import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import Trilha from "./Trilha"

function Dashboard() {
  return (
    <div className="layout">

      <Sidebar />

      <div className="content">
        <Topbar />
        <Trilha />
      </div>

    </div>
  )
}

export default Dashboard