import { ExternalLink, Star } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useListHobbies, useListBlogPosts } from "@workspace/api-client-react";

export default function Hobbies() {
  const { data: hobbies } = useListHobbies();
  const { data: blogPosts } = useListBlogPosts();

  const renderIcon = (iconName: string | null | undefined) => {
    if (!iconName) return <Star size={28} className="text-accent" />;
    
    // @ts-ignore - dynamic icon lookup
    const IconComponent = LucideIcons[iconName];
    if (IconComponent) {
      return <IconComponent size={28} className="text-accent" />;
    }
    return <Star size={28} className="text-accent" />;
  };

  const sortedPosts = blogPosts ? [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

  return (
    <div className="px-6 md:px-12 py-20 max-w-5xl mx-auto w-full space-y-24">
      
      {/* Hobbies Section */}
      <section className="space-y-16">
        <header className="space-y-4 border-b border-border pb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Hobbies & Interests</h1>
          <p className="text-xl text-muted-foreground font-serif italic">Beyond the screen and the data.</p>
        </header>

        {hobbies && hobbies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hobbies.map((hobby) => (
              <div key={hobby.id} className="bg-card border border-border p-8 rounded-lg hover:border-accent/30 transition-colors">
                <div className="mb-6 bg-secondary/50 inline-block p-3 rounded-md">
                  {renderIcon(hobby.icon)}
                </div>
                <h3 className="text-xl font-bold mb-3 font-serif">{hobby.name}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {hobby.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No hobbies added yet.</p>
        )}
      </section>

      {/* Blog Posts Section */}
      <section className="space-y-12">
        <header className="space-y-4 border-b border-border pb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Writing & Blog Posts</h2>
        </header>

        {sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedPosts.map((post) => (
              <div key={post.id} className="bg-card border border-border rounded-lg overflow-hidden flex flex-col hover:border-accent/50 transition-colors">
                {post.coverImageUrl && (
                  <div className="w-full h-48 bg-muted">
                    <img 
                      src={post.coverImageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="text-xs font-mono text-muted-foreground mb-3">{post.date}</div>
                  <h3 className="text-xl font-bold font-serif mb-3 leading-tight">{post.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto">
                    <a href={post.externalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
                      Read Article <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No blog posts published yet.</p>
        )}
      </section>

    </div>
  );
}
