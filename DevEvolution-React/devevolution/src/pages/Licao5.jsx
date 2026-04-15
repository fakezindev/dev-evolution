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

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login")
  }, [navigate])

  // 📡 A Função Universal Definitiva
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
          desafioId: parseInt(id) || 5, // ID 5!
          sucesso: sucesso
        })
      })

      if (!response.ok) throw new Error("Erro ao registrar o progresso")

      const data = await response.json()

      window.dispatchEvent(new Event('atualizarPerfil'))
      setCarregando(false)

      if (sucesso) {
        setModal({
          isOpen: true,
          tipo: "sucesso",
          titulo: data.mensagem.includes("Revisão") ? "💖 Revisão Concluída!" : "🎓 Missão Concluída!",
          mensagem: data.mensagem,
          acaoFechar: () => navigate("/dashboard")
        })
      } else {
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
              titulo: "❌ Código Incorreto",
              mensagem: data.mensagem, 
              acaoFechar: () => setModal({ ...modal, isOpen: false })
            })
        }
      }

    } catch (error) {
      console.error(error)
      setCarregando(false)
      alert("Erro de conexão com o servidor. Verifique se o banco de dados está rodando!")
    }
  }

  // 🧠 Validação e Simulador Dinâmico
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
      
      // 🚀 SIMULAÇÃO DE EXECUÇÃO REAL
      setTimeout(() => {
        // Pede os dados dinamicamente igual à Lição 3
        const inputNome = window.prompt("Simulador DevEvolution:\nDigite o nome do aluno:")
        if (inputNome === null) { setConsoleOutput("Execução cancelada pelo usuário."); return; } 

        const n1 = window.prompt("Simulador DevEvolution:\nDigite a Nota 1:")
        if (n1 === null) { setConsoleOutput("Execução cancelada pelo usuário."); return; } 

        const n2 = window.prompt("Simulador DevEvolution:\nDigite a Nota 2:")
        if (n2 === null) { setConsoleOutput("Execução cancelada pelo usuário."); return; } 

        const n3 = window.prompt("Simulador DevEvolution:\nDigite a Nota 3:")
        if (n3 === null) { setConsoleOutput("Execução cancelada pelo usuário."); return; } 

        // Converte as notas e calcula a média na hora
        const nota1 = Number(n1)
        const nota2 = Number(n2)
        const nota3 = Number(n3)
        const media = ((nota1 + nota2 + nota3) / 3).toFixed(2)

        setConsoleOutput(
`> let nome = "${inputNome}";
> notas = ${nota1}, ${nota2}, ${nota3}
> let media = (n1 + n2 + n3) / 3;

"A média final de ${inputNome} é ${media}"`
        )

        enviarProgressoParaBackend(true)
      }, 500)

    } else {
      let erro = "Erro de Lógica ou Sintaxe:\n"

      if (!temNome) erro += "- Crie a variável nome\n"
      if (!temNotas) erro += "- Crie as 3 notas\n"
      if (!temMedia) erro += "- Crie a variável media\n"
      if (!temDivisao) erro += "- Divida por 3 na variável da média\n"
      if (!temToFixed) erro += "- Use .toFixed(2) no console.log\n"
      if (!temConsole) erro += "- Exiba o resultado com console.log\n"

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
            <span className="prompt">&gt;_</span> {consoleOutput}
          </div>
        </div>

        <div className="ide-new-actions">
          <button className="btn-ide-reset" onClick={resetar}>
            Resetar
          </button>

          <button 
            className="btn-ide-executar-new" 
            onClick={verificarCodigo}
            disabled={carregando}
          >
            ▶ {carregando ? "Validando..." : "Executar"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Licao5