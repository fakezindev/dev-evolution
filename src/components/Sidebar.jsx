import { NavLink } from "react-router-dom"
import { Map, User, Trophy, Sparkles, Code2 } from "lucide-react"

function Sidebar() {
  return (
    <aside className="left-sidebar">
      <div className="container-sidebar">

        {/* Brand Header */}
        <div className="sidebar-logo-box">
          <div className="logo-img-wrapper">
            <img
              id="logo-img"
              src="/images/DevEvolution-logo-simple.png"
              alt="DevEvolution Logo"
            />
          </div>
          <div className="brand-info">
            <span className="brand-title">DevEvolution</span>
            <span className="brand-badge"><Sparkles size={10} /> PLATAFORMA</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
           
            <NavLink to="/dashboard" className="nav-link-item">
              {({ isActive }) => (
                <li className={isActive ? "nav-items active" : "nav-items"}>
                  <Map size={20} className="nav-icon" />
                  <span>Trilha</span>
                  {isActive && <span className="active-indicator" />}
                </li>
              )}
            </NavLink>

            <NavLink to="/perfil" className="nav-link-item">
              {({ isActive }) => (
                <li className={isActive ? "nav-items active" : "nav-items"}>
                  <User size={20} className="nav-icon" />
                  <span>Perfil</span>
                  {isActive && <span className="active-indicator" />}
                </li>
              )}
            </NavLink>
            
            <NavLink to="/ligas" className="nav-link-item">
              {({ isActive }) => (
                <li className={isActive ? "nav-items active" : "nav-items"}>
                  <Trophy size={20} className="nav-icon" />
                  <span>Ligas</span>
                  {isActive && <span className="active-indicator" />}
                </li>
              )}
            </NavLink>

          </ul>
        </nav>

        {/* Footer Card Widget */}
        <div className="sidebar-footer-widget">
          <div className="widget-icon">
            <Code2 size={20} />
          </div>
          <div className="widget-text">
            <strong>Evolução Diária</strong>
            <p>Conclua lições para subir nas Ligas e ganhar XP!</p>
          </div>
        </div>

      </div>
    </aside>
  )
}

export default Sidebar