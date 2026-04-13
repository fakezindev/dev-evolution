import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"

function Licao4() {
  const codeScaffold = `// 1. Defina o preço do produto
let preco = 100

// 2. Defina o desconto (%)
let desconto = 10

// 3. Calcule o valor do desconto

// 4. Calcule o novo preço

// 5. Mostre no console
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
          desafioId: parseInt(id) || 4,
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
          titulo: "💸 Desconto Calculado!",
          mensagem: data.xpGanho
            ? "+50 XP! Você entendeu cálculo com variáveis."
            : "Exercício revisado.",
          acaoFechar: () => navigate("/dashboard")
        })
      } else {
        setModal({
          isOpen: true,
          tipo: "erro",
          titulo: "❌ Lógica incorreta",
          mensagem: "Você perdeu 1 vida. Revise os cálculos.",
          acaoFechar: () => setModal({ ...modal, isOpen: false })
        })
      }

    } catch (error) {
      console.error(error)
      setCarregando(false)
      alert("Erro com servidor.")
    }
  }

  // 🧠 validação inteligente (igual Lição 3)
  const verificarCodigo = async () => {
    setConsoleOutput("Analisando código...")

    const codigoLimpo = codigo.replace(/(\/\*.*\*\/|\/\/.*|\s+)/g, '')

    const temPreco = codigoLimpo.includes("preco=")
    const temDesconto = codigoLimpo.includes("desconto=")
    const temValorDesconto = codigoLimpo.includes("valorDesconto=")
    const temNovoPreco = codigoLimpo.includes("novoPreco=")
    const temConsole = codigoLimpo.includes("console.log")

    if (temPreco && temDesconto && temValorDesconto && temNovoPreco && temConsole) {

      setTimeout(() => {
        const preco = 100
        const desconto = 10

        const valorDesconto = (preco * desconto) / 100
        const novoPreco = preco - valorDesconto

        setConsoleOutput(
          `> preco = ${preco}
          > desconto = ${desconto}
          > valorDesconto = ${valorDesconto}
          > novoPreco = ${novoPreco}

          Resultado: R$ ${novoPreco}`
        )

        enviarProgressoParaBackend(true)
      }, 500)

    } else {
      let erro = "Erro de lógica:\n"

      if (!temPreco) erro += "- Crie a variável preco\n"
      if (!temDesconto) erro += "- Crie a variável desconto\n"
      if (!temValorDesconto) erro += "- Calcule valorDesconto\n"
      if (!temNovoPreco) erro += "- Calcule novoPreco\n"
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
          <h2>💡 Cálculo de Desconto</h2>
        </div>

        <div className="ide-new-box purple">
          <h4>OBJETIVO</h4>
          <p>Calcular desconto e exibir o novo preço.</p>
        </div>

        <div className="ide-new-box purple">
          <h4>PASSO A PASSO</h4>
          <ol>
            <li>Crie <b>preco</b></li>
            <li>Crie <b>desconto</b></li>
            <li>Calcule <b>valorDesconto</b></li>
            <li>Calcule <b>novoPreco</b></li>
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
            <div className="line-numbers">1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7</div>

            <textarea
              className="ide-new-textarea"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              spellCheck="false"
            />
          </div>
        </div>

        <div className="ide-new-console-panel">
          <div className="ide-panel-header">
            <i className="fa-solid fa-desktop"></i> CONSOLE
          </div>

          <div className="ide-new-console">
            <span className="prompt">&gt;_</span> {consoleOutput}
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

export default Licao4