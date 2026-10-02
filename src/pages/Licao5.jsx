import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"
import { API_BASE_URL } from "../api/config"

function Licao5() {
  const codeScaffold = `// 1. PeÃ§a o nome do aluno
let nome = prompt("Digite o nome:")

// 2. PeÃ§a as trÃªs notas
let nota1 = Number(prompt("Nota 1:"))
let nota2 = Number(prompt("Nota 2:"))
let nota3 = Number(prompt("Nota 3:"))

// 3. Calcule a mÃ©dia

// 4. Mostre o resultado
`

  const [codigo, setCodigo] = useState(codeScaffold)
  const [consoleOutput, setConsoleOutput] = useState("")
  const navigate = useNavigate()
  const { id } = useParams()

  const [carregando, setCarregando] = useState(false)
  const [concluido, setConcluido] = useState(false)
  const [modal, setModal] = useState({
    isOpen: false, tipo: "", titulo: "", mensagem: "", botoes: [], acaoFechar: () => {}
  })

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login")
  }, [navigate])

  // ðŸ“¡ A FunÃ§Ã£o Universal Definitiva
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
          tipo: "boss",
          titulo: "ðŸ† MUNDO 1 CONCLUÃDO!",
          mensagem: "ParabÃ©ns, Dev! VocÃª venceu o ChefÃ£o da MÃ©dia Simples e completou com sucesso o Mundo 1: Fundamentos da ProgramaÃ§Ã£o! ðŸš€\n\nVocÃª dominou variÃ¡veis, entrada de dados e operaÃ§Ãµes matemÃ¡ticas. O Mundo 2 te espera!",
          botoes: [
            {
              texto: "ðŸ—ºï¸ Voltar ao Mapa",
              classe: "modal-btn-secundario",
              onClick: () => {
                setModal(prev => ({ ...prev, isOpen: false }))
                setConcluido(true)
                navigate("/dashboard")
              }
            },
            {
              texto: "ðŸš€ Ir para o Mundo 2",
              classe: "modal-btn-boss",
              onClick: () => {
                setModal(prev => ({ ...prev, isOpen: false }))
                setConcluido(true)
                navigate("/licao/6")
              }
            }
          ],
          acaoFechar: () => {
            setModal(prev => ({ ...prev, isOpen: false }))
            setConcluido(true)
          }
        })
      } else {
        const vidasRestantes = data.vidasAtuais !== undefined ? data.vidasAtuais : data.vidas;

        if (vidasRestantes <= 0) {
            setModal({
                isOpen: true,
                tipo: "erro",
                titulo: "Game Over! ðŸ’”",
                mensagem: "Suas vidas acabaram! RefaÃ§a a LiÃ§Ã£o 1 para recuperar sua energia.",
                botoes: [],
                acaoFechar: () => navigate("/dashboard") 
            });
        } else {
            setModal({
              isOpen: true,
              tipo: "erro",
              titulo: "âŒ CÃ³digo Incorreto",
              mensagem: data.mensagem, 
              botoes: [],
              acaoFechar: () => setModal(prev => ({ ...prev, isOpen: false }))
            })
        }
      }

    } catch (error) {
      console.error(error)
      setCarregando(false)
      alert("Erro de conexÃ£o com o servidor. Verifique se o banco de dados estÃ¡ rodando!")
    }
  }

  // ðŸ§  ValidaÃ§Ã£o e Simulador DinÃ¢mico
  const verificarCodigo = async () => {
    setConsoleOutput("Analisando cÃ³digo...")

    const codigoLimpo = codigo.replace(/(\/\*.*\*\/|\/\/.*|\s+)/g, '')

    const temNome = codigoLimpo.includes("nome=")
    const temNotas = codigoLimpo.includes("nota1=") && codigoLimpo.includes("nota2=") && codigoLimpo.includes("nota3=")
    const temMedia = codigoLimpo.includes("media=")
    const temDivisao = codigoLimpo.includes("/3")
    const temToFixed = codigoLimpo.includes("toFixed(2)")
    const temConsole = codigoLimpo.includes("console.log")

    if (temNome && temNotas && temMedia && temDivisao && temToFixed && temConsole) {
      
      // ðŸš€ SIMULAÃ‡ÃƒO DE EXECUÃ‡ÃƒO REAL
      setTimeout(() => {
        // Pede os dados dinamicamente igual Ã  LiÃ§Ã£o 3
        const inputNome = window.prompt("Simulador DevEvolution:\nDigite o nome do aluno:")
        if (inputNome === null) { setConsoleOutput("ExecuÃ§Ã£o cancelada pelo usuÃ¡rio."); return; } 

        const n1 = window.prompt("Simulador DevEvolution:\nDigite a Nota 1:")
        if (n1 === null) { setConsoleOutput("ExecuÃ§Ã£o cancelada pelo usuÃ¡rio."); return; } 

        const n2 = window.prompt("Simulador DevEvolution:\nDigite a Nota 2:")
        if (n2 === null) { setConsoleOutput("ExecuÃ§Ã£o cancelada pelo usuÃ¡rio."); return; } 

        const n3 = window.prompt("Simulador DevEvolution:\nDigite a Nota 3:")
        if (n3 === null) { setConsoleOutput("ExecuÃ§Ã£o cancelada pelo usuÃ¡rio."); return; } 

        // Converte as notas e calcula a mÃ©dia na hora
        const nota1 = Number(n1)
        const nota2 = Number(n2)
        const nota3 = Number(n3)
        const media = ((nota1 + nota2 + nota3) / 3).toFixed(2)

        setConsoleOutput(
`> let nome = "${inputNome}";
> notas = ${nota1}, ${nota2}, ${nota3}
> let media = (n1 + n2 + n3) / 3;

"A mÃ©dia final de ${inputNome} Ã© ${media}"`
        )

        enviarProgressoParaBackend(true)
      }, 500)

    } else {
      let erro = "Erro de LÃ³gica ou Sintaxe:\n"

      if (!temNome) erro += "- Crie a variÃ¡vel nome\n"
      if (!temNotas) erro += "- Crie as 3 notas\n"
      if (!temMedia) erro += "- Crie a variÃ¡vel media\n"
      if (!temDivisao) erro += "- Divida por 3 na variÃ¡vel da mÃ©dia\n"
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
          <h2>ðŸ‘‘ MÃ©dia Simples (ChefÃ£o)</h2>
        </div>

        <div className="ide-new-box purple">
          <h4>ðŸ“š TEORIA</h4>
          <p>
            Assim como na matemÃ¡tica da escola, o computador sempre tenta resolver multiplicaÃ§Ã£o e divisÃ£o antes da soma e subtraÃ§Ã£o.<br/><br/>
            Para fazer a mÃ©dia escolar, nÃ³s <strong>somamos</strong> todas as notas primeiro e depois <strong>dividimos</strong> pela quantidade de matÃ©rias. 
            Para forÃ§ar o computador a fazer a soma primeiro, abraÃ§amos as notas com <strong>( )</strong>: <code>(nota1 + nota2 + nota3) / 3</code>.
          </p>
        </div>

        <div className="ide-new-box">
          <h4>ðŸŽ¯ MISSÃƒO DO CHEFÃƒO DO MUNDO 1</h4>
          <p style={{marginBottom: "10px"}}>Calcule a mÃ©dia do aluno e mostre o boletim final para vencer o Mundo 1.</p>
          <ol>
            <li>O cÃ³digo jÃ¡ pede o nome e as 3 notas usando <code>prompt()</code>.</li>
            <li>Crie uma nova variÃ¡vel <strong>media</strong> que soma as 3 notas (usando os parÃªnteses) e divide tudo por 3.</li>
            <li>No final, mostre no <code>console.log()</code> a mÃ©dia final formatada com <strong>.toFixed(2)</strong> para deixar bonitinho (ex: 8.50).</li>
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
            <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'flex-end' }}>
              <button 
                className="btn-ide-reset" 
                onClick={() => navigate("/dashboard")}
                style={{ background: '#334155', color: '#fff' }}
              >
                ðŸ—ºï¸ Voltar ao Mapa
              </button>
              <button 
                className="btn-ide-confirmar" 
                onClick={() => navigate("/licao/6")}
                style={{ background: 'linear-gradient(135deg, #f1c40f 0%, #e67e22 100%)', color: '#000', fontWeight: 'bold' }}
              >
                ðŸš€ AvanÃ§ar para o Mundo 2 <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          ) : (
            <>
              <button className="btn-ide-reset" onClick={resetar}>
                Resetar
              </button>
              <button 
                className="btn-ide-executar-new" 
                onClick={verificarCodigo}
                disabled={carregando}
              >
                â–¶ {carregando ? "Validando..." : "Executar"}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default Licao5