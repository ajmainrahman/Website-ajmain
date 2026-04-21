import { Download } from "lucide-react";

const stack = {
  "Languages": ["Python Programming", "C", "MySQL", "PostgreSQL", "DAX"],
  "ML/Stats": ["Statistics & Hypothesis Testing", "Supervised Learning (Regression, Classification)", "Unsupervised Learning (Clustering, PCA)", "Feature Engineering", "Predictive Modeling (Linear & Logistic Regression, Decision Trees, Random Forests)"],
  "Data & DB": ["Data Wrangling & Cleaning", "Database Design", "MySQL", "PostgreSQL", "EDA"],
  "Visualization": ["Matplotlib", "Seaborn", "PowerBI"]
};

export default function About() {
  return (
    <div className="px-6 md:px-12 py-20 max-w-5xl mx-auto w-full space-y-16">
      
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">About</h1>
        <p className="text-xl text-muted-foreground font-serif italic">Professional summary & technical expertise.</p>
      </header>

      <section className="prose prose-lg dark:prose-invert max-w-none">
        <p>
          I am a driven AI/ML researcher and data practitioner focused on deriving meaningful insights from complex datasets. My work bridges the gap between rigorous academic research and practical, scalable data products.
        </p>
        <p>
          With a strong foundation in Python and SQL, I specialize in predictive modeling, statistical analysis, and end-to-end data pipelines. I am constantly expanding my toolkit, exploring new algorithms, and refining my ability to communicate data-driven narratives.
        </p>
        <div className="mt-8">
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded hover:bg-primary/90 transition-colors font-medium">
            <Download size={18} /> Download CV (Placeholder)
          </button>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-serif font-bold">Key Technologies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(stack).map(([category, skills]) => (
            <div key={category} className="bg-card border border-border p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4 text-accent">{category}</h3>
              <ul className="space-y-2">
                {skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-muted-foreground text-sm">
                    <span className="w-1.5 h-1.5 bg-accent/50 rounded-full" /> {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold">Research Interests</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>Medical Imaging & Diagnostics</li>
            <li>Natural Language Processing (NLP)</li>
            <li>Sentiment Analysis in Regional Dialects</li>
            <li>Deep Learning Architectures</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold">Industry Interests</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>Data Engineering & Architecture</li>
            <li>Business Intelligence & Analytics</li>
            <li>Predictive Customer Modeling</li>
            <li>End-to-End ML Deployment</li>
          </ul>
        </div>
      </section>

    </div>
  );
}