import "../styles/login.css"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

function LoginUser() {
  const navigate = useNavigate()

  // Mudamos de 'email' para 'username' para bater com o Spring Security
  const [username, setUsername] = useState("") 
  const [senha, setSenha] = useState("")
  const [carregando, setCarregando] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!username || !senha) {
      alert("Preencha todos os campos!")
      return
    }

    setCarregando(true)

    try {
      // Bate na porta do Spring Boot para validar as credenciais
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: senha
        })
      })

      // Se o Spring devolver 403 Forbidden ou outro erro...
      if (!response.ok) {
        throw new Error("Usuário ou senha incorretos!")
      }

      // Se deu 200 OK, abrimos o pacote para pegar o Token
      const data = await response.json()
      const token = data.token // Ajuste se a sua AuthResponse usar outro nome de variável

      // Guarda a chave do castelo no navegador
      localStorage.setItem("token", token)
      localStorage.setItem("auth", "true")

      // Corre pro painel do jogo!
      navigate("/dashboard")

    } catch (error) {
      console.error("Falha no login:", error)
      alert(error.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div className="login-page">
        <div className="login-card">
          <div className="logo-box">
            <img src="/images/DevEvolution-logo-simple.png" alt="logo" />
          </div>

          <h1>Bem-vindo de volta</h1>

          <p className="subtitle">
            Entre na sua conta para continuar evoluindo.
          </p>

          {/* Ajustado para pedir o Nome de Usuário em vez do E-mail */}
          <div className="input-group">
            <label>Seu nome de usuário</label>
            <input
              type="text"
              placeholder="Digite seu username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Sua senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="start-btn" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar →"}
          </button>

          <div className="divider"></div>

          <p className="login-link">
            Ainda não tem conta?{" "}
            <span onClick={() => navigate("/cadastro")} style={{cursor: 'pointer', color: '#007bff'}}>
              Criar conta
            </span>
          </p>

        </div>
      </div>
    </form>
  )
}

export default LoginUser