import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Importações das Lições
import Licao1 from "./Licao1";
import Licao2 from "./Licao2";
import Licao3 from "./Licao3";
import Licao4 from "./Licao4";
import Licao5 from "./Licao5";

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
    const carregarStatus = async () => {
      const token = localStorage.getItem("token");
      
      // Proteção extra: se não tiver token, joga pro login
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/alunos/meu-perfil", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.status === 401 || res.status === 403) {
            console.warn("Token expirado. Deslogando usuário...");
            localStorage.removeItem("token"); // Apaga a chave velha
            navigate("/login"); // Joga pra fora
            return;
        }

        if (!res.ok) throw new Error("Erro ao buscar perfil");
        
        const user = await res.json();

        // 3. Corrigido: A REGRA DA CURA (Game Design)
        // Só bloqueia se ele estiver com 0 vidas E a lição NÃO for a Lição 1!
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
    
    carregarStatus();
  }, [id, navigate]); // Adicionado as dependências no useEffect

  // Função auxiliar para renderizar a lição correta
  const renderizarLicao = () => {
    if (id === "1") return <Licao1 />;
    if (id === "2") return <Licao2 />;
    if (id === "3") return <Licao3 />;
    if (id === "4") return <Licao4 />;
    if (id === "5") return <Licao5 />;    
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