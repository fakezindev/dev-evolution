import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao1.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"

function Licao1() {
  const navigate = useNavigate()
  const { id } = useParams() // Pega o ID do desafio da URL (ex: /desafio/1)

  // ESTADOS DO JOGO
  const [itens, setItens] = useState([
    { id: 1, valor: "false", tipo: "boolean" },
    { id: 2, valor: '"Maçã"', tipo: "string" },
    { id: 3, valor: "42", tipo: "number" },
    { id: 4, valor: "true", type: "boolean" }, // Corrigido para "tipo" abaixo se precisar, mas vamos manter o seu padrão
    { id: 5, valor: "100", tipo: "number" },
  ])

  const [gavetas, setGavetas] = useState({
    string: [],
    number: [],
    boolean: []
  })

  const [dragItem, setDragItem] = useState(null)
  const [erroVisual, setErroVisual] = useState(false)

  // ESTADOS DE FEEDBACK (O que estava faltando!)
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

  // 🎯 DRAG START (Pega o item)
  const handleDragStart = (item) => {
    // Corrige inconsistência na sua lista (o id 4 estava com 'type' em vez de 'tipo')
    const itemCorrigido = { ...item, tipo: item.tipo || item.type }
    setDragItem(itemCorrigido)
  }

  // 🎯 DROP (Solta o item)
  const handleDrop = async (tipoGaveta) => {
    if (!dragItem) return

    // ACERTOU A GAVETA!
    if (dragItem.tipo === tipoGaveta) {
      setGavetas(prev => ({
        ...prev,
        [tipoGaveta]: [...prev[tipoGaveta], dragItem]
      }))
      setItens(prev => prev.filter(i => i.id !== dragItem.id))
      setDragItem(null)

    } else {
      // ERROU A GAVETA! (Hora de perder uma vida no Backend)
      setErroVisual(true)
      setTimeout(() => setErroVisual(false), 400)
      setDragItem(null)
      
      await enviarProgressoParaBackend(false) // successo: false
    }
  }

  // ✅ FINALIZAR (Botão aparece quando itens acabam)
  const finalizarLicao = async () => {
    await enviarProgressoParaBackend(true) // successo: true
  }

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
          desafioId: parseInt(id), // ID pego da URL
          sucesso: sucesso
        })
      })

      if (!response.ok) {
        throw new Error("Erro ao registrar o progresso")
      }

      setCarregando(false)

      // Configura o Modal dependendo se ele acertou a lição ou errou a gaveta
      if (sucesso) {
        setModal({
          isOpen: true,
          tipo: "sucesso",
          titulo: "Resposta Correta!",
          mensagem: "+50 XP! Você está mandando bem, continue assim.",
          acaoFechar: () => navigate("/dashboard") // Volta pro mapa quando fechar
        })
      } else {
        setModal({
          isOpen: true,
          tipo: "erro",
          titulo: "Ops, gaveta errada!",
          mensagem: "Você perdeu 1 coração (Vida). Preste mais atenção nos tipos!",
          acaoFechar: () => setModal({ ...modal, isOpen: false }) // Só fecha e deixa ele tentar de novo
        })
      }

    } catch (error) {
      console.error(error)
      setCarregando(false)
      alert("Erro de conexão com o servidor.")
    }
  }

  // O RETORNO DO JSX (Os modais devem ficar AQUI DENTRO)
  return (
    <div className="licao-container">
      
      {/* Nossos componentes visuais de cima */}
      {carregando && <LoadingSpinner mensagem="Salvando progresso..." />}
      
      <FeedbackModal 
        isOpen={modal.isOpen} 
        tipo={modal.tipo} 
        titulo={modal.titulo} 
        mensagem={modal.mensagem}
        onClose={modal.acaoFechar} 
      />

      <h1>Organize a Bagunça!</h1>
      <p className="subtitle">
        Arraste os dados espalhados para as gavetas corretas antes de começarmos a programar.
      </p>

      <div className="licao-grid">

        {/* ESQUERDA (Itens soltos) */}
        <div className="dados-box">
          <h3>DADOS SOLTOS</h3>
          <div className="dados-area">
            {itens.map(item => (
              <div
                key={item.id}
                className="item"
                draggable
                onDragStart={() => handleDragStart(item)}
              >
                {item.valor}
              </div>
            ))}
          </div>
        </div>

        {/* DIREITA (Gavetas) */}
        <div className="gavetas-box">

          {/* STRING */}
          <div
            className={`gaveta string ${erroVisual ? "erro" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop("string")}
          >
            <span className="label">Texto (String)</span>
            {gavetas.string.map(i => (
              <div key={i.id} className="item small">{i.valor}</div>
            ))}
          </div>

          {/* NUMBER */}
          <div
            className={`gaveta number ${erroVisual ? "erro" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop("number")}
          >
            <span className="label">Número (Number)</span>
            {gavetas.number.map(i => (
              <div key={i.id} className="item small">{i.valor}</div>
            ))}
          </div>

          {/* BOOLEAN */}
          <div
            className={`gaveta boolean ${erroVisual ? "erro" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop("boolean")}
          >
            <span className="label">Verdadeiro/Falso (Boolean)</span>
            {gavetas.boolean.map(i => (
              <div key={i.id} className="item small">{i.valor}</div>
            ))}
          </div>

        </div>

      </div>

      {/* BOTÃO FINAL (Só aparece quando organiza tudo) */}
      {itens.length === 0 && (
        <button className="btn-finalizar" onClick={finalizarLicao}>
          Finalizar Desafio
        </button>
      )}

    </div>
  )
}

export default Licao1