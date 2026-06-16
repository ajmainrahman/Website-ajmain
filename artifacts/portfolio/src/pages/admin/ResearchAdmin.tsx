import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useListResearchPapers,
  useCreateResearchPaper,
  useUpdateResearchPaper,
  useDeleteResearchPaper,
  getListResearchPapersQueryKey,
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
  title: z.string().min(1),
  authors: z.string().min(1),
  abstract: z.string().min(1),
  venue: z.string().min(1),
  year: z.coerce.number().int().min(1900),
  paperLink: z.string().url().optional().or(z.literal("")),
  tags: z.string().min(1),
});

export default function ResearchAdmin() {
  const { data: list, isLoading } = useListResearchPapers();
  const createMutation = useCreateResearchPaper();
  const updateMutation = useUpdateResearchPaper();
  const deleteMutation = useDeleteResearchPaper();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", authors: "", abstract: "", venue: "", year: 2024, paperLink: "", tags: "" },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({ title: "", authors: "", abstract: "", venue: "", year: 2024, paperLink: "", tags: "" });
    setIsDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    form.reset({
      title: item.title, authors: item.authors, abstract: item.abstract,
      venue: item.venue, year: item.year, paperLink: item.paperLink || "", tags: item.tags
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListResearchPapersQueryKey() });
        toast({ title: "Deleted successfully" });
      }
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = { ...values, paperLink: values.paperLink || null };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListResearchPapersQueryKey() }); setIsDialogOpen(false); }
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListResearchPapersQueryKey() }); setIsDialogOpen(false); }
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold">Research Papers</h2>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add</Button>
      </div>

      <div className="space-y-4">
        {list?.map((item) => (
          <div key={item.id} className="bg-card border border-border p-4 rounded-lg flex items-start justify-between">
            <div>
              <h3 className="font-bold font-serif">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.authors} • {item.venue} ({item.year})</p>
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
              <FormField control={form.control} name="authors" render={({ field }) => (
                <FormItem><FormLabel>Authors</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="venue" render={({ field }) => (
                <FormItem><FormLabel>Venue</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="year" render={({ field }) => (
                <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="abstract" render={({ field }) => (
                <FormItem><FormLabel>Abstract</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="paperLink" render={({ field }) => (
                <FormItem><FormLabel>Link</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem><FormLabel>Tags (comma separated)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Save</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}