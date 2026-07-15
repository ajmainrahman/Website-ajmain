import { useListEducation } from "@workspace/api-client-react";

export default function Education() {
  const { data: education } = useListEducation();
  
  const sortedEdu = education ? [...education].sort((a, b) => b.startYear - a.startYear) : [];

  return (
    <div className="px-6 md:px-12 py-20 max-w-5xl mx-auto w-full space-y-16">
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">Education</h1>
        <p className="text-xl text-muted-foreground font-serif italic">Academic background and formal training.</p>
      </header>

      {sortedEdu.length > 0 ? (
        <div className="space-y-12">
          {sortedEdu.map((edu) => {
            const bulletPoints = edu.description
              ? edu.description.split("\n").map(s => s.trim()).filter(Boolean)
              : [];

            return (
              <div key={edu.id} className="relative pl-8 border-l-2 border-border pb-8 last:pb-0">
                <div className="absolute w-4 h-4 bg-background border-2 border-accent rounded-full -left-[9px] top-1" />
                <div className="mb-2">
                  <span className="font-mono text-sm text-accent font-medium">
                    {edu.startYear} – {edu.endYear || "Present"}
                  </span>
                </div>
                <h2 className="text-2xl font-serif font-bold mb-2">{edu.degree}</h2>
                <h3 className="text-lg font-medium text-muted-foreground mb-4">{edu.institution}</h3>

                {bulletPoints.length > 1 ? (
                  <ul className="space-y-1.5 text-muted-foreground leading-relaxed max-w-3xl">
                    {bulletPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground leading-relaxed max-w-3xl">
                    {edu.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground italic">No education entries yet — add them via the Admin Panel.</p>
      )}
    </div>
  );
}
