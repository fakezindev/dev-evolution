import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/perfil.css"

function Perfil() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [foto, setFoto] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
  
    // Se não tem a chave do castelo, chuta pro login
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
        setUsuario(data) // Salva os dados do Spring Boot no estado do React

      } catch (error) {
        console.error("Erro ao carregar o perfil:", error)
        logout() // Se deu erro de segurança, limpa tudo e desloga
      } finally {
        setCarregando(false)
      }
    }

    carregarDadosDoBanco()
  
    // Mantém a sua lógica inteligente de salvar a foto localmente
    const fotoSalva = localStorage.getItem("fotoPerfil")
    if (fotoSalva) {
      setFoto(fotoSalva)
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
    // Atualizado para remover as chaves corretas do novo sistema
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
          {/* Nome oficial vindo do banco */}
          <h1>{usuario.username}</h1>

          <h3>
            {/* Trocamos a idade (que tiramos do cadastro) pelo Curso/Título do aluno */}
            {usuario.email} • {usuario.curso}
          </h3>
        
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
          {/* XP puxado direto do banco */}
          <h3>{usuario.xpTotal}</h3>
          <p>XP Total</p>
        </div>

        {/* Como ainda não temos Gemas e Ligas no Back, deixei estático para manter seu visual */}
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