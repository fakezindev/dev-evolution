import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"

function Licao3() {
  const [codigo, setCodigo] = useState("")
  const [resultado, setResultado] = useState("")
  const navigate = useNavigate()
  const { id } = useParams() // Vai pegar o ID "3" da URL

  const [carregando, setCarregando] = useState(false)
  const [modal, setModal] = useState({
    isOpen: false, tipo: "", titulo: "", mensagem: "", acaoFechar: () => {}
  })

  // 🚫 SEGURANÇA
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login")
  }, [navigate])

  // 📡 COMUNICAÇÃO COM O JAVA (Idêntica, só o ID muda pela URL)
  const enviarProgressoParaBackend = async (sucesso) => {
    setCarregando(true)
    try {
      const response = await fetch("http://localhost:8080/api/progresso/submeter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          desafioId: parseInt(id) || 3, // Vai mandar o ID 3
          sucesso: sucesso
        })
      })

      if (!response.ok) throw new Error("Erro ao registrar o progresso")

      const data = await response.json()
      setCarregando(false)

      if (sucesso) {
        setModal({
          isOpen: true,
          tipo: "sucesso",
          titulo: data.xpGanho ? "✅ Calculadora Perfeita!" : "Revisão Concluída!",
          mensagem: data.xpGanho ? "+50 XP! A matemática está do seu lado." : "Conteúdo revisado com sucesso.",
          acaoFechar: () => navigate("/dashboard")
        })
      } else {
        setModal({
          isOpen: true,
          tipo: "erro",
          titulo: "❌ Cálculo Incorreto",
          mensagem: "Você perdeu 1 Vida. Dica: Use o operador de soma (+) entre as variáveis num1 e num2.",
          acaoFechar: () => setModal({ ...modal, isOpen: false })
        })
      }
    } catch (error) {
      console.error(error)
      setCarregando(false)
      alert("Erro de conexão com o servidor.")
    }
  }

  // 🎯 LÓGICA DA CALCULADORA
  const verificar = async () => {
    // Tira os espaços para o aluno não errar por causa de um espaço a mais
    const codigoLimpo = codigo.replace(/\s+/g, '') 
    
    // O aluno pode acertar somando as variáveis, somando os números diretos ou colocando o resultado (40)
    if (
      codigoLimpo.includes('num1+num2') || 
      codigoLimpo.includes('15+25') ||
      codigoLimpo.includes('40')
    ) {
      setResultado("Calculando...")
      await enviarProgressoParaBackend(true)
    } else {
      setResultado("❌ Tente novamente")
      await enviarProgressoParaBackend(false)
    }
  }

  return (
    <div className="licao-container">
      {carregando && <LoadingSpinner mensagem="Validando cálculo..." />}
      <FeedbackModal {...modal} onClose={modal.acaoFechar} />

      <h1>Missão 3: A Primeira Calculadora</h1>
      <p className="subtitle">
        Variáveis guardam dados! Mostre na tela o resultado da soma de <strong>num1</strong> e <strong>num2</strong>.
      </p>

      <div className="licao-grid">
        {/* ESQUERDA: ONDE ELE DIGITA */}
        <div className="dados-box">
          <h3>SEU CÓDIGO</h3>
          <div className="codigo-base">
            <p><code>let num1 = 15;</code></p>
            <p><code>let num2 = 25;</code></p>
          </div>

          <textarea
            className="editor"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder='Ex: console.log(num1 + num2)'
            style={{ marginTop: '10px' }}
          />

          <button className="btn-finalizar" onClick={verificar}>Executar</button>
          <p className="resultado">{resultado}</p>
        </div>

        {/* DIREITA: OBJETIVO */}
        <div className="gavetas-box">
          <div className="gaveta string">
            <span className="label">Objetivo</span>
            <p style={{ color: "#fff" }}>Seu código deve calcular e exibir:</p>
            <div className="item small" style={{ fontSize: "24px", fontWeight: "bold" }}>
              40
            </div>
            <p style={{ color: "#aaa", fontSize: "12px", marginTop: "15px" }}>
              *Lembre-se do operador matemático correto!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Licao3