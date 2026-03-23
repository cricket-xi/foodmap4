import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Bell, X } from 'lucide-react';
import { UNIVERSITIES, CATEGORIES, Restaurant } from '../data/mockData';
import FoodCard from './FoodCard';
import { useDraggableScroll } from '../hooks/useDraggableScroll';
import { fetchRestaurants, fetchUserProfile, toggleFavorite } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';

interface HomeProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onNavigateTo: (tab: string) => void;
  currentUser?: any;
}

export default function Home({ onSelectRestaurant, onNavigateTo, currentUser }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUni, setSelectedUni] = useState('全部');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [sortBy, setSortBy] = useState<'comprehensive' | 'rating' | 'price'>('comprehensive');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const uniScrollRef = useDraggableScroll<HTMLDivElement>();
  const catScrollRef = useDraggableScroll<HTMLDivElement>();

  useEffect(() => {
    const loadNotifications = () => {
      const stored = localStorage.getItem('mock_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    };
    loadNotifications();
    const interval = setInterval(loadNotifications, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      if (currentUser) {
        try {
          const profile = await fetchUserProfile(currentUser.id);
          setFavorites(profile.favorites?.map((f: any) => f.id.toString()) || []);
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        }
      } else {
        setFavorites([]);
      }
    };
    loadFavorites();
  }, [currentUser]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRestaurants(selectedUni, selectedCategory, searchQuery);
        setRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce search query
    const timeoutId = setTimeout(() => {
      loadData();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [selectedUni, selectedCategory, searchQuery]);

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price') return a.price - b.price;
    return 0; // comprehensive (default order)
  });

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    const updated = notifications.map(n => n.id === notification.id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('mock_notifications', JSON.stringify(updated));
    
    if (notification.type === 'coupon') {
      setShowNotifications(false);
      onNavigateTo('discounts');
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, restaurantId: string) => {
    e.stopPropagation(); // Prevent triggering card click
    if (!currentUser) {
      alert('请先登录');
      return;
    }

    try {
      const result = await toggleFavorite(currentUser.id, parseInt(restaurantId));
      if (result.isFavorite) {
        setFavorites(prev => [...prev, restaurantId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== restaurantId));
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 pb-24 md:pb-6">
      {/* Notifications Modal */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
              onClick={() => setShowNotifications(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-t-3xl md:rounded-3xl z-50 p-6 md:w-[400px] md:max-h-[80vh] max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">消息通知</h3>
                <button onClick={() => setShowNotifications(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => handleNotificationClick(n)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-colors ${n.read ? 'bg-gray-50 border-gray-100' : 'bg-orange-50 border-orange-100'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold ${n.read ? 'text-gray-700' : 'text-orange-600'}`}>
                          {n.title}
                          {!n.read && <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full"></span>}
                        </h4>
                        <span className="text-xs text-gray-400">{new Date(n.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-sm text-gray-600">{n.content}</p>
                      {n.type === 'coupon' && (
                        <div className="mt-3 text-right">
                          <button className="text-sm font-medium text-orange-500 bg-white px-3 py-1 rounded-full border border-orange-200">去领取</button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>暂无新消息</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white px-4 pt-12 md:pt-6 pb-4 sticky top-0 z-40 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">校园食集</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full text-sm font-medium">
              <MapPin size={16} className="mr-1" />
              广州大学城
            </div>
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="搜索美食、餐厅或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>

        {/* Top Icon Menu */}
        <div className="grid grid-cols-4 gap-2 mb-6 mt-4">
          <button onClick={() => onNavigateTo('leaderboard')} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-2xl shadow-sm">🏆</div>
            <span className="text-xs font-medium text-gray-700">红黑榜</span>
          </button>
          <button onClick={() => onNavigateTo('random')} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-2xl shadow-sm">🎲</div>
            <span className="text-xs font-medium text-gray-700">吃啥盲盒</span>
          </button>
          <button onClick={() => onNavigateTo('discounts')} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-2xl shadow-sm">💰</div>
            <span className="text-xs font-medium text-gray-700">学生特惠</span>
          </button>
          <button onClick={() => onNavigateTo('categories')} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-2xl shadow-sm">🍜</div>
            <span className="text-xs font-medium text-gray-700">特色品类</span>
          </button>
        </div>

        {/* Filters */}
        <div ref={uniScrollRef} className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 scroll-smooth">
          {UNIVERSITIES.map(uni => (
            <button
              key={uni}
              onClick={() => setSelectedUni(uni)}
              className={`flex-shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedUni === uni 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {uni}
            </button>
          ))}
        </div>
        <div ref={catScrollRef} className="flex overflow-x-auto hide-scrollbar gap-2 mt-2 pb-2 -mx-4 px-4 scroll-smooth">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">为你推荐</h2>
          <div className="relative flex items-center">
            <Filter size={14} className="text-gray-500 absolute left-0 pointer-events-none" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm text-gray-500 bg-transparent outline-none appearance-none pl-5 pr-4 py-1 cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '8px auto' }}
            >
              <option value="comprehensive">综合排序</option>
              <option value="rating">星级评价最高</option>
              <option value="price">人均价格最低</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : sortedRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedRestaurants.map(restaurant => (
              <FoodCard 
                key={restaurant.id} 
                restaurant={restaurant} 
                onClick={() => onSelectRestaurant(restaurant)}
                isFavorite={favorites.includes(restaurant.id.toString())}
                onToggleFavorite={(e) => handleToggleFavorite(e, restaurant.id.toString())}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium mb-2">没有找到相关美食</p>
            <p className="text-sm">换个关键词或者分类试试吧~</p>
          </div>
        )}
      </div>
    </div>
  );
}
