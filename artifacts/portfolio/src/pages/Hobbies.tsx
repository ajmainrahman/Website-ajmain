import { BookOpen, Camera, Globe, Cpu } from "lucide-react";

export default function Hobbies() {
  return (
    <div className="px-6 md:px-12 py-20 max-w-4xl mx-auto w-full space-y-16">
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">Hobbies & Interests</h1>
        <p className="text-xl text-muted-foreground font-serif italic">Beyond the screen and the data.</p>
      </header>

      <div className="bg-secondary/50 border border-border p-4 rounded-md mb-8">
        <p className="text-sm text-muted-foreground m-0">Note: Placeholder content. Update with actual hobbies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            title: "[Placeholder] Photography",
            description: "I enjoy street and landscape photography, focusing on architectural lines and urban life. It provides a creative counterweight to algorithmic work.",
            icon: <Camera size={28} className="text-accent" />
          },
          {
            title: "[Placeholder] Reading",
            description: "Avid reader of both hard science fiction and historical non-fiction. I find that diverse reading deeply influences creative problem solving.",
            icon: <BookOpen size={28} className="text-accent" />
          },
          {
            title: "[Placeholder] Travel & Culture",
            description: "Exploring different regions of Bangladesh and beyond, studying local histories and the intersection of culture and geography.",
            icon: <Globe size={28} className="text-accent" />
          },
          {
            title: "[Placeholder] Hardware Tinkering",
            description: "Building small IoT projects and tinkering with single-board computers like Raspberry Pi to bridge software algorithms with physical sensors.",
            icon: <Cpu size={28} className="text-accent" />
          }
        ].map((hobby, index) => (
          <div key={index} className="bg-card border border-border p-8 rounded-lg hover:border-accent/30 transition-colors">
            <div className="mb-6 bg-secondary/50 inline-block p-3 rounded-md">
              {hobby.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 font-serif">{hobby.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {hobby.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}