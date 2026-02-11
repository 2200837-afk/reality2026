
import React from 'react';

export interface SimulationState {
  velocity: number; 
  gamma: number;    
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum ViewMode {
  HOME = 'HOME',
  SIMULATION = 'SIMULATION',
  THEORY = 'THEORY',
  EXPERIMENTS = 'EXPERIMENTS',
  QUIZ = 'QUIZ',
  RESEARCH = 'RESEARCH',
  FEEDBACK = 'FEEDBACK'
}

export interface NavItem {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
}

export type VoicePersona = 'HEADMASTER' | 'SISTER' | 'REBEL';

// --- Research & Analytics Types ---

export type LearningStyleType = 'Visual' | 'Auditory' | 'Kinesthetic' | 'Multi-Sensory';

export interface VARKScores {
  visual: number;
  auditory: number;
  kinesthetic: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  gender: string;
  age: number;
  education: string;
  university: string;
  fieldOfStudy: string;
  country: string;
  learningStyle?: LearningStyleType;
  learningScores?: VARKScores;
  loginTime: number;
  sessionCount: number;
}

export type EventType = 
  | 'PAGE_VIEW' 
  | 'CLICK' 
  | 'SLIDER_CHANGE' 
  | 'AR_INTERACTION' 
  | 'DWELL_TIME' 
  | 'QUIZ_COMPLETE'
  | 'REFLECTION_LOG'
  | 'VOICE_INTERACTION';

export interface AnalyticsEvent {
  userId: string;
  timestamp: number;
  eventType: EventType;
  target?: string; 
  value?: number; 
  interEventTime: number; 
  sequenceIndex: number;  
  metadata?: any;         
}

export interface QuizResult {
  userId: string;
  score: number;
  totalQuestions: number;
}

export interface FeedbackSubmission {
  userId: string;
  ratings: Record<string, number>; 
  openEnded: Record<string, string>;
}