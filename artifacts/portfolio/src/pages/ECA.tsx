import { Users } from "lucide-react";
import { useListCampusAmbassadors } from "@workspace/api-client-react";

export default function ECA() {
  const { data: ambassadors } = useListCampusAmbassadors();

  return (
    <div className="px-6 md:px-12 py-20 max-w-5xl mx-auto w-full space-y-16">
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">Extra-Curricular Activities</h1>
        <p className="text-xl text-muted-foreground font-serif italic">Campus Ambassador & Volunteer Roles</p>
      </header>

      <div className="space-y-8">
        {ambassadors && ambassadors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ambassadors.map((item) => (
              <div key={item.id} className="bg-card border border-border p-6 rounded-lg flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  {item.logoUrl ? (
                    <img src={item.logoUrl} alt={item.organization} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center text-muted-foreground">
                      <Users size={24} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold font-serif leading-tight">{item.organization}</h3>
                  </div>
                </div>
                
                <p className="font-medium text-foreground mb-1">{item.role}</p>
                {item.duration && (
                  <p className="text-sm font-mono text-muted-foreground">{item.duration}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No entries yet — add them via the Admin Panel.</p>
        )}
      </div>
    </div>
  );
}