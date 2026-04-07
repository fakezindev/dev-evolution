import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/perfil.css"

function Perfil() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [foto, setFoto] = useState(null)
  const [carregando, setCarregando] = useState(true)

  // 🖼️ URL padrão para "Sem foto" (Avatar genérico e elegante)
  const FOTO_DEFAULT = "https://cdn-icons-png.flaticon.com/512/149/149071.png"

  useEffect(() => {
    const token = localStorage.getItem("token")
  
    if (!token) {
      navigate("/login")
      return
    }

    const carregarDadosDoBanco = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/alunos/meu-perfil", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error("Token inválido ou expirado")
        }

        const data = await response.json()
        setUsuario(data) 
        
        // 🧠 Lógica inteligente: Puxa a foto do Banco primeiro. Se não tiver, tenta o LocalStorage.
        if (data.fotoPerfil) {
          setFoto(data.fotoPerfil)
        } else {
          const fotoSalva = localStorage.getItem("fotoPerfil")
          if (fotoSalva) setFoto(fotoSalva)
        }

      } catch (error) {
        console.error("Erro ao carregar o perfil:", error)
        logout() 
      } finally {
        setCarregando(false)
      }
    }

    carregarDadosDoBanco()
  }, [navigate])

  const handleFoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return
  
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result
      
      // 1. Atualiza visualmente na hora para o usuário
      setFoto(base64String)
      localStorage.setItem("fotoPerfil", base64String) // Backup local

      // 2. Envia a String gigante para o Java guardar no Banco de Dados!
      try {
        await fetch("http://localhost:8080/api/alunos/atualizar-foto", {
          method: "PUT", // ou PATCH, dependendo de como você criar a rota
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          // Mandamos um JSON com o campo que o seu DTO/Entidade espera
          body: JSON.stringify({ fotoPerfil: base64String }) 
        })
      } catch (error) {
        console.error("Erro ao salvar foto no backend:", error)
      }
    }
    reader.readAsDataURL(file)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("auth")
    navigate("/login")
  }

  if (carregando) {
    return <p style={{ textAlign: "center", padding: "50px" }}>Carregando perfil...</p>
  }

  if (!usuario) {
    return <p style={{ textAlign: "center", padding: "50px" }}>Erro ao carregar usuário.</p>
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        
        <label className="perfil-avatar-box">
          <img
            className="perfil-avatar"
            // Se tiver 'foto' usa ela, senão exibe o bonequinho cinza padrão
            src={foto || FOTO_DEFAULT}
            alt="avatar do usuario"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFoto}
            style={{ display: "none" }}
          />
        </label>

        <div className="perfil-info">
          <h1>{usuario.username}</h1>

          <h3>
            {usuario.email} • {usuario.curso || "Software Engineering"}
          </h3>
        
          <button className="reset" onClick={() => {
             localStorage.clear()
             window.location.reload()
          }}>
            Resetar Trilha
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
          <h3>{usuario.xpTotal}</h3>
          <p>XP Total</p>
        </div>

        <div className="stat-card diamond">
          <i className="fa-solid fa-gem"></i>
          <h3>450</h3>
          <p>Gemas</p>
        </div>

        <div className="stat-card">
          <i className="fa-solid fa-shield"></i>
          <h3>Prata</h3>
          <p>Liga</p>
        </div>
      </div>
    </div>
  )
}

export default Perfil