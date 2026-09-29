import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, Lightbulb, Terminal, MonitorPlay, CheckCircle2 } from 'lucide-react';

// IDs das lições do Mundo 2 conforme definidos no banco/LicaoManager
const LICOES_MUNDO2 = [
  { id: 6, titulo: 'Avaliador de Notas', descricao: 'Aprenda a usar if/else para tomar decisões', tipo: 'practice' },
  { id: 7, titulo: 'Radar de Velocidade', descricao: 'Condicionais encadeadas e múltiplos caminhos', tipo: 'practice' },
  { id: 8, titulo: 'Contagem Regressiva', descricao: 'Repetição com while — a lógica do loop', tipo: 'practice' },
  { id: 9, titulo: 'Tabuada Dinâmica', descricao: 'Laços for e automação de tarefas repetitivas', tipo: 'challenge' },
];

// Hub / Mapa do Mundo 2
function Mundo2() {
  const navigate = useNavigate();
  const [xpTotal, setXpTotal] = useState(0);
  const [desafiosConcluidos, setDesafiosConcluidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    fetch('http://localhost:8080/api/alunos/meu-perfil', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setXpTotal(data.xpTotal ?? 0);
        setDesafiosConcluidos(data.desafiosConcluidos ?? []);
      })
      .catch(err => console.error(err))
      .finally(() => setCarregando(false));
  }, [navigate]);

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: '#2a2a35', border: '1px solid #3e3e4e', color: '#94a3b8',
            borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '26px' }}>🌿 Mundo 2</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Estruturas de Decisão (if/else) e Laços</p>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        borderRadius: '12px', padding: '16px 20px', marginBottom: '30px',
        border: '1px solid #4338ca', color: '#a5b4fc', fontSize: '14px'
      }}>
        <Lightbulb size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        Aqui o computador aprende a <strong>tomar decisões</strong>. Prepare-se para o poder do <strong>if/else</strong> e dos loops!
      </div>

      {/* Grid de lições */}
      {carregando ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>Carregando missões...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {LICOES_MUNDO2.map((licao, index) => {
            const concluida = desafiosConcluidos.includes(licao.id);
            // A primeira lição do mundo 2 (id=6) sempre está disponível ao entrar aqui
            // As subsequentes desbloqueiam em cascata
            const anterior = index === 0 ? true : desafiosConcluidos.includes(LICOES_MUNDO2[index - 1].id);
            const disponivel = anterior;

            return (
              <div
                key={licao.id}
                onClick={() => disponivel && navigate(`/licao/${licao.id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  background: disponivel ? '#1e2030' : '#131221',
                  border: `1px solid ${concluida ? '#22c55e' : disponivel ? '#3e3e4e' : '#1f1f28'}`,
                  borderRadius: '12px', padding: '16px 20px',
                  cursor: disponivel ? 'pointer' : 'not-allowed',
                  opacity: disponivel ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { if (disponivel) e.currentTarget.style.borderColor = concluida ? '#4ade80' : '#6366f1'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = concluida ? '#22c55e' : disponivel ? '#3e3e4e' : '#1f1f28'; }}
              >
                {/* Ícone de status */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                  background: concluida ? '#166534' : disponivel ? '#312e81' : '#1f1f28',
                  border: `2px solid ${concluida ? '#22c55e' : disponivel ? '#6366f1' : '#2d3748'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: concluida ? '#4ade80' : disponivel ? '#818cf8' : '#4b5563',
                  fontSize: '18px'
                }}>
                  {concluida ? <CheckCircle2 size={22} /> : disponivel ? <Play size={18} fill="currentColor" /> : '🔒'}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: disponivel ? '#e2e8f0' : '#4b5563', fontSize: '15px' }}>
                    Lição {licao.id}: {licao.titulo}
                  </p>
                  <p style={{ margin: '3px 0 0', color: '#64748b', fontSize: '13px' }}>
                    {licao.descricao}
                  </p>
                </div>

                {/* Badge */}
                {concluida && (
                  <span style={{
                    background: '#14532d', color: '#4ade80', padding: '4px 10px',
                    borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', flexShrink: 0
                  }}>
                    ✓ Concluída
                  </span>
                )}
                {!concluida && disponivel && (
                  <span style={{
                    background: '#1e1b4b', color: '#818cf8', padding: '4px 10px',
                    borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', flexShrink: 0
                  }}>
                    Jogar →
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Template reutilizável para criar novas lições do Mundo 2
// (use como base ao criar Licao10, Licao11, etc.)
export const MinhaNovaLicao = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(
    `// Instrução inicial para o aluno\nlet numero = 5;\n\n// Complete o código aqui...\nconsole.log(numero);\n`
  );
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const textAreaRef = useRef(null);
  // Para modo admin (desbloquear sem resolver), defina como true localmente:
  const adminMode = false;

  useEffect(() => { textAreaRef.current?.focus(); }, []);

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowError(false);
    setLogs([]);

    const capturedLogs = [];
    const mockConsoleLog = (...args) => {
      capturedLogs.push({ type: 'log', text: args.join(' ') });
    };

    try {
      const runner = new Function('console', code);
      runner({ log: mockConsoleLog });
      setLogs([...capturedLogs]);

      const allText = capturedLogs.map(l => l.text).join(' ');
      const codeStr = code.toLowerCase();

      // ======= SUA VALIDAÇÃO AQUI =======
      if (!codeStr.includes('if')) {
        setErrorMessage('⚠️ Você precisa usar if no seu código!');
        setShowError(true);
        setTimeout(() => setShowError(false), 4000);
      } else if (allText.includes('resultado_esperado')) {
        setTimeout(() => setShowSuccess(true), 800);
      } else {
        setErrorMessage('⚠️ O resultado não está certo ainda. Tente novamente!');
        setShowError(true);
        setTimeout(() => setShowError(false), 4000);
      }
      // ==================================

    } catch (e) {
      capturedLogs.push({ type: 'error', text: e.toString() });
      setLogs([...capturedLogs]);
      setErrorMessage('⚠️ Erro de sintaxe no código. Verifique e tente novamente.');
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    }

    setIsRunning(false);
  };

  const handleNext = () => {
    navigate('/mundo2');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#020818', fontFamily: 'monospace' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #1e293b', background: '#0f172a' }}>
        <button
          onClick={() => navigate('/mundo2')}
          style={{ background: '#1e293b', border: 'none', color: '#94a3b8', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex' }}
        >
          <ChevronLeft size={24} />
        </button>
        <div style={{ flex: 1, padding: '0 32px' }}>
          <div style={{ background: '#1e293b', height: '16px', borderRadius: '999px', overflow: 'hidden', border: '1px solid #334155', maxWidth: '400px', margin: '0 auto' }} />
        </div>
        <div style={{ width: '40px' }} />
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Toast de erro */}
        {showError && (
          <div style={{
            position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(127,29,29,0.95)', border: '1px solid #ef4444', color: 'white',
            padding: '16px 24px', borderRadius: '16px', zIndex: 50, maxWidth: '480px',
            width: '90%', backdropFilter: 'blur(8px)', fontWeight: '500', textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            {errorMessage}
          </div>
        )}

        {/* Painel Esquerdo: Teoria */}
        <div style={{ flex: 1, borderRight: '1px solid #1e293b', background: 'rgba(15,23,42,0.5)', overflowY: 'auto' }}>
          <div style={{ padding: '32px', paddingBottom: '128px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px',
              borderRadius: '999px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)',
              color: '#c084fc', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '24px'
            }}>
              <Lightbulb size={16} /> Mundo 2 • Lição X
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#f1f5f9', marginBottom: '24px', lineHeight: 1.2, fontFamily: 'sans-serif' }}>
              Título da Lição: <span style={{ color: '#c084fc' }}>Tema</span>
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'rgba(30,41,59,0.6)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(51,65,85,0.5)' }}>
                <h3 style={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'sans-serif' }}>
                  <span style={{ fontSize: '24px' }}>🎯</span> O Conceito
                </h3>
                <p style={{ color: '#94a3b8', fontWeight: '500', fontFamily: 'sans-serif' }}>
                  Explicação em linguagem simples e com analogia do mundo real.
                </p>
              </div>

              <div style={{ background: 'rgba(88,28,135,0.1)', border: '1px solid rgba(88,28,135,0.3)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ color: '#d8b4fe', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'sans-serif' }}>
                  A Ferramenta
                </h3>
                <p style={{ color: '#cbd5e1', fontWeight: '500', lineHeight: 1.6, fontFamily: 'sans-serif' }}>
                  Mostre a sintaxe do conceito que o aluno vai usar.
                </p>
                <pre style={{ background: '#020817', color: '#d8b4fe', padding: '16px', borderRadius: '12px', marginTop: '16px', fontSize: '14px' }}>
                  {`// Exemplo de código\nlet x = 10 % 3;\n// resultado: 1`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Painel Direito: Editor + Console */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#020817', position: 'relative', width: '100%' }}>
          {/* Barra do editor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
            <Terminal size={20} style={{ color: '#475569' }} />
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, fontFamily: 'sans-serif' }}>
              Editor de Código
            </h2>
            <button
              onClick={handleRun}
              disabled={isRunning || showSuccess}
              style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 24px', borderRadius: '999px', fontWeight: 'bold',
                border: 'none', cursor: isRunning || showSuccess ? 'not-allowed' : 'pointer',
                background: isRunning || showSuccess ? '#334155' : '#10b981',
                color: isRunning || showSuccess ? '#64748b' : 'white',
                transition: 'all 0.2s'
              }}
            >
              <Play size={18} fill="currentColor" /> Rodar Código
            </button>
            {adminMode && !showSuccess && (
              <button
                onClick={() => setShowSuccess(true)}
                style={{ padding: '8px', background: '#1e293b', border: 'none', color: '#94a3b8', borderRadius: '50%', cursor: 'pointer' }}
                title="Admin: Forçar Vitória"
              >
                <CheckCircle2 size={18} />
              </button>
            )}
          </div>

          {/* Textarea com numeração */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0, background: '#020817' }}>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, width: '48px',
              background: 'rgba(15,23,42,0.5)', borderRight: '1px solid rgba(30,41,59,0.5)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0',
              color: '#475569', fontFamily: 'monospace', fontSize: '14px', zIndex: 0
            }}>
              {code.split('\n').map((_, i) => <div key={i} style={{ height: '28px', lineHeight: '28px' }}>{i + 1}</div>)}
            </div>
            <textarea
              ref={textAreaRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{
                flex: 1, width: '100%', background: 'transparent', color: '#e2e8f0',
                fontFamily: 'monospace', fontSize: '17px', padding: '16px 16px 16px 64px',
                resize: 'none', border: 'none', outline: 'none', lineHeight: '28px', zIndex: 10
              }}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
            />
          </div>

          {/* Console */}
          <div style={{ height: '256px', background: '#0a0a0f', borderTop: '2px solid #1e293b', display: 'flex', flexDirection: 'column', zIndex: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
              <MonitorPlay size={16} style={{ color: '#475569' }} />
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>Saída do Console</span>
            </div>
            <div style={{ flex: 1, padding: '16px', fontFamily: 'monospace', fontSize: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {logs.length === 0 && <div style={{ color: '#334155', fontStyle: 'italic' }}>Pressione "Rodar Código" para ver o resultado...</div>}
              {logs.map((log, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 12px', borderRadius: '6px', fontFamily: 'monospace',
                    color: log.type === 'error' ? '#f87171' : '#cbd5e1',
                    background: log.type === 'error' ? 'rgba(239,68,68,0.1)' : 'transparent'
                  }}
                >
                  <span style={{ color: '#475569', marginRight: '8px' }}>{'>'}</span>
                  {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Sucesso */}
      {showSuccess && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(2,8,24,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px'
        }}>
          <div style={{
            background: '#0f172a', border: '2px solid #10b981', borderRadius: '24px',
            padding: '32px', maxWidth: '448px', width: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(16,185,129,0.05)', filter: 'blur(40px)' }} />
            <div style={{
              width: '96px', height: '96px', background: '#10b981', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(16,185,129,0.4)', marginBottom: '24px', position: 'relative', zIndex: 1
            }}>
              <CheckCircle2 size={48} color="white" strokeWidth={3} />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'white', marginBottom: '8px', position: 'relative', zIndex: 1, fontFamily: 'sans-serif' }}>
              Incrível!
            </h2>
            <p style={{ color: '#a7f3d0', marginBottom: '32px', fontWeight: '500', fontSize: '18px', position: 'relative', zIndex: 1, fontFamily: 'sans-serif' }}>
              Mensagem de conclusão motivacional aqui!
            </p>
            <button
              onClick={handleNext}
              style={{
                width: '100%', background: '#10b981', border: 'none', color: 'white',
                fontWeight: 'bold', padding: '16px', borderRadius: '12px',
                cursor: 'pointer', fontSize: '16px', display: 'flex', justifyContent: 'center',
                alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1,
                transition: 'background 0.2s', fontFamily: 'sans-serif'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#059669'}
              onMouseLeave={e => e.currentTarget.style.background = '#10b981'}
            >
              <Play fill="currentColor" size={20} /> Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mundo2;