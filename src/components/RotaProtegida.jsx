import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';

// A proteção agora é inteligente: ela consulta o backend para saber
// se o aluno realmente concluiu o Mundo 1 antes de liberar o Mundo 2.
const RotaProtegida = ({ children }) => {
  const [status, setStatus] = useState('carregando'); // 'carregando' | 'liberado' | 'bloqueado'

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setStatus('bloqueado');
      return;
    }

    fetch(`${API_BASE_URL}/api/alunos/meu-perfil`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Falha ao verificar perfil');
        return res.json();
      })
      .then(data => {
        // Mundo 1 = desafios de ID 1 a 5. O aluno precisa ter concluído todos.
        const idsMundo1 = [1, 2, 3, 4, 5];
        const concluidos = data.desafiosConcluidos ?? [];
        const mundo1Completo = idsMundo1.every(id => concluidos.includes(id));

        setStatus(mundo1Completo ? 'liberado' : 'bloqueado');
      })
      .catch(() => setStatus('bloqueado'));
  }, []);

  if (status === 'carregando') {
    return (
      <div style={{ padding: '50px', color: 'white', textAlign: 'center', fontSize: '18px' }}>
        🔒 Verificando acesso...
      </div>
    );
  }

  if (status === 'bloqueado') {
    return <Navigate to="/aviso-bloqueio" replace />;
  }

  // Acesso liberado — renderiza o componente filho (ex: Mundo2)
  return children;
};

export default RotaProtegida;