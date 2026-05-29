/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Save, ChevronDown, ChevronUp, MapPin, Phone, Globe, Lock, ShieldCheck, ClipboardList, Download, Upload } from 'lucide-react';
import { Category, Question, Option, Resource } from '../types';
import { motion } from 'motion/react';

interface AdminPanelProps {
  questions: Question[];
  onUpdateQuestions: (questions: Question[]) => void;
  resources: Resource[];
  onUpdateResources: (resources: Resource[]) => void;
}

export default function AdminPanel({ questions, onUpdateQuestions, resources, onUpdateResources }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'questions' | 'resources'>('questions');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);

  const exportData = () => {
    const data = { questions, resources };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `refleja_config_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.questions && Array.isArray(json.questions)) {
          onUpdateQuestions(json.questions);
        }
        if (json.resources && Array.isArray(json.resources)) {
          onUpdateResources(json.resources);
        }
        alert('Datos importados correctamente.');
      } catch (error) {
        alert('Error al leer el archivo. Asegúrate de que sea un JSON válido de Refleja.');
      }
    };
    reader.readAsText(file);
  };

  // Question handlers
  const addNewQuestion = () => {
    const newQ: Question = {
      id: crypto.randomUUID(),
      text: "Nueva pregunta",
      category: Category.WOMEN,
      tags: [],
      options: [
        { id: crypto.randomUUID(), text: "Opción 1", score: 0 },
        { id: crypto.randomUUID(), text: "Opción 2", score: 1 }
      ]
    };
    onUpdateQuestions([...questions, newQ]);
    setEditingId(newQ.id);
  };

  const deleteQuestion = (id: string) => {
    onUpdateQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    onUpdateQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  // Resource handlers
  const addNewResource = () => {
    const newRes: Resource = {
      id: crypto.randomUUID(),
      name: "Nuevo Recurso",
      description: "Descripción del servicio",
      contact: "Teléfono / Email",
      location: "Dirección o Municipio",
      category: [Category.WOMEN],
      isPublic: true
    };
    onUpdateResources([...resources, newRes]);
    setEditingResourceId(newRes.id);
  };

  const deleteResource = (id: string) => {
    onUpdateResources(resources.filter(r => r.id !== id));
  };

  const updateResource = (id: string, updates: Partial<Resource>) => {
    onUpdateResources(resources.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const toggleCategory = (resId: string, cat: Category) => {
    const res = resources.find(r => r.id === resId);
    if (!res) return;
    const newCats = res.category.includes(cat) 
      ? res.category.filter(c => c !== cat)
      : [...res.category, cat];
    updateResource(resId, { category: newCats });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 min-h-screen pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 font-sans tracking-tight uppercase italic">Control Central</h1>
          <p className="text-gray-500 text-sm font-medium">Gestiona el contenido vivo de Refleja.</p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('questions')}
            className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'questions' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <ClipboardList size={18} />
            Test
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'resources' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <MapPin size={18} />
            Recursos
          </button>
        </div>
      </header>

      {activeTab === 'questions' ? (
        <div className="grid gap-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-lg font-bold text-gray-800">Cuestionarios ({questions.length})</h2>
            <button
              onClick={addNewQuestion}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-lg shadow-indigo-100"
            >
              <Plus size={18} />
              Añadir Pregunta
            </button>
          </div>
          {questions.map((q) => (
            <motion.div
              key={q.id}
              layout
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <div 
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setEditingId(editingId === q.id ? null : q.id)}
              >
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                    {q.category}
                  </span>
                  <h3 className="font-bold text-gray-900 leading-tight">{q.text}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteQuestion(q.id); }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  {editingId === q.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
              </div>

              {editingId === q.id && (
                <div className="p-8 border-t border-gray-100 bg-gray-50/20 space-y-6">
                  {/* ... same as previous questions edit UI ... */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest font-sans">Contenido</label>
                      <textarea
                        value={q.text}
                        onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                        className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none bg-white min-h-[120px] font-medium"
                      />
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest font-sans">Categoría Principal</label>
                        <select
                          value={q.category}
                          onChange={(e) => updateQuestion(q.id, { category: e.target.value as Category })}
                          className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none bg-white font-bold"
                        >
                          {Object.values(Category).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest font-sans">Etiquetas relacionales</label>
                        <input
                          type="text"
                          value={q.tags.join(', ')}
                          onChange={(e) => updateQuestion(q.id, { tags: e.target.value.split(',').map(t => t.trim()) })}
                          className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none bg-white font-medium"
                          placeholder="Física, Control, Alerta..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-lg font-bold text-gray-800">Recursos de Apoyo ({resources.length})</h2>
            <button
              onClick={addNewResource}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-lg shadow-indigo-100"
            >
              <Plus size={18} />
              Nuevo Recurso
            </button>
          </div>
          {resources.map((res) => (
            <motion.div
              key={res.id}
              layout
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <div 
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setEditingResourceId(editingResourceId === res.id ? null : res.id)}
              >
                <div className="flex-1">
                  <div className="flex gap-1 mb-2">
                    {res.category.map(c => (
                      <span key={c} className="text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{c}</span>
                    ))}
                  </div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    {res.name}
                    {res.isPublic ? <Globe size={14} className="text-green-500" /> : <Lock size={14} className="text-amber-500" />}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{res.location} • {res.contact}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteResource(res.id); }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  {editingResourceId === res.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
              </div>

              {editingResourceId === res.id && (
                <div className="p-8 border-t border-gray-100 bg-indigo-50/10 space-y-8 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nombre Completo</label>
                        <input
                          type="text"
                          value={res.name}
                          onChange={(e) => updateResource(res.id, { name: e.target.value })}
                          className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none bg-white font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Descripción del Servicio</label>
                        <textarea
                          value={res.description}
                          onChange={(e) => updateResource(res.id, { description: e.target.value })}
                          className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none bg-white min-h-[100px] text-sm"
                          placeholder="Explica qué apoyo brindan y a quién..."
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Phone size={12}/> Contacto</label>
                          <input
                            type="text"
                            value={res.contact}
                            onChange={(e) => updateResource(res.id, { contact: e.target.value })}
                            className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none bg-white font-medium text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={12}/> Ubicación</label>
                          <input
                            type="text"
                            value={res.location}
                            onChange={(e) => updateResource(res.id, { location: e.target.value })}
                            className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none bg-white font-medium text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Latitud</label>
                          <input
                            type="number"
                            step="any"
                            value={res.lat || ''}
                            onChange={(e) => updateResource(res.id, { lat: parseFloat(e.target.value) })}
                            className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none bg-white font-medium text-sm"
                            placeholder="Ej: 25.6866"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Longitud</label>
                          <input
                            type="number"
                            step="any"
                            value={res.lng || ''}
                            onChange={(e) => updateResource(res.id, { lng: parseFloat(e.target.value) })}
                            className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none bg-white font-medium text-sm"
                            placeholder="Ej: -100.3161"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Atiende a (Categorías)</label>
                        <div className="flex flex-wrap gap-2">
                          {Object.values(Category).map(cat => (
                            <button
                              key={cat}
                              onClick={() => toggleCategory(res.id, cat)}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border-2 ${res.category.includes(cat) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-100 bg-white text-gray-400'}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 p-4 bg-white rounded-2xl border border-gray-100">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800">Visibilidad</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">¿Es público para todos?</p>
                        </div>
                        <button 
                          onClick={() => updateResource(res.id, { isPublic: !res.isPublic })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${res.isPublic ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${res.isPublic ? 'left-7' : 'left-1'}`}></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-xl px-1 sm:px-8 py-3 rounded-full border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-2 sm:gap-6"
        >
          <div className="hidden sm:flex items-center gap-2 text-indigo-600">
            <ShieldCheck size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Sincronización segura</span>
          </div>
          <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
          <button 
            onClick={() => {
              localStorage.setItem('refleja_questions', JSON.stringify(questions));
              localStorage.setItem('refleja_resources', JSON.stringify(resources));
              alert('Base de datos actualizada en el navegador.');
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-black hover:bg-indigo-700 transition-all shadow-lg active:scale-95 uppercase tracking-tighter"
          >
            <Save size={16} />
            Sincronizar
          </button>
          
          <div className="h-4 w-px bg-gray-200"></div>

          <button 
            onClick={exportData}
            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
            title="Exportar archivo de administración"
          >
            <Download size={20} />
          </button>

          <label className="p-2 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer" title="Importar archivo de administración">
            <Upload size={20} />
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
        </motion.div>
      </div>
    </div>
  );
}
