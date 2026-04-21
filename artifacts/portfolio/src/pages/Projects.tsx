import { Database, Code, Terminal, BarChart, Activity } from "lucide-react";

const appliedProjects = [
  {
    title: "[Placeholder] Medical Imaging Classifier",
    description: "Built a robust CNN architecture to classify anomalies in MRI scans. Focused on handling class imbalance through targeted augmentation and rigorous validation strategies.",
    tags: ["Python", "PyTorch", "Computer Vision", "Medical Data"],
    icon: <Activity size={24} />
  },
  {
    title: "[Placeholder] Bangla NLP Sentiment Analyzer",
    description: "Developed an NLP pipeline specifically tuned for code-mixed Bangla text, processing noisy social media data to classify sentiment during key regional events.",
    tags: ["NLP", "Transformers", "scikit-learn", "Pandas"],
    icon: <Code size={24} />
  },
  {
    title: "[Placeholder] Retail Sales Analytics Dashboard",
    description: "Engineered an end-to-end data pipeline from a MySQL backend to an interactive PowerBI dashboard, providing real-time KPI tracking for retail managers.",
    tags: ["PowerBI", "MySQL", "DAX", "Data Modeling"],
    icon: <BarChart size={24} />
  }
];

export default function Projects() {
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
            "From the first semester (2020) I started solving problems in various Online judges and different websites. Till now I have solved around <strong className="text-foreground">250+ problems</strong> in C, Python and MySQL."
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

      {/* Applied ML / Data Projects Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold border-l-4 border-accent pl-4">Applied Data Products</h2>
          <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">Placeholder Content</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {appliedProjects.map((project, index) => (
            <div key={index} className="bg-card border border-border p-8 rounded-lg flex flex-col hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 bg-secondary text-foreground rounded-lg flex items-center justify-center mb-6">
                {project.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">{project.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 flex-grow text-sm">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="bg-background border border-border px-2.5 py-1 rounded text-xs font-mono text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}