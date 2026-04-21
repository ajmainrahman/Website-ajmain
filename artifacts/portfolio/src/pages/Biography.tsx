export default function Biography() {
  return (
    <div className="px-6 md:px-12 py-20 max-w-4xl mx-auto w-full space-y-12">
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">Biography</h1>
        <p className="text-xl text-muted-foreground font-serif italic">The journey so far.</p>
      </header>

      <div className="bg-secondary/50 border border-border p-4 rounded-md mb-8 inline-block">
        <p className="text-xs font-mono text-muted-foreground m-0">Note: Placeholder copy. Update with your actual story.</p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
        <p>
          My fascination with data began not with numbers, but with a desire to understand systems. Growing up in Bangladesh, I observed how interconnected everything is—how a single variable changing in one place cascades through an entire ecosystem. This curiosity naturally led me to programming, and eventually, to the vast landscapes of Data Science and Machine Learning.
        </p>
        <p>
          I don't just see rows and columns; I see human behavior, system constraints, and hidden narratives. When I clean a messy dataset, I'm clarifying a story. When I build a predictive model, I'm trying to anticipate the next chapter.
        </p>
        <p>
          Over the years, I have sought to bridge the gap between academic theory and practical application. My research has touched upon diverse areas—from medical imaging diagnostics to understanding dialect-driven sentiment in natural language. I find that the rigor demanded by academic publication deeply informs the robustness required for industry-grade data pipelines.
        </p>
        <p>
          Currently, I am diving deep into both the mathematical rigor of statistical testing and the creative intuition required for feature engineering. I believe the best AI systems aren't just highly accurate—they are interpretable, robust, and designed with a deep empathy for the end-user. My goal is to build models that bridge the gap between complex analytical abstractions and tangible human value.
        </p>
      </div>
    </div>
  );
}