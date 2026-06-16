import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useListHobbies,
  useCreateHobby,
  useUpdateHobby,
  useDeleteHobby,
  getListHobbiesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit2, Trash2, Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().optional().or(z.literal("")),
});

export default function HobbiesAdmin() {
  const { data: list, isLoading } = useListHobbies();
  const createMutation = useCreateHobby();
  const updateMutation = useUpdateHobby();
  const deleteMutation = useDeleteHobby();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "", icon: "" },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({ name: "", description: "", icon: "" });
    setIsDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    form.reset({
      name: item.name, description: item.description, icon: item.icon || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListHobbiesQueryKey() });
        toast({ title: "Deleted successfully" });
      }
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = { ...values, icon: values.icon || null };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListHobbiesQueryKey() }); setIsDialogOpen(false); }
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListHobbiesQueryKey() }); setIsDialogOpen(false); }
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold">Hobbies</h2>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add</Button>
      </div>

      <div className="space-y-4">
        {list?.map((item) => (
          <div key={item.id} className="bg-card border border-border p-4 rounded-lg flex items-start justify-between">
            <div>
              <h3 className="font-bold font-serif">{item.name}</h3>
              <p className="text-sm text-muted-foreground">Icon: {item.icon || "None"}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => openEdit(item)}><Edit2 className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? "Edit" : "Add"}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="icon" render={({ field }) => (
                <FormItem><FormLabel>Icon (Lucide name, e.g. Camera)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl></FormItem>
              )} />
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Save</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}