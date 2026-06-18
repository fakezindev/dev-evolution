import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/trilha.css"

function Trilha() {
  const navigate = useNavigate()
  const [xpTotal, setXpTotal] = useState(0)
  const [mundoAtivo, setMundoAtivo] = useState(1)

  const devMode = localStorage.getItem("devMode") === "true";

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetch("http://localhost:8080/api/alunos/meu-perfil", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setXpTotal(data.xpTotal || 0))
    }
  }, [])

  const mundos = [
    { id: 1, nome: "Mundo 1", desc: "Fundamentos da Programação" },
    { id: 2, nome: "Mundo 2", desc: "Estruturas de Decisão (if/else)" },
    { id: 3, nome: "Mundo 3", desc: "Laços de Repetição (while/for)" }
  ];

  // Nossas lições (Mundo 1)
  const licoesMundo1 = [
    { id: 1, titulo: "Hello World", custoXp: 0 },
    { id: 2, titulo: "Mundo das Variáveis", custoXp: 50 },
    { id: 3, titulo: "A Primeira Calculadora", custoXp: 150 },
    { id: 4, titulo: "Calculo de Descontos", custoXp: 300 },
    { id: 5, titulo: "Media Simples", custoXp: 500 }  
  ]

  const licoesMundo2 = [
    { id: 6, titulo: "Avaliador de Notas (If/Else)", custoXp: 600 },
    { id: 7, titulo: "Radar de Velocidade", custoXp: 750 }
  ]

  const licoesMundo3 = [
    { id: 8, titulo: "Contagem Regressiva (While)", custoXp: 900 },
    { id: 9, titulo: "Tabuada Dinâmica (For)", custoXp: 1100 }
  ]

  const licoesAtuais = mundoAtivo === 1 ? licoesMundo1 : mundoAtivo === 2 ? licoesMundo2 : licoesMundo3;

  const abrirLicao = (id) => {
    navigate(`/licao/${id}`)
  }

  return (
    <div className="trilha-container">
      <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px'}}>
         {mundos.map(m => (
            <button 
              key={m.id} 
              onClick={() => setMundoAtivo(m.id)}
              style={{
                background: mundoAtivo === m.id ? '#1da950' : '#2a2a35',
                color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 'bold', transition: '0.3s'
              }}
            >
              {m.nome}
            </button>
         ))}
      </div>

      <div className="trilha-header">
        <h1>{mundos.find(m => m.id === mundoAtivo)?.nome}</h1>
        <p>{mundos.find(m => m.id === mundoAtivo)?.desc}</p>
      </div>

      <div className="trilha-mapa">
        <div className="trilha-linha"></div> {/* A linha do meio */}

        {licoesAtuais.map((licao, index) => {
          const isLiberada = devMode || xpTotal >= licao.custoXp;
          const isConcluida = !devMode && xpTotal >= (licao.custoXp + 50);
          
          // Lógica visual: Se passou da fase é Check. Se é a fase atual, é Estrela. Se não chegou, Cadeado.
          let iconClass = "fa-lock";
          let statusClass = "locked";
          
          if (isConcluida) {
            iconClass = "fa-check";
            statusClass = "completed";
          } else if (isLiberada) {
            iconClass = "fa-star";
            statusClass = "current";
          }

          // Intercala os itens um pouco pra esquerda e um pouco pra direita
          const alignmentClass = index % 2 === 0 ? "left-node" : "right-node";

          return (
            <div key={licao.id} className={`trilha-node-wrapper ${alignmentClass}`}>
              <div 
                className={`trilha-node ${statusClass}`}
                onClick={() => (isLiberada || devMode) && abrirLicao(licao.id)}
              >
                <i className={`fa-solid ${iconClass}`}></i>
              </div>
              <div className="trilha-label">{licao.titulo}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Trilha