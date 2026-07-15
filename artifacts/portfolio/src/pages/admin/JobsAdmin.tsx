import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useListJobs,
  useCreateJob,
  useUpdateJob,
  useDeleteJob,
  getListJobsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Edit2, Trash2, Plus, Loader2, MapPin, Calendar } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  description: z.string().min(1, "Description is required"),
  location: z.string().optional().or(z.literal("")),
  displayOrder: z.coerce.number().int().default(0),
});

export default function JobsAdmin() {
  const { data: jobs, isLoading } = useListJobs();
  const createMutation = useCreateJob();
  const updateMutation = useUpdateJob();
  const deleteMutation = useDeleteJob();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      location: "",
      displayOrder: 0,
    },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({ title: "", company: "", startDate: "", endDate: "", description: "", location: "", displayOrder: (jobs?.length ?? 0) });
    setIsDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    form.reset({
      title: item.title,
      company: item.company,
      startDate: item.startDate,
      endDate: item.endDate || "",
      description: item.description,
      location: item.location || "",
      displayOrder: item.displayOrder,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this job entry?")) return;
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
          toast({ title: "Deleted successfully" });
        },
      }
    );
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      title: values.title,
      company: values.company,
      startDate: values.startDate,
      endDate: values.endDate || null,
      description: values.description,
      location: values.location || null,
      displayOrder: values.displayOrder,
    };

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
            toast({ title: "Updated successfully" });
            setIsDialogOpen(false);
          },
          onError: () => toast({ title: "Failed to update", variant: "destructive" }),
        }
      );
    } else {
      createMutation.mutate(
        { data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
            toast({ title: "Created successfully" });
            setIsDialogOpen(false);
          },
          onError: () => toast({ title: "Failed to create", variant: "destructive" }),
        }
      );
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold">Work Experience</h2>
          <p className="text-muted-foreground">Manage your job history. Shown on About page and first 2 on Home page.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Job</Button>
      </div>

      <div className="space-y-4">
        {jobs?.map((item) => (
          <div key={item.id} className="bg-card border border-border p-4 rounded-lg flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold font-serif">{item.title}</h3>
              <p className="text-sm font-medium text-accent">{item.company}</p>
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1"><Calendar size={11} />{item.startDate} – {item.endDate || "Present"}</span>
                {item.location && <span className="flex items-center gap-1"><MapPin size={11} />{item.location}</span>}
                <span className="text-muted-foreground/60">Order: {item.displayOrder}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="outline" size="icon" onClick={() => openEdit(item)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {(!jobs || jobs.length === 0) && (
          <p className="text-muted-foreground italic text-center py-8">No work experience entries yet.</p>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Job" : "Add Job"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input {...field} placeholder="Data Scientist" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="company" render={({ field }) => (
                <FormItem><FormLabel>Company / Organization</FormLabel><FormControl><Input {...field} placeholder="Company Name" /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="startDate" render={({ field }) => (
                  <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input {...field} placeholder="Jan 2023" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="endDate" render={({ field }) => (
                  <FormItem><FormLabel>End Date (leave blank for Present)</FormLabel><FormControl><Input {...field} placeholder="Dec 2023" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem><FormLabel>Location (optional)</FormLabel><FormControl><Input {...field} placeholder="Dhaka, Bangladesh · Remote" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea {...field} rows={4} placeholder="Describe your role and responsibilities..." /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="displayOrder" render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormDescription>Lower number = shown first. The first 2 also appear on the Home page.</FormDescription>
                  <FormMessage />
                </FormItem>
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
