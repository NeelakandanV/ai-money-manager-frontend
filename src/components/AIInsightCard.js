'use client';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AIInsightCard({ insight }) {
  if (!insight) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-10 mt-8 border-accent-primary/20 relative overflow-hidden"
    >
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent-primary/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-accent-secondary/5 blur-[100px] rounded-full" />

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Sparkles className="text-yellow-400" size={24} />
          </motion.div>
          <h2 className="text-2xl font-bold font-outfit">AI Coach Analysis</h2>
        </div>
        <div className="bg-accent-primary/10 text-accent-primary px-3 py-1.5 rounded-lg text-xs font-bold uppercase border border-accent-primary/20 tracking-widest">
          Experimental
        </div>
      </div>

      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/[0.02] p-8 rounded-2xl border-l-[6px] border-accent-primary mb-10 relative z-10"
      >
        <p className="text-xl text-text-main font-medium leading-relaxed italic opacity-90">
          "{insight.summary}"
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h3 className="flex items-center gap-3 text-lg font-bold text-text-main uppercase tracking-widest text-[13px]">
            <AlertCircle size={20} className="text-accent-danger" />
            Detected Issues
          </h3>
          <ul className="space-y-3">
            {insight.issues.map((issue, idx) => (
              <li key={idx} className="text-text-secondary text-sm py-3 border-b border-white/[0.05] last:border-0 hover:text-text-main transition-colors">
                {issue}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <h3 className="flex items-center gap-3 text-lg font-bold text-text-main uppercase tracking-widest text-[13px]">
            <CheckCircle2 size={20} className="text-accent-success" />
            Strategic Suggestions
          </h3>
          <ul className="space-y-3">
            {insight.suggestions.map((suggestion, idx) => (
              <li key={idx} className="flex items-start gap-4 text-text-secondary text-sm p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl hover:bg-white/[0.06] hover:text-text-main transition-all group">
                <div className="bg-accent-success/10 p-1.5 rounded-lg group-hover:bg-accent-success/20 transition-colors">
                  <ArrowRight size={14} className="text-accent-success" />
                </div>
                <span className="flex-1 mt-1 leading-relaxed">{suggestion}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="flex justify-end pt-8 border-t border-white/[0.05] relative z-10">
        <button className="btn btn-primary group">
          Improve Savings Logic
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
