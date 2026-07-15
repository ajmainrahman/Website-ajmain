import { useState, useMemo } from "react";
import { Download, ExternalLink, MapPin, Calendar } from "lucide-react";
import { useGetProfile, useListCertificates, useListSkills, useListJobs } from "@workspace/api-client-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function About() {
  const { data: profile } = useGetProfile();
  const { data: certificates } = useListCertificates();
  const { data: skills } = useListSkills();
  const { data: jobs } = useListJobs();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIssuer, setSelectedIssuer] = useState<string>("all");

  const categories = useMemo(() => {
    if (!certificates) return [];
    return Array.from(new Set(certificates.map(c => c.category))).sort();
  }, [certificates]);

  const issuers = useMemo(() => {
    if (!certificates) return [];
    return Array.from(new Set(certificates.map(c => c.issuer))).sort();
  }, [certificates]);

  const filteredCertificates = useMemo(() => {
    if (!certificates) return [];
    return certificates.filter(c => {
      const matchCat = selectedCategory === "all" || c.category === selectedCategory;
      const matchIss = selectedIssuer === "all" || c.issuer === selectedIssuer;
      return matchCat && matchIss;
    });
  }, [certificates, selectedCategory, selectedIssuer]);

  const dataAnalystSkills = skills?.filter(s => s.type === "data_analyst") || [];
  const dataScientistSkills = skills?.filter(s => s.type === "data_scientist") || [];

  const sortedJobs = jobs ? [...jobs].sort((a, b) => a.displayOrder - b.displayOrder) : [];

  const researchInterestItems = profile?.researchInterests
    ? profile.researchInterests.split("\n").map(s => s.trim()).filter(Boolean)
    : ["Medical Imaging & Diagnostics", "Natural Language Processing (NLP)", "Sentiment Analysis in Regional Dialects", "Deep Learning Architectures"];

  const industryInterestItems = profile?.industryInterests
    ? profile.industryInterests.split("\n").map(s => s.trim()).filter(Boolean)
    : ["Data Engineering & Architecture", "Business Intelligence & Analytics", "Predictive Customer Modeling", "End-to-End ML Deployment"];

  return (
    <div className="px-6 md:px-12 py-20 max-w-5xl mx-auto w-full space-y-16">
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">About</h1>
        <p className="text-xl text-muted-foreground font-serif italic">Professional summary & technical expertise.</p>
      </header>

      <section className="prose prose-lg dark:prose-invert max-w-none">
        <p className="font-serif leading-relaxed">
          {profile?.bio || "Bio coming soon — add it via the Admin Panel."}
        </p>

        {profile?.quote && (
          <blockquote className="mt-8 border-l-4 border-accent pl-6 py-2 text-2xl font-serif italic text-muted-foreground">
            "{profile.quote}"
            {profile.bengaliQuote && (
              <p className="mt-4 text-base font-serif italic text-muted-foreground/70">
                {profile.bengaliQuote}
              </p>
            )}
          </blockquote>
        )}

        <div className="mt-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <a 
                href={profile?.cvLink || "#"} 
                target={profile?.cvLink ? "_blank" : undefined}
                rel={profile?.cvLink ? "noreferrer" : undefined}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded font-medium transition-colors ${
                  profile?.cvLink 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                }`}
                onClick={(e) => {
                  if (!profile?.cvLink) e.preventDefault();
                }}
              >
                <Download size={18} /> Download CV
              </a>
            </TooltipTrigger>
            {!profile?.cvLink && (
              <TooltipContent>
                <p>CV link not yet configured</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </section>

      {/* Work Experience */}
      {sortedJobs.length > 0 && (
        <section className="space-y-8 pt-8 border-t border-border">
          <h2 className="text-2xl font-serif font-bold">Work Experience</h2>
          <div className="space-y-8">
            {sortedJobs.map(job => (
              <div key={job.id} className="relative pl-8 border-l-2 border-border pb-2 last:pb-0">
                <div className="absolute w-3 h-3 bg-background border-2 border-accent rounded-full -left-[7px] top-1.5" />
                <div className="space-y-1 mb-3">
                  <h3 className="text-xl font-bold font-serif">{job.title}</h3>
                  <p className="text-accent font-medium">{job.company}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {job.startDate} – {job.endDate || "Present"}
                    </span>
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {job.location}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm max-w-3xl">{job.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-8 pt-8 border-t border-border">
        <h2 className="text-2xl font-serif font-bold">Technical Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card border border-border p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-accent">Data Analyst Skills</h3>
            {dataAnalystSkills.length > 0 ? (
              <ul className="space-y-2">
                {dataAnalystSkills.map((skill) => (
                  <li key={skill.id} className="flex items-center gap-2 text-muted-foreground text-sm">
                    <span className="w-1.5 h-1.5 bg-accent/50 rounded-full" /> {skill.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No data analyst skills added.</p>
            )}
          </div>
          
          <div className="bg-card border border-border p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-accent">Data Scientist Skills</h3>
            {dataScientistSkills.length > 0 ? (
              <ul className="space-y-2">
                {dataScientistSkills.map((skill) => (
                  <li key={skill.id} className="flex items-center gap-2 text-muted-foreground text-sm">
                    <span className="w-1.5 h-1.5 bg-accent/50 rounded-full" /> {skill.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No data scientist skills added.</p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-8 pt-8 border-t border-border">
        <h2 className="text-2xl font-serif font-bold">Certificates & Credentials</h2>
        
        {certificates && certificates.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-48">
                <Select value={selectedIssuer} onValueChange={setSelectedIssuer}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Issuers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Issuers</SelectItem>
                    {issuers.map(i => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCertificates.length > 0 ? (
                filteredCertificates.map((cert) => (
                  <div key={cert.id} className="bg-card border border-border p-6 rounded-lg flex flex-col">
                    <div className="mb-2">
                      <span className="inline-block bg-secondary text-secondary-foreground text-xs font-mono px-2 py-1 rounded">
                        {cert.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-serif mb-2">{cert.title}</h3>
                    <p className="text-muted-foreground text-sm mb-1">{cert.issuer}</p>
                    <p className="text-muted-foreground text-xs font-mono mb-4">{cert.date}</p>
                    <div className="mt-auto pt-4 flex">
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
                          View Credential <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic col-span-2">No certificates match your filters.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground italic">No certificates yet — add them via the Admin Panel.</p>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold">Research Interests</h2>
          <ul className="space-y-2 text-muted-foreground">
            {researchInterestItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold">Industry Interests</h2>
          <ul className="space-y-2 text-muted-foreground">
            {industryInterestItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

    </div>
  );
}
