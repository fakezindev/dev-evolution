import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao1.css"

function Licao1() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [itens, setItens] = useState([
    { id: 1, valor: "false", tipo: "boolean" },
    { id: 2, valor: '"Maçã"', tipo: "string" },
    { id: 3, valor: "42", tipo: "number" },
    { id: 4, valor: "true", tipo: "boolean" },
    { id: 5, valor: "100", tipo: "number" },
  ])

  const [gavetas, setGavetas] = useState({
    string: [],
    number: [],
    boolean: []
  })

  const [erro, setErro] = useState(false)
  const [dragItem, setDragItem] = useState(null)

  // 🚫 BLOQUEIO DE ACESSO
  useEffect(() => {
    const progresso = JSON.parse(localStorage.getItem("progressoTrilha"))

    if (!progresso) return

    const nivel = progresso[Number(id) - 1]

    if (!nivel || nivel.status === "bloqueado") {
      navigate("/dashboard")
    }
  }, [id, navigate])

  // 🎯 DRAG START
  const handleDragStart = (item) => {
    setDragItem(item)
  }

  // 🎯 DROP
  const handleDrop = (tipo) => {
    if (!dragItem) return

    if (dragItem.tipo === tipo) {

      setGavetas(prev => ({
        ...prev,
        [tipo]: [...prev[tipo], dragItem]
      }))

      setItens(prev => prev.filter(i => i.id !== dragItem.id))

    } else {
      // ❌ ERRO VISUAL
      setErro(true)
      setTimeout(() => setErro(false), 400)
    }

    setDragItem(null)
  }

  // ✅ FINALIZAR
  const finalizarLicao = () => {

    const progresso = JSON.parse(localStorage.getItem("progressoTrilha"))

    if (!progresso) return

    progresso[0].status = "feito"

    if (progresso[1]) {
      progresso[1].status = "ativo"
    }

    localStorage.setItem("progressoTrilha", JSON.stringify(progresso))

    navigate("/dashboard")
  }

  return (
    <div className="licao-container">

      <h1>Organize a Bagunça!</h1>
      <p className="subtitle">
        Arraste os dados espalhados para as gavetas corretas antes de começarmos a programar.
      </p>

      <div className="licao-grid">

        {/* ESQUERDA */}
        <div className="dados-box">

          <h3>DADOS SOLTOS</h3>

          <div className="dados-area">
            {itens.map(item => (
              <div
                key={item.id}
                className="item"
                draggable
                onDragStart={() => handleDragStart(item)}
              >
                {item.valor}
              </div>
            ))}
          </div>

        </div>

        {/* DIREITA */}
        <div className="gavetas-box">

          <h3>GAVETAS (VARIÁVEIS)</h3>

          {/* STRING */}
          <div
            className={`gaveta string ${erro ? "erro" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop("string")}
          >
            <span className="label">Texto (String)</span>

            {gavetas.string.map(i => (
              <div key={i.id} className="item small">{i.valor}</div>
            ))}
          </div>

          {/* NUMBER */}
          <div
            className={`gaveta number ${erro ? "erro" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop("number")}
          >
            <span className="label">Número (Number)</span>

            {gavetas.number.map(i => (
              <div key={i.id} className="item small">{i.valor}</div>
            ))}
          </div>

          {/* BOOLEAN */}
          <div
            className={`gaveta boolean ${erro ? "erro" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop("boolean")}
          >
            <span className="label">Verdadeiro/Falso (Boolean)</span>

            {gavetas.boolean.map(i => (
              <div key={i.id} className="item small">{i.valor}</div>
            ))}
          </div>

        </div>

      </div>

      {/* BOTÃO FINAL */}
      {itens.length === 0 && (
        <button className="btn-finalizar" onClick={finalizarLicao}>
          Finalizar
        </button>
      )}

    </div>
  )
}

export default Licao1