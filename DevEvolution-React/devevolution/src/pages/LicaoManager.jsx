import { useParams } from "react-router-dom";
import Licao1 from "./Licao1";
import Licao2 from "./Licao2";

function LicaoManager() {
  const { id } = useParams();

  if (id === "1") return <Licao1 />;
  if (id === "2") return <Licao2 />;

  return <div style={{padding: "50px", color: "white"}}>Fase não encontrada ou em construção.</div>;
}

export default LicaoManager;