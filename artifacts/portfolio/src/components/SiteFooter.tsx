import { Github, Linkedin } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="py-8 text-center border-t border-border mt-auto bg-background">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Moshfiqur Rahman Ajmain. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/ajmainrahman" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github size={20} />
          </a>
          <a href="https://www.linkedin.com/in/ajmain-rahman/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}