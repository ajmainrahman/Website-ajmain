import { Link, useLocation } from "wouter";
import { Github, Linkedin, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/education", label: "Education" },
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/eca", label: "ECA" },
  { href: "/hobbies", label: "Hobbies" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif font-bold text-xl tracking-tight hover:text-accent transition-colors">
          M.R.A.
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`hover:text-foreground transition-colors ${location === link.href ? "text-foreground border-b-2 border-accent" : ""}`}>
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <a href="https://github.com/ajmainrahman" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github size={20} />
          </a>
          <a href="https://www.linkedin.com/in/ajmain-rahman/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin size={20} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 -mr-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`text-lg font-medium hover:text-accent transition-colors ${location === link.href ? "text-accent" : "text-foreground"}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <a href="https://github.com/ajmainrahman" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github size={24} />
                </a>
                <a href="https://www.linkedin.com/in/ajmain-rahman/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}