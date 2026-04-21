import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Terminal, 
  BookOpen, 
  FlaskConical, 
  Code, 
  User, 
  ArrowUpRight,
  Database,
  Cpu,
  BarChart,
  Camera,
  Coffee,
  Globe,
  Award
} from "lucide-react";
import { SiPython, SiMysql, SiPostgresql, SiPowerbi } from "react-icons/si";

// --- Components ---

const Section = ({ id, title, children, className = "" }: { id: string, title?: string, children: React.ReactNode, className?: string }) => (
  <section id={id} className={`py-20 md:py-32 px-6 md:px-12 max-w-6xl mx-auto ${className}`}>
    {title && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-12 md:mb-16"
      >
        <h2 className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-2">0{id === "about" ? "1" : id === "biography" ? "2" : id === "research" ? "3" : id === "projects" ? "4" : id === "eca" ? "5" : id === "hobbies" ? "6" : "7"}.</h2>
        <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{title}</h3>
        <div className="w-12 h-1 bg-accent mt-6"></div>
      </motion.div>
    )}
    {children}
  </section>
);

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="font-bold text-lg tracking-tight hover:text-accent transition-colors">
          M.R.A.
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm font-mono text-muted-foreground">
          {["about", "research", "projects", "contact"].map((item) => (
            <a key={item} href={`#${item}`} className="hover:text-foreground transition-colors uppercase tracking-wider">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/ajmainrahman" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github size={20} />
          </a>
          <a href="https://www.linkedin.com/in/ajmain-rahman/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-accent-foreground">
      <Navbar />

      {/* Hero */}
      <section id="hero" className="min-h-[100dvh] flex flex-col justify-center px-6 md:px-12 max-w-6xl mx-auto pt-16 relative">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none"
        />
        
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="font-mono text-accent mb-4">Hello, I'm</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Moshfiqur Rahman Ajmain.
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl md:text-4xl text-muted-foreground font-medium mb-8 leading-tight">
              Building AI that understands both <span className="text-foreground">data</span> and <span className="text-foreground">people</span>.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
              Aspiring data scientist and AI/ML enthusiast based in Bangladesh. Always learning, always experimenting. I transform raw data into clear, actionable insights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <a href="#projects" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
              View Work <ArrowUpRight size={18} />
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-md font-medium hover:bg-secondary/80 transition-colors">
              Get in Touch <Mail size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <Section id="about" title="Core Stack">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Machine Learning",
              icon: <Cpu className="text-accent mb-4" size={32} />,
              skills: ["Supervised Learning", "Unsupervised Learning", "Predictive Modeling", "Feature Engineering"]
            },
            {
              title: "Data & Analysis",
              icon: <BarChart className="text-accent mb-4" size={32} />,
              skills: ["Data Wrangling", "EDA & Visualization", "Statistics", "Hypothesis Testing"]
            },
            {
              title: "Tools & Technologies",
              icon: <Terminal className="text-accent mb-4" size={32} />,
              skills: ["Python", "MySQL / PostgreSQL", "PowerBI", "Matplotlib / Seaborn"]
            }
          ].map((area, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border p-8 rounded-lg hover:border-accent/50 transition-colors group"
            >
              {area.icon}
              <h4 className="text-xl font-bold mb-4">{area.title}</h4>
              <ul className="space-y-2">
                {area.skills.map((skill, j) => (
                  <li key={j} className="flex items-center gap-2 text-muted-foreground font-mono text-sm">
                    <span className="w-1 h-1 bg-accent/50 rounded-full group-hover:bg-accent transition-colors" /> {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Biography */}
      <Section id="biography" title="The Journey">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="prose prose-lg dark:prose-invert max-w-3xl"
        >
          <div className="bg-secondary/50 border border-border p-4 rounded-md mb-8 inline-block">
            <p className="text-xs font-mono text-muted-foreground m-0">Note: Placeholder copy. Update with your actual story.</p>
          </div>
          <p>
            My fascination with data began not with numbers, but with a desire to understand systems. Growing up in Bangladesh, I observed how interconnected everything is—how a single variable changing in one place cascades through an entire ecosystem. This curiosity naturally led me to programming, and eventually, to the vast landscapes of Data Science and Machine Learning.
          </p>
          <p>
            I don't just see rows and columns; I see human behavior, system constraints, and hidden narratives. When I clean a messy dataset, I'm clarifying a story. When I build a predictive model, I'm trying to anticipate the next chapter.
          </p>
          <p>
            Currently, I am diving deep into both the mathematical rigor of statistical testing and the creative intuition required for feature engineering. I believe the best AI systems aren't just highly accurate—they are interpretable, robust, and designed with a deep empathy for the end-user. My goal is to build models that bridge the gap between complex analytical abstractions and tangible human value.
          </p>
        </motion.div>
      </Section>

      {/* Research */}
      <Section id="research" title="Research & Publications">
        <div className="space-y-8 max-w-4xl">
          {[
            {
              title: "[Placeholder] Predictive Modeling of Agricultural Yields using Climate Variables",
              venue: "International Conference on Data Science & Analytics",
              year: "2024",
              abstract: "An investigation into how localized climate data and soil parameters can be used to predict crop yields with high accuracy using ensemble methods like Random Forests and Gradient Boosting."
            },
            {
              title: "[Placeholder] Sentiment Trajectories in Regional Dialects during Crises",
              venue: "Journal of Computational Social Science",
              year: "2023",
              abstract: "A study applying NLP techniques to analyze shifts in public sentiment across various Bangla dialects on social media during natural disasters, highlighting the need for dialect-aware sentiment classifiers."
            }
          ].map((paper, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative pl-8 border-l-2 border-border hover:border-accent transition-colors"
            >
              <div className="absolute w-3 h-3 bg-background border-2 border-border group-hover:border-accent rounded-full -left-[7px] top-2 transition-colors" />
              <div className="flex items-center gap-4 mb-2">
                <span className="font-mono text-sm text-accent">{paper.year}</span>
                <span className="text-sm text-muted-foreground">{paper.venue}</span>
              </div>
              <h4 className="text-xl font-bold mb-3">{paper.title}</h4>
              <p className="text-muted-foreground leading-relaxed mb-4">{paper.abstract}</p>
              <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors">
                View Paper <ArrowUpRight size={14} />
              </a>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects" title="Selected Projects">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Customer Churn Predictor",
              desc: "[Placeholder] A complete pipeline analyzing telco data to identify churn risk factors. Built with Python, applying logistic regression and random forests to achieve 85% predictive accuracy.",
              tags: ["Python", "Scikit-Learn", "Pandas", "Matplotlib"]
            },
            {
              title: "Bangla Tweet Sentiment Analysis",
              desc: "[Placeholder] NLP pipeline for classifying sentiment in code-mixed Bangla/English tweets. Handled extensive text cleaning, tokenization, and applied TF-IDF with SVM classifiers.",
              tags: ["NLP", "Python", "NLTK", "Classification"]
            },
            {
              title: "Plant Disease Classifier",
              desc: "[Placeholder] Image classification model to identify common leaf diseases from agricultural datasets. Focused on exploratory data analysis and baseline convolutional architectures.",
              tags: ["Computer Vision", "EDA", "Deep Learning"]
            },
            {
              title: "Retail Sales Dashboard",
              desc: "[Placeholder] Interactive PowerBI dashboard connecting to a MySQL backend, providing real-time insights into regional sales performance, inventory levels, and seasonal trends.",
              tags: ["PowerBI", "MySQL", "Data Viz", "DAX"]
            }
          ].map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border p-8 rounded-lg flex flex-col h-full hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-secondary rounded-md text-foreground">
                  <Database size={24} />
                </div>
                <a href="https://github.com/ajmainrahman" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent transition-colors">
                  <Github size={20} />
                </a>
              </div>
              <h4 className="text-xl font-bold mb-3">{project.title}</h4>
              <p className="text-muted-foreground mb-6 flex-grow text-sm leading-relaxed">{project.desc}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-mono bg-secondary/50 text-secondary-foreground px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a href="https://github.com/ajmainrahman" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-md font-medium hover:bg-secondary transition-colors">
            View full archive on GitHub <ArrowUpRight size={16} />
          </a>
        </div>
      </Section>

      {/* ECA & Hobbies */}
      <section className="py-20 bg-secondary/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Award className="text-accent" /> Extra-Curricular
            </h3>
            <div className="space-y-6">
              {[
                { role: "[Placeholder] Volunteer Data Instructor", org: "Tech For BD", period: "2023 - Present" },
                { role: "[Placeholder] Programming Club Member", org: "University Tech Society", period: "2021 - 2024" },
                { role: "[Placeholder] Hackathon Finalist", org: "National Datathon", period: "2023" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-start border-b border-border/50 pb-4 last:border-0">
                  <div>
                    <h4 className="font-medium">{item.role}</h4>
                    <p className="text-sm text-muted-foreground">{item.org}</p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">{item.period}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Camera className="text-accent" /> Beyond the Screen
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Camera size={20} />, name: "Photography" },
                { icon: <BookOpen size={20} />, name: "Reading" },
                { icon: <Globe size={20} />, name: "Traveling" },
                { icon: <Coffee size={20} />, name: "Chess" }
              ].map((hobby, i) => (
                <div key={i} className="flex items-center gap-3 bg-card border border-border p-4 rounded-md">
                  <div className="text-muted-foreground">{hobby.icon}</div>
                  <span className="font-medium text-sm">{hobby.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Contact */}
      <Section id="contact" title="Get In Touch" className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-lg text-muted-foreground mb-10">
            I'm currently looking for new opportunities, collaborations, and interesting datasets to explore. Whether you have a question or just want to say hi, my inbox is always open.
          </p>
          <a href="mailto:ajmain.rahman@example.com" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-md font-medium hover:bg-primary/90 transition-colors text-lg">
            Say Hello <Mail size={20} />
          </a>
          
          <div className="flex justify-center gap-8 mt-16 pt-8 border-t border-border">
            <a href="https://github.com/ajmainrahman" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Github size={20} /> <span className="font-mono text-sm">GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/ajmain-rahman/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin size={20} /> <span className="font-mono text-sm">LinkedIn</span>
            </a>
          </div>
        </motion.div>
      </Section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border bg-card">
        <p className="text-sm font-mono text-muted-foreground">
          Designed & Built by Moshfiqur Rahman Ajmain. <br/>
          <span className="opacity-50">© {new Date().getFullYear()} All rights reserved.</span>
        </p>
      </footer>
    </div>
  );
}
