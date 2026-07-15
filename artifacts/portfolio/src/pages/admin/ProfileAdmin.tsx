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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Briefcase, ChevronDown, ChevronUp } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  profilePictureUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  cvLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  quote: z.string().optional().or(z.literal("")),
  bengaliQuote: z.string().optional().or(z.literal("")),
  openToWork: z.boolean(),
  openToWorkText: z.string().optional().or(z.literal("")),
  homeLabelResearch: z.string().optional().or(z.literal("")),
  homeLabelIndustry: z.string().optional().or(z.literal("")),
  researchGate: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  orcid: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  googleScholar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  academia: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  researchInterests: z.string().optional().or(z.literal("")),
  industryInterests: z.string().optional().or(z.literal("")),
  problemSolvingText: z.string().optional().or(z.literal("")),
  problemSolvingPlatforms: z.string().optional().or(z.literal("")),
});

export default function ProfileAdmin() {
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      openToWorkText: "",
      homeLabelResearch: "",
      homeLabelIndustry: "",
      researchGate: "",
      orcid: "",
      googleScholar: "",
      academia: "",
      researchInterests: "",
      industryInterests: "",
      problemSolvingText: "",
      problemSolvingPlatforms: "",
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
        openToWorkText: profile.openToWorkText || "",
        homeLabelResearch: profile.homeLabelResearch || "",
        homeLabelIndustry: profile.homeLabelIndustry || "",
        researchGate: profile.researchGate || "",
        orcid: profile.orcid || "",
        googleScholar: profile.googleScholar || "",
        academia: profile.academia || "",
        researchInterests: profile.researchInterests || "",
        industryInterests: profile.industryInterests || "",
        problemSolvingText: profile.problemSolvingText || "",
        problemSolvingPlatforms: profile.problemSolvingPlatforms || "",
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
          openToWorkText: values.openToWorkText || null,
          homeLabelResearch: values.homeLabelResearch || null,
          homeLabelIndustry: values.homeLabelIndustry || null,
          researchGate: values.researchGate || null,
          orcid: values.orcid || null,
          googleScholar: values.googleScholar || null,
          academia: values.academia || null,
          researchInterests: values.researchInterests || null,
          industryInterests: values.industryInterests || null,
          problemSolvingText: values.problemSolvingText || null,
          problemSolvingPlatforms: values.problemSolvingPlatforms || null,
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

          {/* ── Open to Work ── */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Open to Work</h3>
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
                    <p className="text-xs text-emerald-700">Shows a live pulsing banner on your homepage when enabled</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-emerald-600" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="openToWorkText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Text</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="actively seeking data science & AI/ML opportunities" />
                  </FormControl>
                  <FormDescription>Text shown after "Open to Work —" in the banner.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ── Home Page Labels ── */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Home Page Labels</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="homeLabelResearch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Research Label</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Academic Research" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="homeLabelIndustry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry Label</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Applied Data Products" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ── Personal Info ── */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Personal Info</h3>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="tagline" render={({ field }) => (
              <FormItem><FormLabel>Tagline</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="bio" render={({ field }) => (
              <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea {...field} rows={4} placeholder="Full professional biography..." /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="quote" render={({ field }) => (
              <FormItem><FormLabel>Favorite Quote</FormLabel><FormControl><Textarea {...field} rows={2} placeholder="A quote that inspires you..." /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="bengaliQuote" render={({ field }) => (
              <FormItem><FormLabel>Bengali Quote (optional)</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="profilePictureUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture URL</FormLabel>
                <FormControl><Input {...field} placeholder="https://..." /></FormControl>
                {field.value && <img src={field.value} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover border border-border" />}
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="cvLink" render={({ field }) => (
              <FormItem><FormLabel>CV Google Drive Link</FormLabel><FormControl><Input {...field} placeholder="https://drive.google.com/..." /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          {/* ── Interests (About page) ── */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Interests (About Page)</h3>
            <FormField control={form.control} name="researchInterests" render={({ field }) => (
              <FormItem>
                <FormLabel>Research Interests</FormLabel>
                <FormControl><Textarea {...field} rows={4} placeholder={"Medical Imaging & Diagnostics\nNatural Language Processing\nDeep Learning Architectures"} /></FormControl>
                <FormDescription>One interest per line.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="industryInterests" render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Interests</FormLabel>
                <FormControl><Textarea {...field} rows={4} placeholder={"Data Engineering & Architecture\nBusiness Intelligence & Analytics\nEnd-to-End ML Deployment"} /></FormControl>
                <FormDescription>One interest per line.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* ── Academic Social Links ── */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Academic Social Links (Research Page)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="researchGate" render={({ field }) => (
                <FormItem><FormLabel>ResearchGate URL</FormLabel><FormControl><Input {...field} placeholder="https://researchgate.net/profile/..." /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="orcid" render={({ field }) => (
                <FormItem><FormLabel>ORCID URL</FormLabel><FormControl><Input {...field} placeholder="https://orcid.org/0000-..." /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="googleScholar" render={({ field }) => (
                <FormItem><FormLabel>Google Scholar URL</FormLabel><FormControl><Input {...field} placeholder="https://scholar.google.com/citations?user=..." /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="academia" render={({ field }) => (
                <FormItem><FormLabel>Academia.edu URL</FormLabel><FormControl><Input {...field} placeholder="https://independent.academia.edu/..." /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </div>

          {/* ── Projects Page ── */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Projects Page — Problem Solving</h3>
            <FormField control={form.control} name="problemSolvingText" render={({ field }) => (
              <FormItem>
                <FormLabel>Problem Solving Paragraph</FormLabel>
                <FormControl><Textarea {...field} rows={3} placeholder="From the first semester (2020) I started solving problems..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="problemSolvingPlatforms" render={({ field }) => (
              <FormItem>
                <FormLabel>Platforms</FormLabel>
                <FormControl><Textarea {...field} rows={6} placeholder={"Beecrowd|https://beecrowd.com/profile/...\nHackerRank|https://hackerrank.com/...\nToph\nLeetCode\nStrataScratch\nDataLemur"} /></FormControl>
                <FormDescription>One platform per line. Format: Name or Name|URL (URL is optional — adds a clickable link).</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
