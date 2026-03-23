import "../styles/login.css"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

function LoginUser() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()

    const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"))

    if (!usuarioSalvo) {
      alert("Nenhum usuário cadastrado")
      return
    }

    if (email === usuarioSalvo.email && senha === usuarioSalvo.senha) {
      localStorage.setItem("auth", "true")
      navigate("/dashboard")
    } else {
      alert("Email ou senha incorretos")
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

          <div className="input-group">
            <label>Seu e-mail</label>
            <input
              type="email"
              placeholder="Ex: seuemail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <button type="submit" className="start-btn">
            Entrar →
          </button>

          <div className="divider"></div>

          <p className="login-link">
            Ainda não tem conta? 
            <span onClick={() => navigate("/cadastro")}> Criar conta</span>
          </p>

        </div>

      </div>

    </form>
  )
}

export default LoginUser