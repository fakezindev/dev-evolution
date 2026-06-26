import { Navigate } from 'react-router-dom';

const RotaProtegida = ({ children, mundo1Concluido }) => {
  // Se o aluno não terminou o Mundo 1, ele é redirecionado para a tela de bloqueio
  if (!mundo1Concluido) {
    return <Navigate to="/aviso-bloqueio" replace />;
  }

  // Se ele terminou, a catraca é liberada e o componente filho (Mundo 2) é renderizado
  return children;
};

export default RotaProtegida;