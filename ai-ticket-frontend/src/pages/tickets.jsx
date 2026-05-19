import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Ticket, Clock, ArrowRight, Loader2, Search } from "lucide-react";

export default function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      const data = await res.json();
      setTickets(data || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets(); // Refresh list
      } else {
        alert(data.error || data.message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.title?.toLowerCase().includes(search.toLowerCase()) || 
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-base-200 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Create Ticket */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4 flex items-center gap-2">
                  <PlusCircle className="text-primary" size={24} />
                  New Ticket
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Issue Title</span>
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="E.g. Database connection timeout"
                      className="input input-bordered w-full focus:ring-2 focus:ring-primary/50 transition-shadow bg-base-200"
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Description</span>
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Please provide details about the issue..."
                      className="textarea textarea-bordered w-full h-32 focus:ring-2 focus:ring-primary/50 transition-shadow bg-base-200 resize-none"
                      required
                    ></textarea>
                  </div>
                  
                  <button className="btn btn-primary w-full shadow-lg shadow-primary/30" type="submit" disabled={loading}>
                    {loading ? (
                      <><Loader2 className="animate-spin" size={18} /> Submitting...</>
                    ) : (
                      "Submit Ticket"
                    )}
                  </button>
                </form>
              </div>
            </div>
            
            {/* Info Card */}
            <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 shadow-md">
               <div className="card-body p-6">
                 <h3 className="font-bold text-lg mb-2 text-base-content flex items-center gap-2">
                   <Ticket size={20} className="text-primary" />
                   AI Routing
                 </h3>
                 <p className="text-sm text-base-content/80">
                   Your ticket will be automatically analyzed and routed to the best available moderator based on their skills using Google Gemini.
                 </p>
               </div>
            </div>
          </div>

          {/* Right Column: Tickets List */}
          <div className="w-full lg:w-2/3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight">Your Tickets</h1>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={18} />
                <input 
                  type="text" 
                  placeholder="Search tickets..." 
                  className="input input-bordered w-full pl-10 bg-base-100 shadow-sm focus:ring-2 focus:ring-primary/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {filteredTickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  to={`/tickets/${ticket._id}`}
                  className="card bg-base-100 hover:bg-base-100/80 border border-base-300 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer"
                >
                  <div className="card-body p-5 flex flex-row items-center gap-4">
                     <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                       <Ticket size={24} />
                     </div>
                     <div className="flex-1 min-w-0">
                       <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{ticket.title}</h3>
                       <p className="text-sm text-base-content/60 truncate">{ticket.description}</p>
                     </div>
                     <div className="hidden sm:flex flex-col items-end text-sm text-base-content/50 shrink-0">
                       <div className="flex items-center gap-1 font-medium bg-base-200 px-2 py-1 rounded-md">
                         <Clock size={14} />
                         {new Date(ticket.createdAt).toLocaleDateString()}
                       </div>
                       <div className="mt-2 flex items-center gap-1 text-primary font-medium group-hover:translate-x-1 transition-transform">
                          View Details <ArrowRight size={14} />
                       </div>
                     </div>
                  </div>
                </Link>
              ))}
              
              {tickets.length > 0 && filteredTickets.length === 0 && (
                <div className="text-center py-12 bg-base-100 rounded-2xl border border-base-300 border-dashed">
                  <p className="text-base-content/50">No tickets found matching your search.</p>
                </div>
              )}

              {tickets.length === 0 && (
                <div className="text-center py-16 bg-base-100 rounded-2xl border border-base-300 shadow-sm">
                  <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4 text-base-content/30">
                    <Ticket size={32} />
                  </div>
                  <h3 className="font-bold text-xl mb-2">No tickets yet</h3>
                  <p className="text-base-content/50 mb-6 max-w-md mx-auto">You haven't submitted any support requests. Create your first ticket using the form.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
