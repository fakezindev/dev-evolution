import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"
import { API_BASE_URL } from "../api/config"
import "../styles/trilha.css"

function Trilha() {
  const navigate = useNavigate()
  const [xpTotal, setXpTotal] = useState(0)
  const [mundoAtivo, setMundoAtivo] = useState(1)

  const devMode = localStorage.getItem("devMode") === "true";

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetch(`${API_BASE_URL}/api/alunos/meu-perfil`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setXpTotal(data.xpTotal || 0))
    }
  }, [])

  const mundos = [
    { id: 1, nome: "Mundo 1", desc: "Fundamentos da Programação", licoesCount: 5 },
    { id: 2, nome: "Mundo 2", desc: "Estruturas de Decisão (If/Else)", licoesCount: 2 },
    { id: 3, nome: "Mundo 3", desc: "Laços de Repetição (While/For)", licoesCount: 2 }
  ];

  // Nossas lições (Mundo 1)
  const licoesMundo1 = [
    { id: 1, titulo: "Hello World", custoXp: 0, desc: "Sua primeira linha de código" },
    { id: 2, titulo: "Mundo das Variáveis", custoXp: 50, desc: "Armazenando informações" },
    { id: 3, titulo: "A Primeira Calculadora", custoXp: 150, desc: "Operações matemáticas simples" },
    { id: 4, titulo: "Cálculo de Descontos", custoXp: 300, desc: "Aplicação de porcentagem" },
    { id: 5, titulo: "Média Simples (Chefão)", custoXp: 500, isBoss: true, desc: "Desafio Final do Mundo 1" }  
  ]

  const licoesMundo2 = [
    { id: 6, titulo: "Avaliador de Notas (If/Else)", custoXp: 600, desc: "Tomada de decisões em código" },
    { id: 7, titulo: "Radar de Velocidade", custoXp: 750, desc: "Condicionais e alertas" }
  ]

  const licoesMundo3 = [
    { id: 8, titulo: "Contagem Regressiva (While)", custoXp: 900, desc: "Repetição controlada" },
    { id: 9, titulo: "Tabuada Dinâmica (For)", custoXp: 1100, isBoss: true, desc: "Laços de repetição avançados" }
  ]

  const licoesAtuais = mundoAtivo === 1 ? licoesMundo1 : mundoAtivo === 2 ? licoesMundo2 : licoesMundo3;

  const abrirLicao = (id) => {
    navigate(`/licao/${id}`)
  }

  const mundoAtualObj = mundos.find(m => m.id === mundoAtivo);

  return (
    <div className="trilha-container">
      {/* Ambient Glow */}
      <div className="trilha-bg-glow"></div>

      {/* Hero Header Banner */}
      <div className="trilha-hero-banner">
        <div className="trilha-badge">
          <Sparkles size={14} /> DevEvolution • Trilha de Aprendizado
        </div>
        <h1 className="trilha-hero-title">Mapa de Missões</h1>
        <p className="trilha-hero-desc">
          {mundoAtualObj?.desc} — Escolha uma fase abaixo para avançar sua jornada de dev.
        </p>
      </div>

      {/* World Selector Tabs */}
      <div className="trilha-mundos-tabs">
        {mundos.map(m => (
          <button 
            key={m.id} 
            onClick={() => setMundoAtivo(m.id)}
            className={`mundo-tab-btn ${mundoAtivo === m.id ? 'active' : ''}`}
          >
            <span>{m.nome}</span>
            <span className="mundo-tab-sub">{m.licoesCount} Missões</span>
          </button>
        ))}
      </div>

      {/* Exercise Map Track */}
      <div className="trilha-mapa">
        <div className="trilha-linha"></div>

        {licoesAtuais.map((licao, index) => {
          const isLiberada = devMode || xpTotal >= licao.custoXp;
          const isConcluida = !devMode && xpTotal >= (licao.custoXp + 50);
          
          let statusState = "locked";
          if (licao.isBoss && (isLiberada || isConcluida)) {
            statusState = isConcluida ? "completed" : "boss";
          } else if (isConcluida) {
            statusState = "completed";
          } else if (isLiberada) {
            statusState = "current";
          }

          const alignmentClass = index % 2 === 0 ? "left-node" : "right-node";

          const renderNodeIcon = () => {
            if (licao.isBoss && !isConcluida) return <i className="fa-solid fa-crown"></i>;
            if (isConcluida) return <i className="fa-solid fa-check"></i>;
            if (isLiberada) return <i className="fa-solid fa-play" style={{ fontSize: '20px', marginLeft: '3px' }}></i>;
            return <i className="fa-solid fa-lock"></i>;
          };

          return (
            <div key={licao.id} className={`trilha-node-wrapper ${alignmentClass}`}>
              
              {/* Circle Node */}
              <div 
                className={`trilha-node-circle ${statusState}`}
                onClick={() => (isLiberada || devMode) && abrirLicao(licao.id)}
              >
                {renderNodeIcon()}
              </div>

              {/* Glass Info Card */}
              <div 
                className="trilha-card-info"
                onClick={() => (isLiberada || devMode) && abrirLicao(licao.id)}
              >
                <div className="trilha-card-header">
                  <span className={`trilha-card-fase ${licao.isBoss ? 'boss-tag' : ''}`}>
                    {licao.isBoss ? '👑 CHEFÃO' : `FASE 0${index + 1}`}
                  </span>
                  <span className="trilha-card-xp">{licao.custoXp} XP</span>
                </div>
                
                <h3 className="trilha-card-title">{licao.titulo}</h3>
                
                <div className={`trilha-card-btn ${isConcluida ? 'completed-text' : !isLiberada ? 'locked-text' : ''}`}>
                  {isConcluida ? (
                    <>Concluída ✓ (Refazer)</>
                  ) : isLiberada ? (
                    <>Iniciar Missão →</>
                  ) : (
                    <>Bloqueado ({licao.custoXp} XP)</>
                  )}
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Trilha