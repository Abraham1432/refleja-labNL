/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Question, RiskLevel } from "./types";

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: "1",
    text: "¿Tu pareja o alguien cercano suele hacer bromas hirientes o comentarios que te ridiculizan?",
    category: Category.WOMEN,
    tags: ["Violencia Psicológica", "Alerta"],
    options: [
      { id: "1a", text: "Nunca", score: 0 },
      { id: "1b", text: "A veces", score: 1 },
      { id: "1c", text: "Frecuentemente", score: 3 }
    ]
  },
  {
    id: "2",
    text: "¿Te han prohibido ver a tus amigos, familiares o te controlan el celular?",
    category: Category.WOMEN,
    tags: ["Control", "Violencia Psicológica"],
    options: [
      { id: "2a", text: "No", score: 0 },
      { id: "2b", text: "Intenta controlarme", score: 2 },
      { id: "2c", text: "Sí, constantemente", score: 3 }
    ]
  },
  {
    id: "3",
    text: "¿Sientes que tus opiniones no valen en las decisiones del hogar o sobre tu dinero?",
    category: Category.SENIORS,
    tags: ["Violencia Patrimonial", "Economía"],
    options: [
      { id: "3a", text: "Mis decisiones son respetadas", score: 0 },
      { id: "3b", text: "Me consultan pero ellos deciden", score: 1 },
      { id: "3c", text: "Me quitan mi dinero o deciden por mí", score: 3 }
    ]
  }
];

export const APP_THEME = {
  primary: "#4F46E5", // Indigo
  secondary: "#10B981", // Emerald
  danger: "#EF4444", // Red
  warning: "#F59E0B", // Amber
  surface: "#F9FAFB", // Gray 50
};
