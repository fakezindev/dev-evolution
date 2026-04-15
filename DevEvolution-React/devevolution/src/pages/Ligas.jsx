import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/perfil.css" 

function Ligas() {
  const navigate = useNavigate()
  const [ranking, setRanking] = useState([])
  const [carregando, setCarregando] = useState(true)
  
  // Novo estado para controlar o Modal de Explicação das Ligas
  const [modalAberto, setModalAberto] = useState(false)

  const FOTO_DEFAULT = "https://cdn-icons-png.flaticon.com/512/149/149071.png"

  // Calculadora Oficial de Ligas (Importada da sua lógica do Topbar!)
  const obterLiga = (xp) => {
    if (xp < 150) return { nome: "Bronze", cor: "#cd7f32", icone: "fa-medal", min: 0 }
    if (xp < 300) return { nome: "Prata", cor: "#c0c0c0", icone: "fa-shield", min: 150 }
    if (xp < 501) return { nome: "Ouro", cor: "#ffd700", icone: "fa-trophy", min: 300 }
    if (xp < 850) return { nome: "Platina", cor: "#b0e0e6", icone: "fa-trophy", min: 501 } 
    if (xp < 1100) return { nome: "Diamante", cor: "#00d2ff", icone: "fa-gem", min: 850 }
    if (xp < 1600) return { nome: "Champion", cor: "purple", icone: "fa-gem", min: 1100 }
    if (xp < 1750) return { nome: "GrandChampion", cor: "red", icone: "fa-gem", min: 1600 }
    
    return { nome: "Mestre", cor: "black", icone: "fa-crown", min: 1750 }
  }

  // Array estruturado para renderizar o painel de explicação automaticamente
  const niveisLigas = [
    obterLiga(0), obterLiga(150), obterLiga(300), obterLiga(501),
    obterLiga(850), obterLiga(1100), obterLiga(1600), obterLiga(1750)
  ]

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

  if (carregando) return <p style={{ textAlign: "center", padding: "50px" }}>Carregando Leaderboard...</p>

  return (
    <div className="perfil-container" style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
      
      {/* CABEÇALHO */}
      <div style={{ textAlign: "center", marginBottom: "30px", position: "relative" }}>
        <h1>🏆 Hall da Fama</h1>
        <p className="subtitle">Suba de nível, acumule XP e alcance o rank Mestre!</p>
        
        {/* BOTÃO DE EXPLICAÇÃO */}
        <button 
          onClick={() => setModalAberto(true)}
          style={{
            background: "#3e3e4e", color: "#fff", border: "none",
            padding: "8px 15px", borderRadius: "8px", cursor: "pointer",
            marginTop: "10px", fontWeight: "bold", transition: "0.2s"
          }}
        >
          <i className="fa-solid fa-circle-info"></i> Como funcionam as Ligas?
        </button>
      </div>

      {/* MODAL / PAINEL EXPLICATIVO DAS LIGAS */}
      {modalAberto && (
        <div style={{
          background: "rgba(0,0,0,0.8)", position: "fixed", top: 0, left: 0,
          width: "100%", height: "100%", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 999
        }}>
          <div style={{
            background: "#2a2a35", padding: "30px", borderRadius: "15px",
            maxWidth: "500px", width: "90%", border: "2px solid #3e3e4e"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0 }}>Tabela de Promoção</h2>
              <button onClick={() => setModalAberto(false)} style={{ background: "transparent", color: "#fff", border: "none", fontSize: "20px", cursor: "pointer" }}>✖</button>
            </div>
            
            <p style={{ color: "#8a8a9e", marginBottom: "20px" }}>Complete lições para ganhar XP. Ao atingir a pontuação necessária, você é promovido automaticamente!</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {niveisLigas.map((liga, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#1f1f28", borderRadius: "8px", alignItems: "center" }}>
                  <div style={{ color: liga.cor, fontWeight: "bold", fontSize: "18px" }}>
                    <i className={`fa-solid ${liga.icone}`} style={{ width: "30px", textAlign: "center" }}></i> {liga.nome}
                  </div>
                  <div style={{ color: "#1da950", fontWeight: "bold" }}>
                    {liga.min} XP {index === niveisLigas.length - 1 ? "+" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TABELA DE RANKING */}
      <div style={{ background: "#2a2a35", borderRadius: "15px", padding: "20px" }}>
        
        <div style={{ display: "flex", fontWeight: "bold", padding: "10px", borderBottom: "2px solid #3e3e4e", color: "#8a8a9e" }}>
          <div style={{ width: "10%" }}>#</div>
          <div style={{ width: "50%" }}>Aluno</div>
          <div style={{ width: "20%", textAlign: "center" }}>Liga</div>
          <div style={{ width: "20%", textAlign: "right" }}>XP</div>
        </div>

        {ranking.map((aluno, index) => {
          const posicao = index + 1
          
          // 🛡️ MÁGICA AQUI: O Leaderboard agora usa o mesmo cálculo do Topbar!
          const estiloLiga = obterLiga(aluno.xpTotal)
          
          let corPosicao = "#fff"
          if (posicao === 1) corPosicao = "#ffd700" 
          if (posicao === 2) corPosicao = "#c0c0c0" 
          if (posicao === 3) corPosicao = "#cd7f32" 

          return (
            <div key={aluno.id} style={{ 
              display: "flex", alignItems: "center", padding: "15px 10px", 
              borderBottom: "1px solid #3e3e4e", transition: "0.2s",
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
                  style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${estiloLiga.cor}` }}
                />
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>{aluno.username}</span>
              </div>

              {/* LIGA DINÂMICA */}
              <div style={{ width: "20%", textAlign: "center", color: estiloLiga.cor, fontWeight: "bold" }}>
                <i className={`fa-solid ${estiloLiga.icone}`} style={{ marginRight: "8px" }}></i>
                {estiloLiga.nome}
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