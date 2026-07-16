import { Link } from "wouter";
import { ArrowRight, MapPin, Link2, Calendar, Briefcase, User } from "lucide-react";
import {
  useGetProfile,
  useListResearchPapers,
  useListProjects,
  useListCertificates,
  useListSkills,
  useListJobs,
} from "@workspace/api-client-react";

// Map common tech names to Simple Icons slugs + brand colors
const ICON_MAP: Record<string, { slug: string; color: string }> = {
  python: { slug: "python", color: "#3776AB" },
  javascript: { slug: "javascript", color: "#F7DF1E" },
  typescript: { slug: "typescript", color: "#3178C6" },
  react: { slug: "react", color: "#61DAFB" },
  nextjs: { slug: "nextdotjs", color: "#000000" },
  sql: { slug: "postgresql", color: "#4169E1" },
  postgresql: { slug: "postgresql", color: "#4169E1" },
  mysql: { slug: "mysql", color: "#4479A1" },
  mongodb: { slug: "mongodb", color: "#47A248" },
  tensorflow: { slug: "tensorflow", color: "#FF6F00" },
  pytorch: { slug: "pytorch", color: "#EE4C2C" },
  "scikit-learn": { slug: "scikitlearn", color: "#F7931E" },
  sklearn: { slug: "scikitlearn", color: "#F7931E" },
  powerbi: { slug: "powerbi", color: "#F2C811" },
  tableau: { slug: "tableau", color: "#E97627" },
  docker: { slug: "docker", color: "#2496ED" },
  git: { slug: "git", color: "#F05032" },
  github: { slug: "github", color: "#181717" },
  aws: { slug: "amazonwebservices", color: "#232F3E" },
  fastapi: { slug: "fastapi", color: "#009688" },
  django: { slug: "django", color: "#092E20" },
  flask: { slug: "flask", color: "#000000" },
  nlp: { slug: "huggingface", color: "#FFD21E" },
  pandas: { slug: "pandas", color: "#150458" },
  numpy: { slug: "numpy", color: "#013243" },
  r: { slug: "r", color: "#276DC3" },
  linux: { slug: "linux", color: "#FCC624" },
  excel: { slug: "microsoftexcel", color: "#217346" },
};

function TechBadge({ name }: { name: string }) {
  const key = name.toLowerCase().trim();
  const iconInfo = ICON_MAP[key];
  const iconUrl = iconInfo
    ? `https://cdn.simpleicons.org/${iconInfo.slug}/${iconInfo.color.replace("#", "")}`
    : null;

  return (
    <span className="inline-flex items-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-full text-sm font-medium text-foreground shadow-sm hover:border-accent/50 transition-colors">
      {iconUrl && (
        <img
          src={iconUrl}
          alt={name}
          className="w-4 h-4 object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
      {name}
    </span>
  );
}

export default function Home() {
  const { data: profile } = useGetProfile();
  const { data: papers } = useListResearchPapers();
  const { data: projects } = useListProjects();
  const { data: certificates } = useListCertificates();
  const { data: skills } = useListSkills();
  const { data: jobs } = useListJobs();

  const techTags = skills?.filter(s => s.type === "tech_tag") || [];
  const recentJobs = jobs
    ? [...jobs].sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 2)
    : [];
  const recentPapers = papers?.slice(0, 2) || [];

  const openToWorkText =
    profile?.openToWorkText || "actively seeking data science & AI/ML opportunities";

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-16 md:py-24 w-full">
      <div className="w-full max-w-2xl mx-auto space-y-8">

        {/* ── Avatar ── */}
        <div className="flex justify-center">
          <div className="relative">
            {profile?.profilePictureUrl ? (
              <img
                src={profile.profilePictureUrl}
                alt="Profile"
                className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-border shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-secondary border-4 border-border shadow-lg flex items-center justify-center text-muted-foreground">
                <User size={56} />
              </div>
            )}
          </div>
        </div>

        {/* ── Name + Tagline ── */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {profile?.name || "Moshfiqur Rahman Ajmain"}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {profile?.tagline || "Building AI that understands both data and people."}
          </p>
        </div>

        {/* ── Info Row ── */}
        {(profile?.joinedDate || profile?.location || profile?.websiteUrl) && (
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {profile.joinedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                Joined {profile.joinedDate}
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {profile.location}
              </span>
            )}
            {profile.websiteUrl && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                <Link2 size={14} />
                {profile.websiteUrl.replace(/^https?:\/\//, "").split("/")[0]}
              </a>
            )}
          </div>
        )}

        {/* ── Open to Work banner ── */}
        {profile?.openToWork && (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium px-5 py-2.5 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <Briefcase size={14} />
              Open to Work — {openToWorkText}
            </div>
          </div>
        )}

        {/* ── Tech Badges ── */}
        {techTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {techTags.map(tag => (
              <TechBadge key={tag.id} name={tag.name} />
            ))}
          </div>
        )}

        {/* ── CTA Buttons ── */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            View Research <ArrowRight size={16} />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 border border-border bg-background text-foreground px-6 py-2.5 rounded-full hover:bg-secondary transition-colors font-medium text-sm"
          >
            Explore Projects
          </Link>
          {profile?.cvLink && (
            <a
              href={profile.cvLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-border bg-background text-foreground px-6 py-2.5 rounded-full hover:bg-secondary transition-colors font-medium text-sm"
            >
              Download CV
            </a>
          )}
        </div>

        {/* ── Stats row ── */}
        {(papers || projects || certificates) && (
          <div className="flex justify-center gap-8 pt-2 border-t border-border">
            {[
              { label: "Papers", value: papers?.length ?? 0 },
              { label: "Projects", value: projects?.length ?? 0 },
              { label: "Certificates", value: certificates?.length ?? 0 },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold font-serif">{s.value}</p>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Recent Work Experience ── */}
        {recentJobs.length > 0 && (
          <div className="pt-4 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Experience</h3>
              <Link
                href="/about"
                className="text-xs text-accent hover:underline inline-flex items-center gap-1 font-medium"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentJobs.map(job => (
                <div key={job.id} className="bg-card border border-border p-4 rounded-xl space-y-1">
                  <p className="font-semibold text-sm">{job.title}</p>
                  <p className="text-xs text-accent font-medium">{job.company}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {job.startDate} – {job.endDate || "Present"}
                    {job.location ? ` · ${job.location}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Latest Publications ── */}
        {recentPapers.length > 0 && (
          <div className="pt-4 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Latest Publications</h3>
              <Link
                href="/research"
                className="text-xs text-accent hover:underline inline-flex items-center gap-1 font-medium"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {recentPapers.map(paper => (
                <div key={paper.id} className="bg-card border border-border p-4 rounded-xl">
                  <p className="font-serif font-semibold text-sm leading-snug">{paper.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{paper.venue} · {paper.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
