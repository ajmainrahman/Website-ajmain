import { Link } from "wouter";
import { ArrowRight, Database, FlaskConical, User, Briefcase } from "lucide-react";
import {
  useGetProfile,
  useListResearchPapers,
  useListProjects,
  useListCertificates,
  useListSkills,
} from "@workspace/api-client-react";

export default function Home() {
  const { data: profile } = useGetProfile();
  const { data: papers } = useListResearchPapers();
  const { data: projects } = useListProjects();
  const { data: certificates } = useListCertificates();
  const { data: skills } = useListSkills();

  const recentPapers = papers?.slice(0, 2) || [];
  const techTags = skills?.filter(s => s.type === 'tech_tag') || [];

  return (
    <div className="flex-1 flex flex-col justify-center px-6 md:px-12 py-20 max-w-6xl mx-auto w-full">
      <div className="max-w-4xl space-y-8">

        {/* Open to Work banner */}
        {profile?.openToWork && (
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium px-4 py-2 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <Briefcase size={14} />
            Open to Work — actively seeking data science &amp; AI/ML opportunities
          </div>
        )}

        {/* Dual-tone signal */}
        <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5 bg-secondary px-3 py-1 rounded-full"><FlaskConical size={14} /> Academic Research</span>
          <span className="opacity-50">|</span>
          <span className="flex items-center gap-1.5 bg-secondary px-3 py-1 rounded-full"><Database size={14} /> Applied Data Products</span>
        </div>

        <div className="flex items-center gap-6">
          {profile?.profilePictureUrl ? (
            <img
              src={profile.profilePictureUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-4 border-border text-muted-foreground">
              <User size={40} />
            </div>
          )}
          <div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-foreground leading-[1.1]">
              {profile?.name || "Moshfiqur Rahman Ajmain"}
            </h1>
          </div>
        </div>
        
        <div className="space-y-4 max-w-2xl">
          <p className="text-2xl font-serif text-muted-foreground italic">
            "{profile?.tagline || "Building AI that understands both data and people."}"
          </p>
          <p className="text-lg text-foreground leading-relaxed">
            Aspiring data scientist and AI/ML enthusiast based in Bangladesh. Always learning. Always experimenting.
          </p>
          <p className="text-sm text-muted-foreground font-mono">
            {papers?.length || 0} papers published, {projects?.length || 0} projects, {certificates?.length || 0} certificates
          </p>
        </div>

        {techTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {techTags.map(tag => (
              <span key={tag.id} className="inline-block bg-secondary text-secondary-foreground text-xs font-mono px-2 py-1 rounded border border-border">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-4 pt-4">
          <Link href="/research" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded hover:bg-primary/90 transition-colors font-medium">
            View Research <ArrowRight size={18} />
          </Link>
          <Link href="/projects" className="inline-flex items-center gap-2 border border-border bg-background text-foreground px-6 py-3 rounded hover:bg-secondary transition-colors font-medium">
            Explore Projects
          </Link>
        </div>

        {/* Highlights Preview */}
        {recentPapers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 border-t border-border mt-16">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Latest Publication</h3>
              <p className="font-serif text-xl font-medium line-clamp-2">{recentPapers[0]?.title}</p>
              <Link href="/research" className="text-accent hover:underline inline-flex items-center gap-1 text-sm font-medium">
                Read abstract <ArrowRight size={14} />
              </Link>
            </div>
            {recentPapers[1] && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Recent Work</h3>
                <p className="font-serif text-xl font-medium line-clamp-2">{recentPapers[1].title}</p>
                <Link href="/research" className="text-accent hover:underline inline-flex items-center gap-1 text-sm font-medium">
                  Read abstract <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
