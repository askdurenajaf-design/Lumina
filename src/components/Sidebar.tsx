import React from 'react';
import { BookOpen, History, Plus, MessageSquare } from 'lucide-react';
import { StudyTask } from '../types';

interface SidebarProps {
  tasks: StudyTask[];
  currentTaskId: string | null;
  onSelectTask: (id: string) => void;
  onNewTask: () => void;
}

export function Sidebar({ tasks, currentTaskId, onSelectTask, onNewTask }: SidebarProps) {
  return (
    <div className="w-80 h-full border-r border-slate-200 bg-white flex flex-col hidden lg:flex" id="sidebar">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 bg-blue-600 rounded-lg">
            <BookOpen size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Lumina</span>
        </div>

        <button
          onClick={onNewTask}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors mb-8 shadow-sm"
          id="new-task-button"
        >
          <Plus size={18} />
          <span className="font-medium text-sm">New Study Session</span>
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 px-2 py-2 text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-2">
            <History size={12} />
            <span>Recent Tasks</span>
          </div>
          
          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-300px)] px-1">
            {tasks.length === 0 ? (
              <p className="text-xs text-slate-400 px-2 py-4 italic">No sessions yet</p>
            ) : (
              tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onSelectTask(task.id)}
                  className={`w-full flex flex-col items-start px-4 py-3 rounded-xl transition-all ${
                    currentTaskId === task.id 
                      ? 'bg-blue-50 border border-blue-100 text-blue-700' 
                      : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <MessageSquare size={14} className={currentTaskId === task.id ? 'text-blue-500' : 'text-slate-400'} />
                    <span className="text-sm font-medium truncate flex-1 text-left">{task.title}</span>
                  </div>
                  <span className="text-[10px] mt-1 opacity-60">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
            SN
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-900">Student Mode</span>
            <span className="text-[10px] text-slate-500">Free Tier</span>
          </div>
        </div>
      </div>
    </div>
  );
}
