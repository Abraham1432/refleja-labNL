/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ShieldAlert, Zap, Info } from 'lucide-react';

const VIOLENTOMETRO_LEVELS = [
  { level: 1, title: "Ten cuidado", color: "bg-amber-400", items: ["Bromas hirientes", "Chantajear", "Mentir / Engañar", "Ignorar / Ley del hielo", "Celar", "Culpabilizar", "Descalificar", "Ridiculizar / Ofender", "Humillar en público", "Intimidar / Amenazar"] },
  { level: 2, title: "¡Reacciona!", color: "bg-orange-500", items: ["Controlar / Prohibir", "Destruir artículos personales", "Manosear", "Caricias agresivas", "Golpear jugando", "Pellizcar / Arañar", "Empujar / Jalonear", "Cachetear", "Patear", "Encerrar / Aislar"] },
  { level: 3, title: "¡Pide ayuda hoy!", color: "bg-red-600", items: ["Amenazar con objetos o armas", "Amenazar de muerte", "Forzar relación sexual", "Abuso sexual", "Violación", "Mutilar", "Feminicidio"] }
];

export default function Violentometro() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12 pb-24">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Violentómetro</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Visualiza los niveles de violencia que pueden presentarse en la vida cotidiana. La violencia no es normal y suele escalar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VIOLENTOMETRO_LEVELS.map((stage) => (
          <motion.div 
            key={stage.level}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col h-full bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className={`p-6 ${stage.color} text-white`}>
               <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black uppercase tracking-widest opacity-80">Nivel {stage.level}</span>
                  {stage.level === 1 && <Info size={20} />}
                  {stage.level === 2 && <Zap size={20} />}
                  {stage.level === 3 && <ShieldAlert size={20} />}
               </div>
               <h3 className="text-2xl font-black uppercase italic tracking-tight">{stage.title}</h3>
            </div>
            <div className="p-8 flex-1">
               <ul className="space-y-4">
                  {stage.items.map((item, idx) => (
                    <li key={idx} className="flex gap-3 items-start group">
                       <span className="w-1.5 h-1.5 rounded-full bg-gray-200 mt-2 shrink-0 group-hover:bg-indigo-500 transition-colors"></span>
                       <span className="text-sm font-medium text-gray-700 leading-tight">{item}</span>
                    </li>
                  ))}
               </ul>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                 {stage.level === 3 ? "Riesgo inminente de muerte" : "Señales de alerta"}
               </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-indigo-600 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
             <AlertCircle size={32} />
             <h2 className="text-3xl font-black italic uppercase tracking-tighter">La violencia escala</h2>
          </div>
          <p className="text-lg opacity-90 max-w-2xl leading-relaxed">
            Este instrumento es una herramienta de sensibilización. Si te identificas en cualquiera de estos niveles, recuerda que existen instituciones listas para escucharte sin juzgarte.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
             <div className="px-6 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-bold border border-white/10 uppercase tracking-widest">No es tu culpa</div>
             <div className="px-6 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-bold border border-white/10 uppercase tracking-widest">No estás sola</div>
             <div className="px-6 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-bold border border-white/10 uppercase tracking-widest">Hay salida</div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </div>
  );
}
