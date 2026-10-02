import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"
import { API_BASE_URL } from "../api/config"

function Licao3() {
  // O cÃ³digo inicial agora Ã© apenas um esqueleto de comentÃ¡rios!
  const codeScaffold = `// 1. PeÃ§a o primeiro nÃºmero
// Dica: Use Number(prompt(...))

// 2. PeÃ§a o segundo nÃºmero

// 3. Some os dois e guarde na variÃ¡vel 'soma'

// 4. Mostre o resultado no console com console.log(soma)

`

  const [codigo, setCodigo] = useState(codeScaffold)
  const [consoleOutput, setConsoleOutput] = useState("") 
  const navigate = useNavigate()
  const { id } = useParams()

  const [carregando, setCarregando] = useState(false)
  const [concluido, setConcluido] = useState(false)
  const [modal, setModal] = useState({
    isOpen: false, tipo: "", titulo: "", mensagem: "", acaoFechar: () => {}
  })

  // ðŸš« SEGURANÃ‡A
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login")
  }, [navigate])

  // ðŸ“¡ COMUNICAÃ‡ÃƒO COM O JAVA
  const enviarProgressoParaBackend = async (sucesso) => {
    setCarregando(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/progresso/submeter`, {
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

      window.dispatchEvent(new Event('atualizarPerfil'));
      setCarregando(false)

      if (sucesso) {
        setModal({
          isOpen: true,
          tipo: "sucesso",
          // Se o XP total do aluno aumentou no banco, Ã© vitÃ³ria inÃ©dita. SenÃ£o, Ã© revisÃ£o.
          titulo: data.mensagem.includes("RevisÃ£o") ? "ðŸ’– RevisÃ£o ConcluÃ­da!" : "âœ… MissÃ£o ConcluÃ­da!",
          // A mensagem agora vem MASCADA direto do nosso Spring Boot!
          mensagem: data.mensagem, 
          acaoFechar: () => {
            setModal(prev => ({ ...prev, isOpen: false }))
            setConcluido(true)
          }
        })
      } else {
        setModal({
          isOpen: true,
          tipo: "erro",
          titulo: "âŒ LÃ³gica Incorreta",
          mensagem: "VocÃª perdeu 1 Vida. Verifique se seguiu todos os passos e usou Number() para converter o texto.",
          acaoFechar: () => setModal(prev => ({ ...prev, isOpen: false }))
        })
      }
    } catch (error) {
      console.error(error)
      setCarregando(false)
      alert("Erro de conexÃ£o com o servidor.")
    }
  }

  // ðŸŽ¯ LÃ“GICA DA CALCULADORA DINÃ‚MICA (Simulador mais rigoroso)
  const verificarECalcular = async () => {
    setConsoleOutput("Analisando cÃ³digo...")
    
    // Remove todos os espaÃ§os e comentÃ¡rios em linha para facilitar a validaÃ§Ã£o flexÃ­vel
    const codigoLimpo = codigo.replace(/(\/\*.*\*\/|\/\/.*|\s+)/g, '') 
    
    // ValidaÃ§Ã£o Inteligente: Verifica se as palavras-chave da lÃ³gica JS estÃ£o presentes
    const usouPrompt = codigoLimpo.includes('prompt(')
    const usouNumber = codigoLimpo.includes('Number(') || codigoLimpo.includes('parseInt(') || codigoLimpo.includes('parseFloat(')
    const somouVariaveis = codigoLimpo.includes('soma=a+b') || codigoLimpo.includes('soma=b+a')
    const mostrouConsole = codigoLimpo.includes('console.log(soma)')

    // O aluno precisa ter feito a lÃ³gica completa
    if (usouPrompt && usouNumber && somouVariaveis && mostrouConsole) {
      
      // ðŸš€ SIMULAÃ‡ÃƒO DE EXECUÃ‡ÃƒO REAL
      setTimeout(() => {
        const n1 = window.prompt("Simulador DevEvolution:\nDigite o primeiro nÃºmero:")
        if (n1 === null) { setConsoleOutput("ExecuÃ§Ã£o cancelada pelo usuÃ¡rio."); return; } 
        
        const n2 = window.prompt("Simulador DevEvolution:\nDigite o segundo nÃºmero:")
        if (n2 === null) { setConsoleOutput("ExecuÃ§Ã£o cancelada pelo usuÃ¡rio."); return; } 

        const inputA = Number(n1);
        const inputB = Number(n2);
        const resultadoSoma = inputA + inputB;

        setConsoleOutput(`> let a = ${inputA};\n> let b = ${inputB};\n> console.log(a + b);\n\nResultado: ${resultadoSoma}`)
        enviarProgressoParaBackend(true)
      }, 500) // Pequeno delay para dar o efeito de "processando"

    } else {
      // Feedback para ajudar o aluno a descobrir onde errou
      let msgErro = "Erro de Sintaxe ou LÃ³gica:\n"
      if (!usouPrompt) msgErro += "- VocÃª esqueceu de usar o comando prompt().\n"
      if (!usouNumber) msgErro += "- VocÃª esqueceu de converter o texto para nÃºmero com Number().\n"
      if (!somouVariaveis) msgErro += "- VocÃª nÃ£o criou a variÃ¡vel 'soma' recebendo a + b.\n"
      if (!mostrouConsole) msgErro += "- VocÃª nÃ£o exibiu o resultado com console.log(soma)."
      
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

      {/* PAINEL ESQUERDO: INSTRUÃ‡Ã•ES */}
      <div className="ide-new-sidebar">
        <div className="back-arrow" onClick={() => navigate("/dashboard")}><i className="fa-solid fa-angle-left"></i></div>
        
        <div className="ide-new-title">
          <i className="fa-regular fa-lightbulb" style={{ color: '#ffd700', fontSize: '20px' }}></i>
          <h2>Soma de Dois NÃºmeros</h2>
        </div>

        <div className="ide-new-box purple">
          <h4>ðŸ“š TEORIA</h4>
          <p>
            Os computadores sÃ£o, na verdade, as melhores calculadoras do mundo! 
            No JavaScript, usamos sÃ­mbolos matemÃ¡ticos bem conhecidos como <strong>+</strong> (somar), <strong>-</strong> (subtrair), <strong>*</strong> (multiplicar) e <strong>/</strong> (dividir).<br/><br/>
            Se usarmos <code>console.log(10 + 5)</code>, o computador farÃ¡ a conta e escreverÃ¡ <code>15</code> na tela. Ã‰ mÃ¡gica pura!
          </p>
        </div>

        <div className="ide-new-box">
          <h4>ðŸŽ¯ MISSÃƒO</h4>
          <p style={{marginBottom: "10px"}}>Crie sua primeira calculadora dinÃ¢mica!</p>
          <ol>
            <li>Guarde os nÃºmeros digitados nas variÃ¡veis <strong>a</strong> e <strong>b</strong>. A funÃ§Ã£o <code>prompt()</code> pede textos, entÃ£o use <strong>Number()</strong> por fora para transformÃ¡-los em nÃºmeros de verdade.</li>
            <li>Crie uma nova variÃ¡vel chamada <strong>soma</strong> que recebe <strong>a + b</strong>.</li>
            <li>Mostre o resultado final da soma na tela usando o megafone: <strong>console.log(soma)</strong>.</li>
          </ol>
        </div>
      </div>

      {/* PAINEL DIREITO: IDE E CONSOLE */}
      <div className="ide-new-main">
        
        <div className="ide-new-editor-panel">
          <div className="ide-panel-header">
            <i className="fa-solid fa-code"></i> EDITOR DE CÃ“DIGO
          </div>
          
          <div className="ide-textarea-wrapper">
            <div className="line-numbers">
              {codigo.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <textarea
                className="ide-new-textarea"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="// Digite seu cÃ³digo abaixo:"
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
            {concluido ? (
              <button className="btn-ide-confirmar" onClick={() => navigate(id === "9" ? "/dashboard" : `/licao/${parseInt(id) + 1}`)}>
                {id === "9" ? "Finalizar e Voltar ao Mapa" : "PrÃ³xima MissÃ£o"} <i className="fa-solid fa-arrow-right"></i>
              </button>
            ) : (
              <>
                <button className="btn-ide-reset" onClick={resetar}>Resetar</button>
                <button className="btn-ide-executar-new" onClick={verificarECalcular}>
                  <i className="fa-solid fa-play"></i> EXECUTAR
                </button>
              </>
            )}
          </div>

      </div>
    </div>
  )
}

export default Licao3