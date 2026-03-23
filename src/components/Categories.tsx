import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Restaurant } from '../data/mockData';
import FoodCard from './FoodCard';
import { fetchRestaurants } from '../services/api';
import { motion } from 'motion/react';

interface CategoriesProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onBack: () => void;
}

const CATEGORY_INFO = [
  { name: '快餐简餐', icon: '🍱', color: 'bg-blue-100 text-blue-600' },
  { name: '火锅烤肉', icon: '🍲', color: 'bg-red-100 text-red-600' },
  { name: '奶茶饮品', icon: '🧋', color: 'bg-amber-100 text-amber-600' },
  { name: '地方小吃', icon: '🍢', color: 'bg-orange-100 text-orange-600' },
  { name: '粉面粥饭', icon: '🍜', color: 'bg-emerald-100 text-emerald-600' },
  { name: '西餐日料', icon: '🍣', color: 'bg-purple-100 text-purple-600' },
];

export default function Categories({ onSelectRestaurant, onBack }: CategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedCategory) return;
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRestaurants(undefined, selectedCategory);
        setRestaurants(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [selectedCategory]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full overflow-y-auto bg-gray-50 pb-24 md:pb-6"
    >
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-40 shadow-sm flex items-center">
        <button 
          onClick={() => selectedCategory ? setSelectedCategory(null) : onBack()} 
          className="p-2 -ml-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          {selectedCategory ? selectedCategory : '特色品类'}
        </h1>
      </div>

      <div className="p-4">
        {!selectedCategory ? (
          <div className="grid grid-cols-2 gap-4">
            {CATEGORY_INFO.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${cat.color}`}>
                  {cat.icon}
                </div>
                <span className="font-bold text-gray-800">{cat.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {restaurants.length > 0 ? restaurants.map(restaurant => (
                  <FoodCard key={restaurant.id} restaurant={restaurant} onClick={() => onSelectRestaurant(restaurant)} />
                )) : (
                  <div className="text-center py-20 text-gray-500">
                    该分类下暂无餐厅
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
