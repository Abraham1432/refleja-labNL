/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, ClipboardCheck, BookOpen, MapPin, Heart, ShieldCheck, EyeOff } from 'lucide-react';
import { Question, Resource, Category } from './types';
import { INITIAL_QUESTIONS } from './constants';
import AdminPanel from './components/AdminPanel';
import QuizPage from './components/QuizPage';
import DirectoryPage from './components/DirectoryPage';
import Violentometro from './components/Violentometro';
import EducationPage from './components/EducationPage';
import DictionaryPage from './components/DictionaryPage';

enum Page {
  HOME = "home",
  QUIZ = "quiz",
  ADMIN = "admin",
  DIRECTORY = "directory",
  DICTIONARY = "dictionary",
  VIOLENTOMETRO = "violentometro",
  CHALLENGES = "challenges"
}

const SAMPLE_RESOURCES: Resource[] = [
  {
    id: "r1",
    name: "Alternativa Pacífica A.C.",
    description: "Atención integral a mujeres en situación de violencia. Refugio y asesoría jurídica en Nuevo León.",
    contact: "81 8372 9066",
    location: "Monterrey, N.L.",
    lat: 25.6802,
    lng: -100.3153,
    category: [Category.WOMEN],
    isPublic: true
  },
  {
    id: "r2",
    name: "Instituto Estatal de las Mujeres NL",
    description: "Orientación psicológica y jurídica gratuita. Unidad móvil de atención y acompañamiento.",
    contact: "81 2020 9770",
    location: "Monterrey Centro, N.L.",
    lat: 25.6714,
    lng: -100.3095,
    category: [Category.WOMEN],
    isPublic: true
  },
  {
    id: "r4",
    name: "Línea de la Vida",
    description: "Centro de Atención Ciudadana especializado en salud mental y consumo de sustancias. Atención 24/7.",
    contact: "800 911 2000",
    location: "Cobertura Nacional",
    lat: 19.4326,
    lng: -99.1332,
    category: [Category.MENTAL_HEALTH],
    isPublic: true
  },
  {
    id: "r5",
    name: "Red Nacional de Refugios",
    description: "Espacios seguros para mujeres y sus hijos en situación de violencia extrema. Atención profesional.",
    contact: "800 822 4460",
    location: "Cobertura Nacional",
    lat: 19.4270,
    lng: -99.1276,
    category: [Category.WOMEN],
    isPublic: true
  },
  {
    id: "r6",
    name: "CJM Iztapalapa (CDMX)",
    description: "Centro de Justicia para las Mujeres. Servicios legales, médicos y psicológicos integrales.",
    contact: "55 5200 9000",
    location: "Iztapalapa, CDMX",
    lat: 19.3497,
    lng: -99.0152,
    category: [Category.WOMEN],
    isPublic: true
  },
  {
    id: "r7",
    name: "SAPTEL",
    description: "Servicio de Salud Mental y Medicina a Distancia. Apoyo en crisis psicológicas y emocionales.",
    contact: "55 5259 8121",
    location: "Cobertura Nacional",
    lat: 19.4350,
    lng: -99.1412,
    category: [Category.MENTAL_HEALTH],
    isPublic: true
  },
  {
    id: "r8",
    name: "CJM Guadalajara",
    description: "Atención multidisciplinaria para mujeres víctimas de violencia en la zona metropolitana de Guadalajara.",
    contact: "33 3030 5450",
    location: "Guadalajara, Jalisco",
    lat: 20.6558,
    lng: -103.3106,
    category: [Category.WOMEN],
    isPublic: true
  },
  {
    id: "r9",
    name: "Línea Mujeres CDMX",
    description: "Asesoría jurídica y psicológica para mujeres de la Ciudad de México a través de Locatel.",
    contact: "55 5658 1111 (*0311)",
    location: "CDMX",
    lat: 19.4320,
    lng: -99.1350,
    category: [Category.WOMEN],
    isPublic: true
  },
  {
    id: "r10",
    name: "Gendes A.C.",
    description: "Institución especializada en el trabajo con hombres para la prevención de la violencia y la promoción de masculinidades positivas.",
    contact: "55 5584 7124",
    location: "Roma Sur, CDMX (Nacional)",
    lat: 19.4075,
    lng: -99.1670,
    category: [Category.MEN, Category.MENTAL_HEALTH],
    isPublic: true
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [resources, setResources] = useState<Resource[]>([]);

  // Load data from local storage on mount
  useEffect(() => {
    const savedQuestions = localStorage.getItem('refleja_questions');
    if (savedQuestions) {
      try {
        setQuestions(JSON.parse(savedQuestions));
      } catch (e) {
        console.error("Error loading questions", e);
      }
    }

    const savedResources = localStorage.getItem('refleja_resources');
    if (savedResources) {
      try {
        setResources(JSON.parse(savedResources));
      } catch (e) {
        setResources(SAMPLE_RESOURCES);
        console.error("Error loading resources", e);
      }
    } else {
      setResources(SAMPLE_RESOURCES);
    }
  }, []);

  const saveResources = (newResources: Resource[]) => {
    setResources(newResources);
    localStorage.setItem('refleja_resources', JSON.stringify(newResources));
  };

  const renderHome = () => (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <section className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-indigo-700 font-semibold text-sm"
          >
            <ShieldCheck size={16} />
            Privacidad por diseño
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-sans tracking-tight text-gray-900 leading-[1.1]"
          >
            Refleja lo que <br /> <span className="text-indigo-600">estás viviendo.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-lg leading-relaxed"
          >
            Una herramienta digital pública para acompañar, orientar y conectar con recursos de apoyo frente a la violencia y el malestar emocional.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={() => setCurrentPage(Page.QUIZ)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
            >
              Iniciar Evaluación
            </button>
            <button 
              onClick={() => setCurrentPage(Page.DIRECTORY)}
              className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all"
            >
              Directorio de Apoyo
            </button>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="flex-1 relative"
        >
          <div className="w-full aspect-square bg-indigo-100 rounded-[3rem] overflow-hidden rotate-3 flex items-center justify-center p-12">
             <Heart size={200} className="text-indigo-500 opacity-20 absolute -top-10 -right-10" />
             <div className="relative z-10 space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-2xl space-y-2">
                   <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-8 h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full" 
                            style={{ width: `${i * 20}%` }}
                          />
                        </div>
                      ))}
                   </div>
                   <p className="font-bold text-gray-900">¿Cómo te sientes hoy?</p>
                   <p className="text-sm text-gray-500 italic">Identificar señales es el primer paso.</p>
                </div>
                <div className="bg-white/80 backdrop-blur p-6 rounded-3xl shadow-xl -ml-20">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                         <ShieldCheck size={20} />
                      </div>
                      <p className="font-semibold text-gray-800">Tus datos son anónimos</p>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600">
            <ClipboardCheck size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Evaluación Preventiva</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Cuestionarios basados en el Violentómetro y manuales de atención psicológica especializada para distintos perfiles.</p>
        </div>
        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-green-600">
            <MapPin size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Recursos Territoriales</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Directorio verificado de instituciones públicas y sociales listas para acompañarte en Nuevo León y más allá.</p>
        </div>
        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-amber-600">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Diccionario Vivo</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Conceptos sobre violencia y derechos humanos explicados en lenguaje sencillo para nombrar lo invisible.</p>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setCurrentPage(Page.HOME)}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
              <Heart size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">Refleja</span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-2xl">
            <button 
              onClick={() => setCurrentPage(Page.HOME)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === Page.HOME ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Inicio
            </button>
            <button 
              onClick={() => setCurrentPage(Page.QUIZ)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === Page.QUIZ ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Test
            </button>
            <button 
              onClick={() => setCurrentPage(Page.DIRECTORY)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === Page.DIRECTORY ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Directorio
            </button>
            <button 
              onClick={() => setCurrentPage(Page.VIOLENTOMETRO)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === Page.VIOLENTOMETRO ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Violentómetro
            </button>
            <button 
              onClick={() => setCurrentPage(Page.CHALLENGES)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === Page.CHALLENGES ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Desafíos
            </button>
            <button 
              onClick={() => setCurrentPage(Page.DICTIONARY)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === Page.DICTIONARY ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Diccionario
            </button>
          </div>

          <button 
            onClick={() => setCurrentPage(Page.ADMIN)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <LayoutDashboard size={18} />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {currentPage === Page.HOME && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderHome()}
            </motion.div>
          )}
          {currentPage === Page.QUIZ && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizPage questions={questions} onGoHome={() => setCurrentPage(Page.HOME)} />
            </motion.div>
          )}
          {currentPage === Page.ADMIN && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminPanel 
                questions={questions} 
                onUpdateQuestions={setQuestions} 
                resources={resources}
                onUpdateResources={saveResources}
              />
            </motion.div>
          )}
          {currentPage === Page.DIRECTORY && (
            <motion.div key="directory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DirectoryPage resources={resources} />
            </motion.div>
          )}
          {currentPage === Page.VIOLENTOMETRO && (
            <motion.div key="violentometro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Violentometro />
            </motion.div>
          )}
          {currentPage === Page.CHALLENGES && (
            <motion.div key="challenges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EducationPage />
            </motion.div>
          )}
          {currentPage === Page.DICTIONARY && (
            <motion.div key="dictionary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DictionaryPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info / Safety Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-end pointer-events-auto">
          <div className="bg-white/90 backdrop-blur border border-gray-200 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
            <EyeOff size={16} className="text-amber-500" />
            <p className="text-xs font-bold text-gray-700">Pulsa <span className="text-indigo-600">CTR W</span> para cerrar rápido si estás en peligro.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
