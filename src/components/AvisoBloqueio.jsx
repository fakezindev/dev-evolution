import { Link } from 'react-router-dom';

const AvisoBloqueio = () => {
  return (
    <div className="container-bloqueio">
      <h2>Ops! Acesso Bloqueado 🚧</h2>
      <p>
        Parece que você ainda não tem as chaves de acesso para explorar a Floresta dos Loops ou a Fábrica de Engrenagens do Mundo 2!
      </p>
      <p>
        Continue sua jornada e conclua todos os desafios do Mundo 1 para desbloquear essa nova aventura. Você consegue! 🚀
      </p>
      <Link to="/mundo1">
        <button className="btn-voltar">Voltar aos Desafios do Mundo 1</button>
      </Link>
    </div>
  );
};

export default AvisoBloqueio;