export type GameType = 'quiz' | 'matching' | 'wheel' | 'sequencing' | 'simulation';

export interface GameConfig {
  bookSeries: string;
  subject: string;
  grade: string;
  lessonName: string;
  activityType: 'warmup' | 'practice';
  gameType: GameType;
  questionCount: number;
}

export interface SimulationItem {
  id: string;
  content: string; // Text or Emoji
  zoneId: string; // The correct zone ID it belongs to
}

export interface SimulationZone {
  id: string;
  label: string;
  color?: string;
}

export interface QuestionItem {
  id: string;
  question: string;
  content?: string; // For sequencing items
  // For Quiz
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  // For Matching
  matchPair?: { left: string; right: string };
  // For Wheel
  wheelLabel?: string;
  // For Sequencing
  sequenceOrder?: number; // 1, 2, 3...
  // For Simulation (Warm-up)
  simulationConfig?: {
    zones: SimulationZone[];
    items: SimulationItem[];
    backgroundTheme?: string; // Description for UI hint
  };
}

export interface GeneratedContent {
  title: string;
  description: string;
  questions: QuestionItem[];
}