import { useState, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useListResearchPapers } from "@workspace/api-client-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function Research() {
  const { data: papers } = useListResearchPapers();
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

  return (
    <div className="px-6 md:px-12 py-20 max-w-5xl mx-auto w-full space-y-16">
      <header className="space-y-4 border-b border-border pb-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Research & Publications</h1>
            <p className="text-xl text-muted-foreground font-serif italic mt-4">Academic contributions and peer-reviewed work.</p>
          </div>
          {papers && <div className="text-sm font-mono bg-secondary px-3 py-1 rounded text-muted-foreground">{papers.length} Papers</div>}
        </div>
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
              
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                {paper.abstract}
              </p>
              
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
