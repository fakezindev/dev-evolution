import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"

function Licao3() {
  // O código inicial agora é apenas um esqueleto de comentários!
  const codeScaffold = `// 1. Peça o primeiro número
// Dica: Use Number(prompt(...))

// 2. Peça o segundo número

// 3. Some os dois e guarde na variável 'soma'

// 4. Mostre o resultado no console com console.log(soma)

`

  const [codigo, setCodigo] = useState(codeScaffold)
  const [consoleOutput, setConsoleOutput] = useState("") 
  const navigate = useNavigate()
  const { id } = useParams()

  const [carregando, setCarregando] = useState(false)
  const [modal, setModal] = useState({
    isOpen: false, tipo: "", titulo: "", mensagem: "", acaoFechar: () => {}
  })

  // 🚫 SEGURANÇA
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login")
  }, [navigate])

  // 📡 COMUNICAÇÃO COM O JAVA
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
          desafioId: parseInt(id) || 3, 
          sucesso: sucesso
        })
      })

      if (!response.ok) throw new Error("Erro ao registrar o progresso")

      const data = await response.json()
      setCarregando(false)

      if (sucesso) {
        setModal({
          isOpen: true,
          tipo: "sucesso",
          titulo: data.xpGanho ? "✅ Calculadora Ativada!" : "Revisão Concluída!",
          mensagem: data.xpGanho ? "+50 XP! Você dominou o fluxo de dados." : "Conteúdo revisado.",
          acaoFechar: () => navigate("/dashboard")
        })
      } else {
        setModal({
          isOpen: true,
          tipo: "erro",
          titulo: "❌ Lógica Incorreta",
          mensagem: "Você perdeu 1 Vida. Verifique se seguiu todos os passos e usou Number() para converter o texto.",
          acaoFechar: () => setModal({ ...modal, isOpen: false })
        })
      }
    } catch (error) {
      console.error(error)
      setCarregando(false)
      alert("Erro de conexão com o servidor.")
    }
  }

  // 🎯 LÓGICA DA CALCULADORA DINÂMICA (Simulador mais rigoroso)
  const verificarECalcular = async () => {
    setConsoleOutput("Analisando código...")
    
    // Remove todos os espaços e comentários em linha para facilitar a validação flexível
    const codigoLimpo = codigo.replace(/(\/\*.*\*\/|\/\/.*|\s+)/g, '') 
    
    // Validação Inteligente: Verifica se as palavras-chave da lógica JS estão presentes
    const usouPrompt = codigoLimpo.includes('prompt(')
    const usouNumber = codigoLimpo.includes('Number(') || codigoLimpo.includes('parseInt(') || codigoLimpo.includes('parseFloat(')
    const somouVariaveis = codigoLimpo.includes('soma=a+b') || codigoLimpo.includes('soma=b+a')
    const mostrouConsole = codigoLimpo.includes('console.log(soma)')

    // O aluno precisa ter feito a lógica completa
    if (usouPrompt && usouNumber && somouVariaveis && mostrouConsole) {
      
      // 🚀 SIMULAÇÃO DE EXECUÇÃO REAL
      setTimeout(() => {
        const n1 = window.prompt("Simulador DevEvolution:\nDigite o primeiro número:")
        if (n1 === null) { setConsoleOutput("Execução cancelada pelo usuário."); return; } 
        
        const n2 = window.prompt("Simulador DevEvolution:\nDigite o segundo número:")
        if (n2 === null) { setConsoleOutput("Execução cancelada pelo usuário."); return; } 

        const inputA = Number(n1);
        const inputB = Number(n2);
        const resultadoSoma = inputA + inputB;

        setConsoleOutput(`> let a = ${inputA};\n> let b = ${inputB};\n> console.log(a + b);\n\nResultado: ${resultadoSoma}`)
        enviarProgressoParaBackend(true)
      }, 500) // Pequeno delay para dar o efeito de "processando"

    } else {
      // Feedback para ajudar o aluno a descobrir onde errou
      let msgErro = "Erro de Sintaxe ou Lógica:\n"
      if (!usouPrompt) msgErro += "- Você esqueceu de usar o comando prompt().\n"
      if (!usouNumber) msgErro += "- Você esqueceu de converter o texto para número com Number().\n"
      if (!somouVariaveis) msgErro += "- Você não criou a variável 'soma' recebendo a + b.\n"
      if (!mostrouConsole) msgErro += "- Você não exibiu o resultado com console.log(soma)."
      
      setConsoleOutput(msgErro)
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

      {/* PAINEL ESQUERDO: INSTRUÇÕES */}
      <div className="ide-new-sidebar">
        <div className="back-arrow" onClick={() => navigate("/dashboard")}><i className="fa-solid fa-angle-left"></i></div>
        
        <div className="ide-new-title">
          <i className="fa-regular fa-lightbulb" style={{ color: '#ffd700', fontSize: '20px' }}></i>
          <h2>Soma de Dois Números</h2>
        </div>

        <div className="ide-new-box purple">
          <h4>OBJETIVO</h4>
          <p>Vamos criar uma calculadora simples! Você vai pedir dois números para o usuário, somá-los e mostrar o resultado.</p>
        </div>

        <div className="ide-new-box purple">
          <h4>PASSO A PASSO</h4>
          <ol>
            <li>Guarde os números nas variáveis <strong>a</strong> e <strong>b</strong>. Use <strong>Number(prompt(...))</strong> para transformar o texto em número.</li>
            <li>Crie a variável <strong>soma</strong> fazendo <strong>a + b</strong>.</li>
            <li>Mostre o resultado com <strong>console.log(soma)</strong>.</li>
          </ol>
        </div>
      </div>

      {/* PAINEL DIREITO: IDE E CONSOLE */}
      <div className="ide-new-main">
        
        <div className="ide-new-editor-panel">
          <div className="ide-panel-header">
            <i className="fa-solid fa-code"></i> EDITOR DE CÓDIGO
          </div>
          
          <div className="ide-textarea-wrapper">
            <div className="line-numbers">1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9</div>
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
            <button className="btn-ide-reset" onClick={resetar}>Resetar</button>
            <button className="btn-ide-executar-new" onClick={verificarECalcular}>
              <i className="fa-solid fa-play"></i> EXECUTAR
            </button>
          </div>

      </div>
    </div>
  )
}

export default Licao3