import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, ArrowRight, User } from 'lucide-react';
import { login } from '../services/api';

interface AdminLoginProps {
  onLogin: (role: 'admin', user?: any) => void;
  onBack: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(username, password, 'admin');
      if (result.success) {
        onLogin('admin', result.user);
      } else {
        setError(result.message || '账号或密码错误');
      }
    } catch (err) {
      setError('网络错误，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1"
      >
        &larr; 返回普通登录
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700"
      >
        <div className="bg-slate-900 p-8 text-center text-white border-b border-slate-700">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-inner border border-slate-700">
            <Shield size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 text-slate-100">平台总控中心</h1>
          <p className="text-slate-400 text-sm">O端运营 / 校园大使 专属通道</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">管理员账号</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-900 text-white transition-colors placeholder-slate-500"
                  placeholder="请输入账号"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">安全密码</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-900 text-white transition-colors placeholder-slate-500"
                  placeholder="请输入密码"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-900 transition-all disabled:opacity-70"
            >
              {loading ? '验证中...' : '安全登录'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
              <span className="font-bold text-slate-400">测试账号：</span>
              <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400 ml-1">admin</code> 或 <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400 ml-1">admin2</code> / <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">123456</code>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
