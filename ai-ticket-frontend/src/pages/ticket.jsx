import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, Sparkles, User, Tag, CheckCircle } from "lucide-react";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolution, setResolution] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/tickets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setTicket(data.ticket);
        } else {
          alert(data.message || "Failed to fetch ticket");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, token]);

  const handleResolve = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/tickets/${id}/resolve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ resolution }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setTicket(data.ticket);
        alert("Ticket resolved successfully!");
      } else {
        alert(data.message || "Failed to resolve ticket");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return 'badge-error';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-success';
      default: return 'badge-ghost';
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'open': return 'badge-primary';
      case 'todo': return 'badge-secondary';
      case 'in_progress': return 'badge-info';
      case 'resolved': return 'badge-success';
      default: return 'badge-ghost';
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
    
  if (!ticket) 
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <h2 className="text-2xl font-bold mb-4">Ticket not found</h2>
        <Link to="/tickets" className="btn btn-primary shadow-lg shadow-primary/30">Return to Dashboard</Link>
      </div>
    );

  const isAssigned = ticket.assignedTo && ticket.assignedTo._id === user._id;
  const isAdmin = user.role === "admin";
  const canResolve = (isAssigned || isAdmin) && ticket.status !== "RESOLVED";

  return (
    <div className="min-h-screen bg-base-200 pt-24 pb-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link to="/tickets" className="inline-flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors mb-6 font-medium">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        
        {/* Header Card */}
        <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-6 md:p-8 border-b border-base-300">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`badge badge-lg font-bold shadow-sm ${getStatusColor(ticket.status)}`}>
                {ticket.status?.toUpperCase() || 'OPEN'}
              </span>
              {ticket.priority && (
                <span className={`badge badge-lg font-bold shadow-sm badge-outline ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority?.toUpperCase()} PRIORITY
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-base-content mb-4 tracking-tight leading-tight">
              {ticket.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-base-content/70 font-medium">
               <div className="flex items-center gap-2 bg-base-100/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-base-200">
                 <Calendar size={16} />
                 {new Date(ticket.createdAt).toLocaleString(undefined, {
                   dateStyle: 'medium',
                   timeStyle: 'short'
                 })}
               </div>
               {ticket.assignedTo && (
                 <div className="flex items-center gap-2 bg-base-100/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-base-200">
                   <User size={16} />
                   Assigned to: <span className="text-base-content font-bold">{ticket.assignedTo?.email}</span>
                 </div>
               )}
            </div>
          </div>
          
          <div className="card-body p-6 md:p-8">
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-base-content/80">
                Description
              </h3>
              <p className="text-base-content text-lg leading-relaxed whitespace-pre-wrap bg-base-200/50 p-6 rounded-2xl border border-base-200 shadow-inner">
                {ticket.description}
              </p>
            </div>

            {/* Metadata Section */}
            {(ticket.relatedSkills?.length > 0 || ticket.helpfulNotes) && (
              <>
                <div className="divider text-base-content/40 font-medium text-sm">AI Analysis & Metadata</div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Related Skills */}
                  {ticket.relatedSkills?.length > 0 && (
                    <div className="md:col-span-1">
                      <h4 className="font-bold mb-3 flex items-center gap-2 text-base-content/80">
                        <Tag size={16} /> Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {ticket.relatedSkills.map(skill => (
                          <span key={skill} className="badge badge-secondary badge-outline badge-lg font-semibold shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* AI Notes */}
                  {ticket.helpfulNotes && (
                    <div className="md:col-span-2">
                      <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                        <div className="absolute -top-4 -right-4 text-indigo-500/10 pointer-events-none">
                           <Sparkles size={120} />
                        </div>
                        <h4 className="font-bold mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 relative z-10">
                          <Sparkles size={20} className="animate-pulse" /> AI Generated Notes
                        </h4>
                        <div className="prose prose-indigo max-w-none text-base-content/80 relative z-10 prose-p:leading-relaxed prose-headings:text-base-content">
                          <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Resolution Section */}
            {ticket.status === "RESOLVED" && ticket.resolution && (
              <div className="bg-success/5 border border-success/20 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-success">
                   <CheckCircle size={20} /> Resolution
                </h3>
                <p className="text-base-content text-lg leading-relaxed whitespace-pre-wrap">
                  {ticket.resolution}
                </p>
                {ticket.resolvedAt && (
                  <div className="text-sm text-base-content/60 mt-3 font-medium">
                    Resolved on: {new Date(ticket.resolvedAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Resolve Form */}
            {canResolve && (
              <div className="bg-base-200/50 p-6 rounded-2xl border border-base-200">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-base-content/80">
                   Submit Resolution
                </h3>
                <form onSubmit={handleResolve}>
                  <textarea
                    className="textarea textarea-bordered w-full h-32 mb-4 bg-base-100"
                    placeholder="Describe how the ticket was resolved..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Resolve Ticket"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
