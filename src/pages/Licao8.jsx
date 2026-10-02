import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"

function Licao8() {
  const [codigo, setCodigo] = useState("")
  const [saida, setSaida] = useState("") // Novo estado para o terminal!
  const navigate = useNavigate()
  const { id } = useParams()

  const [carregando, setCarregando] = useState(false)
  const [concluido, setConcluido] = useState(false)
  const [modal, setModal] = useState({
    isOpen: false, tipo: "", titulo: "", mensagem: "", acaoFechar: () => {}
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
          desafioId: parseInt(id) || 1, // âš ï¸ ATENÃ‡ÃƒO: Mude este nÃºmero para 1, 2, 3 ou 4 dependendo do arquivo!
          sucesso: sucesso
        })
      })

      if (!response.ok) throw new Error("Erro ao registrar o progresso")

      const data = await response.json()

      // ðŸ“¢ DISPARA O EVENTO PARA O TOPBAR ATUALIZAR INSTANTANEAMENTE
      window.dispatchEvent(new Event('atualizarPerfil'))
      setCarregando(false)

      if (sucesso) {
        setModal({
          isOpen: true,
          tipo: "sucesso",
          // O React sÃ³ decide o TÃ­tulo:
          titulo: data.mensagem.includes("RevisÃ£o") ? "ðŸ’– RevisÃ£o ConcluÃ­da!" : "âœ… MissÃ£o ConcluÃ­da!",
          // O Java manda a mensagem perfeita (Ex: "VocÃª ganhou +50 XP!" ou "VocÃª recuperou 1 coraÃ§Ã£o!")
          mensagem: data.mensagem, 
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
                acaoFechar: () => navigate("/dashboard") // Todas as liÃ§Ãµes expulsam pro mapa no Game Over!
            });
        } else {
            setModal({
              isOpen: true,
              tipo: "erro",
              titulo: "âŒ CÃ³digo Incorreto",
              // O Java manda a mensagem de erro (Ex: "Ops! CÃ³digo incorreto. VocÃª perdeu 1 vida ðŸ’”")
              mensagem: data.mensagem, 
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
      codigoLimpo.includes('while(') && 
      (codigoLimpo.includes('contador>0') || codigoLimpo.includes('contador>=1')) && 
      (codigoLimpo.includes('contador--') || codigoLimpo.includes('contador=contador-1'));
      
    if (acertou) {
      setSaida("3... 2... 1... Fogo!") 
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
          <i className="fa-regular fa-lightbulb" style={{ color: '#4da6ff', fontSize: '24px' }}></i>
          <h2>Contagem Regressiva</h2>
        </div>

        <div className="ide-new-box purple">
          <h4>ðŸ“š TEORIA</h4>
          <p>
            O <strong>while</strong> (Enquanto) Ã© um ciclo infinito que sÃ³ para quando dizemos chega.<br/><br/>
            Pense nele como uma mÃ£e dizendo: "Enquanto seu quarto estiver bagunÃ§ado, continue arrumando!". 
            Se nÃ£o limparmos o quarto (ou se nÃ£o diminuirmos nosso contador), ficaremos presos nesse ciclo para todo o sempre (o famoso Loop Infinito). 
            Usamos <code>contador--</code> para diminuir o valor de 1 em 1.
          </p>
        </div>

        <div className="ide-new-box">
          <h4>ðŸŽ¯ MISSÃƒO</h4>
          <p style={{marginBottom: "10px"}}>FaÃ§a o foguete decolar diminuindo o contador!</p>
          <ol>
             <li>Crie a estrutura <code>while (contador &gt; 0)</code>.</li>
             <li>Dentro do bloco do <code>while</code>, imprima o valor atual com <code>console.log(contador)</code>.</li>
             <li><strong>MUITO IMPORTANTE:</strong> Logo depois de imprimir, diminua o contador usando <code>contador--</code>. Se esquecer disso, o foguete explode!</li>
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
             <div className="line-numbers">1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7</div>
             <textarea
               className="ide-new-textarea"
               value={codigo}
               onChange={(e) => setCodigo(e.target.value)}
               placeholder="// let contador = 3;\n// Digite seu while abaixo:"
               spellCheck="false"
             />
          </div>

          <div className="ide-new-actions">
            {concluido ? (
              <button className="btn-ide-confirmar" onClick={() => navigate(id === "9" ? "/dashboard" : `/licao/${parseInt(id) + 1}`)}>
                {id === "9" ? "Finalizar e Voltar ao Mapa" : "PrÃ³xima MissÃ£o"} <i className="fa-solid fa-arrow-right"></i>
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

export default Licao8