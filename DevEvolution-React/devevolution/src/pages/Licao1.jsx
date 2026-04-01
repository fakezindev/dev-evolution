import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"

function Licao1() {
  const [codigo, setCodigo] = useState("")
  const [resultado, setResultado] = useState("")
  const navigate = useNavigate()
  const { id } = useParams() // Pega o ID da URL

  // ⚙️ NOSSOS ESTADOS DE FEEDBACK (O Motor do Jogo)
  const [carregando, setCarregando] = useState(false)
  const [modal, setModal] = useState({
    isOpen: false,
    tipo: "",
    titulo: "",
    mensagem: "",
    acaoFechar: () => {}
  })

  // 🚫 BLOQUEIO DE ACESSO DE SEGURANÇA
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
    }
  }, [navigate])

  // 📡 COMUNICAÇÃO COM O SPRING BOOT
  const enviarProgressoParaBackend = async (sucesso) => {
    setCarregando(true)
    const token = localStorage.getItem("token")

    try {
      const response = await fetch("http://localhost:8080/api/progresso/submeter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          desafioId: parseInt(id) || 1, // Manda o ID 1 para o Java
          sucesso: sucesso
        })
      })

      if (!response.ok) {
        throw new Error("Erro ao registrar o progresso")
      }

      const data = await response.json()
      setCarregando(false)

      if (sucesso) {
        setModal({
          isOpen: true,
          tipo: "sucesso",
          titulo: data.xpGanho ? "✅ Parabéns! Missão Concluída!" : "Revisão Concluída!",
          mensagem: data.xpGanho ? "+50 XP adicionados! Você está mandando bem." : "Conteúdo revisado com sucesso.",
          acaoFechar: () => navigate("/dashboard")
        })
      } else {
        setModal({
          isOpen: true,
          tipo: "erro",
          titulo: "❌ Código incorreto",
          mensagem: "Você perdeu 1 coração (Vida). Dica: Lembre-se de colocar o texto entre aspas dentro do console.log!",
          acaoFechar: () => setModal({ ...modal, isOpen: false })
        })
      }
    } catch (error) {
      console.error(error)
      setCarregando(false)
      alert("Erro de conexão com o servidor.")
    }
  }

  // 🎯 A LÓGICA DE VERIFICAÇÃO INTEGRADA
  const verificar = async () => {
    // Remove espaços em branco para facilitar a validação e evitar erros por bobeira
    const codigoLimpo = codigo.replace(/\s+/g, '') 
    
    // Valida se ele usou aspas duplas, simples ou se esqueceu as aspas
    if (
      codigoLimpo.includes('console.log("HelloWorld")') || 
      codigoLimpo.includes("console.log('HelloWorld')") ||
      codigoLimpo.includes("console.log(HelloWorld)") 
    ) {
      setResultado("Validando resposta no servidor...")
      await enviarProgressoParaBackend(true)
    } else {
      setResultado("❌ Tente novamente")
      await enviarProgressoParaBackend(false)
    }
  }

  return (
    <div className="licao-container">

      {/* 🔮 NOSSOS MODAIS E SPINNERS INJETADOS AQUI */}
      {carregando && <LoadingSpinner mensagem="Salvando progresso..." />}
      <FeedbackModal 
        isOpen={modal.isOpen} 
        tipo={modal.tipo} 
        titulo={modal.titulo} 
        mensagem={modal.mensagem}
        onClose={modal.acaoFechar} 
      />

      <h1>Missão 1: Hello World</h1>
      <p className="subtitle">
        Escreva um código que exiba <strong>Hello World</strong>
      </p>

      <div className="licao-grid">

        {/* ESQUERDA */}
        <div className="dados-box">
          <h3>SEU CÓDIGO</h3>

          <textarea
            className="editor"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder='Ex: console.log("Hello World")'
          />

          <button className="btn-finalizar" onClick={verificar}>
            Executar
          </button>

          <p className="resultado">{resultado}</p>
        </div>

        {/* DIREITA */}
        <div className="gavetas-box">

          <div className="gaveta string">
            <span className="label">Objetivo</span>

            <p style={{ color: "#fff" }}>
              Seu código deve conter:
            </p>

            <div className="item small">
              Hello World
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Licao1