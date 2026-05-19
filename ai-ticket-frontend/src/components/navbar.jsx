import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, TicketIcon, User } from "lucide-react";

export default function Navbar() {
  const token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  if (user) {
    user = JSON.parse(user);
  }
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100/70 backdrop-blur-md fixed top-0 left-0 w-full z-50 border-b border-base-300 shadow-sm px-4 lg:px-8">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl flex items-center gap-2 hover:bg-transparent px-2">
          <div className="bg-gradient-to-br from-primary to-secondary p-1.5 rounded-lg text-primary-content shadow-lg shadow-primary/30">
            <TicketIcon size={20} className="text-white" />
          </div>
          <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            SupportDesk AI
          </span>
        </Link>
      </div>
      <div className="flex gap-3">
        {!token ? (
          <>
            <Link to="/login" className="btn btn-ghost font-medium">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary bg-gradient-to-r from-primary to-secondary border-none shadow-lg shadow-primary/30 text-white font-medium hover:scale-105 transition-transform">
              Get Started
            </Link>
          </>
        ) : (
          <>
            <Link to="/tickets" className="btn btn-ghost btn-sm font-medium">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            {user && user?.role === "admin" && (
              <Link to="/admin" className="btn btn-ghost btn-sm font-medium">
                Admin
              </Link>
            )}
            <div className="dropdown dropdown-end ml-2">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-primary/50 transition-all border border-base-300 bg-base-200">
                <div className="w-9 rounded-full flex items-center justify-center">
                   <User size={20} className="mt-2 text-base-content/70" />
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
                <li className="px-4 py-3 border-b border-base-200 mb-2 flex flex-col items-start gap-1">
                  <span className="text-xs font-bold uppercase text-primary tracking-wider">Account</span>
                  <span className="opacity-80 text-sm truncate w-full">{user?.email}</span>
                </li>
                <li>
                  <button onClick={logout} className="text-error hover:bg-error/10 hover:text-error flex items-center gap-2 py-2">
                    <LogOut size={16}/> Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
