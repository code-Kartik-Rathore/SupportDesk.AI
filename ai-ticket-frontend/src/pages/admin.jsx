import { useEffect, useState } from "react";
import { ShieldAlert, Users, Wrench, Search, Edit2, Save, X, Tag, Trash2 } from "lucide-react";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.email);
    setFormData({
      role: user.role,
      skills: user.skills?.join(", ") || "",
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/update-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: editingUser,
            role: formData.role,
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          }),
        }
      );

      if (res.ok) {
        setEditingUser(null);
        setFormData({ role: "", skills: "" });
        fetchUsers();
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDeleteClick = async (userToDelete) => {
    if (window.confirm(`Are you sure you want to delete user ${userToDelete.email}?`)) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/users/${userToDelete._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          alert("User deleted successfully!");
          fetchUsers();
        } else {
          const data = await res.json();
          alert(data.error || "Failed to delete user");
        }
      } catch (err) {
        console.error("Delete failed", err);
        alert("Something went wrong");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || user.role === activeTab;
    return matchesSearch && matchesTab;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin": return <ShieldAlert size={18} className="text-error" />;
      case "moderator": return <Wrench size={18} className="text-warning" />;
      default: return <Users size={18} className="text-info" />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Admin Control Panel</h1>
            <p className="text-base-content/70">Manage users, assign moderator roles, and configure routing skills.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={18} />
            <input
              type="text"
              placeholder="Search by email..."
              className="input input-bordered w-full pl-10 shadow-sm focus:ring-2 focus:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto pb-2">
          <div className="tabs tabs-boxed bg-base-100 p-1 mb-6 shadow-sm inline-flex whitespace-nowrap">
            <button className={`tab tab-lg ${activeTab === 'all' ? 'tab-active font-bold' : ''}`} onClick={() => setActiveTab('all')}>All Users</button>
            <button className={`tab tab-lg ${activeTab === 'moderator' ? 'tab-active font-bold' : ''}`} onClick={() => setActiveTab('moderator')}>Moderators</button>
            <button className={`tab tab-lg ${activeTab === 'admin' ? 'tab-active font-bold' : ''}`} onClick={() => setActiveTab('admin')}>Admins</button>
            <button className={`tab tab-lg ${activeTab === 'user' ? 'tab-active font-bold' : ''}`} onClick={() => setActiveTab('user')}>Standard Users</button>
          </div>
        </div>

        {/* User Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user._id} className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden hover:shadow-2xl transition-all">
                <div className="bg-gradient-to-r from-base-200 to-base-100 p-4 border-b border-base-300 flex justify-between items-center">
                   <div className="flex items-center gap-2 font-bold">
                     {getRoleIcon(user.role)}
                     <span className="capitalize">{user.role}</span>
                   </div>
                   {!editingUser && (
                     <div className="flex items-center gap-1">
                       <button onClick={() => handleEditClick(user)} className="btn btn-ghost btn-xs btn-circle text-base-content/50 hover:text-primary">
                         <Edit2 size={16} />
                       </button>
                       <button onClick={() => handleDeleteClick(user)} className="btn btn-ghost btn-xs btn-circle text-base-content/50 hover:text-error">
                         <Trash2 size={16} />
                       </button>
                     </div>
                   )}
                </div>
                
                <div className="card-body p-5">
                  <h3 className="font-bold text-lg truncate" title={user.email}>{user.email}</h3>
                  
                  {editingUser === user.email ? (
                    <div className="mt-4 space-y-4 bg-base-200 p-4 rounded-xl border border-base-300">
                      <div className="form-control">
                        <label className="label py-1"><span className="label-text font-medium text-xs">Role</span></label>
                        <select
                          className="select select-sm select-bordered w-full"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>

                      <div className="form-control">
                        <label className="label py-1"><span className="label-text font-medium text-xs">Skills (comma separated)</span></label>
                        <input
                          type="text"
                          className="input input-sm input-bordered w-full"
                          placeholder="e.g. billing, technical, sales"
                          value={formData.skills}
                          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button className="btn btn-primary btn-sm flex-1 shadow-sm" onClick={handleUpdate}>
                          <Save size={14} /> Save
                        </button>
                        <button className="btn btn-ghost btn-sm flex-1" onClick={() => setEditingUser(null)}>
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-2 text-sm text-base-content/70">
                        <Tag size={14} /> Skills
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {user.skills && user.skills.length > 0 ? (
                          user.skills.map(skill => (
                            <span key={skill} className="badge badge-sm badge-secondary badge-outline">{skill}</span>
                          ))
                        ) : (
                          <span className="text-xs opacity-50 italic">No skills assigned</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
               <div className="col-span-full py-20 text-center border-2 border-dashed border-base-300 rounded-2xl">
                 <p className="text-base-content/50 font-medium">No users found matching your criteria.</p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
