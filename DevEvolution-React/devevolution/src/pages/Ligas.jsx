import "../styles/ligas.css"

function Ligas() {

  const ranking = [
    { nome: "Murilo", xp: 2400 },
    { nome: "Vitor", xp: 2100 },
    { nome: "Ana", xp: 1900 },
    { nome: "Carlos", xp: 1700 },
    { nome: "Julia", xp: 1500 },
  ]

  return (
    <div className="ligas-container">

      <h1 className="liga-title">Liga </h1>
      <h3 className="liga-subtitle">Ranking semanal</h3>

      <div className="liga-board">

        {ranking.map((user, index) => (
          <div key={index} className="liga-card">

            <div className="liga-position">
              #{index + 1}
            </div>

            <div className="liga-user">

              <img
                src="https://i.pravatar.cc/60"
                alt="avatar"
                className="liga-avatar"
              />

              <div className="liga-info">
                <h3>{user.nome}</h3>
                <p>{user.xp} XP</p>
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}

export default Ligas