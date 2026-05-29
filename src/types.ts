/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Category {
  WOMEN = "Mujeres",
  MEN = "Hombres",
  CHILDREN = "Niñas, Niños y Adolescentes",
  SENIORS = "Adultos Mayores",
  MIGRANTS = "Personas Migrantes",
  ETHNIC = "Origen Étnico/Racial",
  MENTAL_HEALTH = "Salud Mental"
}

export enum RiskLevel {
  LOW = "Informativo / Preventivo",
  MEDIUM = "Alerta / Reacciona",
  HIGH = "Peligro / Busca ayuda hoy"
}

export interface Option {
  id: string;
  text: string;
  score: number; // 0 a 3 usualmente
}

export interface Question {
  id: string;
  text: string;
  category: Category;
  tags: string[];
  options: Option[];
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  contact: string;
  location: string;
  lat?: number;
  lng?: number;
  category: Category[];
  isPublic: boolean;
}
