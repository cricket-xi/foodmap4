import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dices, RefreshCw, ChevronRight } from 'lucide-react';
import { CATEGORIES, Restaurant } from '../data/mockData';
import { useDraggableScroll } from '../hooks/useDraggableScroll';
import { fetchRestaurants } from '../services/api';

interface RandomizerProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export default function Randomizer({ onSelectRestaurant }: RandomizerProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Restaurant | null>(null);
  const [currentDisplay, setCurrentDisplay] = useState<Restaurant | null>(null);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  
  // Category state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Dietary restrictions state
  const [avoidSpicy, setAvoidSpicy] = useState(false);
  const [avoidCilantro, setAvoidCilantro] = useState(false);
  const [avoidMeat, setAvoidMeat] = useState(false);
  const [customAvoid, setCustomAvoid] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const catScrollRef = useDraggableScroll<HTMLDivElement>();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRestaurants();
        setAllRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      }
    };
    loadData();
  }, []);

  const handleCategoryClick = (cat: string) => {
    if (cat === '全部') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev => 
        prev.includes(cat) 
          ? prev.filter(c => c !== cat)
          : [...prev, cat]
      );
    }
  };

  const handleSpin = () => {
    if (isSpinning) return;
    
    // Filter based on dietary restrictions
    const pool = allRestaurants.filter(r => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(r.category)) return false;
      
      if (avoidSpicy && r.dietaryFeatures?.includes('spicy')) return false;
      if (avoidCilantro && r.dietaryFeatures?.includes('cilantro')) return false;
      if (avoidMeat && r.dietaryFeatures?.some(f => ['meat', 'beef_mutton', 'seafood'].includes(f))) return false;
      
      if (customAvoid.trim()) {
        const avoidKeywords = customAvoid.split(/[,，\s]+/).filter(k => k.trim() !== '');
        for (const keyword of avoidKeywords) {
          const inName = r.name.toLowerCase().includes(keyword.toLowerCase());
          const inTags = r.tags.some(t => t.toLowerCase().includes(keyword.toLowerCase()));
          const inMenu = r.menu?.some(m => m.name.toLowerCase().includes(keyword.toLowerCase()));
          
          if (inName || inTags || inMenu) {
            return false;
          }
        }
      }
      return true;
    });

    if (pool.length === 0) {
      setErrorMsg('没有符合条件的餐厅啦，放宽点要求吧~');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setIsSpinning(true);
    setResult(null);
    setErrorMsg('');

    let count = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      const randomRest = pool[Math.floor(Math.random() * pool.length)];
      setCurrentDisplay(randomRest);
      count++;

      if (count >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
        setResult(randomRest);
      }
    }, 100);
  };

  return (
    <div className="h-full overflow-y-auto bg-orange-50 pt-12 pb-24 md:pb-12 px-4 flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">今天吃什么？</h1>
        <p className="text-gray-600 font-medium">大学城美食盲盒，专治选择困难症</p>
      </div>

      <div className="relative w-full max-w-sm aspect-square bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center mb-6 overflow-hidden border-4 border-orange-100">
        <AnimatePresence mode="wait">
          {isSpinning ? (
            <motion.div
              key="spinning"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-center"
            >
              <div className="w-32 h-32 rounded-full bg-orange-100 mx-auto mb-4 flex items-center justify-center animate-spin">
                <Dices size={48} className="text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 animate-pulse">
                {currentDisplay?.name || "抽取中..."}
              </h2>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center w-full"
            >
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-500 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                <span className="text-6xl filter drop-shadow-md">{result.emoji}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.name}</h2>
              <p className="text-orange-600 font-medium mb-4">{result.university}</p>
              
              <button 
                onClick={() => onSelectRestaurant(result)}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                查看详情 <ChevronRight size={18} className="ml-1" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-32 h-32 rounded-full bg-orange-100 mx-auto mb-6 flex items-center justify-center">
                <Dices size={48} className="text-orange-500" />
              </div>
              <p className="text-gray-500 font-medium">点击下方按钮开始抽取</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Filter */}
      <div className="w-full max-w-sm mb-6">
        <p className="text-sm font-bold text-gray-700 mb-3 px-1">想吃什么类型？(可多选)</p>
        <div ref={catScrollRef} className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 scroll-smooth">
          {CATEGORIES.map(cat => {
            const isSelected = cat === '全部' ? selectedCategories.length === 0 : selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`flex-shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isSelected 
                    ? 'bg-orange-500 text-white border border-orange-500' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div className="w-full max-w-sm mb-8">
        <p className="text-sm font-bold text-gray-700 mb-3 px-1">忌口选项</p>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setAvoidSpicy(!avoidSpicy)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              avoidSpicy ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            🌶️ 不吃辣
          </button>
          <button 
            onClick={() => setAvoidCilantro(!avoidCilantro)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              avoidCilantro ? 'bg-green-50 text-green-600 border-green-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            🌿 不吃香菜
          </button>
          <button 
            onClick={() => setAvoidMeat(!avoidMeat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              avoidMeat ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            🥗 吃素
          </button>
        </div>
        
        <div className="mt-3">
          <input 
            type="text" 
            placeholder="其他忌口？(如：葱, 蒜，空格隔开)" 
            value={customAvoid}
            onChange={(e) => setCustomAvoid(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-gray-400"
          />
        </div>
        
        <AnimatePresence>
          {errorMsg && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-500 text-sm font-medium mt-3 text-center"
            >
              {errorMsg}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`w-full max-w-sm py-4 rounded-2xl font-black text-lg flex items-center justify-center transition-all transform active:scale-95 shadow-lg ${
          isSpinning 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-orange-500/30'
        }`}
      >
        <RefreshCw size={24} className={`mr-2 ${isSpinning ? 'animate-spin' : ''}`} />
        {isSpinning ? '抽取中...' : result ? '再抽一次' : '开始抽取'}
      </button>
    </div>
  );
}
