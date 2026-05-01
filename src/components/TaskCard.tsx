import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { TaskCategory } from '../types';

interface TaskCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category: TaskCategory;
  onClick: (category: TaskCategory) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ title, description, icon: Icon, category, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(category)}
      className="flex flex-col items-start p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all text-left w-full"
      id={`task-card-${category}`}
    >
      <div className="p-3 bg-slate-50 rounded-xl mb-4 group-hover:bg-blue-50 transition-colors">
        <Icon size={24} className="text-slate-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 line-clamp-2">{description}</p>
    </motion.button>
  );
}
