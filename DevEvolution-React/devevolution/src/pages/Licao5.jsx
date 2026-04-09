import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"

function Licao5() {
  const codeScaffold = `// 1. Peça o nome do aluno
let nome = prompt("Digite o nome:")

// 2. Peça as três notas
let nota1 = Number(prompt("Nota 1:"))
let nota2 = Number(prompt("Nota 2:"))
let nota3 = Number(prompt("Nota 3:"))

// 3. Calcule a média

// 4. Mostre o resultado
`

  const [codigo, setCodigo] = useState(codeScaffold)
  const [consoleOutput, setConsoleOutput] = useState("")
  const navigate = useNavigate()
  const { id } = useParams()

  const [carregando, setCarregando] = useState(false)
  const [modal, setModal] = useState({
    isOpen: false, tipo: "", titulo: "", mensagem: "", acaoFechar: () => {}
  })

  // 🔒 segurança
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login")
  }, [navigate])

  // 📡 backend
  const enviarProgressoParaBackend = async (sucesso) => {
    setCarregando(true)

    try {
      const response = await fetch("http://localhost:8080/api/progresso/submeter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          desafioId: parseInt(id) || 5,
          sucesso
        })
      })

      if (!response.ok) throw new Error("Erro ao registrar progresso")

      const data = await response.json()
      setCarregando(false)

      if (sucesso) {
        setModal({
          isOpen: true,
          tipo: "sucesso",
          titulo: "🎓 Média Calculada!",
          mensagem: data.xpGanho
            ? "+50 XP! Você dominou médias."
            : "Exercício revisado.",
          acaoFechar: () => navigate("/dashboard")
        })
      } else {
        setModal({
          isOpen: true,
          tipo: "erro",
          titulo: "❌ Código incorreto",
          mensagem: "Você perdeu 1 vida. Revise o cálculo da média.",
          acaoFechar: () => setModal({ ...modal, isOpen: false })
        })
      }

    } catch (error) {
      console.error(error)
      setCarregando(false)
      alert("Erro com servidor.")
    }
  }

  // 🧠 validação inteligente
  const verificarCodigo = async () => {
    setConsoleOutput("Analisando código...")

    const codigoLimpo = codigo.replace(/(\/\*.*\*\/|\/\/.*|\s+)/g, '')

    const temNome = codigoLimpo.includes("nome=")
    const temNotas = codigoLimpo.includes("nota1=") && codigoLimpo.includes("nota2=") && codigoLimpo.includes("nota3=")
    const temMedia = codigoLimpo.includes("media=")
    const temDivisao = codigoLimpo.includes("/3")
    const temToFixed = codigoLimpo.includes("toFixed(2)")
    const temConsole = codigoLimpo.includes("console.log")

    if (temNome && temNotas && temMedia && temDivisao && temToFixed && temConsole) {

      setTimeout(() => {
        const nome = "Leo"
        const nota1 = 7
        const nota2 = 8
        const nota3 = 10

        const media = ((nota1 + nota2 + nota3) / 3).toFixed(2)

        setConsoleOutput(
`> nome = ${nome}
> notas = ${nota1}, ${nota2}, ${nota3}
> media = ${media}

"A média final do aluno ${nome} é ${media}"`
        )

        enviarProgressoParaBackend(true)
      }, 500)

    } else {
      let erro = "Erro:\n"

      if (!temNome) erro += "- Crie a variável nome\n"
      if (!temNotas) erro += "- Crie as 3 notas\n"
      if (!temMedia) erro += "- Crie a variável media\n"
      if (!temDivisao) erro += "- Divida por 3\n"
      if (!temToFixed) erro += "- Use toFixed(2)\n"
      if (!temConsole) erro += "- Use console.log\n"

      setConsoleOutput(erro)
      await enviarProgressoParaBackend(false)
    }
  }

  const resetar = () => {
    setCodigo(codeScaffold)
    setConsoleOutput("")
  }

  return (
    <div className="ide-new-container">

      {carregando && <LoadingSpinner mensagem="Validando..." />}
      <FeedbackModal {...modal} onClose={modal.acaoFechar} />

      {/* ESQUERDA */}
      <div className="ide-new-sidebar">

        <div className="back-arrow" onClick={() => navigate("/dashboard")}>
          <i className="fa-solid fa-angle-left"></i>
        </div>

        <div className="ide-new-title">
          <h2>🎓 Média Simples</h2>
        </div>

        <div className="ide-new-box purple">
          <h4>OBJETIVO</h4>
          <p>
            Calcular a média de três notas e exibir com 2 casas decimais.
          </p>
        </div>

        <div className="ide-new-box purple">
          <h4>PASSO A PASSO</h4>
          <ol>
            <li>Peça o nome</li>
            <li>Peça 3 notas</li>
            <li>Calcule a média</li>
            <li>Use <b>toFixed(2)</b></li>
            <li>Mostre no console</li>
          </ol>
        </div>

      </div>

      {/* DIREITA */}
      <div className="ide-new-main">

        <div className="ide-new-editor-panel">
          <div className="ide-panel-header">
            <i className="fa-solid fa-code"></i> EDITOR
          </div>

          <div className="ide-textarea-wrapper">
            <div className="line-numbers">1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10<br/>11<br/>12</div>

            <textarea
              className="ide-new-textarea"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="// Digite seu código abaixo:"
              spellCheck="false"
            />
          </div>
        </div>

        <div className="ide-new-console-panel">
          <div className="ide-panel-header">
            <i className="fa-solid fa-desktop"></i> CONSOLE
          </div>

          <div className="ide-new-console">
            <span className="prompt">&gt;_</span>
          </div>
        </div>

        <div className="ide-new-actions">
          <button className="btn-ide-reset" onClick={resetar}>
            Resetar
          </button>

          <button className="btn-ide-executar-new" onClick={verificarCodigo}>
            ▶ Executar
          </button>
        </div>

      </div>
    </div>
  )
}

export default Licao5