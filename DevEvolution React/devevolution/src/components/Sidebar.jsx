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

            <li className="nav-items">
              <NavLink to="/dashboard">
                <i className="fa-regular fa-map"></i>
                <span>Trilha</span>
              </NavLink>
            </li>

            <li className="nav-items">
              <NavLink to="/perfil">
                <i className="fa-regular fa-user"></i>
                <span>Perfil</span>
              </NavLink>
            </li>

            <li className="nav-items">
              <NavLink to="/ligas">
                <i className="fa-regular fa-flag"></i>
                <span>Ligas</span>
              </NavLink>
            </li>

          </ul>
        </nav>

      </div>
    </div>
  )
}

export default Sidebar