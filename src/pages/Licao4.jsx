import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"
import { API_BASE_URL } from "../api/config"

function Licao4() {
  const codeScaffold = `
let preco = 100

let desconto = 10

// 3. Calcule o valor do desconto

// 4. Calcule o novo preÃ§o

// 5. Mostre no console
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

  // ðŸ”’ seguranÃ§a
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login")
  }, [navigate])

  // ðŸ“¡ backend
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
          desafioId: parseInt(id) || 4, // âš ï¸ ATENÃ‡ÃƒO: Mude este nÃºmero para 1, 2, 3 ou 4 dependendo da tela!
          sucesso: sucesso
        })
      })

      if (!response.ok) throw new Error("Erro ao registrar o progresso")

      const data = await response.json()

      // ðŸ“¢ Avisa o Topbar instantaneamente
      window.dispatchEvent(new Event('atualizarPerfil'))
      setCarregando(false)

      if (sucesso) {
        setModal({
          isOpen: true,
          tipo: "sucesso",
          // TÃ­tulo dinÃ¢mico baseado na resposta do Java
          titulo: data.mensagem.includes("RevisÃ£o") ? "ðŸ’– RevisÃ£o ConcluÃ­da!" : "âœ… MissÃ£o ConcluÃ­da!",
          mensagem: data.mensagem,
          acaoFechar: () => {
            setModal(prev => ({ ...prev, isOpen: false }))
            setConcluido(true)
          }
        })
      } else {
        // LÃ³gica de Game Over Blindada
        const vidasRestantes = data.vidasAtuais !== undefined ? data.vidasAtuais : data.vidas;

        if (vidasRestantes <= 0) {
            setModal({
                isOpen: true,
                tipo: "erro",
                titulo: "Game Over! ðŸ’”",
                mensagem: "Suas vidas acabaram! RefaÃ§a a LiÃ§Ã£o 1 para recuperar sua energia.",
                acaoFechar: () => navigate("/dashboard")
            });
        } else {
            setModal({
              isOpen: true,
              tipo: "erro",
              titulo: "âŒ LÃ³gica Incorreta",
              mensagem: data.mensagem, // ðŸ—£ï¸ Usa a mensagem de erro direto do Java!
              acaoFechar: () => setModal(prev => ({ ...prev, isOpen: false }))
            })
        }
      }
    } catch (error) {
      console.error(error)
      setCarregando(false)
      // Mensagem de alerta melhorada para te ajudar a lembrar do Banco de Dados
      alert("Erro de conexÃ£o com o servidor. Verifique se o Desafio existe no Banco de Dados!")
    }
  }

  // ðŸ§  validaÃ§Ã£o inteligente (igual LiÃ§Ã£o 3)
  const verificarCodigo = async () => {
    setConsoleOutput("Analisando cÃ³digo...")

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
      let erro = "Erro de lÃ³gica:\n"

      if (!temPreco) erro += "- Crie a variÃ¡vel preco\n"
      if (!temDesconto) erro += "- Crie a variÃ¡vel desconto\n"
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
          <h2>ðŸ’¡ CÃ¡lculo de Desconto</h2>
        </div>

        <div className="ide-new-box purple">
          <h4>ðŸ“š TEORIA</h4>
          <p>
            No JavaScript, os nÃºmeros com vÃ­rgula (como R$ 10,50) sÃ£o escritos com <strong>ponto</strong> (10.50), igual nos Estados Unidos!<br/><br/>
            AlÃ©m de somar, podemos fazer contas maiores misturando operadores. 
            Para calcular um desconto, por exemplo, multiplicamos o preÃ§o pela porcentagem (`*`) e dividimos por 100 (`/`).
          </p>
        </div>

        <div className="ide-new-box">
          <h4>ðŸŽ¯ MISSÃƒO</h4>
          <p style={{marginBottom: "10px"}}>Calcule o novo preÃ§o do produto com o desconto aplicado!</p>
          <ol>
            <li>A variÃ¡vel <strong>preco</strong> e <strong>desconto</strong> jÃ¡ existem.</li>
            <li>Crie uma nova variÃ¡vel chamada <strong>valorDesconto</strong> que vai ser igual a <code>(preco * desconto) / 100</code>.</li>
            <li>Crie outra variÃ¡vel chamada <strong>novoPreco</strong> que recebe <code>preco - valorDesconto</code>.</li>
            <li>Mostre no console o <strong>novoPreco</strong>.</li>
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
              <button className="btn-ide-reset" onClick={resetar}>
                Resetar
              </button>
              <button className="btn-ide-executar-new" onClick={verificarCodigo}>
                â–¶ Executar
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default Licao4