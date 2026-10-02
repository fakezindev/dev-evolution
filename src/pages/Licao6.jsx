import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"
import { API_BASE_URL } from "../api/config"

function Licao6() {
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
      codigoLimpo.includes('if(') && 
      codigoLimpo.includes('>=') && 
      codigoLimpo.includes('else');
      
    if (acertou) {
      setSaida("Aprovado ou Reprovado") 
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
          <h2>Avaliador de Notas</h2>
        </div>

        <div className="ide-new-box purple">
          <h4>ðŸ“š TEORIA</h4>
          <p>
            O <strong>if</strong> (Se) e o <strong>else</strong> (SenÃ£o) funcionam como uma encruzilhada. 
            NÃ³s fazemos uma pergunta ao computador: "A nota Ã© maior que 6?".<br/><br/>
            Se a resposta for sim (<strong>if</strong>), ele vai por um caminho e aprova o aluno. 
            SenÃ£o (<strong>else</strong>), ele vai pelo outro caminho e reprova o aluno. Ã‰ assim que os jogos tomam decisÃµes!
          </p>
        </div>

        <div className="ide-new-box">
          <h4>ðŸŽ¯ MISSÃƒO</h4>
          <p style={{marginBottom: "10px"}}>Crie o sistema que aprova ou reprova o aluno!</p>
          <ol>
             <li>Crie a estrutura <code>if (nota &gt;= 6)</code> (se a nota for maior ou igual a 6).</li>
             <li>Dentro do bloco do <code>if</code>, use o console.log para escrever "Aprovado".</li>
             <li>Crie a estrutura <code>else</code> logo apÃ³s fechar o bloco do if.</li>
             <li>Dentro do bloco do <code>else</code>, use o console.log para escrever "Reprovado".</li>
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
               placeholder="// let nota = 7;\n// Digite seu if/else abaixo:"
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

export default Licao6