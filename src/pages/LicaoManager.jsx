import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/config";

// Importações das Lições
import Licao1 from "./Licao1";
import Licao2 from "./Licao2";
import Licao3 from "./Licao3";
import Licao4 from "./Licao4";
import Licao5 from "./Licao5";
import Licao6 from "./Licao6";
import Licao7 from "./Licao7";
import Licao8 from "./Licao8";
import Licao9 from "./Licao9";

// Não esqueça de importar o seu componente de Modal!
import FeedbackModal from "../components/FeedbackModal";

function LicaoManager() {
  const { id } = useParams();
  const navigate = useNavigate(); // 1. Corrigido: Instância do navigate

  // 2. Corrigido: Estado do modal criado
  const [modal, setModal] = useState({
    isOpen: false, tipo: "", titulo: "", mensagem: "", acaoFechar: () => {}
  });

  useEffect(() => {
    const verificarVidas = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API_BASE_URL}/api/alunos/meu-perfil`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) return; // Se der erro, deixa o PrivateRoute tratar

        const user = await res.json();

        // Bloqueia se 0 vidas, EXCETO na Lição 1 (que é o mecanismo de recuperação)
        if (user.vidasAtuais <= 0 && id !== "1") {
             setModal({
                isOpen: true,
                tipo: "erro",
                titulo: "Energia Esgotada! 💔",
                mensagem: "Você está com 0 vidas! Volte e refaça a Lição 1 (Hello World) para recuperar sua energia.",
                acaoFechar: () => navigate("/dashboard")
             });
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    verificarVidas();
  }, [id, navigate]);

  // Função auxiliar para renderizar a lição correta
  const renderizarLicao = () => {
    if (id === "1") return <Licao1 />;
    if (id === "2") return <Licao2 />;
    if (id === "3") return <Licao3 />;
    if (id === "4") return <Licao4 />;
    if (id === "5") return <Licao5 />;    
    if (id === "6") return <Licao6 />;
    if (id === "7") return <Licao7 />;
    if (id === "8") return <Licao8 />;
    if (id === "9") return <Licao9 />;
    return <div style={{padding: "50px", color: "white"}}>Fase não encontrada ou em construção.</div>;
  };

  return (
    <>
      {/* O Modal precisa existir no HTML para poder aparecer na tela */}
      <FeedbackModal {...modal} onClose={modal.acaoFechar} />
      
      {/* Aqui ele renderiza a lição escolhida */}
      {renderizarLicao()}
    </>
  );
}

export default LicaoManager;