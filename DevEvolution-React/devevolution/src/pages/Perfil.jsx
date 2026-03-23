import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/perfil.css"
function Perfil() {

  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [foto, setFoto] = useState(null)

  useEffect(() => {

    const usuarioSalvo = localStorage.getItem("usuario")
    const fotoSalva = localStorage.getItem("fotoPerfil")
  
    if (!usuarioSalvo) {
      navigate("/login")
      return
    }
  
    const dadosUsuario = JSON.parse(usuarioSalvo)
    setTimeout(() => {
      setUsuario(dadosUsuario)
    }, 0)
  
    if (fotoSalva) {
      setTimeout(() => {
        setFoto(fotoSalva)
      }, 0)
    }
  
  }, [navigate])

  const handleFoto = (e) => {
    const file = e.target.files[0]
  
    if (!file) return
  
    const reader = new FileReader()
  
    reader.onloadend = () => {
      setFoto(reader.result)
      localStorage.setItem("fotoPerfil", reader.result)
    }
  
    reader.readAsDataURL(file)
  }

  const logout = () => {
    localStorage.removeItem("auth")
    localStorage.removeItem("usuario")
    navigate("/login")
  }

  if (!usuario) {
    return <p>Carregando...</p>
  }

  return (

    <div className="perfil-container">

      <div className="perfil-header">

      <label className="perfil-avatar-box">

<img
  className="perfil-avatar"
  src={foto || "/images/avatar.png"}
  alt="avatar"
/>

<input
  type="file"
  accept="image/*"
  onChange={handleFoto}
  style={{ display: "none" }}
/>

</label>

        <div className="perfil-info">

          <h1>{usuario.nome}</h1>

          <h3>
            {usuario.email} • {usuario.idade} anos
          </h3>

          <button className="logout-btn" onClick={logout}>
            Sair da conta
          </button>

        </div>

      </div>

      <h2 className="stats-title">Estatísticas</h2>

      <div className="stats-grid">

        <div className="stat-card frequency">
          <i className="fa-solid fa-fire"></i>
          <h3>3</h3>
          <p>Ofensiva</p>
        </div>

        <div className="stat-card xp">
          <i className="fa-solid fa-bolt"></i>
          <h3>1200</h3>
          <p>XP Total</p>
        </div>

        <div className="stat-card diamond">
          <i className="fa-solid fa-gem"></i>
          <h3>450</h3>
          <p>Gemas</p>
        </div>

        <div className="stat-card ">
          <i className="fa-solid fa-shield"></i>
          <h3>Prata</h3>
          <p>Liga</p>
        </div>

      </div>

    </div>
  )
}

export default Perfil