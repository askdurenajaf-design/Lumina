export type TaskCategory = 'math' | 'writing' | 'coding' | 'general' | 'summarize';

export interface Message {
  role: 'user' | 'model';
  content: string;
  isThinking?: boolean;
}

export interface StudyTask {
  id: string;
  title: string;
  category: TaskCategory;
  messages: Message[];
  createdAt: number;
}
