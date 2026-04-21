import { ArrowUpRight, BookOpen } from "lucide-react";

const publications = [
  {
    title: "Benchmark Diagnostic MRI and Medical Imaging Dataset",
    venue: "[Placeholder] Journal of Medical Imaging",
    year: "2024",
    abstract: "[Placeholder] This paper introduces a comprehensive, annotated dataset of MRI scans aimed at improving the training of diagnostic deep learning models. We detail the collection methodology, annotation process, and baseline model performance."
  },
  {
    title: "A Deep Learning Approach to Detect and Classification of Lung Cancer",
    venue: "[Placeholder] International Conference on Health Informatics",
    year: "2023",
    abstract: "[Placeholder] We propose a novel convolutional neural network architecture for the early detection and classification of lung cancer nodules from CT scans, achieving state-of-the-art sensitivity on standard benchmarks."
  },
  {
    title: "Team Error Point at BLP-2023 Task 1: A Comprehensive Approach for Violence Inciting Text Detection using Deep Learning and Traditional Machine Learning Algorithm",
    venue: "Workshop on Bangla Language Processing (BLP-2023)",
    year: "2023",
    abstract: "[Placeholder] We describe our system for detecting violence-inciting text in Bangla. We compared traditional machine learning models with deep learning approaches, finding that an ensemble method yielded the best results for this specific NLP task."
  },
  {
    title: "Survey-based Machine learning approaches to diagnosis of hair fall disorder in Bangladeshi Community",
    venue: "[Placeholder] Journal of Computational Health",
    year: "2022",
    abstract: "[Placeholder] Utilizing a large-scale survey from the Bangladeshi community, we applied various machine learning techniques to identify key predictive factors for hair fall disorders, providing a data-driven foundation for dermatological diagnosis."
  },
  {
    title: "Enhancing Sentiment Analysis using Machine Learning Predictive Models to Analyze Social Media Reviews on Junk Food",
    venue: "[Placeholder] Symposium on Applied Data Science",
    year: "2022",
    abstract: "[Placeholder] This study explores public perception of junk food brands by applying advanced sentiment analysis models to social media data, highlighting correlations between specific marketing campaigns and consumer sentiment shifts."
  }
];

export default function Research() {
  return (
    <div className="px-6 md:px-12 py-20 max-w-5xl mx-auto w-full space-y-16">
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">Research & Publications</h1>
        <p className="text-xl text-muted-foreground font-serif italic">Academic contributions and peer-reviewed work.</p>
      </header>

      <div className="bg-secondary/50 border border-border p-4 rounded-md mb-8 inline-flex items-center gap-2">
        <BookOpen size={16} className="text-muted-foreground" />
        <p className="text-sm text-muted-foreground m-0">Note: Venues, years, and abstracts are placeholders to be updated by the owner.</p>
      </div>

      <div className="space-y-12">
        {publications.map((paper, index) => (
          <article key={index} className="group relative pl-8 border-l-2 border-border hover:border-accent transition-colors">
            <div className="absolute w-3 h-3 bg-background border-2 border-border group-hover:border-accent rounded-full -left-[7px] top-2 transition-colors" />
            
            <div className="flex items-center gap-4 mb-2">
              <span className="font-mono text-sm text-accent font-medium">{paper.year}</span>
              <span className="text-sm text-muted-foreground">{paper.venue}</span>
            </div>
            
            <h2 className="text-2xl font-serif font-bold mb-4 leading-tight">{paper.title}</h2>
            
            <p className="text-muted-foreground leading-relaxed mb-4 max-w-3xl">
              {paper.abstract}
            </p>
            
            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors">
              Read Paper <ArrowUpRight size={14} />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}