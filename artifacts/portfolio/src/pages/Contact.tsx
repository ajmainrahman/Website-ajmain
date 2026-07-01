import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Github, Linkedin, Mail, Send } from "lucide-react";

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
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      toast({
        title: "Message Sent",
        description: "Thanks for reaching out — I'll get back to you soon.",
      });
      form.reset();
    } catch {
      toast({
        title: "Something went wrong",
        description: "Your message couldn't be sent. Please try again or reach out via LinkedIn/GitHub.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="px-6 md:px-12 py-20 max-w-5xl mx-auto w-full space-y-16">
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">Contact</h1>
        <p className="text-xl text-muted-foreground font-serif italic">Get in touch for research or opportunities.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">Connect</h2>
            <p className="text-muted-foreground leading-relaxed">
              I am currently open to new research collaborations, data science roles, and discussions about applied ML. 
              Feel free to reach out via the form or connect on professional networks.
            </p>
          </div>

          <div className="space-y-6">
            <a href="https://github.com/ajmainrahman" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-accent transition-colors group">
              <div className="bg-secondary p-3 rounded-md group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Github size={24} />
              </div>
              <div>
                <p className="font-bold">GitHub</p>
                <p className="text-sm text-muted-foreground font-mono">ajmainrahman</p>
              </div>
            </a>
            
            <a href="https://www.linkedin.com/in/ajmain-rahman/" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-accent transition-colors group">
              <div className="bg-secondary p-3 rounded-md group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Linkedin size={24} />
              </div>
              <div>
                <p className="font-bold">LinkedIn</p>
                <p className="text-sm text-muted-foreground font-mono">ajmain-rahman</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
              <div className="bg-secondary p-3 rounded-md">
                <Mail size={24} />
              </div>
              <div>
                <p className="font-bold">Email</p>
                <p className="text-sm text-muted-foreground font-mono">Email available on request</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card border border-border p-8 rounded-lg">
          <h2 className="text-2xl font-serif font-bold mb-6">Send a Message</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="jane@example.com" type="email" {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="How can we collaborate?" 
                        className="min-h-[120px] bg-background" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full gap-2">
                Send Message <Send size={16} />
              </Button>
            </form>
          </Form>
        </div>
        
      </div>
    </div>
  );
}