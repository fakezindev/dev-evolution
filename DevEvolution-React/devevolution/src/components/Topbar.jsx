import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Topbar() {
  const navigate = useNavigate()
  
  // Começamos com os valores zerados enquanto a API responde
  const [perfil, setPerfil] = useState({
    vidasAtuais: 0,
    xpTotal: 0
  })

  useEffect(() => {
    const carregarPerfil = async () => {
      const token = localStorage.getItem("token")

      // Se por algum motivo não tiver token, nem tenta fazer a requisição
      if (!token) return 

      try {
        const response = await fetch("http://localhost:8080/api/alunos/meu-perfil", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Apresentando o crachá pro Spring Security
          }
        })

        if (!response.ok) {
          throw new Error("Sessão expirada ou token inválido")
        }

        const data = await response.json()
        setPerfil(data) // Sucesso! Atualiza a Topbar com os dados reais

      } catch (error) {
        console.error("Falha ao buscar os dados do perfil:", error)
        // Se deu ruim (ex: token expirou), limpa tudo e chuta pro login
        localStorage.removeItem("token")
        localStorage.removeItem("auth")
        navigate("/login")
      }
    }

    carregarPerfil()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("auth")
    navigate("/login")
  }

  return (
    <div className="top-sidebar">
      <ul>
        {/* Substituí o fogo por coração (Vidas), mas pode voltar pro fogo se preferir! */}
        <li className="frequency" title="Suas vidas atuais">
          ❤️ {perfil.vidasAtuais}
        </li>

        {/* Substituí o diamante por raio (XP), mas pode usar diamante também! */}
        <li className="diamond" title="Seu XP acumulado">
          ⚡ {perfil.xpTotal} XP
        </li>

        <li>
          <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#ff6b81', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Sair
      </button>
        </li>
      </ul>
    </div>
  )
}

export default Topbar