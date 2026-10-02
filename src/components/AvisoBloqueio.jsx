import { useNavigate } from 'react-router-dom';

const AvisoBloqueio = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 10%, #172448 0%, #0b1329 70%, #060a17 100%)',
      padding: '24px',
      fontFamily: "'Segoe UI', system-ui, sans-serif"
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: 'rgba(19, 31, 58, 0.88)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '24px',
        padding: '40px 32px',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0,0,0,0.6)'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
        <h2 style={{ color: '#f87171', fontWeight: 800, fontSize: '24px', margin: '0 0 12px 0' }}>
          Acesso Bloqueado!
        </h2>
        <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '8px' }}>
          Você ainda não concluiu todos os desafios do <strong style={{ color: '#f1f5f9' }}>Mundo 1</strong>.
          Complete todas as 5 lições para desbloquear o Mundo 2!
        </p>
        <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '28px' }}>
          Você consegue! 🚀
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
            border: 'none',
            borderRadius: '14px',
            color: '#fff',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(168,85,247,0.4)'
          }}
        >
          🗺️ Voltar ao Mapa
        </button>
      </div>
    </div>
  );
};

export default AvisoBloqueio;