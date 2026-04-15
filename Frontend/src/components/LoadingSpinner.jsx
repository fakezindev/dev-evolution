import "../styles/spinner.css"

function LoadingSpinner({ mensagem = "Carregando..." }) {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="loading-spinner"></div>
        <p className="spinner-text">{mensagem}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner