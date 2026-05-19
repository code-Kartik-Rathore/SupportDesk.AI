import { Link } from "react-router-dom";
import { ArrowRight, Bot, ShieldCheck, Zap, Sparkles, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200 overflow-hidden relative font-sans">
      {/* Decorative blurred gradients (Blobs) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      <div className="absolute top-[50%] left-[50%] w-72 h-72 bg-info/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-3000"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="text-center max-w-4xl mx-auto relative">
          {/* Floating Icons */}
          <div className="absolute -top-10 -left-10 text-primary/30 animate-bounce animation-delay-1000">
            <Sparkles size={40} />
          </div>
          <div className="absolute -top-5 -right-10 text-secondary/30 animate-pulse animation-delay-2000">
            <Star size={32} />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-100 border border-base-300 shadow-sm mb-8 text-sm font-medium text-primary hover:scale-105 transition-transform cursor-pointer">
            <Bot size={16} />
            <span>AI-Powered Ticket Resolution</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight text-base-content">
            Support that works <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              smarter, not harder.
            </span>
          </h1>
          
          <p className="mb-10 text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Automate your IT and customer support with an intelligent ticket management system. Categorize, prioritize, and assign tickets instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup" className="btn btn-primary btn-lg rounded-full px-8 shadow-xl shadow-primary/30 hover:scale-105 transition-transform group">
              Start for free
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg rounded-full px-8 hover:bg-base-300 border-base-300 hover:scale-105 transition-transform">
              Log In
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="card bg-base-100/40 backdrop-blur-xl border border-base-300/50 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group">
            <div className="card-body items-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 ring-1 ring-primary/20 group-hover:scale-110 transition-transform">
                <Bot size={32} />
              </div>
              <h3 className="card-title text-xl mb-2 font-bold group-hover:text-primary transition-colors">Smart Routing</h3>
              <p className="text-base-content/70">Automatically assigns tickets to the most qualified moderators based on required skills.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card bg-base-100/40 backdrop-blur-xl border border-base-300/50 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group">
            <div className="card-body items-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 ring-1 ring-secondary/20 group-hover:scale-110 transition-transform">
                <Zap size={32} />
              </div>
              <h3 className="card-title text-xl mb-2 font-bold group-hover:text-secondary transition-colors">Auto-Categorization</h3>
              <p className="text-base-content/70">Our AI model instantly reads and tags tickets so you don't have to manually triage.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card bg-base-100/40 backdrop-blur-xl border border-base-300/50 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group">
            <div className="card-body items-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-4 ring-1 ring-accent/20 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <h3 className="card-title text-xl mb-2 font-bold group-hover:text-accent transition-colors">Reliable & Secure</h3>
              <p className="text-base-content/70">Role-based access controls with secure background processing for all incoming requests.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
