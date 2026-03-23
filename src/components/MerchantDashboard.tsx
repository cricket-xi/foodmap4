import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Store, TrendingUp, Ticket, BarChart3, LogOut, Megaphone, Users, Star, CheckCircle2, QrCode, MessageSquare, AlertTriangle, ShieldAlert, Utensils, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { fetchMerchantStats, publishCoupon, verifyCoupon, replyToReview, appealReview, fetchRestaurantById, updateRestaurantMenu } from '../services/api';
import { motion } from 'motion/react';

interface MerchantDashboardProps {
  onLogout: () => void;
  currentUser?: any;
}

type StoreStatus = 'open' | 'closed' | 'busy';

export default function MerchantDashboard({ onLogout, currentUser }: MerchantDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'analytics' | 'marketing' | 'verification' | 'reviews' | 'settings'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [storeStatus, setStoreStatus] = useState<StoreStatus>('open');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Menu Modal State
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<any>(null);
  const [menuForm, setMenuForm] = useState({ name: '', price: '', stock: '' });

  // Mock Orders
  const [orders, setOrders] = useState([
    { id: 'ORD-001', customer: '张同学', items: '招牌麻辣烫套餐 x1', total: 25, status: 'pending', time: '10分钟前' },
    { id: 'ORD-002', customer: '李同学', items: '肥牛卷 x2, 娃娃菜 x1', total: 42, status: 'preparing', time: '25分钟前' },
    { id: 'ORD-003', customer: '王同学', items: '撒尿牛丸 x1', total: 12, status: 'completed', time: '1小时前' },
  ]);

  // Mock menu items for demonstration
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    fetchMerchantStats(currentUser?.id).then(setStats);
    const restaurantId = currentUser?.id ? String(currentUser.id - 100) : '1';
    fetchRestaurantById(restaurantId).then(res => {
      if (res && res.menu) {
        setMenuItems(res.menu.map((m: any, i: number) => ({
          id: i + 1,
          name: m.name,
          price: m.price,
          sales: Math.floor(Math.random() * 1000),
          stock: 999,
          status: 'on'
        })));
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const syncMenuToDB = async (newItems: any[]) => {
    const apiMenu = newItems.map(item => ({
      name: item.name,
      price: item.price,
      recommended: false
    }));
    const restaurantId = currentUser?.id ? String(currentUser.id - 100) : '1';
    await updateRestaurantMenu(restaurantId, apiMenu);
  };

  // Coupon Form State
  const [couponForm, setCouponForm] = useState({
    title: '',
    discountAmount: '',
    minSpend: '',
    totalQuantity: '100',
    validUntil: ''
  });

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        restaurantId: currentUser?.id ? currentUser.id - 100 : 1, // Use actual merchant ID or fallback
        title: couponForm.title,
        discountAmount: Number(couponForm.discountAmount),
        minSpend: Number(couponForm.minSpend),
        totalQuantity: Number(couponForm.totalQuantity),
        remainingQuantity: Number(couponForm.totalQuantity),
        validUntil: new Date(couponForm.validUntil).toISOString(),
        status: 'ACTIVE'
      };
      
      const res = await publishCoupon(payload);
      showToast('发布成功！已推送到周边学生端。');
      setCouponForm({
        title: '',
        discountAmount: '',
        minSpend: '',
        totalQuantity: '100',
        validUntil: ''
      });
    } catch (error) {
      showToast('发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    setIsSubmitting(true);
    try {
      const res = await verifyCoupon('TEST_CODE');
      showToast(res.message || '核销成功！');
    } catch (error) {
      showToast('核销失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (id: number) => {
    try {
      const res = await replyToReview(id, '感谢您的评价！');
      showToast(res.message || '回复成功！');
    } catch (error) {
      showToast('回复失败，请重试');
    }
  };

  const handleAppeal = async (id: number) => {
    try {
      const res = await appealReview(id, '恶意差评');
      showToast(res.message || '申诉已提交，平台将尽快处理。');
    } catch (error) {
      showToast('申诉失败，请重试');
    }
  };

  const toggleMenuStatus = (id: number) => {
    const newItems = menuItems.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === 'on' ? 'off' : 'on' };
      }
      return item;
    });
    setMenuItems(newItems);
    syncMenuToDB(newItems);
    showToast('商品状态已更新');
  };

  const handleOpenMenuModal = (item?: any) => {
    if (item) {
      setEditingMenuItem(item);
      setMenuForm({ name: item.name, price: item.price.toString(), stock: item.stock.toString() });
    } else {
      setEditingMenuItem(null);
      setMenuForm({ name: '', price: '', stock: '' });
    }
    setShowMenuModal(true);
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    let newItems;
    if (editingMenuItem) {
      newItems = menuItems.map(item => 
        item.id === editingMenuItem.id 
          ? { ...item, name: menuForm.name, price: Number(menuForm.price), stock: Number(menuForm.stock) } 
          : item
      );
      setMenuItems(newItems);
      showToast('商品已更新');
    } else {
      const newItem = {
        id: Date.now(),
        name: menuForm.name,
        price: Number(menuForm.price),
        sales: 0,
        stock: Number(menuForm.stock),
        status: 'on'
      };
      newItems = [newItem, ...menuItems];
      setMenuItems(newItems);
      showToast('商品已添加');
    }
    syncMenuToDB(newItems);
    setShowMenuModal(false);
  };

  const handleDeleteMenu = (id: number) => {
    const newItems = menuItems.filter(item => item.id !== id);
    setMenuItems(newItems);
    syncMenuToDB(newItems);
    showToast('商品已删除');
  };

  const handleUpdateOrderStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
    showToast('订单状态已更新');
  };

  if (!stats) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getStatusColor = (status: StoreStatus) => {
    switch(status) {
      case 'open': return 'bg-green-500';
      case 'closed': return 'bg-gray-400';
      case 'busy': return 'bg-red-500';
    }
  };

  const getStatusText = (status: StoreStatus) => {
    switch(status) {
      case 'open': return '营业中';
      case 'closed': return '已打烊';
      case 'busy': return '爆满排队中';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar / Bottom Nav */}
      <div className="bg-white border-r border-gray-200 md:w-64 flex-shrink-0 flex flex-col justify-between order-2 md:order-1 fixed bottom-0 w-full md:relative z-50">
        <div>
          <div className="p-6 hidden md:block">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Store className="text-blue-500" />
              商家中心
            </h1>
          </div>
          <nav className="flex md:flex-col p-2 md:p-4 gap-1 md:gap-2 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex-shrink-0 md:flex-none flex items-center justify-center md:justify-start gap-2 p-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Store size={18} />
              <span className="hidden md:inline">门店概览</span>
              <span className="md:hidden">概览</span>
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex-shrink-0 md:flex-none flex items-center justify-center md:justify-start gap-2 p-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Utensils size={18} />
              <span className="hidden md:inline">订单管理</span>
              <span className="md:hidden">订单</span>
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{orders.filter(o => o.status === 'pending').length}</span>
            </button>
            <button 
              onClick={() => setActiveTab('menu')}
              className={`flex-shrink-0 md:flex-none flex items-center justify-center md:justify-start gap-2 p-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'menu' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Utensils size={18} />
              <span className="hidden md:inline">商品管理</span>
              <span className="md:hidden">商品</span>
            </button>
            <button 
              onClick={() => setActiveTab('verification')}
              className={`flex-shrink-0 md:flex-none flex items-center justify-center md:justify-start gap-2 p-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'verification' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <QrCode size={18} />
              <span className="hidden md:inline">扫码核销</span>
              <span className="md:hidden">核销</span>
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex-shrink-0 md:flex-none flex items-center justify-center md:justify-start gap-2 p-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'reviews' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <MessageSquare size={18} />
              <span className="hidden md:inline">评价管理</span>
              <span className="md:hidden">评价</span>
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`flex-shrink-0 md:flex-none flex items-center justify-center md:justify-start gap-2 p-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <BarChart3 size={18} />
              <span className="hidden md:inline">数据分析</span>
              <span className="md:hidden">数据</span>
            </button>
            <button 
              onClick={() => setActiveTab('marketing')}
              className={`flex-shrink-0 md:flex-none flex items-center justify-center md:justify-start gap-2 p-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'marketing' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Megaphone size={18} />
              <span className="hidden md:inline">营销投放</span>
              <span className="md:hidden">营销</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-shrink-0 md:flex-none flex items-center justify-center md:justify-start gap-2 p-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Settings size={18} />
              <span className="hidden md:inline">门店设置</span>
              <span className="md:hidden">设置</span>
            </button>
          </nav>
        </div>
        <div className="p-4 hidden md:block border-t border-gray-100">
          <button onClick={onLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors w-full p-2 text-sm font-medium">
            <LogOut size={18} />
            退出登录
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0 order-1 md:order-2">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800 hidden md:block">{stats.storeName}</h2>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(storeStatus)}`}></span>
              <span className="text-sm text-gray-600 font-medium">{getStatusText(storeStatus)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setStoreStatus('open')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${storeStatus === 'open' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                营业
              </button>
              <button 
                onClick={() => setStoreStatus('busy')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${storeStatus === 'busy' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                爆满
              </button>
              <button 
                onClick={() => setStoreStatus('closed')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${storeStatus === 'closed' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                打烊
              </button>
            </div>
            <button onClick={onLogout} className="md:hidden text-gray-500 hover:text-red-500 ml-2">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="p-4 md:p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <Users size={16} />
                      <span className="text-sm font-medium">今日浏览</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.todayViews}</div>
                    <div className="text-xs text-green-500 flex items-center mt-1 font-medium">
                      <TrendingUp size={12} className="mr-1" /> +12.5% 较昨日
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <Ticket size={16} />
                      <span className="text-sm font-medium">领券数</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.todayCoupons}</div>
                    <div className="text-xs text-green-500 flex items-center mt-1 font-medium">
                      <TrendingUp size={12} className="mr-1" /> +5.2% 较昨日
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <Store size={16} />
                      <span className="text-sm font-medium">核销数</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.todayRedeemed}</div>
                    <div className="text-xs text-gray-400 flex items-center mt-1 font-medium">
                      持平 较昨日
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <Star size={16} />
                      <span className="text-sm font-medium">TrustScore</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.trustScore}</div>
                    <div className="text-xs text-blue-500 flex items-center mt-1 font-medium">
                      打败了 85% 的同城商家
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">近7天流量趋势</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.trafficData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="views" name="浏览量" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="clicks" name="点击量" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'verification' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <QrCode size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">扫码核销</h3>
                  <p className="text-gray-500 mb-8">请扫描学生出示的优惠券二维码</p>
                  
                  <div className="w-64 h-64 bg-gray-100 rounded-2xl mx-auto mb-8 relative overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="absolute inset-0 bg-blue-500 opacity-10 animate-pulse"></div>
                    <div className="w-full h-1 bg-blue-500 absolute top-1/2 left-0 transform -translate-y-1/2 shadow-[0_0_10px_#3b82f6]"></div>
                    <span className="text-gray-400 font-medium">摄像头画面</span>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                      唤起摄像头
                    </button>
                    <button onClick={handleVerify} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-xl transition-colors">
                      手动输入核销码
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">最新评价</h3>
                    <div className="flex gap-2">
                      <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none">
                        <option>全部评价</option>
                        <option>好评 (红榜)</option>
                        <option>差评 (黑榜)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Review 1 */}
                    <div className="border-b border-gray-100 pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <img src="https://picsum.photos/seed/user1/100/100" className="w-10 h-10 rounded-full" alt="user" />
                          <div>
                            <div className="font-bold text-sm">干饭小能手</div>
                            <div className="flex text-orange-400 text-xs mt-0.5">
                              <Star size={12} className="fill-current" /><Star size={12} className="fill-current" /><Star size={12} className="fill-current" /><Star size={12} className="fill-current" /><Star size={12} className="fill-current" />
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">昨天 12:30</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">味道一如既往的好，阿姨给的肉很多，下次还来！</p>
                      <div className="flex gap-3">
                        <button onClick={() => handleReply(1)} className="text-sm text-blue-600 font-medium hover:text-blue-800">回复</button>
                      </div>
                    </div>
                    
                    {/* Review 2 - Bad Review */}
                    <div className="border-b border-gray-100 pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <img src="https://picsum.photos/seed/user2/100/100" className="w-10 h-10 rounded-full" alt="user" />
                          <div>
                            <div className="font-bold text-sm">挑剔的食客</div>
                            <div className="flex text-orange-400 text-xs mt-0.5">
                              <Star size={12} className="fill-current" /><Star size={12} className="text-gray-300" /><Star size={12} className="text-gray-300" /><Star size={12} className="text-gray-300" /><Star size={12} className="text-gray-300" />
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">前天 18:45</span>
                      </div>
                      <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm mb-3 border border-red-100">
                        <AlertTriangle size={16} className="inline mr-1 mb-0.5" />
                        触发黑榜预警：包含敏感词"态度差"
                      </div>
                      <p className="text-sm text-gray-700 mb-3">今天去吃感觉菜不新鲜，而且服务员态度很差，爱答不理的，避雷！</p>
                      <div className="flex gap-3">
                        <button onClick={() => handleReply(2)} className="text-sm text-blue-600 font-medium hover:text-blue-800">回复致歉</button>
                        <button onClick={() => handleAppeal(2)} className="text-sm text-gray-500 font-medium hover:text-gray-700 flex items-center">
                          <ShieldAlert size={14} className="mr-1" /> 申诉恶意差评 (剩余1次)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">用户画像分析</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-4">客源学校分布</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.schoolData} layout="vertical" margin={{ left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#4b5563'}} />
                            <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="value" name="客流占比(%)" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-4">评价情感分析</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">正面评价 (红榜倾向)</span>
                            <span className="font-bold text-green-600">78%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">中性评价</span>
                            <span className="font-bold text-yellow-600">15%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">负面评价 (黑榜倾向)</span>
                            <span className="font-bold text-red-600">7%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '7%' }}></div>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <h5 className="text-sm font-bold text-blue-800 mb-2">AI 经营建议</h5>
                          <p className="text-sm text-blue-700 leading-relaxed">
                            近期关于"上菜慢"的负面提及率上升了 3%。建议在高峰期优化出餐流程。您的"分量足"标签极受广工学生欢迎，可在营销中重点突出。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'marketing' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                      <Ticket size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">发布学生专享券</h3>
                      <p className="text-sm text-gray-500">吸引周边学生到店消费</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handlePublish} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">优惠券标题</label>
                      <input 
                        type="text" 
                        required
                        placeholder="例如：满50减10"
                        value={couponForm.title}
                        onChange={(e) => setCouponForm({...couponForm, title: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">折扣金额 (元)</label>
                        <input 
                          type="number" 
                          required
                          min="0"
                          step="0.01"
                          value={couponForm.discountAmount}
                          onChange={(e) => setCouponForm({...couponForm, discountAmount: e.target.value})}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">最低消费 (元)</label>
                        <input 
                          type="number" 
                          required
                          min="0"
                          step="0.01"
                          value={couponForm.minSpend}
                          onChange={(e) => setCouponForm({...couponForm, minSpend: e.target.value})}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">发放数量</label>
                        <input 
                          type="number" 
                          required
                          min="1"
                          value={couponForm.totalQuantity}
                          onChange={(e) => setCouponForm({...couponForm, totalQuantity: e.target.value})}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">有效期至</label>
                        <input 
                          type="date" 
                          required
                          value={couponForm.validUntil}
                          onChange={(e) => setCouponForm({...couponForm, validUntil: e.target.value})}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition-colors mt-2"
                    >
                      {isSubmitting ? '发布中...' : '一键发布'}
                    </button>
                  </form>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                      <Megaphone size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">购买定向曝光</h3>
                      <p className="text-sm text-gray-500">在特定场景榜单获取广告位</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:border-blue-500 cursor-pointer transition-colors">
                      <div>
                        <h4 className="font-bold text-gray-900">首页盲盒加权</h4>
                        <p className="text-xs text-gray-500 mt-1">提升在盲盒抽取中的概率 30%</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">¥99<span className="text-xs text-gray-500 font-normal">/周</span></div>
                        <button className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full mt-1 font-medium">购买</button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:border-blue-500 cursor-pointer transition-colors">
                      <div>
                        <h4 className="font-bold text-gray-900">深夜食堂榜推荐位</h4>
                        <p className="text-xs text-gray-500 mt-1">场景榜单 Top 3 固定展示 (带广告标识)</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">¥199<span className="text-xs text-gray-500 font-normal">/周</span></div>
                        <button className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full mt-1 font-medium">购买</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">订单管理</h3>
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-gray-900">{order.id}</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              order.status === 'pending' ? 'bg-red-100 text-red-600' :
                              order.status === 'preparing' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {order.status === 'pending' ? '待接单' : order.status === 'preparing' ? '制作中' : '已完成'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">顾客: {order.customer}</div>
                          <div className="text-sm text-gray-600 mb-1">内容: {order.items}</div>
                          <div className="text-sm text-gray-400">{order.time}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="font-bold text-lg text-orange-500">¥{order.total}</div>
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <button onClick={() => handleUpdateOrderStatus(order.id, 'preparing')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                接单
                              </button>
                            )}
                            {order.status === 'preparing' && (
                              <button onClick={() => handleUpdateOrderStatus(order.id, 'completed')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                制作完成
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">商品管理</h3>
                    <button onClick={() => handleOpenMenuModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                      <Plus size={16} /> 添加商品
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-sm text-gray-500">
                          <th className="pb-3 font-medium">商品名称</th>
                          <th className="pb-3 font-medium">价格</th>
                          <th className="pb-3 font-medium">月销</th>
                          <th className="pb-3 font-medium">库存</th>
                          <th className="pb-3 font-medium">状态</th>
                          <th className="pb-3 font-medium text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {menuItems.map(item => (
                          <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="py-4 font-medium text-gray-900">{item.name}</td>
                            <td className="py-4 text-gray-600">¥{item.price}</td>
                            <td className="py-4 text-gray-600">{item.sales}</td>
                            <td className="py-4 text-gray-600">{item.stock > 0 ? item.stock : <span className="text-red-500">售罄</span>}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'on' ? 'bg-green-100 text-green-700' : item.status === 'sold_out' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                {item.status === 'on' ? '上架中' : item.status === 'sold_out' ? '已售罄' : '已下架'}
                              </span>
                            </td>
                            <td className="py-4 text-right space-x-2">
                              <button onClick={() => toggleMenuStatus(item.id)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                {item.status === 'on' ? '下架' : '上架'}
                              </button>
                              <button onClick={() => handleOpenMenuModal(item)} className="text-sm text-gray-500 hover:text-gray-700">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDeleteMenu(item.id)} className="text-sm text-red-500 hover:text-red-700">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-3xl space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">基本信息</h3>
                  <form className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">门店名称</label>
                      <input type="text" defaultValue={stats.storeName} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">门店公告</label>
                      <textarea rows={3} defaultValue="欢迎光临！本店新推出特色麻辣拌，欢迎品尝。" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                        <input type="text" defaultValue="13800138000" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">营业时间</label>
                        <input type="text" defaultValue="10:00 - 22:00" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button type="button" onClick={() => showToast('设置已保存')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors">
                        保存修改
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle2 size={20} className="text-green-400" />
          {successMessage}
        </div>
      )}
      {/* Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">{editingMenuItem ? '编辑菜品' : '添加菜品'}</h3>
            <form onSubmit={handleSaveMenu} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">菜品名称</label>
                <input 
                  type="text" 
                  required
                  value={menuForm.name}
                  onChange={e => setMenuForm({...menuForm, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">价格 (元)</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  step="0.01"
                  value={menuForm.price}
                  onChange={e => setMenuForm({...menuForm, price: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">库存</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={menuForm.stock}
                  onChange={e => setMenuForm({...menuForm, stock: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowMenuModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">取消</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">保存</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
