import { NavLink } from "react-router-dom"

function Sidebar() {

  return (
    <div className="left-sidebar">
      <div className="container-sidebar">

        <div className="container-lg">
          <img
            id="logo-img"
            src="/images/DevEvolution-logo-simple.png"
            alt="logo"
          />
        </div>

        <nav>
          <ul className="nav-list">
           
            <NavLink to="/dashboard">
                {({ isActive }) => (
                <li className={isActive ? "nav-items active" : "nav-items"}>
                  <i className="fa-regular fa-map"></i>
                  <span>Trilha</span>
                </li>
              )}
            </NavLink>

            <NavLink to="/perfil">
                {({ isActive }) => (
                <li className={isActive ? "nav-items active" : "nav-items"}>
                  <i className="fa-regular fa-user"></i>
                  <span>Perfil</span>
                </li>
              )}
            </NavLink>
            
            <NavLink to="/ligas">
                {({ isActive }) => (
                <li className={isActive ? "nav-items active" : "nav-items"}>
                  <i className="fa-regular fa-flag"></i>
                  <span>Ligas</span>
                </li>
              )}
            </NavLink>

          </ul>
        </nav>

      </div>
    </div>
  )
}

export default Sidebar