import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useListProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  getListProjectsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Trash2, Plus } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  techStack: z.string().min(1),
  githubUrl: z.string().url(),
  liveDemoUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().min(1),
});

export default function ProjectsAdmin() {
  const { data: list, isLoading } = useListProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", techStack: "", githubUrl: "", liveDemoUrl: "", category: "data-analytics" },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({ title: "", description: "", techStack: "", githubUrl: "", liveDemoUrl: "", category: "data-analytics" });
    setIsDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    form.reset({
      title: item.title, description: item.description, techStack: item.techStack,
      githubUrl: item.githubUrl, liveDemoUrl: item.liveDemoUrl || "", category: item.category
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        toast({ title: "Deleted successfully" });
      }
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = { ...values, liveDemoUrl: values.liveDemoUrl || null };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() }); setIsDialogOpen(false); }
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() }); setIsDialogOpen(false); }
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold">Projects</h2>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add</Button>
      </div>

      <div className="space-y-4">
        {list?.map((item) => (
          <div key={item.id} className="bg-card border border-border p-4 rounded-lg flex items-start justify-between">
            <div>
              <h3 className="font-bold font-serif">{item.title}</h3>
              <span className="text-xs bg-secondary px-2 py-1 rounded mt-1 inline-block">{item.category}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => openEdit(item)}><Edit2 className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? "Edit" : "Add"}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="data-analytics">Applied Data Products</SelectItem>
                      <SelectItem value="ml-ai-research">ML/AI Research</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <FormField control={form.control} name="techStack" render={({ field }) => (
                <FormItem><FormLabel>Tech Stack (comma separated)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="githubUrl" render={({ field }) => (
                <FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="liveDemoUrl" render={({ field }) => (
                <FormItem><FormLabel>Live Demo URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl></FormItem>
              )} />
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Save</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}