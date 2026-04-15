import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/licao.css"
import LoadingSpinner from "../components/LoadingSpinner"
import FeedbackModal from "../components/FeedbackModal"

function Licao2() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [itens, setItens] = useState([
    { id: 1, valor: '"DevHero"', tipo: "string" },
    { id: 2, valor: '"Maçã"', tipo: "string" },
    { id: 3, valor: "100", tipo: "number" },
    { id: 4, valor: "true", tipo: "boolean" },
    { id: 5, valor: "42", tipo: "number" },
    { id: 6, valor: "false", tipo: "boolean" },
  ])

  const [gavetas, setGavetas] = useState({
    string: [],
    number: [],
    boolean: []
  })

  const [dragItem, setDragItem] = useState(null)
  const [erroVisual, setErroVisual] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [modal, setModal] = useState({
    isOpen: false, tipo: "", titulo: "", mensagem: "", acaoFechar: () => {}
  })

  // ✅ 1. useEffect Limpo! O LicaoManager já cuida das vidas pra gente.
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleDragStart = (item) => {
    setDragItem(item)
  }

  const handleDrop = async (tipoGaveta) => {
    if (!dragItem) return

    if (dragItem.tipo === tipoGaveta) {
      setGavetas(prev => ({
        ...prev,
        [tipoGaveta]: [...prev[tipoGaveta], dragItem]
      }))
      setItens(prev => prev.filter(i => i.id !== dragItem.id))
      setDragItem(null)
    } else {
      setErroVisual(true)
      setTimeout(() => setErroVisual(false), 400)
      setDragItem(null)
      // O aluno arrastou pra gaveta errada? Toma dano na hora!
      await enviarProgressoParaBackend(false) 
    }
  }

  const finalizarLicao = async () => {
    // Terminou de arrastar tudo certinho? Vitória!
    await enviarProgressoParaBackend(true)
  }

  // ✅ 2. A Função Universal Definitiva
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
          desafioId: parseInt(id) || 2, // Garantindo que é a Lição 2
          sucesso: sucesso
        })
      })

      if (!response.ok) throw new Error("Erro ao registrar o progresso")

      const data = await response.json()

      window.dispatchEvent(new Event('atualizarPerfil'))
      setCarregando(false)

      if (sucesso) {
        setModal({
          isOpen: true,
          tipo: "sucesso",
          titulo: data.mensagem.includes("Revisão") ? "💖 Revisão Concluída!" : "✅ Missão Concluída!",
          mensagem: data.mensagem, 
          acaoFechar: () => navigate("/dashboard")
        })
      } else {
        const vidasRestantes = data.vidasAtuais !== undefined ? data.vidasAtuais : data.vidas;

        if (vidasRestantes <= 0) {
            setModal({
                isOpen: true,
                tipo: "erro",
                titulo: "Game Over! 💔",
                mensagem: "Suas vidas acabaram! Refaça a Lição 1 para recuperar sua energia.",
                acaoFechar: () => navigate("/dashboard")
            });
        } else {
            setModal({
              isOpen: true,
              tipo: "erro",
              titulo: "❌ Gaveta Errada!",
              mensagem: data.mensagem, // Traz o texto direto do Java
              acaoFechar: () => setModal({ ...modal, isOpen: false })
            })
        }
      }

    } catch (error) {
      console.error(error)
      setCarregando(false)
      alert("Erro de conexão com o servidor. Verifique se o banco de dados está rodando!")
    }
  }

  return (
    // ... O seu return (JSX visual) continua exatamente igual, está perfeito!
    <div className="licao-container compact-mode">
      {carregando && <LoadingSpinner mensagem="Salvando progresso..." />}
      <FeedbackModal {...modal} onClose={modal.acaoFechar} />

      <div className="licao-header-center">
        <h1>Organize a Bagunça!</h1>
        <p className="subtitle">
          Arraste os dados espalhados para as gavetas corretas antes de começarmos a programar.
        </p>
      </div>

      <div className="dnd-grid">
        
        {/* ESQUERDA: DADOS SOLTOS */}
        <div className="dnd-col">
          <h4 className="dnd-title">DADOS SOLTOS</h4>
          <div className="dados-soltos-box">
            {itens.map(item => (
              <div
                key={item.id}
                className="dnd-item"
                draggable
                onDragStart={() => handleDragStart(item)}
              >
                <i className="fa-solid fa-grip-vertical"></i>
                {item.valor}
              </div>
            ))}
          </div>
        </div>

        {/* DIREITA: GAVETAS */}
        <div className="dnd-col gavetas-area">
          <h4 className="dnd-title">GAVETAS (VARIÁVEIS)</h4>

          {/* STRING */}
          <div
            className={`gaveta gaveta-string ${erroVisual ? "erro" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop("string")}
          >
            <span className="gaveta-label">Texto (String)</span>
            {gavetas.string.length === 0 && <span className="gaveta-placeholder">Arraste itens para cá</span>}
            {gavetas.string.map(i => (
              <div key={i.id} className="dnd-item small"><i className="fa-solid fa-grip-vertical"></i> {i.valor}</div>
            ))}
          </div>

          {/* NUMBER */}
          <div
            className={`gaveta gaveta-number ${erroVisual ? "erro" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop("number")}
          >
            <span className="gaveta-label">Número (Number)</span>
            {gavetas.number.length === 0 && <span className="gaveta-placeholder">Arraste itens para cá</span>}
            {gavetas.number.map(i => (
              <div key={i.id} className="dnd-item small"><i className="fa-solid fa-grip-vertical"></i> {i.valor}</div>
            ))}
          </div>

          {/* BOOLEAN */}
          <div
            className={`gaveta gaveta-boolean ${erroVisual ? "erro" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop("boolean")}
          >
            <span className="gaveta-label">Verdadeiro/Falso (Boolean)</span>
            {gavetas.boolean.length === 0 && <span className="gaveta-placeholder">Arraste itens para cá</span>}
            {gavetas.boolean.map(i => (
              <div key={i.id} className="dnd-item small"><i className="fa-solid fa-grip-vertical"></i> {i.valor}</div>
            ))}
          </div>

        </div>
      </div>

      {itens.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button className="btn-ide-executar" onClick={finalizarLicao} style={{ display: "inline-flex" }}>
            <i className="fa-solid fa-check"></i> FINALIZAR DESAFIO
          </button>
        </div>
      )}

    </div>
  )
}

export default Licao2