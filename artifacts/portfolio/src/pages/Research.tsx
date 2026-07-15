import { useState, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useListResearchPapers, useGetProfile } from "@workspace/api-client-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

function ResearchGateIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.586 0H4.414A4.414 4.414 0 0 0 0 4.414v15.172A4.414 4.414 0 0 0 4.414 24h15.172A4.414 4.414 0 0 0 24 19.586V4.414A4.414 4.414 0 0 0 19.586 0zm-7.72 17.26c-2.899 0-5.25-2.352-5.25-5.252s2.351-5.25 5.25-5.25a5.23 5.23 0 0 1 3.568 1.392l-1.456 1.456a3.14 3.14 0 0 0-2.112-.813 3.215 3.215 0 0 0-3.216 3.215 3.215 3.215 0 0 0 3.216 3.215 3.16 3.16 0 0 0 2.37-1.052h-2.37v-2.035h4.524c.047.256.07.52.07.783 0 2.9-2.35 5.34-4.594 5.34z"/>
    </svg>
  );
}

function OrcidIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.947.947 0 0 1 0-1.894zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.434h2.297c2.272 0 3.938-1.491 3.938-3.722 0-2.216-1.666-3.712-3.938-3.712h-2.297z"/>
    </svg>
  );
}

function GoogleScholarIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
    </svg>
  );
}

function AcademiaIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0L0 6l12 6 12-6L12 0zM0 18l12 6 12-6v-6L12 18 0 12v6z"/>
    </svg>
  );
}

export default function Research() {
  const { data: papers } = useListResearchPapers();
  const { data: profile } = useGetProfile();
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [tagSearch, setTagSearch] = useState("");

  const years = useMemo(() => {
    if (!papers) return [];
    const uniqueYears = Array.from(new Set(papers.map(p => p.year))).sort((a, b) => b - a);
    return uniqueYears;
  }, [papers]);

  const filteredPapers = useMemo(() => {
    if (!papers) return [];
    let filtered = [...papers].sort((a, b) => b.year - a.year);
    
    if (selectedYear !== "all") {
      filtered = filtered.filter(p => p.year.toString() === selectedYear);
    }
    
    if (tagSearch.trim()) {
      const searchLower = tagSearch.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.tags.toLowerCase().includes(searchLower) || 
        p.title.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [papers, selectedYear, tagSearch]);

  const socialLinks = [
    { label: "ResearchGate", url: profile?.researchGate, icon: <ResearchGateIcon size={18} /> },
    { label: "ORCID", url: profile?.orcid, icon: <OrcidIcon size={18} /> },
    { label: "Google Scholar", url: profile?.googleScholar, icon: <GoogleScholarIcon size={18} /> },
    { label: "Academia.edu", url: profile?.academia, icon: <AcademiaIcon size={18} /> },
  ].filter(s => s.url);

  return (
    <div className="px-6 md:px-12 py-20 max-w-5xl mx-auto w-full space-y-16">
      <header className="space-y-4 border-b border-border pb-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Research & Publications</h1>
            <p className="text-xl text-muted-foreground font-serif italic mt-4">Academic contributions and peer-reviewed work.</p>
          </div>
          {papers && <div className="text-sm font-mono bg-secondary px-3 py-1 rounded text-muted-foreground">{papers.length} Papers</div>}
        </div>

        {/* Academic Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2">
            {socialLinks.map(link => (
              <a
                key={link.label}
                href={link.url!}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium border border-border bg-card px-3 py-2 rounded-md hover:border-accent hover:text-accent transition-colors"
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {papers && papers.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Input 
              placeholder="Search by tag or title..." 
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="space-y-12">
        {filteredPapers.length > 0 ? (
          filteredPapers.map((paper) => (
            <article key={paper.id} className="group relative pl-8 border-l-2 border-border hover:border-accent transition-colors">
              <div className="absolute w-3 h-3 bg-background border-2 border-border group-hover:border-accent rounded-full -left-[7px] top-2 transition-colors" />
              
              <div className="flex items-center gap-4 mb-2">
                <span className="font-mono text-sm text-accent font-medium">{paper.year}</span>
                <span className="text-sm text-muted-foreground">{paper.venue}</span>
              </div>
              
              <h2 className="text-2xl font-serif font-bold mb-3 leading-tight">{paper.title}</h2>
              <p className="text-sm text-muted-foreground font-medium mb-4 italic">{paper.authors}</p>
              
              {paper.abstract && (
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                  {paper.abstract}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-6">
                {paper.tags.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag, idx) => (
                  <span key={idx} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-mono">
                    {tag}
                  </span>
                ))}
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href={paper.paperLink || "#"} 
                    target={paper.paperLink ? "_blank" : undefined}
                    rel={paper.paperLink ? "noreferrer" : undefined}
                    className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                      paper.paperLink ? "text-foreground hover:text-accent" : "text-muted-foreground cursor-not-allowed opacity-50"
                    }`}
                    onClick={(e) => {
                      if (!paper.paperLink) e.preventDefault();
                    }}
                  >
                    Read Paper <ArrowUpRight size={14} />
                  </a>
                </TooltipTrigger>
                {!paper.paperLink && (
                  <TooltipContent>
                    <p>Link not yet configured</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </article>
          ))
        ) : (
          <p className="text-muted-foreground italic">No publications match your criteria.</p>
        )}
      </div>
    </div>
  );
}
