import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/trilha.css";

function Trilha() {
  const navigate = useNavigate();
  const [trilhas, setTrilhas] = useState([]);
  const [desafiosConcluidos, setDesafiosConcluidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDadosDoBanco = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // 1. Busca as Trilhas/Mundos do seu Spring Boot
        const resTrilhas = await fetch("http://localhost:8080/api/trilhas");
        const dataTrilhas = await resTrilhas.json();

        // 2. Busca o Perfil para saber o que o Bruno já completou
        const resPerfil = await fetch("http://localhost:8080/api/alunos/meu-perfil", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const dataPerfil = await resPerfil.json();

        setTrilhas(dataTrilhas);
        setDesafiosConcluidos(dataPerfil.desafiosConcluidos || []);
      } catch (error) {
        console.error("Erro ao sincronizar com o servidor:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosDoBanco();
  }, [navigate]);

  // Lógica para descobrir qual é o próximo desafio (estrela)
  const todosDesafiosIds = trilhas.flatMap(t => t.mundos.flatMap(m => m.desafios.map(d => d.id)));
  const idProximoDesafio = todosDesafiosIds.find(id => !desafiosConcluidos.includes(id));

  const handleClick = (desafio, status) => {
    if (status === "bloqueado") return;
    // Navega para a rota que o LicaoManager vai tratar
    navigate(`/licao/${desafio.id}`);
  };

  if (carregando) return <p>Carregando trilha...</p>;

  return (
    <div className="trilha-container">
      {trilhas.map((trilha) => (
        <div key={trilha.id}>
          {/* Mantendo o seu H1 e Subtitle original */}
          <h1>{trilha.nome}</h1>
          
          {trilha.mundos.map((mundo) => (
            <div key={mundo.id}>
              <p className="subtitle">{mundo.nome}</p>

              <div className="trilha-vertical">
                <div className="linha"></div>

                {mundo.desafios.map((desafio, index) => {
                  const isConcluido = desafiosConcluidos.includes(desafio.id);
                  const isAtual = desafio.id === idProximoDesafio;
                  
                  // Define o status exatamente como você tinha antes
                  let status = "bloqueado";
                  if (isConcluido) status = "feito";
                  else if (isAtual || (desafiosConcluidos.length === 0 && index === 0)) status = "ativo";

                  return (
                    <div
                      key={desafio.id}
                      // Mantendo suas classes left/right e status
                      className={`nivel ${status} ${index % 2 === 0 ? "left" : "right"}`}
                      onClick={() => handleClick(desafio, status)}
                    >
                      {/* Voltando para os seus Emojis originais */}
                      <div className="circulo">
                        {status === "feito" && "✅"}
                        {status === "ativo" && "⭐"}
                        {status === "bloqueado" && "🔒"}
                      </div>

                      <span>{desafio.titulo || desafio.nome}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Trilha;