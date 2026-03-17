import React from "react";

const LEAF_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBU5OWWcepVmbuglWBpnfb4svab04kCCEY9uXWSQLFXGjmVqu-bNRia6g-3WQjxnerA9DdvT9VlYo30hkaK1EW-V9377BO7KWL17PMQFEy192n5YylCc76jhrIAlUXGPYvIdorRHXBgQgm32lnlof303kTX8KnnVW9GI62TCwFIOdahE5cyjZB5HLOOMMVrncJ-V_35obxDfCdhJIvMPVwJFHLOwJ-0h_2zNUKDM-4BNmkI-JUrlyhKmanydixO8L2_p88xWAAW3wiW";

const pipelineSteps = [
  { icon: "camera", title: "Detect", desc: "Capture image of the plant leaf with your camera." },
  { icon: "search", title: "Diagnose", desc: "Identify specific disease markers via neural network." },
  { icon: "lightbulb", title: "Advise", desc: "Get specialized treatment and chemical recommendations." },
  { icon: "calendar_month", title: "Schedule", desc: "Plan intervention tasks and treatment cycles." },
  { icon: "priority_high", title: "Prioritize", desc: "Assess urgency levels across the entire crop yield." },
];

const techStack = [
  { icon: "javascript", name: "React", color: "text-sky-500" },
  { icon: "format_paint", name: "Tailwind CSS", color: "text-cyan-400" },
  { icon: "bolt", name: "FastAPI", color: "text-emerald-500" },
  { icon: "memory", name: "TensorFlow", color: "text-orange-500" },
  { icon: "model_training", name: "Google Gemini", color: "text-indigo-500" },
];

const developer = {
  name: "Bakhtiyor (John) Dadajonov",
  role: "AI/ML Engineer",
  email: "bakhtiyorjondadajonov@gmail.com",
  portfolio: "https://itsbakhtiyor.vercel.app/",
};

const About = () => {
  return (
    <div className="bg-background-light font-display text-slate-900">
      {/* Section 1: Overview */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-slate-900 text-4xl md:text-5xl font-black leading-tight">
              About This Project
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Global crop losses due to pests and diseases threaten food security
              and economic stability for millions of small-scale farmers. Our
              AI-driven solution empowers agricultural communities with instant
              diagnostic tools to protect their yields and promote sustainable
              farming practices.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-6 rounded-xl border border-primary/10 bg-white shadow-sm flex flex-col gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">
                  bolt
                </span>
                <h3 className="font-bold text-slate-900">Fast CNN Detection</h3>
                <p className="text-sm text-slate-500">
                  Real-time leaf scanning and disease identification using
                  lightweight mobile neural networks.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-primary/10 bg-white shadow-sm flex flex-col gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">
                  auto_awesome
                </span>
                <h3 className="font-bold text-slate-900">
                  Gemini Vision Analysis
                </h3>
                <p className="text-sm text-slate-500">
                  Deep multimodal analysis for treatment suggestions and
                  long-term crop management.
                </p>
              </div>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-square md:aspect-video lg:aspect-square bg-slate-200 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent z-10"></div>
            <img
              src={LEAF_IMAGE}
              alt="Close up of a green plant leaf in sunlight"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Pipeline */}
      <section className="bg-primary/5 py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How the AI Pipeline Works
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Our seamless end-to-end process ensures that identifying a disease
              is just the beginning of the journey back to plant health.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {pipelineSteps.map((step) => (
              <div
                key={step.title}
                className="flex flex-col items-center text-center gap-4 relative z-10"
              >
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-2xl">
                    {step.icon}
                  </span>
                </div>
                <h3 className="font-bold text-lg">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Tech Stack */}
      <section className="bg-white py-20 px-6 border-b border-primary/10">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
            Built With
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-4 min-w-[200px] hover:border-primary transition-all"
              >
                <span className={`material-symbols-outlined ${tech.color}`}>
                  {tech.icon}
                </span>
                <span className="font-bold">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Created By */}
      <section className="bg-primary/5 py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Created By
            </h2>
          </div>
          <div className="max-w-lg mx-auto bg-white rounded-2xl border border-primary/10 shadow-sm p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-4xl">
                person
              </span>
            </div>
            <h3 className="font-bold text-2xl text-slate-900">
              {developer.name}
            </h3>
            <span className="mt-2 inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {developer.role}
            </span>
            <hr className="w-full border-slate-200 my-6" />
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href={`mailto:${developer.email}`}
                className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">mail</span>
                <span className="text-sm">{developer.email}</span>
              </a>
              <a
                href={developer.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">language</span>
                <span className="text-sm">Portfolio</span>
              </a>
            </div>
          </div>
          <p className="text-center text-slate-400 text-sm mt-6">
            For any inquiries, feel free to reach out
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
