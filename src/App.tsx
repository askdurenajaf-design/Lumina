import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatBox } from './components/ChatBox';
import { TaskCard } from './components/TaskCard';
import { StudyTask, Message, TaskCategory } from './types';
import { getStudyHelp } from './services/geminiService';
import { 
  Calculator, 
  PenTool, 
  Code, 
  FileText, 
  Sparkles, 
  Menu, 
  X,
  BookOpen,
  LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_TEMPLATES: { title: string; description: string; icon: LucideIcon; category: TaskCategory }[] = [
  {
    title: 'Math Helper',
    description: 'Solve complex equations and understand step-by-step logic.',
    icon: Calculator,
    category: 'math'
  },
  {
    title: 'Essay Draftsman',
    description: 'Outline ideas, improve grammar, and polish your writing style.',
    icon: PenTool,
    category: 'writing'
  },
  {
    title: 'Code Tutor',
    description: 'Debug programs, understand algorithms, and learn new languages.',
    icon: Code,
    category: 'coding'
  },
  {
    title: 'Text Summarizer',
    description: 'Extract key insights and main ideas from long study materials.',
    icon: FileText,
    category: 'summarize'
  }
];

export default function App() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentTask = tasks.find(t => t.id === currentTaskId);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('lumina_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('lumina_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleNewTask = (category: TaskCategory = 'general', title: string = 'New Session') => {
    const newTask: StudyTask = {
      id: Math.random().toString(36).substring(7),
      title,
      category,
      messages: [],
      createdAt: Date.now()
    };
    setTasks([newTask, ...tasks]);
    setCurrentTaskId(newTask.id);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentTaskId) {
      // Create a task if none selected
      const taskId = Math.random().toString(36).substring(7);
      const newTask: StudyTask = {
        id: taskId,
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        category: 'general',
        messages: [{ role: 'user', content }],
        createdAt: Date.now()
      };
      setTasks([newTask, ...tasks]);
      setCurrentTaskId(taskId);
      
      await performAIAction(content, [], 'general', taskId);
    } else {
      const updatedTasks = tasks.map(t => {
        if (t.id === currentTaskId) {
          return {
            ...t,
            messages: [...t.messages, { role: 'user', content } as Message]
          };
        }
        return t;
      });
      setTasks(updatedTasks);
      
      const task = updatedTasks.find(t => t.id === currentTaskId)!;
      await performAIAction(content, task.messages.slice(0, -1), task.category, currentTaskId);
    }
  };

  const performAIAction = async (prompt: string, history: Message[], category: TaskCategory, taskId: string) => {
    setIsLoading(true);
    try {
      const response = await getStudyHelp(prompt, history, category);
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            messages: [...t.messages, { role: 'model', content: response }]
          };
        }
        return t;
      }));
    } catch (error) {
      console.error("AI Action failed", error);
      // Add error message to chat
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            messages: [...t.messages, { role: 'model', content: "Sorry, I encountered an error. Please try again." }]
          };
        }
        return t;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Mobile Navigation */}
      <motion.div
        animate={{ x: isSidebarOpen ? 0 : -320 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden shadow-2xl"
      >
        <Sidebar 
          tasks={tasks} 
          currentTaskId={currentTaskId} 
          onSelectTask={(id) => { setCurrentTaskId(id); setIsSidebarOpen(false); }}
          onNewTask={() => handleNewTask('general')}
        />
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>
      </motion.div>

      {/* Desktop Sidebar */}
      <Sidebar 
        tasks={tasks} 
        currentTaskId={currentTaskId} 
        onSelectTask={setCurrentTaskId}
        onNewTask={() => handleNewTask('general')}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
              id="mobile-menu-toggle"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 truncate">
                {currentTask ? currentTask.title : 'Study Assistant'}
              </span>
              {currentTask && (
                <div className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {currentTask.category}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tigh">Status</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-600">AI Ready</span>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Sparkles size={18} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-4 md:p-8 flex flex-col max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {!currentTaskId ? (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="flex-1 flex flex-col justify-center"
              >
                <div className="max-w-2xl mx-auto text-center mb-12">
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-6">
                    <Sparkles size={14} className="mr-2" />
                    Student AI Copilot
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4 font-sans">
                    What are we learning today?
                  </h1>
                  <p className="text-lg text-slate-500 font-medium">
                    Select a specialized tutor or just ask a question to get started. 
                    I'm here to help you understand, not just find answers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {INITIAL_TEMPLATES.map((template) => (
                    <TaskCard 
                      key={template.category}
                      category={template.category}
                      title={template.title}
                      description={template.description}
                      icon={template.icon}
                      onClick={(cat) => handleNewTask(cat, template.title)}
                    />
                  ))}
                </div>
                
                <div className="mt-12 text-center">
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                    <BookOpen size={12} />
                    Helping 10,000+ students succeed
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <ChatBox 
                  messages={currentTask?.messages || []} 
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
