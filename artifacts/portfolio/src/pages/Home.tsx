import { Link } from "wouter";
import { ArrowRight, Database, FlaskConical } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-center px-6 md:px-12 py-20 max-w-6xl mx-auto w-full">
      <div className="max-w-4xl space-y-8">
        
        {/* Dual-tone signal */}
        <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5 bg-secondary px-3 py-1 rounded-full"><FlaskConical size={14} /> Academic Research</span>
          <span className="opacity-50">|</span>
          <span className="flex items-center gap-1.5 bg-secondary px-3 py-1 rounded-full"><Database size={14} /> Applied Data Products</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-foreground leading-[1.1]">
          Moshfiqur Rahman Ajmain.
        </h1>
        
        <div className="space-y-4 max-w-2xl">
          <p className="text-2xl font-serif text-muted-foreground italic">
            "Building AI that understands both data and people."
          </p>
          <p className="text-lg text-foreground leading-relaxed">
            Aspiring data scientist and AI/ML enthusiast based in Bangladesh. Always learning. Always experimenting.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <Link href="/research" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded hover:bg-primary/90 transition-colors font-medium">
            View Research <ArrowRight size={18} />
          </Link>
          <Link href="/projects" className="inline-flex items-center gap-2 border border-border bg-background text-foreground px-6 py-3 rounded hover:bg-secondary transition-colors font-medium">
            Explore Projects
          </Link>
        </div>

        {/* Highlights Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 border-t border-border mt-16">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Latest Publication</h3>
            <p className="font-serif text-xl font-medium line-clamp-2">"Benchmark Diagnostic MRI and Medical Imaging Dataset"</p>
            <Link href="/research" className="text-accent hover:underline inline-flex items-center gap-1 text-sm font-medium">
              Read abstract <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Currently Exploring</h3>
            <p className="font-serif text-xl font-medium">Advanced feature engineering & predictive modeling for complex health metrics.</p>
            <Link href="/about" className="text-accent hover:underline inline-flex items-center gap-1 text-sm font-medium">
              See full stack <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}