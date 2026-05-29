/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, HelpCircle, Trophy, RefreshCcw, Info } from 'lucide-react';

interface Challenge {
  id: string;
  statement: string;
  isTruth: boolean;
  explanation: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: "1",
    statement: "La violencia de género solo ocurre en clases sociales bajas.",
    isTruth: false,
    explanation: "Falso. La violencia de género es estructural y atraviesa todas las clases sociales, niveles educativos y religiones."
  },
  {
    id: "2",
    statement: "En México, la Ley General de Acceso de las Mujeres a una Vida Libre de Violencia reconoce la violencia digital.",
    isTruth: true,
    explanation: "Verdadero. Gracias a la Ley Olimpia, se integró la violencia digital como un delito y una modalidad de violencia."
  },
  {
    id: "3",
    statement: "Si no hay golpes físicos, no se puede considerar violencia de pareja.",
    isTruth: false,
    explanation: "Falso. La violencia psicológica, económica, patrimonial y sexual son formas graves de violencia que muchas veces preceden a la física."
  },
  {
    id: "4",
    statement: "Los hombres también pueden ser víctimas de violencia familiar.",
    isTruth: true,
    explanation: "Verdadero. Aunque estadísticamente las mujeres enfrentan un riesgo mayor y sistémico, los hombres también pueden vivir violencia y tienen derecho a apoyo."
  }
];

export default function EducationPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    if (answer === CHALLENGES[currentIdx].isTruth) {
      setScore(score + 1);
    }
  };

  const next = () => {
    if (currentIdx < CHALLENGES.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
    } else {
      setIsDone(true);
    }
  };

  const reset = () => {
    setCurrentIdx(0);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setScore(0);
    setIsDone(false);
  };

  if (isDone) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
           <Trophy size={48} />
        </div>
        <div className="space-y-2">
           <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">¡Desafío Completado!</h2>
           <p className="text-gray-500 font-medium">Has acertado {score} de {CHALLENGES.length} conceptos clave.</p>
        </div>
        <div className="p-8 bg-white rounded-[3rem] border border-gray-100 shadow-xl space-y-4">
           <p className="text-gray-600 leading-relaxed italic">
             "El conocimiento es la primera herramienta de protección. Compartir esta información puede salvar vidas."
           </p>
           <button 
             onClick={reset}
             className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl mx-auto font-black italic uppercase tracking-tighter hover:bg-slate-900 transition-all"
           >
             <RefreshCcw size={20} />
             Repetir Desafío
           </button>
        </div>
      </div>
    );
  }

  const q = CHALLENGES[currentIdx];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-12 pb-24 min-h-[600px] flex flex-col justify-center">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
           <HelpCircle size={14} />
           Verdad o Mito
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">Desafío Refleja</h1>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
                <motion.div 
                   className="h-full bg-amber-400"
                   initial={{ width: 0 }}
                   animate={{ width: `${((currentIdx + 1) / CHALLENGES.length) * 100}%` }}
                />
             </div>

             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight text-center">
               "{q.statement}"
             </h2>

             {!showExplanation ? (
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleAnswer(true)}
                    className="p-6 rounded-2xl bg-indigo-50 text-indigo-700 font-black italic uppercase tracking-tighter hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex flex-col items-center gap-2"
                  >
                    <CheckCircle2 size={32} />
                    Verdadero
                  </button>
                  <button 
                    onClick={() => handleAnswer(false)}
                    className="p-6 rounded-2xl bg-red-50 text-red-700 font-black italic uppercase tracking-tighter hover:bg-red-600 hover:text-white transition-all shadow-sm flex flex-col items-center gap-2"
                  >
                    <XCircle size={32} />
                    Falso
                  </button>
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-6"
               >
                  <div className={`p-6 rounded-2xl flex gap-4 ${selectedAnswer === q.isTruth ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                     {selectedAnswer === q.isTruth ? <CheckCircle2 className="shrink-0" /> : <XCircle className="shrink-0" />}
                     <div>
                        <p className="font-black italic uppercase tracking-tighter text-sm mb-1">
                          {selectedAnswer === q.isTruth ? "¡Correcto!" : "Incorrecto"}
                        </p>
                        <p className="text-sm font-medium leading-relaxed">{q.explanation}</p>
                     </div>
                  </div>
                  <button 
                    onClick={next}
                    className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black italic uppercase tracking-tighter hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                  >
                    Siguiente
                    <HelpCircle size={20} />
                  </button>
               </motion.div>
             )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
