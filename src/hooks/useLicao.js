import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../api/config"

/**
 * Hook reutilizável para todas as lições (Licao1 a Licao9).
 * Centraliza: estados, envio de progresso, lógica de modal e navegação.
 *
 * @param {number} licaoId  - ID do desafio (1–9)
 * @param {object} [opcoes] - Opções extras:
 *   - isBoss (boolean): Se true, exibe modal especial de conclusão de Mundo
 *   - titulosBoss (object): { titulo, mensagem, botoesExtras[] }
 */
export function useLicao(licaoId, opcoes = {}) {
  const navigate = useNavigate()

  const [carregando, setCarregando] = useState(false)
  const [concluido, setConcluido]   = useState(false)
  const [modal, setModal]           = useState({
    isOpen: false, tipo: "", titulo: "", mensagem: "", botoes: [], acaoFechar: () => {}
  })

  const fecharModal = () => setModal(prev => ({ ...prev, isOpen: false }))

  const enviarProgresso = async (sucesso) => {
    // Evita múltiplas requisições simultâneas
    if (carregando) return
    setCarregando(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/progresso/submeter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ desafioId: licaoId, sucesso })
      })

      if (!response.ok) throw new Error("Erro ao registrar o progresso")

      const data = await response.json()
      window.dispatchEvent(new Event("atualizarPerfil"))

      if (sucesso) {
        if (opcoes.isBoss) {
          // Modal especial de Chefão/Conclusão de Mundo
          const { titulo, mensagem, botoesExtras = [] } = opcoes.titulosBoss ?? {}
          setModal({
            isOpen: true,
            tipo: "boss",
            titulo: titulo ?? "🏆 FASE CONCLUÍDA!",
            mensagem: mensagem ?? data.mensagem,
            botoes: botoesExtras,
            acaoFechar: () => { fecharModal(); setConcluido(true) }
          })
        } else {
          setModal({
            isOpen: true,
            tipo: "sucesso",
            titulo: data.mensagem?.includes("Revisão") ? "💖 Revisão Concluída!" : "✅ Missão Concluída!",
            mensagem: data.mensagem,
            botoes: [],
            acaoFechar: () => { fecharModal(); setConcluido(true) }
          })
        }
      } else {
        const vidasRestantes = data.vidasAtuais ?? data.vidas ?? 1

        if (vidasRestantes <= 0) {
          setModal({
            isOpen: true,
            tipo: "erro",
            titulo: "Game Over! 💔",
            mensagem: "Suas vidas acabaram! Refaça a Lição 1 para recuperar sua energia.",
            botoes: [],
            acaoFechar: () => navigate("/dashboard")
          })
        } else {
          setModal({
            isOpen: true,
            tipo: "erro",
            titulo: "❌ Código Incorreto",
            mensagem: data.mensagem,
            botoes: [],
            acaoFechar: fecharModal
          })
        }
      }
    } catch (error) {
      console.error(error)
      alert("Erro de conexão com o servidor. Verifique se o banco de dados está rodando!")
    } finally {
      setCarregando(false)
    }
  }

  const irParaProxima = () => {
    if (licaoId >= 9) navigate("/dashboard")
    else navigate(`/licao/${licaoId + 1}`)
  }

  return { carregando, concluido, setConcluido, modal, enviarProgresso, fecharModal, irParaProxima }
}
