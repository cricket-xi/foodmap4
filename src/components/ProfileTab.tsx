import { useState, useEffect } from 'react';
import { Heart, MessageSquare, Settings, ChevronRight, Award, MapPin, Bell, Shield, LogOut, User, Lock, Utensils, Moon, HelpCircle, Info, Trash2, ArrowLeft, CheckCircle2, Star, Gift, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Restaurant } from '../data/mockData';
import FoodCard from './FoodCard';
import { fetchUserProfile } from '../services/api';

interface ProfileTabProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onLogout: () => void;
  currentUser?: any;
}

export default function ProfileTab({ onSelectRestaurant, onLogout, currentUser }: ProfileTabProps) {
  const [activeTab, setActiveTab] = useState<'favorites' | 'reviews' | 'settings'>('favorites');
  const [showLevelDetails, setShowLevelDetails] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = currentUser?.id || 1;
        const data = await fetchUserProfile(userId);
        setUserProfile(data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    loadData();
  }, [currentUser]);

  const favoriteRestaurants = userProfile?.favorites || [];
  const reviews = userProfile?.reviews || [];

  const handleSettingClick = (settingName: string) => {
    // In a real app, this would open a modal or navigate to a new page
    alert(`即将开放: ${settingName}`);
  };

  if (!userProfile) {
    return <div className="h-full flex items-center justify-center">加载中...</div>;
  }

  if (showLevelDetails) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="h-full overflow-y-auto bg-gray-50 pb-24 md:pb-6"
      >
        {/* Header */}
        <div className="bg-white px-4 pt-12 pb-4 flex items-center sticky top-0 z-20 shadow-sm">
          <button onClick={() => setShowLevelDetails(false)} className="p-2 -ml-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-900">吃货等级</h1>
        </div>

        <div className="px-4 mt-6 space-y-6">
          {/* Level Card */}
          <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">当前等级</p>
                  <h2 className="text-3xl font-black flex items-center">
                    Lv.{userProfile.level || 1} <span className="text-lg ml-2 font-bold bg-white/20 px-2 py-1 rounded-lg">资深干饭人</span>
                  </h2>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Award size={28} className="text-white" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>当前经验值 {userProfile.exp || 0}</span>
                  <span>距离升级还需 {(userProfile.nextLevelExp || 100) - (userProfile.exp || 0)}</span>
                </div>
                <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${((userProfile.exp || 0) / (userProfile.nextLevelExp || 100)) * 100}%` }}></div>
                </div>
                <p className="text-xs text-orange-100 mt-2 text-right">Lv.{(userProfile.level || 1) + 1} 目标 {userProfile.nextLevelExp || 100}</p>
              </div>
            </div>
          </div>

          {/* How to level up */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp size={20} className="mr-2 text-orange-500" />
              如何获取经验？
            </h3>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">每日签到</p>
                    <p className="text-xs text-gray-500">每天登录小程序</p>
                  </div>
                </div>
                <span className="text-orange-500 font-bold text-sm">+5 经验</span>
              </div>
              <div className="w-full h-px bg-gray-50"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">发布评价</p>
                    <p className="text-xs text-gray-500">分享真实的就餐体验</p>
                  </div>
                </div>
                <span className="text-orange-500 font-bold text-sm">+15 经验</span>
              </div>
              <div className="w-full h-px bg-gray-50"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                    <Heart size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">收藏餐厅</p>
                    <p className="text-xs text-gray-500">发现并收藏心仪美食</p>
                  </div>
                </div>
                <span className="text-orange-500 font-bold text-sm">+2 经验</span>
              </div>
            </div>
          </div>

          {/* Privileges */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Gift size={20} className="mr-2 text-orange-500" />
              等级特权
            </h3>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Star size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Lv.1 新手吃货</p>
                  <p className="text-xs text-gray-500 mt-1">解锁基础盲盒抽取功能、评价功能。</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Star size={18} className="text-orange-400 fill-orange-400" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Lv.3 进阶吃货</p>
                  <p className="text-xs text-gray-500 mt-1">解锁专属头像框，评价显示特殊标识。</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-50">
                <div className="mt-0.5">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Lv.5 美食达人</p>
                  <p className="text-xs text-gray-500 mt-1">解锁线下合作商家 9.5 折专属优惠。</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-50">
                <div className="mt-0.5">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Lv.7 终极食神</p>
                  <p className="text-xs text-gray-500 mt-1">每月获得一次“霸王餐”抽奖资格。</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-8"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-y-auto bg-gray-50 pb-24 md:pb-6"
    >
      {/* Header Profile Section */}
      <div className="bg-white px-6 pt-16 pb-8 rounded-b-[40px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <img 
              src={userProfile.avatar || "https://picsum.photos/seed/user/200/200"} 
              alt="User Avatar" 
              className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white flex items-center">
              <Award size={10} className="mr-1" />
              Lv.{userProfile.level || 1}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{userProfile.username || '用户'}</h1>
            <p className="text-sm text-gray-500 flex items-center">
              <MapPin size={14} className="mr-1" />
              {userProfile.university || '未知大学'}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-between mt-8 px-4 relative z-10">
          <div className="text-center cursor-pointer" onClick={() => setActiveTab('favorites')}>
            <p className="text-2xl font-bold text-gray-900">{favoriteRestaurants.length}</p>
            <p className="text-xs text-gray-500 mt-1">收藏夹</p>
          </div>
          <div className="w-px h-10 bg-gray-100"></div>
          <div className="text-center cursor-pointer" onClick={() => setActiveTab('reviews')}>
            <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
            <p className="text-xs text-gray-500 mt-1">评价记录</p>
          </div>
          <div className="w-px h-10 bg-gray-100"></div>
          <div className="text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowLevelDetails(true)}>
            <p className="text-2xl font-bold text-orange-500">Lv.{userProfile.level || 1}</p>
            <p className="text-xs text-orange-600 mt-1 flex items-center justify-center">
              吃货等级 <ChevronRight size={12} className="ml-0.5" />
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex px-4 mt-6 gap-2">
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center transition-colors ${
            activeTab === 'favorites' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Heart size={16} className={`mr-2 ${activeTab === 'favorites' ? 'fill-white' : ''}`} />
          收藏夹
        </button>
        <button 
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center transition-colors ${
            activeTab === 'reviews' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100'
          }`}
        >
          <MessageSquare size={16} className={`mr-2 ${activeTab === 'reviews' ? 'fill-white' : ''}`} />
          评价记录
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-12 py-3 rounded-2xl flex items-center justify-center transition-colors ${
            activeTab === 'settings' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Content Area */}
      <div className="px-4 mt-6">
        {activeTab === 'favorites' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">我的收藏</h2>
            {favoriteRestaurants.map((restaurant) => (
              <FoodCard 
                key={restaurant.id} 
                restaurant={restaurant} 
                onClick={() => onSelectRestaurant(restaurant)}
              />
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">我的评价</h2>
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl filter drop-shadow-sm">{review.restaurant?.emoji || '🍽️'}</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{review.restaurant?.name || '未知餐厅'}</p>
                      <p className="text-[10px] text-gray-500">{review.restaurant?.university || ''}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => review.restaurant && onSelectRestaurant(review.restaurant)}
                    className="text-orange-500 bg-orange-50 px-2 py-1 rounded text-xs font-medium"
                  >
                    查看
                  </button>
                </div>
                <div className="flex items-center mb-2">
                  <div className="flex text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <Award key={i} size={14} className={i < Math.floor(review.rating) ? "fill-current" : "text-gray-200"} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 ml-2">{review.date}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  "{review.content}"
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            {/* Account Settings */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">账号设置</h3>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div onClick={() => handleSettingClick('编辑资料')} className="p-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <span className="font-medium text-sm text-gray-700">编辑资料</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
                <div onClick={() => handleSettingClick('账号安全')} className="p-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                      <Lock size={16} />
                    </div>
                    <span className="font-medium text-sm text-gray-700">账号安全</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
                <div onClick={() => handleSettingClick('隐私设置')} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                      <Shield size={16} />
                    </div>
                    <span className="font-medium text-sm text-gray-700">隐私设置</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">偏好设置</h3>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div onClick={() => handleSettingClick('饮食偏好')} className="p-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                      <Utensils size={16} />
                    </div>
                    <span className="font-medium text-sm text-gray-700">饮食偏好</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">不吃香菜</span>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </div>
                <div onClick={() => handleSettingClick('消息通知')} className="p-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center">
                      <Bell size={16} />
                    </div>
                    <span className="font-medium text-sm text-gray-700">消息通知</span>
                  </div>
                  <div className="w-10 h-6 bg-orange-500 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                  </div>
                </div>
                <div onClick={() => handleSettingClick('深色模式')} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                      <Moon size={16} />
                    </div>
                    <span className="font-medium text-sm text-gray-700">深色模式</span>
                  </div>
                  <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* General & Support */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">通用与帮助</h3>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div onClick={() => handleSettingClick('清除缓存')} className="p-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center">
                      <Trash2 size={16} />
                    </div>
                    <span className="font-medium text-sm text-gray-700">清除缓存</span>
                  </div>
                  <span className="text-xs text-gray-400">128 MB</span>
                </div>
                <div onClick={() => handleSettingClick('帮助中心')} className="p-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center">
                      <HelpCircle size={16} />
                    </div>
                    <span className="font-medium text-sm text-gray-700">帮助中心</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
                <div onClick={() => handleSettingClick('意见反馈')} className="p-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                      <MessageSquare size={16} />
                    </div>
                    <span className="font-medium text-sm text-gray-700">意见反馈</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
                <div onClick={() => handleSettingClick('关于我们')} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center">
                      <Info size={16} />
                    </div>
                    <span className="font-medium text-sm text-gray-700">关于我们</span>
                  </div>
                  <span className="text-xs text-gray-400">v1.0.0</span>
                </div>
              </div>
            </div>

            {/* Logout */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mt-6">
              <div onClick={onLogout} className="p-4 flex items-center justify-center hover:bg-red-50 cursor-pointer transition-colors group">
                <div className="flex items-center gap-2">
                  <LogOut size={18} className="text-red-500 group-hover:text-red-600" />
                  <span className="font-bold text-sm text-red-500 group-hover:text-red-600">退出登录</span>
                </div>
              </div>
            </div>
            
            <div className="h-8"></div> {/* Bottom padding */}
          </div>
        )}
      </div>
    </motion.div>
  );
}
