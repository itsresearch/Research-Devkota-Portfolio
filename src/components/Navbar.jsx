import { NavLink } from "react-router-dom";

function Navbar() {
  const baseLinkStyle = "transition-all duration-200 text-base";
  const activeClass = "text-amber-300";
  const inactiveClass = "text-white/80";

  return (
<nav className="flex justify-center gap-8 px-4 mb-6 rounded-xl lg:border lg:border-white/20 lg:shadow-md lg:font-semibold bg-white/10 backdrop-blur-sm">
      {[
        { to: "/about", label: "About" },
        { to: "/skill", label: "Skills" },
        { to: "/project", label: "Projects" },
        // { to: "/achieve", label: "Achieve" }, // Uncomment if needed
        { to: "/contact", label: "Say Hi!" },
      ].map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `${baseLinkStyle} ${isActive ? activeClass : inactiveClass}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default Navbar;
