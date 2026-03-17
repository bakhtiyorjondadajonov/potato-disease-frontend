import React from "react";
import { Link } from "react-router-dom";
import { plants } from "../data/plantData";
import earlyBlight from "../images/early_blight/early_blight_1.jpg";
import lateBlight from "../images/late_blight/late_blight_1.jpg";
import healthyLeaf from "../images/healthy/healthy_1.jpg";

const HERO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCL9bsynQMcvFxZuSMA_OZDk6yJ_aLw82BerDxKy1sIjnWjo4-Vol3rFyaFpKtxh6VIB8I-yfDTcMhnMPZcaIJIsLqg00mEiw7epoqsBn4AlUh_K7AaWOT_31Jnm_qJ5EbpsaIwLoj3f4jqx3p4UbiZ-4JnnnGgNqcY8pv6Jye5tvrrxcQWkGNnyem6trXVBL8pZeU96Z6aVoCXv8SbOhPHZnz9FwDQeBdjACSJwXIIVbIg0TwEnwjWGTHbJ9IYWdtx8jwXlnq7el9P";

const stats = [
  { icon: "potted_plant", value: "6", label: "Plants Supported" },
  { icon: "coronavirus", value: "38+", label: "Diseases Detectable" },
  { icon: "bolt", value: "Instant", label: "Analysis Results" },
];

const diseases = [
  {
    name: "Early Blight",
    image: earlyBlight,
    borderColor: "border-red-500",
    description:
      "Characterized by small, dark, concentric spots on older leaves. Often looks like a \"target\" pattern.",
  },
  {
    name: "Late Blight",
    image: lateBlight,
    borderColor: "border-orange-500",
    description:
      "Large, irregular, water-soaked, grey-green patches. Can spread rapidly in humid conditions.",
  },
  {
    name: "Healthy Leaf",
    image: healthyLeaf,
    borderColor: "border-primary",
    description:
      "Deep green color, firm structure, and no visible lesions or discoloration on the leaf surface.",
  },
];

const steps = [
  { icon: "potted_plant", title: "Select Plant", desc: "Choose from our list of supported crops." },
  { icon: "photo_camera", title: "Upload Photo", desc: "Upload a clear photo of the infected leaf." },
  { icon: "psychology", title: "AI Diagnosis", desc: "Our neural network analyzes the symptoms." },
  { icon: "assignment", title: "Get Plan", desc: "Receive a detailed treatment plan." },
];

const Home = () => {
  return (
    <div className="font-display bg-background-light text-slate-900">
      {/* Hero Section */}
      <section className="relative bg-background-dark min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent z-10"></div>
          <img
            src={HERO_BG}
            alt="Green farm field at sunrise"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-10 py-20 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">
              AI-Powered Plant <br />
              <span className="text-primary">Disease Detection</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
              Photograph a leaf. Get an instant diagnosis with treatment advice
              — no pathology degree needed.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/analyze"
                className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 no-underline"
              >
                <span className="material-symbols-outlined">analytics</span>
                Start Analysis
              </Link>
              <a
                href="#supported-plants"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-all no-underline"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="max-w-5xl mx-auto -mt-12 relative z-30 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow-xl border border-primary/10">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex items-center gap-4 px-4 py-2 ${
                i < stats.length - 1
                  ? "border-b md:border-b-0 md:border-r border-slate-100"
                  : ""
              }`}
            >
              <span className="material-symbols-outlined text-primary text-4xl">
                {stat.icon}
              </span>
              <div>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Supported Plants */}
      <section id="supported-plants" className="py-24 bg-background-light px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              Plants We Can Diagnose
            </h2>
            <div className="h-1 w-20 bg-primary rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plants.map((plant) => (
              <div
                key={plant.id}
                className="bg-white p-4 rounded-xl shadow-sm border-2 border-transparent hover:border-primary transition-all group"
              >
                <div className="aspect-video rounded-lg overflow-hidden mb-4 relative">
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span
                    className={`absolute top-3 left-3 ${
                      plant.badgeColor === "blue"
                        ? "bg-blue-600"
                        : "bg-purple-600"
                    } text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1`}
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      {plant.badgeColor === "blue" ? "memory" : "auto_awesome"}
                    </span>
                    {plant.badge.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                  {plant.name}
                </h3>
                <p className="text-slate-500 text-sm mt-1">{plant.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Disease Gallery */}
      <section className="py-24 bg-white px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black text-slate-900">
              Common Potato Diseases
            </h2>
            <p className="text-slate-500 mt-2">
              Visual guides for quick manual cross-reference
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {diseases.map((disease) => (
              <div
                key={disease.name}
                className={`bg-white rounded-xl shadow-lg overflow-hidden border-t-8 ${disease.borderColor}`}
              >
                <img
                  src={disease.image}
                  alt={disease.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    {disease.name}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {disease.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="py-24 bg-background-light px-4 md:px-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              How It Works
            </h2>
            <p className="text-slate-500">Four simple steps to plant health</p>
          </div>
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-12">
            {steps.map((step, i) => (
              <React.Fragment key={step.title}>
                <div className="flex flex-col items-center text-center relative z-10 max-w-[200px]">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-md">
                    <span className="material-symbols-outlined text-4xl">
                      {step.icon}
                    </span>
                  </div>
                  <h5 className="text-lg font-bold text-slate-900 mb-2">
                    {step.title}
                  </h5>
                  <p className="text-xs text-slate-500">{step.desc}</p>
                </div>
                {i < steps.length - 1 ? (
                  <div className="hidden md:block w-[15%] h-1 border-t-2 border-dashed border-slate-300"></div>
                ) : null}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link
              to="/analyze"
              className="bg-primary text-white px-10 py-4 rounded-lg font-black hover:scale-105 transition-transform shadow-lg shadow-primary/30 no-underline inline-block"
            >
              TRY IT NOW
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
