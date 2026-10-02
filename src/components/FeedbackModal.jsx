import { useEffect } from "react"
import "../styles/modal.css"

function FeedbackModal({ isOpen, tipo, titulo, mensagem, icone, botoes, botaoTexto, onClose }) {
  
  // Efeito Sonoro!
  useEffect(() => {
    if (isOpen) {
      // DICA: Salve dois arquivos .mp3 na sua pasta 'public/sounds' do React
      const audioFile = (tipo === "sucesso" || tipo === "boss") ? "/sounds/success.mp3" : "/sounds/error.mp3"
      const audio = new Audio(audioFile)
      
      // Toca o som (o catch previne erros caso o navegador bloqueie o autoplay)
      audio.play().catch(e => console.log("Áudio não pôde ser reproduzido", e))
    }
  }, [isOpen, tipo])

  if (!isOpen) return null

  const isBoss = tipo === "boss"
  const isSucesso = tipo === "sucesso" || isBoss

  const renderIcone = () => {
    if (icone) return <i className={icone}></i>
    if (isBoss) return <i className="fa-solid fa-trophy"></i>
    if (isSucesso) return <i className="fa-solid fa-circle-check"></i>
    return <i className="fa-solid fa-heart-crack"></i>
  }

  const getClasseModal = () => {
    if (isBoss) return "modal-boss"
    if (isSucesso) return "modal-sucesso"
    return "modal-erro"
  }

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${getClasseModal()}`}>
        
        <div className="modal-icon">
          {renderIcone()}
        </div>
        
        <h2 className="modal-title">{titulo}</h2>
        <p className="modal-message">{mensagem}</p>
        
        {botoes && botoes.length > 0 ? (
          <div className="modal-botoes-container">
            {botoes.map((btn, index) => (
              <button 
                key={index} 
                className={`modal-btn ${btn.classe || ""}`} 
                onClick={btn.onClick}
              >
                {btn.texto}
              </button>
            ))}
          </div>
        ) : (
          <button className="modal-btn" onClick={onClose}>
            {botaoTexto || "Continuar"}
          </button>
        )}

      </div>
    </div>
  )
}

export default FeedbackModal