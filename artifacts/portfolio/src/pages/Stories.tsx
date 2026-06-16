import { useListStories } from "@workspace/api-client-react";

export default function Stories() {
  const { data: stories } = useListStories();

  const sortedStories = stories ? [...stories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

  return (
    <div className="px-6 md:px-12 py-20 max-w-4xl mx-auto w-full space-y-16">
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">Stories & Updates</h1>
        <p className="text-xl text-muted-foreground font-serif italic">Personal milestones, reflections, and updates.</p>
      </header>

      <div className="space-y-16">
        {sortedStories.length > 0 ? (
          sortedStories.map((story) => (
            <article key={story.id} className="space-y-6">
              <div className="space-y-2">
                <span className="text-sm font-mono text-accent">{story.date}</span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold leading-tight">{story.title}</h2>
              </div>
              
              {story.imageUrl && (
                <div className="w-full max-h-[500px] overflow-hidden rounded-lg border border-border">
                  <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="prose prose-lg dark:prose-invert max-w-none font-serif leading-relaxed text-foreground">
                {story.body.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))
        ) : (
          <p className="text-muted-foreground italic">No stories yet — check back soon.</p>
        )}
      </div>
    </div>
  );
}