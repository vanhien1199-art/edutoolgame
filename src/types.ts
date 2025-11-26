export type GameType = 'quiz' | 'matching' | 'wheel' | 'sequencing' | 'simulation' | 'fast_quiz' | 'comparison' | 'number_grid' | 'keyword_guess' | 'mystery_box';

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
  content?: string; // For sequencing items or general content
  // For Quiz / Fast Quiz
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
    backgroundTheme?: string;
  };
  // For Comparison (Common/Diff)
  comparisonConfig?: {
    groupA: string; // Label A (e.g. Tế bào thực vật)
    groupB: string; // Label B (e.g. Tế bào động vật)
    items: { id: string; content: string; belongsTo: 'A' | 'B' | 'Both' }[];
  };
  // For Keyword Guessing
  keywordConfig?: {
    keywords: string[]; // List of 3-4 keywords
    finalAnswer: string; // The hidden lesson topic
  };
  // For Mystery Box
  mysteryConfig?: {
    hints: string[]; // 3-4 hints
    itemContent: string; // What is inside the box
  };
}

export interface GeneratedContent {
  title: string;
  description: string;
  questions: QuestionItem[];
}
