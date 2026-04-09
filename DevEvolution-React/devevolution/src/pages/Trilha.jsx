import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/trilha.css"

function Trilha() {
  const navigate = useNavigate()
  const [xpTotal, setXpTotal] = useState(0)

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

  // Nossas lições (Mundo 1)
  const licoes = [
    { id: 1, titulo: "Hello World", custoXp: 0 },
    { id: 2, titulo: "Mundo das Variáveis", custoXp: 50 },
    { id: 3, titulo: "A Primeira Calculadora", custoXp: 100 },
    { id: 4, titulo: "Calculo de Descontos", custoXp: 150 },
    { id: 5, titulo: "Media Simples", custoXp: 200 }  
  ]

  const abrirLicao = (id) => {
    navigate(`/licao/${id}`)
  }

  return (
    <div className="trilha-container">
      <div className="trilha-header">
        <h1>Mundo 1</h1>
        <p>Fundamentos da Programação</p>
      </div>

      <div className="trilha-mapa">
        <div className="trilha-linha"></div> {/* A linha do meio */}

        {licoes.map((licao, index) => {
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