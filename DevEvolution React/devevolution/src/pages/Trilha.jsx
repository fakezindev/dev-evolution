import "../styles/trilha.css"

function Trilha() {
  return (
    <div className="container-trilha">

      <h1>Mundo 1</h1>
      <h3>Fundamentos da programação</h3>

      <div className="trilha">

        <div className="nivel ativo">1</div>

        <div className="nivel bloqueado">2</div>

        <div className="nivel bloqueado">3</div>

      </div>

    </div>
  )
}

export default Trilha