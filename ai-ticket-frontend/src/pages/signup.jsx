import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, KeyRound, Mail, Loader2, Sparkles } from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-base-100 font-sans">
      {/* Left side: Beautiful gradient and copy */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-20 bg-gradient-to-br from-primary via-secondary to-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-lg">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity">
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-medium mb-6">
            <Sparkles size={16} /> Get started in seconds
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">Join SupportDesk AI today</h1>
          <p className="text-xl opacity-90 leading-relaxed font-light">
            Automate your IT support and customer service with our intelligent ticket management platform.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/20 rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-white/20 rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      {/* Right side: Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Mobile back button */}
        <Link to="/" className="absolute top-8 left-8 lg:hidden inline-flex items-center gap-2 text-base-content/70 hover:text-base-content">
          <ArrowLeft size={20} /> Home
        </Link>
        
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold mb-2">Create an account</h2>
            <p className="text-base-content/70">Sign up to get started with SupportDesk AI</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  className="input input-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-base-200"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <KeyRound size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  className="input input-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-base-200"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-2 shadow-lg shadow-primary/30"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Signing up...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-base-content/70">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
