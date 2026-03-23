import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Store, Lock, ArrowRight, MapPin } from 'lucide-react';
import { login } from '../services/api';

interface LoginProps {
  onLogin: (role: 'user' | 'merchant' | 'admin', user?: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<'user' | 'merchant'>('user');
  const [username, setUsername] = useState(role === 'user' ? 'student' : 'merchant');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (newRole: 'user' | 'merchant') => {
    setRole(newRole);
    setUsername(newRole === 'user' ? 'student' : 'merchant');
    setPassword('123456');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await login(username, password, role);
      if (res.success) {
        onLogin(role, res.user);
      } else {
        setError(res.message || '登录失败');
      }
    } catch (err) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative">
      <div className="absolute top-4 right-4">
        <button 
          onClick={() => onLogin('admin')} 
          className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
        >
          平台总控中心
        </button>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-orange-500 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
            <MapPin size={32} className="text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">校园食集</h1>
          <p className="text-orange-100 text-sm">大学城美食探索与决策辅助平台</p>
        </div>

        <div className="p-8">
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button 
              type="button"
              onClick={() => handleRoleChange('user')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'user' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <User size={16} />
              学生端
            </button>
            <button 
              type="button"
              onClick={() => handleRoleChange('merchant')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'merchant' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Store size={16} />
              商家端
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">账号</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 transition-colors"
                  placeholder="请输入账号"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 transition-colors"
                  placeholder="请输入密码"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all ${role === 'user' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${role === 'user' ? 'focus:ring-orange-500' : 'focus:ring-blue-500'} disabled:opacity-70`}
            >
              {loading ? '登录中...' : '立即登录'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="font-bold text-gray-700">测试账号提示：</span><br/>
              学生端：账号 <code className="bg-gray-200 px-1 rounded">student</code> 或 <code className="bg-gray-200 px-1 rounded">student2</code> 密码 <code className="bg-gray-200 px-1 rounded">123456</code><br/>
              商家端：账号 <code className="bg-gray-200 px-1 rounded">merchant</code> 或 <code className="bg-gray-200 px-1 rounded">merchant2</code> 密码 <code className="bg-gray-200 px-1 rounded">123456</code>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
