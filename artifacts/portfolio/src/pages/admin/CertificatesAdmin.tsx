import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useListCertificates,
  useCreateCertificate,
  useUpdateCertificate,
  useDeleteCertificate,
  getListCertificatesQueryKey,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit2, Trash2, Plus, Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
  credentialUrl: z.string().url().optional().or(z.literal("")),
});

export default function CertificatesAdmin() {
  const { data: list, isLoading } = useListCertificates();
  const createMutation = useCreateCertificate();
  const updateMutation = useUpdateCertificate();
  const deleteMutation = useDeleteCertificate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      issuer: "",
      date: "",
      category: "",
      credentialUrl: "",
    },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({ title: "", issuer: "", date: "", category: "", credentialUrl: "" });
    setIsDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    form.reset({
      title: item.title,
      issuer: item.issuer,
      date: item.date,
      category: item.category,
      credentialUrl: item.credentialUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCertificatesQueryKey() });
        toast({ title: "Deleted successfully" });
      }
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      ...values,
      credentialUrl: values.credentialUrl || null,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCertificatesQueryKey() });
          toast({ title: "Updated successfully" });
          setIsDialogOpen(false);
        }
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCertificatesQueryKey() });
          toast({ title: "Created successfully" });
          setIsDialogOpen(false);
        }
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold">Certificates</h2>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Certificate</Button>
      </div>

      <div className="space-y-4">
        {list?.map((item) => (
          <div key={item.id} className="bg-card border border-border p-4 rounded-lg flex items-start justify-between">
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.issuer} • {item.date}</p>
              <span className="inline-block mt-2 text-xs bg-secondary px-2 py-1 rounded">{item.category}</span>
            </div>
            <div className="flex items-center gap-2">
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
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="issuer" render={({ field }) => (
                <FormItem><FormLabel>Issuer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem><FormLabel>Date</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="credentialUrl" render={({ field }) => (
                <FormItem><FormLabel>Credential URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Save</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}