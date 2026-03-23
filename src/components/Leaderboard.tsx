import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Skull, Flame, Share2, Bookmark, MapPin, MessageSquare, Heart, MoreHorizontal } from 'lucide-react';
import { Restaurant } from '../data/mockData';
import FoodCard from './FoodCard';
import { fetchRestaurants } from '../services/api';
import { motion } from 'motion/react';

interface LeaderboardProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onBack: () => void;
}

export default function Leaderboard({ onSelectRestaurant, onBack }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'red' | 'black' | 'community'>('red');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUni, setSelectedUni] = useState('广州大学');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRestaurants(selectedUni);
        setRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [selectedUni]);

  // Mock calculations for leaderboards
  const redList = [...restaurants].sort((a, b) => b.rating - a.rating).filter(r => r.rating >= 4.5);
  // For demo purposes, if blackList is empty, we force one to show the UI
  const blackList = [...restaurants].sort((a, b) => a.rating - b.rating).filter(r => r.rating < 4.5).slice(0, 2);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full overflow-y-auto bg-gray-50 pb-24 md:pb-6"
    >
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button onClick={onBack} className="p-2 -ml-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">校园特色榜单</h1>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bookmark size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('red')}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'red' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Trophy size={16} />
            闭眼入红榜
          </button>
          <button 
            onClick={() => setActiveTab('black')}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'black' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Skull size={16} />
            踩雷黑榜
          </button>
          <button 
            onClick={() => setActiveTab('community')}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'community' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <MessageSquare size={16} />
            社区讨论
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* University Selector for Red/Black lists */}
        {(activeTab === 'red' || activeTab === 'black') && (
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2">
            {['广州大学', '中山大学', '华南理工大学', '广东外语外贸大学'].map(uni => (
              <button
                key={uni}
                onClick={() => setSelectedUni(uni)}
                className={`flex-shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedUni === uni 
                    ? (activeTab === 'red' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-200 text-gray-800 border border-gray-300')
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {uni}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'red' && (
              <>
                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 text-white mb-6 shadow-md">
                  <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <Trophy size={24} className="text-yellow-300" />
                    {selectedUni}必吃榜
                  </h2>
                  <p className="text-red-100 text-sm">收录红榜指数 &gt; 85% 且评价数 &gt; 50条的优质店铺</p>
                </div>
                
                {redList.length > 0 ? redList.map((restaurant, index) => (
                  <div key={restaurant.id} className="relative">
                    <div className="absolute -left-2 -top-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md z-10 border-2 border-white">
                      {index + 1}
                    </div>
                    <FoodCard restaurant={restaurant} onClick={() => onSelectRestaurant(restaurant)} />
                  </div>
                )) : (
                  <div className="text-center py-10 text-gray-500">该校区暂无上榜餐厅</div>
                )}
              </>
            )}

            {activeTab === 'black' && (
              <>
                <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-2xl p-4 text-white mb-6 shadow-md">
                  <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <Skull size={24} className="text-gray-300" />
                    {selectedUni}避雷榜
                  </h2>
                  <p className="text-gray-300 text-sm">收录黑榜指数 &gt; 40% 的店铺，同学请注意避坑</p>
                </div>
                
                {blackList.length > 0 ? blackList.map((restaurant, index) => (
                  <div key={restaurant.id} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
                    <div className="p-4 flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 grayscale">
                        {restaurant.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900 text-lg">{restaurant.name}</h3>
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
                            黑榜指数 89%
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                          <MapPin size={14} className="mr-1" />
                          {restaurant.location}
                        </div>
                        
                        {/* 避雷评价外显 */}
                        <div className="bg-red-50 rounded-lg p-3 mt-2 border border-red-100">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">热评第一</span>
                            <span className="text-xs text-gray-500">👍 342人赞同</span>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            "千万别来！阿姨手抖得像帕金森，肉没几块全是菜帮子，而且态度极差，吃出过钢丝球！"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 text-gray-500">该校区暂无黑榜餐厅，大家吃得都很开心~</div>
                )}
              </>
            )}

            {activeTab === 'community' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img src="https://picsum.photos/seed/user1/100/100" alt="avatar" className="w-10 h-10 rounded-full" />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">深夜干饭人</h4>
                        <p className="text-xs text-gray-500">刚刚 · 广州大学</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
                  </div>
                  <p className="text-sm text-gray-800 mb-3 leading-relaxed">
                    广大商业中心新开的那家螺蛳粉绝了！加辣加臭，吃完回宿舍室友都惊呆了😂 有没有一起去二刷的？
                  </p>
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md">#螺蛳粉</span>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md">#探店打卡</span>
                  </div>
                  <div className="flex gap-6 text-gray-500 text-sm border-t border-gray-50 pt-3">
                    <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors"><Heart size={16} /> 24</button>
                    <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"><MessageSquare size={16} /> 8</button>
                    <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors ml-auto"><Share2 size={16} /> 分享</button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img src="https://picsum.photos/seed/user2/100/100" alt="avatar" className="w-10 h-10 rounded-full" />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">奶茶续命</h4>
                        <p className="text-xs text-gray-500">2小时前 · 中山大学</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
                  </div>
                  <p className="text-sm text-gray-800 mb-3 leading-relaxed">
                    避雷！南门那家新开的烧烤店，上菜慢不说，肉串还是冷的。跟老板反映态度也很敷衍，大家千万别去踩坑了！😡
                  </p>
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md">#避雷</span>
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md">#烧烤</span>
                  </div>
                  <div className="flex gap-6 text-gray-500 text-sm border-t border-gray-50 pt-3">
                    <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors"><Heart size={16} /> 156</button>
                    <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"><MessageSquare size={16} /> 42</button>
                    <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors ml-auto"><Share2 size={16} /> 分享</button>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img src="https://picsum.photos/seed/user3/100/100" alt="avatar" className="w-10 h-10 rounded-full" />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">干饭王</h4>
                        <p className="text-xs text-gray-500">5小时前 · 华南理工大学</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
                  </div>
                  <p className="text-sm text-gray-800 mb-3 leading-relaxed">
                    求问各位大佬，附近有没有适合十几个人的社团聚餐地点？人均50左右，最好能有包厢或者大桌的。在线等，挺急的！🙏
                  </p>
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-md">#求推荐</span>
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-md">#聚餐</span>
                  </div>
                  <div className="flex gap-6 text-gray-500 text-sm border-t border-gray-50 pt-3">
                    <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors"><Heart size={16} /> 12</button>
                    <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"><MessageSquare size={16} /> 35</button>
                    <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors ml-auto"><Share2 size={16} /> 分享</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
