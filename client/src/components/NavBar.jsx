import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { logoutUser } from "../pages/Auth/utils/auth";

export default function NavBar() {
  const { user, setUser } = useContext(UserContext);

  const createNavLinks = (items) => {
    return (
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            IdentityGuard
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              {items.map(({ name, path, onClick }, index) => {
                return (
                  <NavLink
                    className="nav-item nav-link"
                    to={path}
                    key={index}
                    onClick={onClick}
                  >
                    {name}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    );
  };
  if (user && user.admin) {
    return createNavLinks([
      { name: "Dashboard", path: "admin/dashboard" },
      { name: "Logout", path: "/login", onClick: () => logoutUser(setUser) },
    ]);
  } else if (user && user.status == "Accepted") {
    return createNavLinks([
      { name: "Dashboard", path: "/dashboard" },
      { name: "Verifier", path: "/verifiers" },
      { name: "Logout", path: "/login", onClick: () => logoutUser(setUser) },
    ]);
  } else if (user && user.status == "Refused") {
    return createNavLinks([
      { name: "Dashboard", path: "/refusedDashboard" },
      { name: "Logout", path: "/login", onClick: () => logoutUser(setUser) },
    ]);
  } else {
    return createNavLinks([
      { name: "Login", path: "/login" },
      { name: "Register", path: "/register" },
      { name: "Verifier", path: "/verifiers" },
    ]);
  }
}
