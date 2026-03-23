import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LogOut, 
  BarChart3, 
  Users, 
  Store, 
  ShieldAlert, 
  Megaphone,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Bell
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { API_BASE_URL, fetchLogs } from '../services/api';

interface AdminDashboardProps {
  onLogout: () => void;
  currentUser: any;
}

const TABS = [
  { id: 'dashboard', label: '数据大盘', icon: BarChart3 },
  { id: 'users', label: '用户管理', icon: Users },
  { id: 'merchants', label: '商户管理', icon: Store },
  { id: 'risk', label: '内容风控', icon: ShieldAlert },
  { id: 'marketing', label: '营销资源', icon: Megaphone },
  { id: 'monitoring', label: '监控告警', icon: Bell },
];

export default function AdminDashboard({ onLogout, currentUser }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState('');
  const [logs, setLogs] = useState<any[]>([]);

  const MOCK_TRAFFIC_DATA = currentUser?.username === 'admin2' ? [
    { time: '08:00', uv: 2000, pv: 1200 },
    { time: '10:00', uv: 1500, pv: 800 },
    { time: '12:00', uv: 4000, pv: 5000 },
    { time: '14:00', uv: 1200, pv: 1500 },
    { time: '16:00', uv: 900, pv: 2000 },
    { time: '18:00', uv: 3000, pv: 4500 },
    { time: '20:00', uv: 1500, pv: 2000 },
  ] : [
    { time: '08:00', uv: 4000, pv: 2400 },
    { time: '10:00', uv: 3000, pv: 1398 },
    { time: '12:00', uv: 2000, pv: 9800 },
    { time: '14:00', uv: 2780, pv: 3908 },
    { time: '16:00', uv: 1890, pv: 4800 },
    { time: '18:00', uv: 2390, pv: 3800 },
    { time: '20:00', uv: 3490, pv: 4300 },
  ];

  const MOCK_FUNNEL_DATA = currentUser?.username === 'admin2' ? [
    { name: '曝光量', value: 5000 },
    { name: '领券量', value: 1500 },
    { name: '核销数', value: 400 },
  ] : [
    { name: '曝光量', value: 10000 },
    { name: '领券量', value: 3000 },
    { name: '核销数', value: 800 },
  ];

  useEffect(() => {
    if (activeTab === 'monitoring') {
      const loadLogs = async () => {
        try {
          const data = await fetchLogs(currentUser?.username);
          setLogs(data);
        } catch (error) {
          console.error('Error fetching logs:', error);
        }
      };
      loadLogs();
    }
  }, [activeTab]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Activity size={20} />
            </div>
            <h3 className="text-slate-500 font-medium">今日活跃用户 (DAU)</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{currentUser?.username === 'admin2' ? '8,230' : '12,450'}</p>
          <p className="text-sm text-emerald-500 mt-2 flex items-center gap-1">
            <TrendingUp size={14} /> {currentUser?.username === 'admin2' ? '+5.1%' : '+15.3%'} 较昨日
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Store size={20} />
            </div>
            <h3 className="text-slate-500 font-medium">入驻商户总数</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{currentUser?.username === 'admin2' ? '650' : '842'}</p>
          <p className="text-sm text-emerald-500 mt-2 flex items-center gap-1">
            <TrendingUp size={14} /> {currentUser?.username === 'admin2' ? '+1 家新入驻' : '+3 家新入驻'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-slate-500 font-medium">待处理风控事件</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{currentUser?.username === 'admin2' ? '5' : '24'}</p>
          <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
            <TrendingUp size={14} /> {currentUser?.username === 'admin2' ? '+1 新增投诉' : '+5 新增投诉'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">实时流量趋势</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_TRAFFIC_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#3b82f6" strokeWidth={3} dot={false} name="页面浏览量 (PV)" />
                <Line type="monotone" dataKey="uv" stroke="#10b981" strokeWidth={3} dot={false} name="独立访客 (UV)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">发券核销漏斗</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_FUNNEL_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 500}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">搜索热力图 (模拟)</h3>
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">查看完整地图</button>
        </div>
        <div className="h-64 bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-400 via-orange-200 to-transparent blur-xl transform scale-150"></div>
          <p className="text-slate-500 font-medium z-10 relative bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm">热力图数据加载中...</p>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">学生认证审核</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="搜索学号/姓名" className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
              <Filter size={18} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="p-4 font-medium">用户ID</th>
                <th className="p-4 font-medium">姓名/学号</th>
                <th className="p-4 font-medium">学校</th>
                <th className="p-4 font-medium">机审结果</th>
                <th className="p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-600">#U892{i}</td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800">张同学</div>
                    <div className="text-slate-500 text-xs">2021000{i}</div>
                  </td>
                  <td className="p-4 text-slate-600">广州大学</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      <CheckCircle2 size={12} /> 匹配度 98%
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => showToast('已通过认证')} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">通过</button>
                      <button onClick={() => showToast('已驳回认证')} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">驳回</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">C端账号管理</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <input type="text" placeholder="输入用户ID或手机号" className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
              搜索用户
            </button>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold">U</div>
              <div>
                <h4 className="font-medium text-slate-800">李同学 (ID: #U8924)</h4>
                <p className="text-sm text-slate-500">信用等级: 良好 (85分)</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => showToast('信用等级已调整')} className="px-3 py-1.5 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors">调整信用</button>
              <button onClick={() => showToast('账号已封禁')} className="px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors">封禁账号</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMerchants = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">营业执照审核</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
              POI纠偏合并
            </button>
          </div>
        </div>
        <div className="p-6 text-center text-slate-500 py-12">
          <Store size={48} className="mx-auto text-slate-300 mb-4" />
          <p>暂无待审核的商户入驻申请</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">涉事门店管理</h3>
        </div>
        <div className="p-6">
          <div className="border border-red-100 bg-red-50 rounded-xl p-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-red-800">张亮麻辣烫 (大学城店)</h4>
                <span className="px-2 py-0.5 bg-red-200 text-red-800 text-xs font-bold rounded">高危投诉</span>
              </div>
              <p className="text-sm text-red-600">多次被投诉食品安全问题，建议下架整改。</p>
            </div>
            <button onClick={() => showToast('门店已强制下架')} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
              强制下架
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRisk = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">评价申诉仲裁</h3>
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
            违禁词库管理
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded">恶意差评申诉</span>
                    <span className="text-slate-500 text-sm">商户：张亮麻辣烫</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">"用户评价：吃出虫子了，垃圾店！(机审未发现图片证据)"</p>
                  <p className="text-sm text-slate-500 mt-1">商户申诉理由：监控显示该顾客自带异物，纯属敲诈。</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => showToast('已隐藏该评价')} className="px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors">隐藏评价</button>
                  <button onClick={() => showToast('已驳回商户申诉')} className="px-3 py-1.5 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors">维持原判</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">图文敏感机审拦截</h3>
        </div>
        <div className="p-6">
          <div className="border border-slate-200 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-600 font-medium">拦截内容：包含违禁词 "最便宜"</p>
              <p className="text-xs text-slate-400 mt-1">发布者：某某餐饮店 (商户)</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => showToast('已人工放行')} className="px-3 py-1.5 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors">人工放行</button>
              <button onClick={() => showToast('已确认违规并删除')} className="px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors">确认违规</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketing = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Banner 资源位管理</h3>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
            + 新增投放
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-4 flex gap-4 items-center">
              <div className="w-24 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                Banner {i}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">开学季美食特惠</h4>
                <p className="text-xs text-slate-500 mt-1">投放时间: 2023.09.01 - 2023.09.15</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs text-slate-600">投放中 (点击率 4.2%)</span>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                下线
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">场景榜单人工干预</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-500 mb-4">调整 "深夜食堂" 榜单排序</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm font-medium text-slate-700">1. 烧烤摊</span>
                <button onClick={() => showToast('已调整排序')} className="text-xs text-emerald-600 font-medium">置顶</button>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm font-medium text-slate-700">2. 炒粉店</span>
                <button onClick={() => showToast('已调整排序')} className="text-xs text-emerald-600 font-medium">置顶</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">定向 Push</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">推送目标人群</label>
                <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>近7天未活跃用户</option>
                  <option>高频点餐用户</option>
                  <option>新注册用户</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">推送内容</label>
                <textarea rows={2} placeholder="输入推送文案..." className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
              </div>
              <button onClick={() => showToast('Push 任务已创建')} className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
                发送 Push
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">平台监控告警</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
              导出日志
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="p-4 font-medium">时间</th>
                <th className="p-4 font-medium">操作类型</th>
                <th className="p-4 font-medium">操作者角色</th>
                <th className="p-4 font-medium">操作者ID</th>
                <th className="p-4 font-medium">详情描述</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-600">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      log.actionType === 'SYSTEM_ALERT' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {log.actionType}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{log.actorRole}</td>
                  <td className="p-4 text-slate-600">{log.actorId || '-'}</td>
                  <td className="p-4 text-slate-800">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white mb-8">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <ShieldAlert size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight">总控中心</span>
          </div>
          
          <nav className="space-y-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-slate-500">超级管理员</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            退出登录
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {TABS.find(t => t.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">上次登录: 刚刚</span>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'merchants' && renderMerchants()}
            {activeTab === 'risk' && renderRisk()}
            {activeTab === 'marketing' && renderMarketing()}
            {activeTab === 'monitoring' && renderMonitoring()}
          </motion.div>
        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} className="text-emerald-400" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
