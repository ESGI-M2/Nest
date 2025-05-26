import { SidebarTrigger } from "./sidebar"

export default function NavBar() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <SidebarTrigger />
      <div className="flex-1">
      </div>
      <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li><a>Paramètres</a></li>
        <li><a>Déconnexion</a></li>
      </ul>
    </div>
    </div>
  );
}