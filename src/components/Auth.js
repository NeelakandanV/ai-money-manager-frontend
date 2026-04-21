'use client';
import { useState } from 'react';
import { apiCall } from '@/utils/api';
import { Mail, Lock, User, Banknote, Target, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    salary: '',
    savingsGoal: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const endpoint = isLogin ? '/users/login' : '/users';
    
    try {
      const data = await apiCall(endpoint, 'POST', {
        ...formData,
        salary: Number(formData.salary),
        savingsGoal: Number(formData.savingsGoal)
      });
      localStorage.setItem('user', JSON.stringify(data));
      onAuthSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0b0d] overflow-hidden">
      {/* Left side - Visual/Brand (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 xl:p-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#0a0b0d]" />
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-accent-primary/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent-secondary/15 blur-[150px] rounded-full animate-pulse delay-700" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center shadow-2xl">
              <span className="text-xl font-black text-white font-outfit">$</span>
            </div>
            <h1 className="text-xl font-black font-outfit text-white tracking-tight">ZenMoney</h1>
          </div>
          
          <h2 className="text-4xl xl:text-6xl font-black font-outfit text-white mb-4 xl:mb-6 leading-tight tracking-tighter">
            Balance your <br />
            <span className="text-gradient">Financial Life.</span>
          </h2>
          <p className="text-slate-400 text-base xl:text-xl font-medium max-w-sm leading-relaxed opacity-80">
            The intelligent personal finance coach designed to bring clarity and peace to your wealth management.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10"><ShieldCheck size={18} className="text-accent-primary" /></div>
            <div>
              <h4 className="text-white text-xs font-bold mb-1">Secure</h4>
              <p className="text-slate-500 text-[10px] font-medium leading-tight">Bank-grade encryption for all your data.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10"><Zap size={18} className="text-accent-primary" /></div>
            <div>
              <h4 className="text-white text-xs font-bold mb-1">Instant</h4>
              <p className="text-slate-500 text-[10px] font-medium leading-tight">Real-time stats and AI-driven insights.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 xl:p-16 bg-[#0a0b0d] relative overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-[420px] 2xl:max-w-[460px]">
          <div className="mb-8 2xl:mb-12">
            <div className="lg:hidden flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-black text-accent-primary font-outfit">$</span>
                </div>
                <h1 className="text-lg font-black font-outfit text-white tracking-tight">ZenMoney</h1>
            </div>
            <h3 className={`text-3xl xl:text-4xl 2xl:text-5xl font-black font-outfit mb-3 leading-tight tracking-tighter ${!isLogin ? 'text-gradient' : 'text-white'}`}>
              {isLogin ? 'Welcome Back' : 'Join ZenMoney'}
            </h3>
            <p className="text-slate-500 text-xs xl:text-sm font-medium opacity-80">
              {isLogin ? 'Enter your details to access your account' : 'Unlock your financial potential with ZenMoney'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 xl:gap-8">
            <div className="space-y-4 xl:space-y-6">
              {!isLogin && (
                <div className="group">
                  <div className="flex items-center gap-2.5 mb-2 ml-1">
                    <User size={14} className="text-accent-primary opacity-70 group-focus-within:opacity-100 transition-opacity" />
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] group-focus-within:text-accent-primary transition-colors">Full Name</label>
                  </div>
                  <input
                    name="name"
                    placeholder="Enter your name"
                    className="input-field py-3 xl:py-4 bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:border-accent-primary/40 transition-all font-medium text-white text-sm"
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="group">
                <div className="flex items-center gap-2.5 mb-2 ml-1">
                  <Mail size={14} className="text-accent-primary opacity-70 group-focus-within:opacity-100 transition-opacity" />
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] group-focus-within:text-accent-primary transition-colors">Email Address</label>
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  className="input-field py-3 xl:py-4 bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:border-accent-primary/40 transition-all font-medium text-white text-sm"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="group">
                <div className="flex items-center gap-2.5 mb-2 ml-1">
                  <Lock size={14} className="text-accent-primary opacity-70 group-focus-within:opacity-100 transition-opacity" />
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] group-focus-within:text-accent-primary transition-colors">Password</label>
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  className="input-field py-3 xl:py-4 bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:border-accent-primary/40 transition-all font-medium text-white text-sm"
                  onChange={handleChange}
                  required
                />
              </div>

              {!isLogin && (
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="group">
                    <div className="flex items-center gap-2 mb-2 ml-1">
                      <Banknote size={14} className="text-accent-primary" />
                      <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-[0.1em]">Salary (₹)</label>
                    </div>
                    <input
                      name="salary"
                      type="number"
                      placeholder="Monthly"
                      className="input-field py-3 bg-white/[0.03] border-white/5 text-xs"
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                  <div className="group">
                    <div className="flex items-center gap-2 mb-2 ml-1">
                      <Target size={14} className="text-accent-primary" />
                      <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-[0.1em]">Goal (₹)</label>
                    </div>
                    <input
                      name="savingsGoal"
                      type="number"
                      placeholder="Target"
                      className="input-field py-3 bg-white/[0.03] border-white/5 text-xs"
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-accent-danger/5 border border-accent-danger/10 flex items-center gap-3">
                <Sparkles size={14} className="text-accent-danger" />
                <p className="text-accent-danger text-[10px] font-bold leading-none">{error}</p>
              </div>
            )}
            
            <div className="flex flex-col gap-4 xl:gap-6">
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn btn-primary w-full justify-center py-3.5 xl:py-4 font-black shadow-lg shadow-accent-primary/10 active:scale-[0.98] transition-all disabled:opacity-50 text-sm xl:text-base"
              >
                {isLoading ? '...' : (isLogin ? 'Sign In' : 'Create Account')}
                {!isLoading && <ArrowRight size={18} className="ml-2" />}
              </button>

              <div className="text-center">
                <p className="text-slate-500 text-[11px] xl:text-xs font-medium">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    onClick={() => setIsLogin(!isLogin)} 
                    className="text-accent-primary font-bold hover:text-accent-secondary transition-colors underline-offset-4 hover:underline"
                  >
                    {isLogin ? 'Join ZenMoney' : 'Sign In Now'}
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
