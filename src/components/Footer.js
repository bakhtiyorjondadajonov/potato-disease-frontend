import React from "react";
import { Link } from "react-router-dom";

const techStack = ["React", "FastAPI", "TensorFlow", "Gemini Pro", "Tailwind CSS"];

const Footer = () => {
  return (
    <footer className="bg-[#14532d] text-white pt-20 pb-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary text-3xl">
              energy_savings_leaf
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              LeafSense
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed mb-6">
            Harnessing the power of Deep Learning to empower farmers and
            gardeners worldwide. Our mission is to reduce crop loss through
            early detection.
          </p>
          <div className="flex gap-4">
            <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined">share</span>
            </span>
            <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined">mail</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h6 className="text-lg font-bold mb-6">Navigation</h6>
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className="text-slate-300 hover:text-primary transition-colors no-underline"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/analyze"
                className="text-slate-300 hover:text-primary transition-colors no-underline"
              >
                Analyze Plant
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-slate-300 hover:text-primary transition-colors no-underline"
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Tech Stack + Status */}
        <div>
          <h6 className="text-lg font-bold mb-6">Built With</h6>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="bg-white/10 px-3 py-1.5 rounded text-xs font-bold border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <p className="text-xs text-slate-400 font-medium mb-4 uppercase tracking-widest">
              Operational Status
            </p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm font-bold">All Systems Functional</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-center">
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} LeafSense. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
