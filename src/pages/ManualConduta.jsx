import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Check,
  AlertTriangle,
  Users,
  Code2,
  Lock,
  Sparkles,
  X,
  Loader2,
  ShieldCheck,
  Gamepad2
} from 'lucide-react';
import '../styles/manual.css';
import { API_BASE_URL } from "../api/config";

function ManualConduta() {
  const navigate = useNavigate();
  const [aceito, setAceito] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleAceitar = async () => {
    if (!aceito || carregando) return;
    setCarregando(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/alunos/aceitar-manual`, {
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
    <div className="manual-page">
      {/* Glow Effects */}
      <div className="manual-bg-glow"></div>
      <div className="manual-bg-glow-bottom"></div>

      <div className="manual-card">
        {/* Header Section */}
        <div className="manual-header">
          <div className="manual-badge">
            <ShieldCheck size={14} /> DevEvolution • Protocolo da Comunidade
          </div>

          <div className="manual-icon-wrapper">
            <Shield size={42} strokeWidth={2.2} />
          </div>
          
          <h1 className="manual-title">Manual de Conduta</h1>
          <p className="manual-subtitle">
            Para garantir que nossa comunidade seja incrível, justa e enriquecedora para todos os devs, pedimos que leia e aceite as regras do jogo antes de começar.
          </p>
        </div>

        {/* The 3 Laws Section */}
        <div className="manual-laws-container">
          {/* Law 1 */}
          <div className="manual-law-card">
            <div className="law-icon-box purple">
              <Users size={22} />
            </div>
            <div className="law-content">
              <div className="law-header">
                <h3 className="law-title">1. Respeito Mútuo</h3>
                <span className="law-tag">Convivência</span>
              </div>
              <p className="law-description">
                Não toleramos nenhum tipo de linguagem ofensiva, bullying ou desrespeito com outros jogadores no fórum ou em qualquer ambiente da plataforma.
              </p>
            </div>
          </div>

          {/* Law 2 */}
          <div className="manual-law-card">
            <div className="law-icon-box cyan">
              <Code2 size={22} />
            </div>
            <div className="law-content">
              <div className="law-header">
                <h3 className="law-title">2. Esforço Genuíno</h3>
                <span className="law-tag">Aprendizado</span>
              </div>
              <p className="law-description">
                Compartilhar respostas diretas atrapalha o seu aprendizado e o dos outros. Você pode e deve ajudar, mas explicando a lógica, não entregando o código pronto.
              </p>
            </div>
          </div>

          {/* Law 3 */}
          <div className="manual-law-card">
            <div className="law-icon-box emerald">
              <Lock size={22} />
            </div>
            <div className="law-content">
              <div className="law-header">
                <h3 className="law-title">3. Segurança Primeiro</h3>
                <span className="law-tag">Privacidade</span>
              </div>
              <p className="law-description">
                Não compartilhe senhas, e-mails ou informações pessoais com outros usuários. O DevEvolution nunca pedirá sua senha fora da tela de login.
              </p>
            </div>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="manual-warning-card">
          <AlertTriangle size={20} />
          <div>
            O descumprimento destas regras pode resultar em perda de XP, bloqueio temporário ou banimento permanente da plataforma.
          </div>
        </div>

        {/* Interactive Agreement Checkbox */}
        <div 
          className={`manual-checkbox-card ${aceito ? 'checked' : ''}`}
          onClick={() => setAceito(!aceito)}
        >
          <div className={`custom-checkbox ${aceito ? 'active' : ''}`}>
            <Check size={16} strokeWidth={3} />
          </div>
          <span className="checkbox-text">
            Li e concordo em seguir o Manual de Conduta do DevEvolution. Prometo ajudar a manter um ambiente seguro e divertido.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="manual-actions">
          <button 
            type="button"
            onClick={handleRecusar}
            className="btn-recusar"
          >
            <X size={18} /> Sair / Recusar
          </button>
          
          <button 
            type="button"
            onClick={handleAceitar}
            disabled={!aceito || carregando}
            className={`btn-aceitar ${aceito && !carregando ? 'active' : 'disabled'}`}
          >
            {carregando ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Confirmando...
              </>
            ) : aceito ? (
              <>
                <Gamepad2 size={18} /> Aceitar e Jogar
              </>
            ) : (
              <>
                Concorde com os termos para continuar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManualConduta;
