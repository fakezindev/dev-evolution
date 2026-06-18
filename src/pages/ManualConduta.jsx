import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Check, AlertTriangle } from 'lucide-react';

function ManualConduta() {
  const navigate = useNavigate();
  const [aceito, setAceito] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleAceitar = async () => {
    if (!aceito) return;
    setCarregando(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/alunos/aceitar-manual", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        navigate("/dashboard");
      } else {
        alert("Erro ao confirmar. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      alert("Falha na conexão.");
    } finally {
      setCarregando(false);
    }
  };

  const handleRecusar = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4 font-sans">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-purple-500/30">
            <Shield size={40} />
          </div>
          
          <h1 className="text-3xl font-black text-slate-100 mb-2">Manual de Conduta</h1>
          <p className="text-slate-400 font-medium mb-8">
            Para garantir que nossa comunidade seja incrível para todos, precisamos que você concorde com as regras do jogo.
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-left w-full space-y-4 mb-8 h-64 overflow-y-auto custom-scrollbar">
            <h3 className="text-purple-400 font-bold flex items-center gap-2">
              <AlertTriangle size={18} /> As 3 Leis do DevEvolution
            </h3>
            
            <div className="space-y-4 text-slate-300 text-sm">
              <p>
                <strong className="text-slate-100">1. Respeito Mútuo:</strong> Não toleramos nenhum tipo de linguagem ofensiva, bullying ou desrespeito com outros jogadores no fórum ou em qualquer ambiente da plataforma.
              </p>
              <p>
                <strong className="text-slate-100">2. Esforço Genuíno:</strong> Compartilhar respostas diretas atrapalha o seu aprendizado e o dos outros. Você pode e deve ajudar, mas explicando a lógica, não entregando o código pronto.
              </p>
              <p>
                <strong className="text-slate-100">3. Segurança Primeiro:</strong> Não compartilhe senhas, e-mails ou informações pessoais com outros usuários. O DevEvolution nunca pedirá sua senha fora da tela de login.
              </p>
              <p className="italic text-slate-500 mt-4 pt-4 border-t border-slate-800/50">
                O descumprimento destas regras pode resultar em perda de XP, bloqueio temporário ou banimento permanente da plataforma.
              </p>
            </div>
          </div>

          <label className="flex items-start gap-4 mb-8 cursor-pointer group text-left w-full bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
            <div className="relative flex items-center mt-1">
              <input 
                type="checkbox" 
                className="peer sr-only"
                checked={aceito}
                onChange={(e) => setAceito(e.target.checked)}
              />
              <div className="w-6 h-6 bg-slate-900 border-2 border-slate-600 rounded flex items-center justify-center peer-checked:bg-purple-500 peer-checked:border-purple-500 transition-all">
                <Check size={16} className="text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
              </div>
            </div>
            <span className="text-slate-300 font-medium select-none group-hover:text-slate-200 transition-colors">
              Li e concordo em seguir o Manual de Conduta do DevEvolution. Prometo ajudar a manter um ambiente seguro e divertido.
            </span>
          </label>

          <div className="flex gap-4 w-full">
            <button 
              onClick={handleRecusar}
              className="flex-1 py-4 font-bold text-slate-400 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Não Aceito
            </button>
            <button 
              onClick={handleAceitar}
              disabled={!aceito || carregando}
              className={`flex-1 py-4 font-bold text-white rounded-xl transition-all shadow-lg flex items-center justify-center ${
                aceito 
                ? 'bg-purple-600 hover:bg-purple-500 hover:shadow-purple-500/25' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {carregando ? 'Confirmando...' : 'Aceitar e Jogar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManualConduta;
