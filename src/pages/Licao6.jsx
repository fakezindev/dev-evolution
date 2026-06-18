import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"

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
      const response = await fetch("http://localhost:8080/api/progresso/submeter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          desafioId: parseInt(id) || 1, // ⚠️ ATENÇÃO: Mude este número para 1, 2, 3 ou 4 dependendo do arquivo!
          sucesso: sucesso
        })
      })

      if (!response.ok) throw new Error("Erro ao registrar o progresso")

      const data = await response.json()

      // 📢 DISPARA O EVENTO PARA O TOPBAR ATUALIZAR INSTANTANEAMENTE
      window.dispatchEvent(new Event('atualizarPerfil'))
      setCarregando(false)

      if (sucesso) {
        setModal({
          isOpen: true,
          tipo: "sucesso",
          // O React só decide o Título:
          titulo: data.mensagem.includes("Revisão") ? "💖 Revisão Concluída!" : "✅ Missão Concluída!",
          // O Java manda a mensagem perfeita (Ex: "Você ganhou +50 XP!" ou "Você recuperou 1 coração!")
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
                titulo: "Game Over! 💔",
                mensagem: "Suas vidas acabaram! Refaça a Lição 1 para recuperar sua energia.",
                acaoFechar: () => navigate("/dashboard") // Todas as lições expulsam pro mapa no Game Over!
            });
        } else {
            setModal({
              isOpen: true,
              tipo: "erro",
              titulo: "❌ Código Incorreto",
              // O Java manda a mensagem de erro (Ex: "Ops! Código incorreto. Você perdeu 1 vida 💔")
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

  const verificar = async () => {
    if (!codigo.trim()) {
      setSaida("Erro: O editor está vazio.")
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

      {/* PAINEL ESQUERDO: INSTRUÇÕES */}
      <div className="ide-new-sidebar">
        <div className="back-arrow" onClick={() => navigate("/dashboard")}>
          <i className="fa-solid fa-arrow-left"></i> Voltar ao Mapa
        </div>
        <div className="ide-new-title">
          <i className="fa-regular fa-lightbulb" style={{ color: '#4da6ff', fontSize: '24px' }}></i>
          <h2>Avaliador de Notas</h2>
        </div>

        <div className="ide-new-box purple">
          <h4>📚 TEORIA</h4>
          <p>
            O <strong>if</strong> (Se) e o <strong>else</strong> (Senão) funcionam como uma encruzilhada. 
            Nós fazemos uma pergunta ao computador: "A nota é maior que 6?".<br/><br/>
            Se a resposta for sim (<strong>if</strong>), ele vai por um caminho e aprova o aluno. 
            Senão (<strong>else</strong>), ele vai pelo outro caminho e reprova o aluno. É assim que os jogos tomam decisões!
          </p>
        </div>

        <div className="ide-new-box">
          <h4>🎯 MISSÃO</h4>
          <p style={{marginBottom: "10px"}}>Crie o sistema que aprova ou reprova o aluno!</p>
          <ol>
             <li>Crie a estrutura <code>if (nota &gt;= 6)</code> (se a nota for maior ou igual a 6).</li>
             <li>Dentro do bloco do <code>if</code>, use o console.log para escrever "Aprovado".</li>
             <li>Crie a estrutura <code>else</code> logo após fechar o bloco do if.</li>
             <li>Dentro do bloco do <code>else</code>, use o console.log para escrever "Reprovado".</li>
          </ol>
        </div>
      </div>

      {/* PAINEL DIREITO: SIMULADOR E EDITOR */}
      <div className="ide-new-main">
        
        {/* TOPO: SAÍDA DO SIMULADOR */}
        <div className="ide-new-console-panel">
          <div className="ide-panel-header">
            <i className="fa-solid fa-desktop"></i> SAÍDA DO SIMULADOR
          </div>
          <div className="ide-new-console">
            <span className="prompt">&gt;</span> <span>{saida}</span>
          </div>
        </div>

        {/* BASE: EDITOR DE CÓDIGO */}
        <div className="ide-new-editor-panel">
          <div className="ide-panel-header">
            <i className="fa-solid fa-code"></i> EDITOR DE CÓDIGO
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
                {id === "9" ? "Finalizar e Voltar ao Mapa" : "Próxima Missão"} <i className="fa-solid fa-arrow-right"></i>
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