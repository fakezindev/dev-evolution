const WORLD_2_LESSONS = [
    { id: 'par-impar', title: 'Par ou Ímpar', type: 'practice' },
    { id: 'if-else-lesson', title: 'Caminhos do If/Else', type: 'practice' },
    { id: 'radar-ranks-lesson', title: 'Radar de Ranks', type: 'practice' },
    { id: 'porta-guardioes-lesson', title: 'A Porta dos Guardiões', type: 'challenge' },
];import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, Lightbulb, Terminal, MonitorPlay, CheckCircle2 } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { motion, AnimatePresence } from 'motion/react';

export const MinhaNovaLicao = () => {
const navigate = useNavigate();
const { completeLesson, adminMode } = useProgress();

const [code, setCode] = useState(
`// Instrução inicial para o aluno
let numero = 5;

// Complete o código aqui...
console.log(numero);
`
);

const [logs, setLogs] = useState([]);const [isRunning, setIsRunning] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
const [showError, setShowError] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
const textAreaRef = useRef<HTMLTextAreaElement>(null);

useEffect(() => { textAreaRef.current?.focus(); }, []);

const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowError(false);
    setLogs([]);

    const capturedLogs = [];
    const somar = (a, b) => {
        return a + b;
};
    capturedLogs.push({ type: 'log', text: args.join(' ') });
}; 
    try {
const runner = new Function('console', code);
runner({ log: mockConsoleLog });

setLogs([...capturedLogs]);

const allText = capturedLogs.map(l => l.text).join(' ');
const codeStr = code.toLowerCase();

      // ======= SUA VALIDAÇÃO AQUI =======
if (!codeStr.includes('let')) {
        setErrorMessage('⚠️ Você precisa usar X no seu código!');
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
    completeLesson('minha-nova-licao', 35, 25); // XP, Moedas
    navigate('/');
};

return (
    <div className="flex flex-col h-screen w-full bg-slate-950 font-sans overflow-hidden">
      {/* Header */}
<div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 shadow-xl z-20">
        <button
onClick={() => navigate('/')}
className="text-slate-400 hover:text-white flex items-center bg-slate-800 rounded-full p-2 hover:bg-slate-700 transition-colors"
        >
<ChevronLeft size={24} />
        </button>
        <div className="flex-1 px-8">
<div className="bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700 w-full max-w-md mx-auto" />
        </div>
        <div className="w-10" />
</div>

<div className="flex flex-1 flex-col lg:flex-row overflow-hidden relative">
        {/* Toast de erro */}
        <AnimatePresence>
{showError && (
            <motion.div
initial={{ opacity: 0, y: -20, x: '-50%' }}
animate={{ opacity: 1, y: 0, x: '-50%' }}
exit={{ opacity: 0, y: -20, x: '-50%' }}
className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-900/90 border border-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 max-w-lg w-11/12 backdrop-blur-md font-medium text-center"
            >
{errorMessage}
            </motion.div>
)}
        </AnimatePresence>

        {/* Painel Esquerdo: Teoria */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/50 overflow-y-auto flex flex-col">
<div className="p-8 pb-32">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-bold uppercase tracking-wider mb-6">
<Lightbulb size={16} />
              Mundo 2 • Lição X {/* ← Ajuste o número */}
            </div>

            <h1 className="text-4xl font-black text-slate-100 mb-6 leading-tight">
Título da Lição: <span className="text-purple-400">Tema</span>
            </h1>

            <div className="space-y-6">
<div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50">
                <h3 className="text-slate-200 flex items-center gap-3">
<span className="text-2xl">🎯</span> O Conceito
                </h3>
                <p className="text-slate-400 font-medium">
Explicação em linguagem simples e com analogia do mundo real.
                </p>
</div>

<div className="bg-purple-900/10 border border-purple-800/30 p-6 rounded-2xl">
                <h3 className="text-purple-300 flex items-center gap-3">
A Ferramenta
                </h3>
                <p className="text-slate-300 font-medium leading-relaxed">
Mostre a sintaxe do conceito que o aluno vai usar.
                </p>
                <pre className="bg-slate-950 text-purple-300 p-4 rounded-xl mt-4 text-sm font-mono">
                  {`// Exemplo de código\nlet x = 10 % 3; // resultado: 1`}
                </pre>
</div>
            </div>
</div>
        </div>

        {/* Painel Direito: Editor + Console */}
        <div className="flex-1 flex flex-col bg-slate-950 relative w-full">
<div className="flex items-center gap-3 px-6 py-4 bg-slate-900 border-b border-slate-800">
            <Terminal size={20} className="text-slate-500" />
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Editor de Código</h2>
            <motion.button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
onClick={handleRun}
disabled={isRunning || showSuccess}
className={`ml-auto flex items-center gap-2 px-6 py-2 rounded-full font-bold shadow-lg transition-colors ${
                isRunning || showSuccess ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-white'
}`}
            >
<Play size={18} fill="currentColor" />
Rodar Código
            </motion.button>
            {adminMode && !showSuccess && (
<button onClick={() => setShowSuccess(true)} className="ml-2 p-2 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 transition-colors" title="Admin: Forçar Vitória">
                <CheckCircle2 size={18} />
</button>
            )}
</div>

<div className="flex-1 flex flex-col relative min-h-0 bg-slate-950">
            <div className="absolute top-0 bottom-0 left-0 w-12 bg-slate-900/50 border-r border-slate-800/50 flex flex-col items-center py-4 text-slate-600 font-mono text-sm z-0">
{code.split('\n').map((_, i) => <div key={i} className="h-7 leading-7">{i + 1}</div>)}
            </div>
            <textarea
ref={textAreaRef}
value={code}
onChange={(e) => setCode(e.target.value)}
className="flex-1 w-full bg-transparent text-slate-200 font-mono text-lg p-4 pl-16 resize-none focus:outline-none custom-scrollbar leading-7 z-10"
spellCheck="false"
autoCapitalize="off"
autoComplete="off"
autoCorrect="off"
            />
</div>

<div className="h-64 bg-[#0a0a0f] border-t-2 border-slate-800 flex flex-col z-20">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800">
<MonitorPlay size={16} className="text-slate-500" />
<span className="text-xs font-bold text-slate-500 uppercase">Saída do Console</span>
            </div>
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar flex flex-col gap-2">
{logs.length === 0 && <div className="text-slate-600 italic">Pressione "Rodar Código" para ver o resultado...</div>}
<AnimatePresence>
                {logs.map((log, i) => (
<motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`px-3 py-2 rounded-md font-mono ${log.type === 'error' ? 'text-red-400 bg-red-500/10' : 'text-slate-300'}`}
>
                    <span className="text-slate-500 mr-2">{'>'}</span>
                    {log.text}
</motion.div>
                ))}
</AnimatePresence>
            </div>
</div>
        </div>
</div>

      {/* Modal de Sucesso */}
<AnimatePresence>
        {showSuccess && (
<div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
initial={{ scale: 0.8, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
exit={{ scale: 0.8, opacity: 0 }}
className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-8 max-w-md w-full flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
            >
<div className="absolute inset-0 bg-emerald-500/10 blur-xl" />
<motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6 relative z-10"
>
                <CheckCircle2 size={48} className="text-white" strokeWidth={3} />
</motion.div>
<h2 className="text-3xl font-black text-white mb-2 relative z-10">Incrível!</h2>
<p className="text-emerald-100 mb-8 font-medium text-lg relative z-10">
                Mensagem de conclusão motivacional aqui!
</p>
<motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2 relative z-10"
>
                <Play fill="currentColor" size={20} />
                Continuar
</motion.button>
            </motion.div>
</div>
        )}
</AnimatePresence>
    </div>
);
