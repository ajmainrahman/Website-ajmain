import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  useListPhotos, 
  useCreatePhoto, 
  useUpdatePhoto, 
  useDeletePhoto, 
  getListPhotosQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

const photoSchema = z.object({
  imageUrl: z.string().url("Must be a valid URL").min(1, "Image URL is required"),
  caption: z.string().optional().or(z.literal("")),
  date: z.string().optional().or(z.literal("")),
});

export default function PhotosAdmin() {
  const { data: photos, isLoading } = useListPhotos();
  const createPhoto = useCreatePhoto();
  const updatePhoto = useUpdatePhoto();
  const deletePhoto = useDeletePhoto();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<z.infer<typeof photoSchema>>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      imageUrl: "",
      caption: "",
      date: "",
    },
  });

  const handleEdit = (photo: any) => {
    setEditingId(photo.id);
    form.reset({
      imageUrl: photo.imageUrl,
      caption: photo.caption || "",
      date: photo.date || "",
    });
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    form.reset({ imageUrl: "", caption: "", date: "" });
    setIsFormOpen(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    deletePhoto.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPhotosQueryKey() });
        toast({ title: "Photo deleted" });
      }
    });
  };

  const onSubmit = (values: z.infer<typeof photoSchema>) => {
    const data = {
      imageUrl: values.imageUrl,
      caption: values.caption || null,
      date: values.date || null,
    };

    if (editingId) {
      updatePhoto.mutate(
        { id: editingId, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListPhotosQueryKey() });
            toast({ title: "Photo updated" });
            handleCancel();
          },
        }
      );
    } else {
      createPhoto.mutate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListPhotosQueryKey() });
            toast({ title: "Photo added" });
            handleCancel();
          },
        }
      );
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold">Photography</h2>
          <p className="text-muted-foreground">Manage photos in the Hobbies section.</p>
        </div>
        {!isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus size={16} /> Add Photo
          </Button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-card border border-border p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{editingId ? "Edit Photo" : "Add New Photo"}</h3>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X size={16} />
            </Button>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caption (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Oct 2023" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={createPhoto.isPending || updatePhoto.isPending}>
                {(createPhoto.isPending || updatePhoto.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Update Photo" : "Upload Photo"}
              </Button>
            </form>
          </Form>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {photos && photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.id} className="relative group bg-card border border-border rounded-lg overflow-hidden flex flex-col">
              <div className="aspect-square bg-muted">
                <img src={photo.imageUrl} alt={photo.caption || "Photo"} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                {photo.caption && <p className="text-sm font-medium truncate">{photo.caption}</p>}
                {photo.date && <p className="text-xs text-muted-foreground font-mono mt-1">{photo.date}</p>}
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur rounded-md p-1 border border-border">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(photo)}>
                  <Pencil size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(photo.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-12 border border-border border-dashed rounded-lg">
            No photos found.
          </div>
        )}
      </div>
    </div>
  );
}