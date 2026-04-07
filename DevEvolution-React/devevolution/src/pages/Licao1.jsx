import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"

function Licao1() {
  const [codigo, setCodigo] = useState("")
  const [saida, setSaida] = useState("") // Novo estado para o terminal!
  const navigate = useNavigate()
  const { id } = useParams()

  const [carregando, setCarregando] = useState(false)
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
          desafioId: parseInt(id) || 1,
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
          titulo: data.xpGanho ? "✅ Missão Concluída!" : "Revisão Concluída!",
          mensagem: data.xpGanho ? "+50 XP adicionados!" : "Conteúdo revisado com sucesso.",
          acaoFechar: () => navigate("/dashboard")
        })
      } else {
        setModal({
          isOpen: true,
          tipo: "erro",
          titulo: "❌ Código Incorreto",
          mensagem: "Você perdeu 1 coração (Vida). Verifique a sintaxe do console.log.",
          acaoFechar: () => setModal({ ...modal, isOpen: false })
        })
      }
    } catch (error) {
      console.error(error)
      setCarregando(false)
      alert("Erro de conexão com o servidor.")
    }
  }

  const verificar = async () => {
    if (!codigo.trim()) {
      setSaida("Erro: O editor está vazio.")
      return
    }

    const codigoLimpo = codigo.replace(/\s+/g, '')
    
    // Aceita aspas simples ou duplas, Hello World ou Olá Mundo
    const acertou = 
      codigoLimpo.includes('console.log("Olá,Mundo!")') || 
      codigoLimpo.includes("console.log('Olá,Mundo!')") ||
      codigoLimpo.includes('console.log("HelloWorld")') ||
      codigoLimpo.includes("console.log('HelloWorld')")

    if (acertou) {
      // Simula o texto aparecendo no console antes de chamar o Java
      setSaida("Olá, Mundo!") 
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
    <div className="ide-container">
      {carregando && <LoadingSpinner mensagem="Validando..." />}
      <FeedbackModal {...modal} onClose={modal.acaoFechar} />

      {/* PAINEL ESQUERDO: INSTRUÇÕES */}
      <div className="ide-sidebar">
        <div className="ide-title">
          <i className="fa-regular fa-lightbulb" style={{ color: '#4da6ff', fontSize: '20px' }}></i>
          <h2>Hello World</h2>
        </div>

        <div className="ide-instruction-box">
          <p>Use a função <strong>console.log("Olá, Mundo!")</strong> para imprimir uma mensagem na tela.</p>
        </div>
      </div>

      {/* PAINEL DIREITO: SIMULADOR E EDITOR */}
      <div className="ide-main">
        
        {/* TOPO: SAÍDA DO SIMULADOR */}
        <div className="ide-output-panel">
          <div className="ide-panel-header">
            <i className="fa-solid fa-desktop"></i> SAÍDA DO SIMULADOR
          </div>
          <div className="ide-terminal">
            <span className="prompt">&gt;</span> {saida}
          </div>
        </div>

        {/* BASE: EDITOR DE CÓDIGO */}
        <div className="ide-editor-panel">
          <div className="ide-panel-header">
            <i className="fa-solid fa-code"></i> EDITOR DE CÓDIGO
          </div>
          
          <textarea
            className="ide-textarea"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="// Digite seu código abaixo:"
            spellCheck="false"
          />

          <div className="ide-actions">
            <button className="btn-ide-reset" onClick={resetar}>Resetar</button>
            <button className="btn-ide-executar" onClick={verificar}>
              <i className="fa-solid fa-play"></i> EXECUTAR
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Licao1