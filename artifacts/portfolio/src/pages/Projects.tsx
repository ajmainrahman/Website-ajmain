import { ExternalLink, Github } from "lucide-react";
import { useListProjects } from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Projects() {
  const { data: projects } = useListProjects();

  const dataProjects = projects?.filter(p => p.category === "data-analytics") || [];
  const mlProjects = projects?.filter(p => p.category === "ml-ai-research") || [];

  return (
    <div className="px-6 md:px-12 py-20 max-w-5xl mx-auto w-full space-y-16">
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">Projects & Code</h1>
        <p className="text-xl text-muted-foreground font-serif italic">Applied machine learning, data engineering, and problem solving.</p>
      </header>

      {/* Competitive Programming Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-serif font-bold border-l-4 border-accent pl-4">Foundational Problem Solving</h2>
        <div className="bg-card border border-border p-8 rounded-lg">
          <p className="text-lg leading-relaxed mb-8">
            "From the first semester (2020) I started solving problems in various Online judges and different websites. Till now I have solved around <strong className="text-foreground text-accent">250+ problems</strong> in C, Python and MySQL."
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Beecrowd", "HackerRank", "Toph", "LeetCode", "StrataScratch", "DataLemur"].map((platform) => (
              <div key={platform} className="bg-secondary text-secondary-foreground text-center py-3 px-4 rounded-md font-mono text-sm font-medium">
                {platform}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <Tabs defaultValue="data-analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
            <TabsTrigger value="data-analytics">Applied Data Products</TabsTrigger>
            <TabsTrigger value="ml-ai-research">ML/AI Research</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data-analytics" className="space-y-8">
            {dataProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {dataProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No projects in this category yet.</p>
            )}
          </TabsContent>
          
          <TabsContent value="ml-ai-research" className="space-y-8">
            {mlProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {mlProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No projects in this category yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </section>

    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <div className="bg-card border border-border p-8 rounded-lg flex flex-col hover:border-accent/50 transition-colors">
      <h3 className="text-xl font-bold mb-3 font-serif">{project.title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-6 flex-grow text-sm">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {project.techStack.split(',').map((tag: string) => tag.trim()).filter(Boolean).map((tag: string) => (
          <span key={tag} className="bg-background border border-border px-2.5 py-1 rounded text-xs font-mono text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-auto">
        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors">
          <Github size={16} /> Code
        </a>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <a 
              href={project.liveDemoUrl || "#"} 
              target={project.liveDemoUrl ? "_blank" : undefined}
              rel={project.liveDemoUrl ? "noreferrer" : undefined}
              className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                project.liveDemoUrl ? "hover:text-accent" : "text-muted-foreground cursor-not-allowed opacity-50"
              }`}
              onClick={(e) => {
                if (!project.liveDemoUrl) e.preventDefault();
              }}
            >
              <ExternalLink size={16} /> Demo
            </a>
          </TooltipTrigger>
          {!project.liveDemoUrl && (
            <TooltipContent>
              <p>Live demo not available</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
