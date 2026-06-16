import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  useListCampusAmbassadors, 
  useCreateCampusAmbassador, 
  useUpdateCampusAmbassador, 
  useDeleteCampusAmbassador, 
  getListCampusAmbassadorsQueryKey 
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

const ambassadorSchema = z.object({
  organization: z.string().min(1, "Organization is required"),
  role: z.string().min(1, "Role is required"),
  duration: z.string().optional().or(z.literal("")),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export default function CampusAmbassadorsAdmin() {
  const { data: ambassadors, isLoading } = useListCampusAmbassadors();
  const createAmbassador = useCreateCampusAmbassador();
  const updateAmbassador = useUpdateCampusAmbassador();
  const deleteAmbassador = useDeleteCampusAmbassador();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<z.infer<typeof ambassadorSchema>>({
    resolver: zodResolver(ambassadorSchema),
    defaultValues: {
      organization: "",
      role: "",
      duration: "",
      logoUrl: "",
    },
  });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    form.reset({
      organization: item.organization,
      role: item.role,
      duration: item.duration || "",
      logoUrl: item.logoUrl || "",
    });
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    form.reset({ organization: "", role: "", duration: "", logoUrl: "" });
    setIsFormOpen(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    deleteAmbassador.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCampusAmbassadorsQueryKey() });
        toast({ title: "Entry deleted" });
      }
    });
  };

  const onSubmit = (values: z.infer<typeof ambassadorSchema>) => {
    const data = {
      organization: values.organization,
      role: values.role,
      duration: values.duration || null,
      logoUrl: values.logoUrl || null,
    };

    if (editingId) {
      updateAmbassador.mutate(
        { id: editingId, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListCampusAmbassadorsQueryKey() });
            toast({ title: "Entry updated" });
            handleCancel();
          },
        }
      );
    } else {
      createAmbassador.mutate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListCampusAmbassadorsQueryKey() });
            toast({ title: "Entry added" });
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
          <h2 className="text-2xl font-serif font-bold">Campus Ambassadors & Volunteer Roles</h2>
          <p className="text-muted-foreground">Manage ECA page entries.</p>
        </div>
        {!isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus size={16} /> Add Entry
          </Button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-card border border-border p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{editingId ? "Edit Entry" : "Add New Entry"}</h3>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X size={16} />
            </Button>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 2023 - Present" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={createAmbassador.isPending || updateAmbassador.isPending}>
                {(createAmbassador.isPending || updateAmbassador.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Update Entry" : "Create Entry"}
              </Button>
            </form>
          </Form>
        </div>
      )}

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ambassadors && ambassadors.length > 0 ? (
              ambassadors.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {item.logoUrl && <img src={item.logoUrl} alt="" className="w-8 h-8 rounded object-cover border border-border" />}
                      {item.organization}
                    </div>
                  </TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.duration}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}