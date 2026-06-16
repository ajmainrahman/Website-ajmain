import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useListEducation,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
  getListEducationQueryKey,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit2, Trash2, Plus, Loader2 } from "lucide-react";

const formSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  startYear: z.coerce.number().int().min(1900),
  endYear: z.coerce.number().int().optional().nullable(),
  description: z.string().min(1, "Description is required"),
});

export default function EducationAdmin() {
  const { data: education, isLoading } = useListEducation();
  const createMutation = useCreateEducation();
  const updateMutation = useUpdateEducation();
  const deleteMutation = useDeleteEducation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      degree: "",
      institution: "",
      startYear: new Date().getFullYear(),
      endYear: null,
      description: "",
    },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({
      degree: "",
      institution: "",
      startYear: new Date().getFullYear(),
      endYear: null,
      description: "",
    });
    setIsDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    form.reset({
      degree: item.degree,
      institution: item.institution,
      startYear: item.startYear,
      endYear: item.endYear || null,
      description: item.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListEducationQueryKey() });
          toast({ title: "Deleted successfully" });
        },
      }
    );
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      degree: values.degree,
      institution: values.institution,
      startYear: values.startYear,
      endYear: values.endYear || null,
      description: values.description,
    };

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListEducationQueryKey() });
            toast({ title: "Updated successfully" });
            setIsDialogOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate(
        { data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListEducationQueryKey() });
            toast({ title: "Created successfully" });
            setIsDialogOpen(false);
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
          <h2 className="text-2xl font-serif font-bold">Education</h2>
          <p className="text-muted-foreground">Manage your educational background.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
      </div>

      <div className="space-y-4">
        {education?.map((item) => (
          <div key={item.id} className="bg-card border border-border p-4 rounded-lg flex items-start justify-between">
            <div>
              <h3 className="font-bold font-serif">{item.degree}</h3>
              <p className="text-sm text-muted-foreground">{item.institution}</p>
              <p className="text-xs font-mono text-muted-foreground">{item.startYear} - {item.endYear || 'Present'}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => openEdit(item)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {(!education || education.length === 0) && (
          <p className="text-muted-foreground italic text-center py-8">No records found.</p>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Education" : "Add Education"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="degree" render={({ field }) => (
                <FormItem><FormLabel>Degree</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="institution" render={({ field }) => (
                <FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="startYear" render={({ field }) => (
                  <FormItem><FormLabel>Start Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="endYear" render={({ field }) => (
                  <FormItem><FormLabel>End Year (optional)</FormLabel><FormControl><Input type="number" {...field} value={field.value || ""} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}