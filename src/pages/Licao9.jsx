import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"
import { API_BASE_URL } from "../api/config"

function Licao9() {
  const [codigo, setCodigo] = useState("")
  const [saida, setSaida] = useState("")
  const navigate = useNavigate()
  const { id } = useParams()

  const [carregando, setCarregando] = useState(false)
  const [concluido, setConcluido] = useState(false)
  const [modal, setModal] = useState({
    isOpen: false, tipo: "", titulo: "", mensagem: "", botoes: [], acaoFechar: () => {}
  })

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login")
    }
  }, [navigate])

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
          desafioId: parseInt(id) || 9,
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
          titulo: "ðŸ‘‘ ZEROU A JORNADA! MUNDO 3 CONCLUÃDO!",
          mensagem: "ParabÃ©ns, Dev LendÃ¡rio! VocÃª venceu o ChefÃ£o Final da Tabuada DinÃ¢mica e concluiu com maestria o Mundo 3! ðŸš€\n\nVocÃª dominou os LaÃ§os de RepetiÃ§Ã£o e se tornou um verdadeiro mestre do cÃ³digo no DevEvolution!",
          botoes: [
            {
              texto: "ðŸ—ºï¸ Voltar ao Mapa",
              classe: "modal-btn-boss",
              onClick: () => {
                setModal(prev => ({ ...prev, isOpen: false }))
                setConcluido(true)
                navigate("/dashboard")
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

  const verificar = async () => {
    if (!codigo.trim()) {
      setSaida("Erro: O editor estÃ¡ vazio.")
      return
    }

    const codigoLimpo = codigo.replace(/\s+/g, '')
    
    const acertou = 
      codigoLimpo.includes('for(') && 
      (codigoLimpo.includes('i<=10') || codigoLimpo.includes('i<11')) && 
      (codigoLimpo.includes('i++') || codigoLimpo.includes('i=i+1'));
      
    if (acertou) {
      setSaida("Tabuada gerada com sucesso!") 
      await enviarProgressoParaBackend(true)
    } else {
      setSaida("ReferenceError: syntax error ou mensagem incorreta.")
      await enviarProgressoParaBackend(false)
    }
  }

  const resetar = () => {
    setCodigo("")
    setSaida("")
  }

  return (
    <div className="ide-new-container">
      {carregando && <LoadingSpinner mensagem="Validando..." />}
      <FeedbackModal {...modal} onClose={modal.acaoFechar} />

      {/* PAINEL ESQUERDO: INSTRUÃ‡Ã•ES */}
      <div className="ide-new-sidebar">
        <div className="back-arrow" onClick={() => navigate("/dashboard")}>
          <i className="fa-solid fa-arrow-left"></i> Voltar ao Mapa
        </div>
        <div className="ide-new-title">
          <i className="fa-solid fa-crown" style={{ color: '#fbbf24', fontSize: '24px' }}></i>
          <h2>ðŸ‘‘ Tabuada DinÃ¢mica (ChefÃ£o)</h2>
        </div>

        <div className="ide-new-box purple">
          <h4>ðŸ“š TEORIA</h4>
          <p>
            O <strong>for</strong> (Para) Ã© o irmÃ£o organizado do while. Ele Ã© um laÃ§o de repetiÃ§Ã£o perfeito para quando jÃ¡ sabemos exatamente onde a contagem comeÃ§a e onde termina.<br/><br/>
            Ele tem 3 partes na sua declaraÃ§Ã£o:<br/>
            1. Onde ele nasce (ex: <code>let i = 1</code>)<br/>
            2. AtÃ© onde ele vive (ex: <code>i &lt;= 10</code>)<br/>
            3. Como ele cresce (ex: <code>i++</code>)
          </p>
        </div>

        <div className="ide-new-box">
          <h4>ðŸŽ¯ MISSÃƒO DO CHEFÃƒO DO MUNDO 3</h4>
          <p style={{marginBottom: "10px"}}>Gere a tabuada usando um ciclo organizado para zerar o jogo!</p>
          <ol>
             <li>Crie a estrutura <code>for (let i = 1; i &lt;= 10; i++)</code>.</li>
             <li>Dentro do bloco do <code>for</code>, imprima no console a multiplicaÃ§Ã£o da variÃ¡vel por <code>i</code>.</li>
             <li>Execute e veja a magia acontecer!</li>
          </ol>
        </div>
      </div>

      {/* PAINEL DIREITO: SIMULADOR E EDITOR */}
      <div className="ide-new-main">
        
        {/* TOPO: SAÃDA DO SIMULADOR */}
        <div className="ide-new-console-panel">
          <div className="ide-panel-header">
            <i className="fa-solid fa-desktop"></i> SAÃDA DO SIMULADOR
          </div>
          <div className="ide-new-console">
            <span className="prompt">&gt;</span> <span>{saida}</span>
          </div>
        </div>

        {/* BASE: EDITOR DE CÃ“DIGO */}
        <div className="ide-new-editor-panel">
          <div className="ide-panel-header">
            <i className="fa-solid fa-code"></i> EDITOR DE CÃ“DIGO
          </div>
          
          <div className="ide-textarea-wrapper">
             <div className="line-numbers">1<br/>2<br/>3<br/>4<br/>5<br/>6</div>
             <textarea
               className="ide-new-textarea"
               value={codigo}
               onChange={(e) => setCodigo(e.target.value)}
               placeholder="// let base = 7;\n// Digite seu laÃ§o for abaixo:"
               spellCheck="false"
             />
          </div>

          <div className="ide-new-actions">
            {concluido ? (
              <button className="btn-ide-confirmar" onClick={() => navigate("/dashboard")}>
                ðŸ† Finalizar e Voltar ao Mapa <i className="fa-solid fa-arrow-right"></i>
              </button>
            ) : (
              <>
                <button className="btn-ide-reset" onClick={resetar}>Resetar</button>
                <button className="btn-ide-executar-new" onClick={verificar}>
                  <i className="fa-solid fa-play"></i> EXECUTAR
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Licao9