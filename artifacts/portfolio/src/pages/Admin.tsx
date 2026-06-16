import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  useAdminMe,
  useAdminLogin,
  useAdminLogout,
  getAdminMeQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogOut, ExternalLink, Loader2 } from "lucide-react";

import ProfileAdmin from "./admin/ProfileAdmin";
import CertificatesAdmin from "./admin/CertificatesAdmin";
import ResearchAdmin from "./admin/ResearchAdmin";
import ProjectsAdmin from "./admin/ProjectsAdmin";
import BlogPostsAdmin from "./admin/BlogPostsAdmin";
import HobbiesAdmin from "./admin/HobbiesAdmin";
import EducationAdmin from "./admin/EducationAdmin";
import SkillsAdmin from "./admin/SkillsAdmin";
import CampusAmbassadorsAdmin from "./admin/CampusAmbassadorsAdmin";
import PhotosAdmin from "./admin/PhotosAdmin";
import StoriesAdmin from "./admin/StoriesAdmin";

const SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "education", label: "Education" },
  { id: "certificates", label: "Certificates" },
  { id: "research", label: "Research Papers" },
  { id: "projects", label: "Projects" },
  { id: "blogposts", label: "Blog Posts" },
  { id: "hobbies", label: "Hobbies" },
  { id: "skills", label: "Skills" },
  { id: "campus-ambassadors", label: "Campus Ambassadors" },
  { id: "photography", label: "Photography" },
  { id: "stories", label: "Stories" },
];

export default function Admin() {
  const queryClient = useQueryClient();
  const { data: auth, isLoading } = useAdminMe();
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  if (!auth?.authenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col fixed inset-y-0 left-0 bg-card">
        <div className="p-6 border-b border-border">
          <h1 className="font-serif font-bold text-xl tracking-tight">Admin Panel</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeSection === sec.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary w-full"
          >
            <ExternalLink size={16} /> View Site
          </a>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {activeSection === "profile" && <ProfileAdmin />}
          {activeSection === "education" && <EducationAdmin />}
          {activeSection === "certificates" && <CertificatesAdmin />}
          {activeSection === "research" && <ResearchAdmin />}
          {activeSection === "projects" && <ProjectsAdmin />}
          {activeSection === "blogposts" && <BlogPostsAdmin />}
          {activeSection === "hobbies" && <HobbiesAdmin />}
          {activeSection === "skills" && <SkillsAdmin />}
          {activeSection === "campus-ambassadors" && <CampusAmbassadorsAdmin />}
          {activeSection === "photography" && <PhotosAdmin />}
          {activeSection === "stories" && <StoriesAdmin />}
        </div>
      </main>
    </div>
  );
}

function AdminLogin() {
  const [password, setPassword] = useState("");
  const login = useAdminLogin();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { data: { password } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminMeQueryKey() });
          toast({ title: "Logged in successfully" });
        },
        onError: () => {
          toast({ title: "Incorrect password", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm bg-card border border-border p-8 rounded-lg shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-center mb-6">Admin Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={login.isPending || !password}>
            {login.isPending ? <Loader2 className="animate-spin mx-auto" /> : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function LogoutButton() {
  const logout = useAdminLogout();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminMeQueryKey() });
      },
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={logout.isPending}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors rounded-md w-full"
    >
      {logout.isPending ? <Loader2 className="animate-spin" size={16} /> : <LogOut size={16} />} 
      Sign Out
    </button>
  );
}