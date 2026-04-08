import { useParams } from "react-router-dom";
import Licao1 from "./Licao1";
import Licao2 from "./Licao2";
import Licao3 from "./Licao3";

import { useEffect } from "react";

function LicaoManager() {
  const { id } = useParams();

  useEffect(() => {
    const carregarStatus = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/alunos/meu-perfil", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const user = await res.json();

        // Se o aluno está com 0 vidas, precisamos checar se essa lição é nova para ele
        // (Aqui você pode usar o seu estado de progresso que já criamos no Dashboard)
        if (user.vidasAtuais === 0) {
             setModal({
                isOpen: true,
                tipo: "erro",
                titulo: "Você está sem Vidas!",
                mensagem: "Sua energia acabou. Volte para uma lição anterior e complete-a com sucesso para recuperar 1 coração.",
                acaoFechar: () => navigate("/dashboard")
             });
        }
    };
    carregarStatus();
  }, []);

  if (id === "1") return <Licao1 />;
  if (id === "2") return <Licao2 />;
  if (id === "3") return <Licao3 />;

  return <div style={{padding: "50px", color: "white"}}>Fase não encontrada ou em construção.</div>;
}

export default LicaoManager;