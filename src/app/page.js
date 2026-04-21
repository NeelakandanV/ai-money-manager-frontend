'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  PlusCircle, 
  LayoutDashboard,
  History,
  Settings,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SummaryCard from '@/components/SummaryCard';
import AIInsightCard from '@/components/AIInsightCard';
import Auth from '@/components/Auth';
import { apiCall } from '@/utils/api';
import { CURATED_CATEGORIES } from '@/utils/categories';

export default function Home() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: 'other',
    type: 'expense'
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, transData, insightData] = await Promise.all([
        apiCall('/transactions/stats', 'GET', null, user.token),
        apiCall('/transactions', 'GET', null, user.token),
        apiCall('/ai/insights', 'GET', null, user.token)
      ]);
      setStats(statsData);
      setTransactions(transData.slice(0, 5));
      setInsight(insightData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    try {
      await apiCall('/transactions', 'POST', newTransaction, user.token);
      setNewTransaction({ description: '', amount: '', category: 'other', type: 'expense' });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) {
    return <Auth onAuthSuccess={setUser} />;
  }

  if (loading && !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-2xl font-bold text-accent-primary font-outfit"
        >
          Analyzing your finances...
        </motion.div>
      </div>
    );
  }

  const spendingDiff = stats ? stats.currentTotal - stats.prevTotalUpToToday : 0;
  const isSpendingMore = spendingDiff > 0;

  return (
    <div className="flex min-h-screen bg-background text-text-main font-inter selection:bg-accent-primary/30">
      {/* Sidebar */}
      <aside className="w-72 bg-surface/50 backdrop-blur-xl border-r border-white/5 flex flex-col p-8 fixed h-full z-40">
        <div className="flex items-center gap-4 mb-14 px-2">
          <div className="w-11 h-11 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl flex items-center justify-center font-extrabold text-2xl font-outfit text-white shadow-lg shadow-accent-primary/20">
            $
          </div>
          <h1 className="text-2xl font-extrabold font-outfit tracking-tight">ZenMoney</h1>
        </div>
        
        <nav className="flex flex-col gap-1.5">
          <button className="flex items-center gap-4 p-4 rounded-xl font-semibold transition-all bg-accent-primary/10 text-accent-primary group">
            <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" /> Dashboard
          </button>
          <button className="flex items-center gap-4 p-4 rounded-xl font-medium transition-all text-text-secondary hover:bg-white/5 hover:text-text-main group">
            <History size={20} className="group-hover:scale-110 transition-transform" /> History
          </button>
          <button className="flex items-center gap-4 p-4 rounded-xl font-medium transition-all text-text-secondary hover:bg-white/5 hover:text-text-main group">
            <Settings size={20} className="group-hover:scale-110 transition-transform" /> Settings
          </button>
        </nav>

        <div className="mt-auto px-2">
          <button 
            className="flex items-center gap-4 py-4 px-2 rounded-xl font-medium transition-all text-text-muted hover:text-accent-danger group w-full"
            onClick={() => { localStorage.removeItem('user'); setUser(null); }}
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto p-12 min-h-screen flex flex-col">
          <motion.header 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-end mb-14"
          >
            <div>
              <h2 className="text-4xl font-extrabold mb-2 tracking-tight">
                Welcome back, <span className="text-gradient font-black">{user.name}</span>
              </h2>
              <p className="text-text-muted text-sm font-semibold uppercase tracking-[0.2em] opacity-80">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <button className="bg-white/5 border border-white/10 p-3 rounded-2xl text-text-secondary hover:bg-white/10 hover:text-text-main transition-all group">
                <Bell size={22} className="group-hover:rotate-12 transition-transform" />
              </button>
              <div className="w-12 h-12 rounded-2xl border-2 border-accent-primary/30 p-0.5 hover:border-accent-primary transition-colors cursor-pointer">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                  alt="Profile" 
                  className="rounded-[14px] w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.header>

          {/* Stats Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <SummaryCard 
              title="Monthly Salary" 
              amount={`₹${user.salary.toLocaleString()}`} 
              icon={TrendingUp} 
              trend={0} 
              type="income" 
              index={0}
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 border-accent-primary/20 relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-text-muted text-[11px] font-bold uppercase tracking-[0.2em]">Actual Spends</h3>
                <span className="bg-accent-primary/15 text-accent-primary text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider">
                  {stats?.percentOfIncome.toFixed(1)}% OF INCOME
                </span>
              </div>
              <p className="text-4xl font-black font-outfit text-text-main mb-8 relative z-10">
                ₹{stats?.currentTotal.toLocaleString()}
              </p>
              
              <div className={`flex items-center gap-2.5 p-3.5 rounded-xl text-[11px] font-extrabold w-fit relative z-10 transition-transform group-hover:scale-105 ${
                isSpendingMore ? 'bg-accent-danger/10 text-accent-danger' : 'bg-accent-success/10 text-accent-success'
              }`}>
                {isSpendingMore ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span className="uppercase tracking-wider">
                  Spending {isSpendingMore ? 'more' : 'less'} than last month
                </span>
              </div>
              {/* Refined Background Glow */}
              <div className={`absolute -bottom-16 -right-16 w-32 h-32 blur-[80px] opacity-20 rounded-full transition-opacity group-hover:opacity-30 ${isSpendingMore ? 'bg-accent-danger' : 'bg-accent-success'}`} />
            </motion.div>

            <SummaryCard 
              title="Savings Goal" 
              amount={`₹${user.savingsGoal.toLocaleString()}`} 
              icon={Wallet} 
              trend={0} 
              type="savings" 
              index={2}
            />
          </section>

          {/* AI Insight Section */}
          <AIInsightCard insight={insight} />

          {/* Bottom Section */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-10 mt-12 mb-12">
            <div className="glass p-10 xl:col-span-2">
              <div className="flex justify-between items-center mb-10 px-2">
                <h3 className="text-2xl font-bold font-outfit">Recent Transactions</h3>
                <button className="text-accent-primary font-bold text-xs uppercase tracking-widest hover:text-accent-secondary transition-colors">View Full History</button>
              </div>
              <div className="space-y-3">
                {transactions.map((t, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.5 }}
                    key={i} 
                    className="flex justify-between items-center p-5 bg-white/[0.01] border border-white/[0.03] rounded-2xl hover:bg-white/[0.03] hover:border-white/10 transition-all group cursor-default shadow-sm hover:shadow-lg"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${t.type === 'income' ? 'bg-accent-success/5 text-accent-success' : 'bg-white/5 text-text-secondary'}`}>
                        {t.type === 'income' ? '$' : t.category?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-bold text-text-main group-hover:text-accent-primary transition-colors">{t.description}</p>
                        <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">{t.category} • {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <p className={`font-black font-outfit text-xl ${t.type === 'income' ? 'text-accent-success' : 'text-text-main'}`}>
                      {t.type === 'expense' ? '-' : '+'}₹{t.amount.toLocaleString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <aside className="glass p-10 h-fit space-y-8">
              <div>
                <h3 className="text-2xl font-bold font-outfit mb-2">Quick Tracker</h3>
                <p className="text-text-muted text-xs font-medium uppercase tracking-widest opacity-70">Add transaction instantly</p>
              </div>
              <div className="flex flex-col gap-5">
                <div className="space-y-1.5 px-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Netflix Subscription" 
                    className="input-field py-3.5 text-sm" 
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5 px-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Amount (₹)</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="input-field py-3.5 text-sm"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5 px-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Category</label>
                  <div className="relative group">
                    <select 
                      className="input-field py-3.5 text-sm appearance-none bg-surface cursor-pointer pr-10"
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    >
                      {CURATED_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted group-hover:text-text-main transition-colors select-none">
                      ▼
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleAddTransaction} 
                  className="btn btn-primary w-full justify-center py-4 mt-4 shadow-accent-primary/20 hover:shadow-2xl active:scale-95"
                >
                  <PlusCircle size={20} /> Create Record
                </button>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}
