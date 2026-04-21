import { Users, Award, Mic } from "lucide-react";

export default function ECA() {
  return (
    <div className="px-6 md:px-12 py-20 max-w-4xl mx-auto w-full space-y-16">
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">Extra-Curricular Activities</h1>
        <p className="text-xl text-muted-foreground font-serif italic">Leadership, community, and engagement.</p>
      </header>

      <div className="bg-secondary/50 border border-border p-4 rounded-md mb-8">
        <p className="text-sm text-muted-foreground m-0">Note: Placeholder content. Update with actual extra-curricular experiences.</p>
      </div>

      <div className="space-y-8">
        {[
          {
            role: "[Placeholder] Vice President",
            organization: "University Data Science Society",
            period: "2022 - 2024",
            description: "Organized weekly workshops on Python and SQL for underclassmen. Coordinated the annual university datathon with over 200 participants.",
            icon: <Users className="text-accent" size={24} />
          },
          {
            role: "[Placeholder] Technical Speaker",
            organization: "Regional Tech Conference",
            period: "2023",
            description: "Delivered a talk on 'Introduction to Predictive Modeling' to an audience of 150+ students and professionals, focusing on accessible data science practices.",
            icon: <Mic className="text-accent" size={24} />
          },
          {
            role: "[Placeholder] Finalist",
            organization: "National Innovation Hackathon",
            period: "2022",
            description: "Led a team of four to develop a prototype machine learning application aimed at early disease detection in regional crops. Placed top 5 out of 50+ teams.",
            icon: <Award className="text-accent" size={24} />
          }
        ].map((item, index) => (
          <div key={index} className="flex gap-6 bg-card border border-border p-6 rounded-lg">
            <div className="hidden sm:block mt-1">
              {item.icon}
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                <h3 className="text-xl font-bold">{item.role}</h3>
                <span className="font-mono text-sm text-accent">{item.period}</span>
              </div>
              <p className="font-medium text-foreground mb-3">{item.organization}</p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}