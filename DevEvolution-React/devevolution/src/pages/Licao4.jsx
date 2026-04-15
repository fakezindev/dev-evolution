import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"

function Licao4() {
  const codeScaffold = `
let preco = 100

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
          desafioId: parseInt(id) || 4, // ⚠️ ATENÇÃO: Mude este número para 1, 2, 3 ou 4 dependendo da tela!
          sucesso: sucesso
        })
      })

      if (!response.ok) throw new Error("Erro ao registrar o progresso")

      const data = await response.json()

      // 📢 Avisa o Topbar instantaneamente
      window.dispatchEvent(new Event('atualizarPerfil'))
      setCarregando(false)

      if (sucesso) {
        setModal({
          isOpen: true,
          tipo: "sucesso",
          // Título dinâmico baseado na resposta do Java
          titulo: data.mensagem.includes("Revisão") ? "💖 Revisão Concluída!" : "✅ Missão Concluída!",
          mensagem: data.mensagem,
          acaoFechar: () => navigate("/dashboard")
        })
      } else {
        // Lógica de Game Over Blindada
        const vidasRestantes = data.vidasAtuais !== undefined ? data.vidasAtuais : data.vidas;

        if (vidasRestantes <= 0) {
            setModal({
                isOpen: true,
                tipo: "erro",
                titulo: "Game Over! 💔",
                mensagem: "Suas vidas acabaram! Refaça a Lição 1 para recuperar sua energia.",
                acaoFechar: () => navigate("/dashboard")
            });
        } else {
            setModal({
              isOpen: true,
              tipo: "erro",
              titulo: "❌ Lógica Incorreta",
              mensagem: data.mensagem, // 🗣️ Usa a mensagem de erro direto do Java!
              acaoFechar: () => setModal({ ...modal, isOpen: false })
            })
        }
      }
    } catch (error) {
      console.error(error)
      setCarregando(false)
      // Mensagem de alerta melhorada para te ajudar a lembrar do Banco de Dados
      alert("Erro de conexão com o servidor. Verifique se o Desafio existe no Banco de Dados!")
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