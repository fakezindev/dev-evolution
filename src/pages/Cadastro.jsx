import "../styles/login.css"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

function Cadastro() {
  const navigate = useNavigate()
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!nome || !email || !senha) {
      alert("Preencha todos os campos!")
      return
    }

    setCarregando(true)

    try {
      // 1. Requisição ÚNICA de Cadastro (agora só com os 3 campos)
      const registerResponse = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: nome,
          password: senha,
          email: email
        })
      })

      if (!registerResponse.ok) {
        throw new Error("Erro ao criar conta. O nome de usuário já pode estar em uso.")
      }

      // 2. Login automático
      const loginResponse = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: nome,
          password: senha
        })
      })

      if (!loginResponse.ok) {
        throw new Error("Erro ao tentar fazer login automático.")
      }

      const loginData = await loginResponse.json()
      const token = loginData.token 

      // 3. Salva o acesso
      localStorage.setItem("token", token)
      localStorage.setItem("auth", "true")

      navigate("/dashboard")

    } catch (error) {
      console.error("Falha no cadastro:", error)
      alert(error.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="login-page">
        <div className="login-card">
          <div className="logo-box">
            <img src="/images/DevEvolution-logo-simple.png" alt="logo" />
          </div>

          <h1>Pronto para evoluir?</h1>
          <p className="subtitle">Crie seu perfil e comece sua jornada no código.</p>

          <div className="input-group">
            <label>Como devemos te chamar?</label>
            <input type="text" placeholder="Digite seu username" value={nome}
              onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Qual é seu e-mail?</label>
            <input type="email" placeholder="Ex: seuemail@gmail.com" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Qual é sua senha?</label>
            <input type="password" placeholder="Crie uma senha!" value={senha}
              onChange={(e) => setSenha(e.target.value)} required />
          </div>

          <button className="start-btn" type="submit" disabled={carregando}>
            {carregando ? "Criando perfil..." : "Começar Agora →"}
          </button>

          <div className="divider"></div>

          <p className="login-link">
            Já tem uma conta? <span onClick={() => navigate("/login")} style={{cursor: 'pointer', color: '#007bff'}}>Faça Login</span>
          </p>

        </div>
      </div>
    </form>
  )
}

export default Cadastro