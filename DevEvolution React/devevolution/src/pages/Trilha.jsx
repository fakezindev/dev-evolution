import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/trilha.css"

function Trilha() {

  const navigate = useNavigate()

  const niveisIniciais = [
    { id: 1, nome: "Mundo das Variáveis", status: "ativo" },
    { id: 2, nome: "Missão do Robô", status: "bloqueado" },
    { id: 3, nome: "Loops", status: "bloqueado" },
  ]

  const [niveis, setNiveis] = useState([])

 useEffect(() => {

  const salvo = localStorage.getItem("progressoTrilha")

  if (salvo) {
    setNiveis(JSON.parse(salvo))
  } else {
    const iniciais = [
      { id: 1, nome: "Mundo das Variáveis", status: "ativo" },
      { id: 2, nome: "Missão do Robô", status: "bloqueado" },
      { id: 3, nome: "Loops", status: "bloqueado" },
    ]

    setNiveis(iniciais)
    localStorage.setItem("progressoTrilha", JSON.stringify(iniciais))
  }

}, [])

 useEffect(() => {

  const progresso = JSON.parse(localStorage.getItem("progressoTrilha"))

  if (!progresso) return

  // só bloqueia se realmente for bloqueado
  if (progresso[0].status === "bloqueado") {
    navigate("/dashboard")
  }

}, [navigate])

  const handleClick = (nivel) => {

  if (nivel.status === "bloqueado") return

  navigate(`/licao/${nivel.id}`)
}

if (!niveis || niveis.length === 0) {
  return <p>Carregando trilha...</p>
}

  return (
    <div className="trilha-container">

      <h1>Mundo 1</h1>
      <p className="subtitle">Fundamentos da Programação</p>

      <div className="trilha-vertical">

        <div className="linha"></div>

        {niveis.map((nivel, index) => (
          <div
            key={nivel.id}
            className={`nivel ${nivel.status} ${index % 2 === 0 ? "left" : "right"}`}
            onClick={() => handleClick(nivel)}
          >

            <div className="circulo">
              {nivel.status === "feito" && "✅"}
              {nivel.status === "ativo" && "⭐"}
              {nivel.status === "bloqueado" && "🔒"}
            </div>

            <span>{nivel.nome}</span>

          </div>
        ))}

      </div>

    </div>
  )

  
}


export default Trilha