import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/perfil.css" // Vamos aproveitar o CSS que já temos para os cards

function Ligas() {
  const navigate = useNavigate()
  const [ranking, setRanking] = useState([])
  const [carregando, setCarregando] = useState(true)

  const FOTO_DEFAULT = "https://cdn-icons-png.flaticon.com/512/149/149071.png"

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    const buscarRanking = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/alunos/ranking", {
          headers: { "Authorization": `Bearer ${token}` }
        })

        if (!response.ok) throw new Error("Erro ao buscar ranking")

        const data = await response.json()
        setRanking(data)
      } catch (error) {
        console.error(error)
      } finally {
        setCarregando(false)
      }
    }

    buscarRanking()
  }, [navigate])

  // Função simples para escolher o ícone e a cor da liga
  const obterEstiloLiga = (liga) => {
    switch (liga) {
      case "Diamante": return { icone: "fa-gem", cor: "#00d2ff" }
      case "Ouro": return { icone: "fa-trophy", cor: "#ffd700" }
      case "Prata": return { icone: "fa-shield", cor: "#c0c0c0" }
      default: return { icone: "fa-medal", cor: "#cd7f32" } // Bronze
    }
  }

  if (carregando) return <p style={{ textAlign: "center", padding: "50px" }}>Carregando Leaderboard...</p>

  return (
    <div className="perfil-container" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1>🏆 Hall da Fama</h1>
        <p className="subtitle">Suba de nível, acumule XP e alcance a liga Diamante!</p>
      </div>

      <div style={{ background: "#2a2a35", borderRadius: "15px", padding: "20px" }}>
        
        {/* Cabeçalho da Tabela */}
        <div style={{ display: "flex", fontWeight: "bold", padding: "10px", borderBottom: "2px solid #3e3e4e", color: "#8a8a9e" }}>
          <div style={{ width: "10%" }}>#</div>
          <div style={{ width: "50%" }}>Aluno</div>
          <div style={{ width: "20%", textAlign: "center" }}>Liga</div>
          <div style={{ width: "20%", textAlign: "right" }}>XP</div>
        </div>

        {/* Lista de Alunos (Mapeada do Backend) */}
        {ranking.map((aluno, index) => {
          const posicao = index + 1
          const estiloLiga = obterEstiloLiga(aluno.liga)
          
          // Destaque para o Top 3
          let corPosicao = "#fff"
          if (posicao === 1) corPosicao = "#ffd700" // Ouro
          if (posicao === 2) corPosicao = "#c0c0c0" // Prata
          if (posicao === 3) corPosicao = "#cd7f32" // Bronze

          return (
            <div key={aluno.id} style={{ 
              display: "flex", 
              alignItems: "center", 
              padding: "15px 10px", 
              borderBottom: "1px solid #3e3e4e",
              transition: "0.2s",
            }}>
              
              {/* POSIÇÃO */}
              <div style={{ width: "10%", fontSize: "20px", fontWeight: "bold", color: corPosicao }}>
                {posicao}º
              </div>

              {/* FOTO E NOME */}
              <div style={{ width: "50%", display: "flex", alignItems: "center", gap: "15px" }}>
                <img 
                  src={aluno.fotoPerfil || FOTO_DEFAULT} 
                  alt="avatar" 
                  style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                />
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>{aluno.username}</span>
              </div>

              {/* LIGA */}
              <div style={{ width: "20%", textAlign: "center", color: estiloLiga.cor, fontWeight: "bold" }}>
                <i className={`fa-solid ${estiloLiga.icone}`} style={{ marginRight: "8px" }}></i>
                {aluno.liga}
              </div>

              {/* XP */}
              <div style={{ width: "20%", textAlign: "right", fontWeight: "bold", color: "#1da950" }}>
                {aluno.xpTotal} XP
              </div>

            </div>
          )
        })}

      </div>
    </div>
  )
}

export default Ligas