/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Book, Sparkles, ArrowRight } from 'lucide-react';

interface Concept {
  term: string;
  definition: string;
  example: string;
  action: string;
}

const CONCEPTS: Concept[] = [
  {
    term: "Violencia Vicaria",
    definition: "Es aquella violencia que se ejerce sobre las hijas e hijos para herir y maltratar a la mujer. Es una de las formas más crueles de violencia de género.",
    example: "Amenazar con quitarte a tus hijos o hablarles mal de ti para dañar el vínculo.",
    action: "Busca asesoría legal especializada en derecho familiar y violencia de género."
  },
  {
    term: "Violencia Patrimonial",
    definition: "Cualquier acto que afecta la supervivencia de la víctima. Se manifiesta en la transformación, sustracción, destrucción o retención de objetos, documentos personales, bienes o valores.",
    example: "Romper tus títulos de propiedad, esconder tu acta de nacimiento o destruir tus herramientas de trabajo.",
    action: "Denuncia ante el Ministerio Público; estos actos son delitos contra el patrimonio."
  },
  {
    term: "Violencia Digital (Ley Olimpia)",
    definition: "Actos de acoso, hostigamiento, amenazas o vulneración de datos e imágenes privadas a través de tecnologías de la información.",
    example: "Compartir fotos íntimas sin tu consentimiento o crear perfiles falsos para difamarte.",
    action: "No borres las pruebas (mensajes, capturas). Existe protección legal bajo la Ley Olimpia."
  },
  {
    term: "Micromachismos",
    definition: "Prácticas de dominación y violencia masculina en la vida cotidiana, tan sutiles que parecen normales o aceptables.",
    example: "Que te interrumpan constantemente al hablar (mansplaining) o que se asuma que tú debes hacer todo el trabajo doméstico.",
    action: "Identificarlo es el primer paso para establecer límites saludables."
  }
];

export default function DictionaryPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Concept | null>(null);

  const filtered = CONCEPTS.filter(c => 
    c.term.toLowerCase().includes(search.toLowerCase()) ||
    c.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-24">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Diccionario Vivo</h1>
        <p className="text-gray-500 max-w-lg mx-auto">Conceptos para nombrar lo invisible. Definiciones claras basadas en leyes y psicología especializada.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="¿Qué concepto quieres entender?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:border-indigo-500 outline-none transition-all font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          {filtered.map((c) => (
            <button
              key={c.term}
              onClick={() => setSelected(c)}
              className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center justify-between group ${selected?.term === c.term ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-white border-gray-100 text-gray-700 hover:border-indigo-300'}`}
            >
              <div className="flex items-center gap-3">
                <Book size={18} className={selected?.term === c.term ? 'text-indigo-200' : 'text-gray-400'} />
                <span className="font-bold uppercase tracking-tight">{c.term}</span>
              </div>
              <ArrowRight size={18} className={`transition-transform ${selected?.term === c.term ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:opacity-100'}`} />
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.term}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6 h-fit sticky top-32"
            >
              <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Definición Refleja</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">{selected.term}</h2>
              <p className="text-gray-600 leading-relaxed font-medium">{selected.definition}</p>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ejemplo cotidiano</p>
                <p className="text-sm text-gray-700 italic">"{selected.example}"</p>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">Acción recomendada</p>
                <p className="text-sm text-green-800 font-bold">{selected.action}</p>
              </div>
            </motion.div>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center p-12 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
              <Book size={48} className="text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Selecciona un concepto para explorar</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
