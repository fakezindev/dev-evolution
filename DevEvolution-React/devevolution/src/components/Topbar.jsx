import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/topbar.css"

function Topbar() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    // 1. Criamos a função que busca os dados atualizados
    const carregarDados = () => {
      const token = localStorage.getItem("token")
      if (token) {
        fetch("http://localhost:8080/api/alunos/meu-perfil", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setUsuario(data))
        .catch(err => console.error(err))
      }
    }

    // 2. Chama a função logo que a tela carrega (comportamento normal)
    carregarDados()

    // 3. Fica com o "ouvido colado" esperando o grito das Lições
    window.addEventListener('atualizarPerfil', carregarDados)

    // 4. Limpeza de segurança quando o componente for desmontado
    return () => window.removeEventListener('atualizarPerfil', carregarDados)
  }, [])

  const logout = () => {
    localStorage.clear()
    navigate("/login")
  }

  // Calculadora de Ligas interna do Front (Sem buracos matemáticos)
  const obterLiga = (xp) => {
    if (xp < 150) return { nome: "Bronze", cor: "#cd7f32", icone: "fa-medal" }
    if (xp < 300) return { nome: "Prata", cor: "#c0c0c0", icone: "fa-shield" }
    if (xp < 501) return { nome: "Ouro", cor: "#ffd700", icone: "fa-trophy" }
    if (xp < 850) return { nome: "Platina", cor: "#b0e0e6", icone: "fa-trophy" } // Troquei levemente a cor para não ficar igual ao Prata
    if (xp < 1100) return { nome: "Diamante", cor: "#00d2ff", icone: "fa-gem" }
    if (xp < 1600) return { nome: "Champion", cor: "purple", icone: "fa-gem" }
    if (xp < 1750) return { nome: "GrandChampion", cor: "Red", icone: "fa-gem" }
    
    // O último não precisa de 'if'. Se ele passou por todos acima, ele é Mestre!
    return { nome: "Mestre", cor: "Black", icone: "fa-crown" }
  }

  const ligaInfo = usuario ? obterLiga(usuario.xpTotal) : { nome: "...", cor: "#fff", icone: "fa-star" }

  return (
    <div className="topbar-container">
      <div className="topbar-content">
        <div className="topbar-left">
          {/* Espaço para logo ou menu hamburger, se precisar futuramente */}
        </div>

        <div className="topbar-right">
          {usuario && (
            <>
              <div className="tb-badge admin">
                <i className="fa-solid fa-gear"></i> {usuario.username.toUpperCase()}
              </div>

              {/* Trocamos a classe 'fire' pela 'heart' e o ícone */}
              <div className="tb-badge heart">
                <i className="fa-solid fa-heart"></i> {usuario.vidasAtuais !== undefined ? usuario.vidasAtuais : 5}
              </div>

              <div className="tb-badge gem">
                <i className="fa-solid fa-gem"></i> 455
              </div>

              <div className="tb-badge level">
                <div className="level-col">
                  <span style={{ color: ligaInfo.cor, fontWeight: "bold" }}>
                    <i className={`fa-solid ${ligaInfo.icone}`}></i> Liga {ligaInfo.nome}
                  </span>
                  <span className="level-sub">
                    {usuario.xpTotal} XP Acumulado
                  </span>
                </div>
              </div>
            </>
          )}

          <button className="tb-btn-sair" onClick={logout}>
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}

export default Topbar