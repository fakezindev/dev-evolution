import { useState } from "react"
import "../styles/licao.css"
import { useNavigate } from "react-router-dom"


function Licao1() {
  const [codigo, setCodigo] = useState("")
  const [resultado, setResultado] = useState("")
  const xp = localStorage.getItem("xp") || 0
  const navigate = useNavigate()
  const [concluida, setConcluida] = useState(false)

  const verificar = () => {
    if (concluida) return // 🚫 evita repetir
  
    if (codigo.includes("console.log(Hello World)")) {
      setResultado("✅ Parabéns! Missão concluída!")
      setConcluida(true)
  
      // 🔓 LIBERA FASE 2
      const progresso = JSON.parse(localStorage.getItem("progressoTrilha"))
  
      if (progresso) {
        progresso[0].status = "feito"
        progresso[1].status = "ativo"
  
        localStorage.setItem("progressoTrilha", JSON.stringify(progresso))
      }
  
      // 💰 GANHA XP
      const xpAtual = Number(localStorage.getItem("xp")) || 0
      localStorage.setItem("xp", xpAtual + 50)
  
      // 🔁 VOLTA PRO MAPA
      setTimeout(() => {
        navigate("/dashboard")
      }, 500)
  
    } else {
      setResultado("❌ Tente novamente")
    }
  }

  return (
    <div className="licao-container">

      <h1>Missão 1: Hello World</h1>
      <p className="subtitle">
        Escreva um código que exiba <strong>Hello World</strong>
      </p>

      <div className="licao-grid">

        {/* ESQUERDA */}
        <div className="dados-box">
          <h3>SEU CÓDIGO</h3>

          <textarea
            className="editor"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder='Ex: console.log("Hello World")'
          />

          <button className="btn-finalizar" onClick={verificar}>
            Executar
          </button>

          <p className="resultado">{resultado}</p>
        </div>

        {/* DIREITA */}
        <div className="gavetas-box">

          <div className="gaveta string">
            <span className="label">Objetivo</span>

            <p style={{ color: "#fff" }}>
              Seu código deve conter:
            </p>

            <div className="item small">
              Hello World
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Licao1