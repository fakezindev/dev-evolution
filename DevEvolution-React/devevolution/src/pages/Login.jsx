import "../styles/login.css"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

function Login() {
    const navigate = useNavigate()
    const [nome, setNome] = useState("")
    const [idade, setIdade] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!nome || !idade || !email || !senha) {
      alert("Preencha todos os campos!")
      return
    }
    const usuario = {
      nome,
      idade,
      email,
      senha
    }
  
    localStorage.setItem("usuario", JSON.stringify(usuario))
    
    localStorage.setItem("auth", "true")

    navigate("/dashboard")
  }

  return (

    <form onSubmit={handleSubmit}>

    <div className="login-page">

      <div className="login-card">

        <div className="logo-box">
          <img src="/images/DevEvolution-logo-simple.png" alt="logo" />
        </div>

        <h1>Pronto para evoluir?</h1>

        <p className="subtitle">
          Crie seu perfil e comece sua jornada no código.
        </p>

        <div className="input-group">
          <label>Como devemos te chamar?</label>
          <input type="text" placeholder="Digite seu nome"   value={nome}
        onChange={(e) => setNome(e.target.value)} required/>
        </div>

        <div className="input-group">
          <label>Qual a sua idade?</label>
          <input type="number" placeholder="Ex: 22" value={idade}
        onChange={(e) => setIdade(e.target.value)} required />
        </div>
        
        <div className="input-group">
          <label>Qual é seu e-mail?</label>
          <input type="email" placeholder="Ex: seuemail@gmail.com"  value={email}
        onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Qual é sua senha?</label>
          <input type="password" placeholder="Crie uma senha!" value={senha}
        onChange={(e) => setSenha(e.target.value)} required />
        </div>

        <button className="start-btn" >
           Começar Agora →
        </button>

        <div className="divider"></div>

        <p className="login-link">
          Já tem uma conta? <span onClick={() => navigate("/login")}>Faça Login</span>
        </p>

      </div>

    </div>
    </form>
  )
}

export default Login