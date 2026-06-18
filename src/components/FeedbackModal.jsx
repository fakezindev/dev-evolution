import { useEffect } from "react"
import "../styles/modal.css"

function FeedbackModal({ isOpen, tipo, titulo, mensagem, onClose }) {
  
  // Efeito Sonoro!
  useEffect(() => {
    if (isOpen) {
      // DICA: Salve dois arquivos .mp3 na sua pasta 'public/sounds' do React
      const audioFile = tipo === "sucesso" ? "/sounds/success.mp3" : "/sounds/error.mp3"
      const audio = new Audio(audioFile)
      
      // Toca o som (o catch previne erros caso o navegador bloqueie o autoplay)
      audio.play().catch(e => console.log("Áudio não pôde ser reproduzido", e))
    }
  }, [isOpen, tipo])

  if (!isOpen) return null

  const isSucesso = tipo === "sucesso"

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${isSucesso ? "modal-sucesso" : "modal-erro"}`}>
        
        <div className="modal-icon">
          {/* Usando os ícones do FontAwesome que você já tem no projeto */}
          {isSucesso ? <i className="fa-solid fa-circle-check"></i> : <i className="fa-solid fa-heart-crack"></i>}
        </div>
        
        <h2 className="modal-title">{titulo}</h2>
        <p className="modal-message">{mensagem}</p>
        
        <button className="modal-btn" onClick={onClose}>
          Continuar
        </button>

      </div>
    </div>
  )
}

export default FeedbackModal