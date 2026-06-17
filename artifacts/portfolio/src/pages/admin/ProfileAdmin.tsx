import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetProfile, useUpdateProfile, getGetProfileQueryKey } from "@workspace/api-client-react";
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
import { Switch } from "@/components/ui/switch";
import { Loader2, Briefcase } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  profilePictureUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  cvLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  quote: z.string().optional().or(z.literal("")),
  bengaliQuote: z.string().optional().or(z.literal("")),
  openToWork: z.boolean(),
});

export default function ProfileAdmin() {
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      tagline: "",
      profilePictureUrl: "",
      cvLink: "",
      bio: "",
      quote: "",
      bengaliQuote: "",
      openToWork: false,
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        tagline: profile.tagline || "",
        profilePictureUrl: profile.profilePictureUrl || "",
        cvLink: profile.cvLink || "",
        bio: profile.bio || "",
        quote: profile.quote || "",
        bengaliQuote: profile.bengaliQuote || "",
        openToWork: profile.openToWork ?? false,
      });
    }
  }, [profile, form]);

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    updateProfile.mutate(
      {
        data: {
          name: values.name,
          tagline: values.tagline,
          profilePictureUrl: values.profilePictureUrl || null,
          cvLink: values.cvLink || null,
          bio: values.bio || null,
          quote: values.quote || null,
          bengaliQuote: values.bengaliQuote || null,
          openToWork: values.openToWork,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
          toast({ title: "Profile updated successfully" });
        },
        onError: () => {
          toast({ title: "Failed to update profile", variant: "destructive" });
        },
      }
    );
  };

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold">Profile</h2>
        <p className="text-muted-foreground">Manage your personal information.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-lg">

          {/* Open to Work toggle — prominent at the top */}
          <FormField
            control={form.control}
            name="openToWork"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="space-y-0.5">
                  <FormLabel className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Briefcase size={16} />
                    Open to Work
                  </FormLabel>
                  <p className="text-xs text-emerald-700">
                    Shows a live pulsing banner on your homepage when enabled
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} placeholder="Full professional biography..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Favorite Quote</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={2} placeholder="A quote that inspires you..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bengaliQuote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bengali Quote (Optional translation or secondary quote)</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profilePictureUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://..." />
                </FormControl>
                {field.value && (
                  <div className="mt-2">
                    <img src={field.value} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-border" />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cvLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CV Google Drive Link</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://drive.google.com/..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
