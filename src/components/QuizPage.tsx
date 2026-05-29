/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Question, RiskLevel } from '../types';
import { ArrowRight, ArrowLeft, RefreshCcw, Home, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface QuizPageProps {
  questions: Question[];
  onGoHome: () => void;
}

export default function QuizPage({ questions, onGoHome }: QuizPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => q.category === selectedCategory);
  }, [questions, selectedCategory]);

  const totalScore = Object.values(answers).reduce((sum: number, score: number) => sum + score, 0);

  const handleAnswer = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    if (currentStep < filteredQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const riskAssessment = useMemo(() => {
    // Escala simplificada basada en el Violentómetro
    const scoreVal = totalScore as number;
    if (scoreVal <= 5) return {
      level: RiskLevel.LOW,
      color: "bg-green-50 text-green-700 border-green-200",
      icon: <ShieldCheck className="text-green-600" />,
      message: "Por ahora las señales son bajas, pero mantente alerta. Es importante seguir fortaleciendo tu autonomía y círculos de confianza.",
      recommendation: "Te recomendamos leer nuestro diccionario vivo de conceptos para identificar microviolencias que suelen pasar desapercibidas."
    };
    if (scoreVal <= 15) return {
      level: RiskLevel.MEDIUM,
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Info className="text-amber-600" />,
      message: "¡Cuidado! Hay señales claras de violencia que pueden escalar. No es tu culpa y no estás sola/o.",
      recommendation: "Es un buen momento para hablar con alguien de confianza o contactar a una de las instituciones de nuestro directorio para orientación preventiva."
    };
    return {
      level: RiskLevel.HIGH,
      color: "bg-red-50 text-red-700 border-red-200",
      icon: <AlertTriangle className="text-red-600" />,
      message: "Situación de riesgo elevado. Tu integridad física o emocional podría estar en peligro inminente.",
      recommendation: "Prioriza tu seguridad hoy mismo. Revisa nuestro directorio territorial de apoyo y busca refugio o asesoría legal urgente."
    };
  }, [totalScore]);

  if (!selectedCategory) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-sans">¿Cómo podemos ayudarte hoy?</h1>
          <p className="text-gray-500">Selecciona el perfil que mejor describa tu situación para personalizar el test.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(Category).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="p-6 text-left bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{cat}</h3>
              <p className="text-xs text-gray-400 mt-1">Instrumento especializado</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto p-6 space-y-8"
      >
        <div className={`p-8 rounded-3xl border ${riskAssessment.color} space-y-6 shadow-sm`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              {riskAssessment.icon}
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider opacity-80">Nivel de Riesgo Determinado</p>
              <h2 className="text-3xl font-black">{riskAssessment.level}</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg leading-relaxed font-medium">{riskAssessment.message}</p>
            <div className="h-px bg-current opacity-10"></div>
            <p className="text-sm italic opacity-90">{riskAssessment.recommendation}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={onGoHome}
            className="flex items-center justify-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Home size={20} />
            Inicio
          </button>
          <button 
            onClick={() => {
              setIsFinished(false);
              setCurrentStep(0);
              setAnswers({});
            }}
            className="flex items-center justify-center gap-3 p-4 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <RefreshCcw size={20} />
            Repetir Test
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <ShieldCheck size={18} className="text-gray-400" />
            Privacidad Garantizada
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Estos resultados son estrictamente personales y temporales. No han sido guardados en ningún servidor central. Si compartes este dispositivo, te recomendamos limpiar el historial o cerrar esta pestaña ahora.
          </p>
        </div>
      </motion.div>
    );
  }

  const q = filteredQuestions[currentStep];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 min-h-[600px] flex flex-col justify-center">
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{selectedCategory}</span>
          <span className="text-xs font-medium text-gray-400">Pregunta {currentStep + 1} de {filteredQuestions.length}</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-indigo-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / filteredQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {q.text}
          </h2>

          <div className="grid gap-3">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleAnswer(q.id, opt.score)}
                className="w-full text-left p-5 bg-white border border-gray-200 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group flex items-center justify-between"
              >
                <span className="font-medium text-gray-700 group-hover:text-indigo-700">{opt.text}</span>
                <ArrowRight size={18} className="text-gray-300 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-start pt-4">
        {currentStep > 0 && (
          <button 
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Anterior
          </button>
        )}
      </div>
    </div>
  );
}
