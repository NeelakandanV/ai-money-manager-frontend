'use client';
import { motion } from 'framer-motion';

export default function SummaryCard({ title, amount, icon: Icon, trend, type, index }) {
  const isPositive = trend > 0;
  
  const typeStyles = {
    income: 'text-accent-success',
    expense: 'text-accent-danger',
    savings: 'text-accent-primary',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card flex flex-col gap-6 min-w-[250px] flex-1 hover:border-white/20 transition-all cursor-default group"
    >
      <div className="flex justify-between items-center">
        <div className="bg-white/5 p-3 rounded-xl flex items-center justify-center group-hover:bg-accent-primary/10 transition-colors">
          {Icon && <Icon size={20} className="text-accent-primary group-hover:scale-110 transition-transform" />}
        </div>
        {trend !== 0 && (
          <span className={`text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-tighter ${
            isPositive ? 'bg-accent-success/10 text-accent-success' : 'bg-accent-danger/10 text-accent-danger'
          }`}>
            {isPositive ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <h3 className="text-text-muted text-[11px] font-bold uppercase tracking-[0.2em] mb-2">{title}</h3>
        <p className={`text-3xl font-extrabold font-outfit ${typeStyles[type]}`}>
          {amount}
        </p>
      </div>
    </motion.div>
  );
}
