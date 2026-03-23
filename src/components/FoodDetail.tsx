import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, Star, Tag, Clock, Phone, Share2, Heart, X, Plus } from 'lucide-react';
import { Restaurant } from '../data/mockData';
import { submitReview, toggleFavorite, fetchUserProfile } from '../services/api';

interface FoodDetailProps {
  restaurant: Restaurant;
  onBack: () => void;
  onNavigate: (restaurant: Restaurant) => void;
  currentUser?: any;
}

export default function FoodDetail({ restaurant: initialRestaurant, onBack, onNavigate, currentUser }: FoodDetailProps) {
  const [restaurant, setRestaurant] = useState(initialRestaurant);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [environmentRating, setEnvironmentRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [tasteRating, setTasteRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cart, setCart] = useState<{item: any, quantity: number}[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const userId = currentUser?.id || 1;
        const profile = await fetchUserProfile(userId);
        const isFav = profile.favorites?.some((fav: any) => fav.id.toString() === restaurant.id);
        setIsFavorite(!!isFav);
      } catch (error) {
        console.error('Failed to check favorite status:', error);
      }
    };
    checkFavorite();
  }, [restaurant.id, currentUser]);

  const handleToggleFavorite = async () => {
    try {
      const userId = currentUser?.id || 1;
      const result = await toggleFavorite(userId, parseInt(restaurant.id));
      setIsFavorite(result.isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      setIsFavorite(!isFavorite); // Optimistic UI update fallback
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewContent.trim()) return;
    setIsSubmitting(true);
    const averageRating = Math.round((environmentRating + serviceRating + tasteRating) / 3 * 10) / 10;
    try {
      const newReview = await submitReview(parseInt(restaurant.id), {
        user: currentUser?.username || 'student', // Mock current user
        rating: averageRating,
        content: reviewContent
      });
      
      setRestaurant(prev => ({
        ...prev,
        reviews: [newReview, ...prev.reviews],
        rating: Number(((prev.rating * prev.reviews.length + averageRating) / (prev.reviews.length + 1)).toFixed(1))
      }));
      
      setShowReviewModal(false);
      setReviewContent('');
      setEnvironmentRating(5);
      setServiceRating(5);
      setTasteRating(5);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addToCart = (menuItem: any) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.name === menuItem.name);
      if (existing) {
        return prev.map(c => c.item.name === menuItem.name ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { item: menuItem, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItem: any) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.name === menuItem.name);
      if (existing && existing.quantity > 1) {
        return prev.map(c => c.item.name === menuItem.name ? { ...c, quantity: c.quantity - 1 } : c);
      }
      return prev.filter(c => c.item.name !== menuItem.name);
    });
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleCheckout = () => {
    if (cartCount === 0) return;
    alert(`支付成功！总计 ¥${cartTotal.toFixed(2)}`);
    setCart([]);
    setShowCartModal(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 pointer-events-auto hidden md:block"
        onClick={onBack}
      />
      
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full h-full md:h-[85vh] md:max-w-2xl bg-gray-50 overflow-hidden pb-0 md:rounded-3xl md:shadow-2xl pointer-events-auto flex flex-col"
      >
        <div className="flex-1 overflow-y-auto pb-24 md:pb-20">
          {/* Header Image */}
          <div className="relative h-72 w-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <span className="text-9xl filter drop-shadow-lg pb-12">{restaurant.emoji}</span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Top Actions */}
            <div className="absolute top-0 left-0 right-0 p-4 pt-12 md:pt-4 flex justify-between items-center z-10">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors">
              <Share2 size={18} />
            </button>
            <button 
              onClick={handleToggleFavorite}
              className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
            >
              <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
            </button>
          </div>
        </div>

        {/* Title Info */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-orange-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              {restaurant.category}
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium flex items-center">
              <Star size={10} className="fill-yellow-400 text-yellow-400 mr-1" />
              {restaurant.rating}
            </span>
          </div>
          <h1 className="text-2xl font-bold leading-tight mb-1">{restaurant.name}</h1>
          <p className="text-sm text-gray-200 flex items-center">
            <MapPin size={14} className="mr-1" />
            {restaurant.location}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 -mt-4 relative z-20 bg-gray-50 rounded-t-3xl">
        {/* Info Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
            <div>
              <p className="text-gray-500 text-xs mb-1">人均消费</p>
              <p className="text-2xl font-bold text-orange-500">¥{restaurant.price}</p>
            </div>
            <div className="h-10 w-px bg-gray-100"></div>
            <div>
              <p className="text-gray-500 text-xs mb-1">所属校区</p>
              <p className="font-medium text-gray-900">{restaurant.university}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start">
              <Clock size={16} className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">营业时间</p>
                <p className="text-xs text-gray-500">10:00 - 22:00</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone size={16} className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">联系电话</p>
                <p className="text-xs text-gray-500">138-0000-0000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Discount Card */}
        {restaurant.discount && (
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-4 flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mr-3 flex-shrink-0">
              <Tag size={20} />
            </div>
            <div>
              <h3 className="font-bold text-orange-800 text-sm mb-0.5">学生专属特权</h3>
              <p className="text-orange-600 text-xs">{restaurant.discount}</p>
            </div>
            <button className="ml-auto bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-orange-600 transition-colors">
              去使用
            </button>
          </div>
        )}

        {/* Tags */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3 px-1">餐厅标签</h3>
          <div className="flex flex-wrap gap-2">
            {restaurant.tags.map((tag, idx) => (
              <span key={idx} className="bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Menu Section */}
        {restaurant.menu && restaurant.menu.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3 px-1">招牌菜单</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {restaurant.menu.map((item, index) => {
                const cartItem = cart.find(c => c.item.name === item.name);
                return (
                  <div key={index} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800">{item.name}</span>
                      {item.recommended && (
                        <span className="ml-2 text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded-sm font-medium">
                          推荐
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-orange-500">¥{item.price}</span>
                      <div className="flex items-center gap-2">
                        {cartItem && (
                          <>
                            <button onClick={() => removeFromCart(item)} className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold">-</button>
                            <span className="text-sm font-medium w-4 text-center">{cartItem.quantity}</span>
                          </>
                        )}
                        <button onClick={() => addToCart(item)} className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">+</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-bold text-gray-900">同学评价 ({restaurant.reviews.length})</h3>
            <button 
              onClick={() => setShowReviewModal(true)}
              className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-orange-100 transition-colors"
            >
              <Plus size={14} /> 写评价
            </button>
          </div>
          
          <div className="space-y-4">
            {restaurant.reviews.length > 0 ? (
              restaurant.reviews.map(review => (
                <div key={review.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center mb-3">
                    <img src={review.avatar} alt={review.user} className="w-8 h-8 rounded-full mr-3" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{review.user}</p>
                      <p className="text-[10px] text-gray-400">{review.date}</p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className={i < review.rating ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm mb-4">还没有同学评价过，快来抢沙发吧~</p>
                <button 
                  onClick={() => setShowReviewModal(true)}
                  className="bg-orange-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
                >
                  发表第一条评价
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
        
      {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe flex gap-3 z-30 shrink-0">
          <button 
            onClick={() => onNavigate(restaurant)}
            className="flex-1 bg-orange-100 text-orange-600 font-bold py-3 rounded-xl flex items-center justify-center hover:bg-orange-200 transition-colors"
          >
            <MapPin size={18} className="mr-2" /> 导航去吃
          </button>
          <button 
            onClick={() => cartCount > 0 ? setShowCartModal(true) : null}
            className={`flex-1 font-bold py-3 rounded-xl flex items-center justify-center transition-colors ${cartCount > 0 ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          >
            {cartCount > 0 ? `去结算 (¥${cartTotal.toFixed(2)})` : '买单打卡'}
          </button>
        </div>
      </motion.div>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCartModal && (
          <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowCartModal(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl p-6 pb-safe z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">已选菜品</h3>
                <button onClick={() => setShowCartModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4 max-h-[50vh] overflow-y-auto mb-6">
                {cart.map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{c.item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-orange-500">¥{(c.item.price * c.quantity).toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(c.item)} className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold">-</button>
                        <span className="text-sm font-medium w-4 text-center">{c.quantity}</span>
                        <button onClick={() => addToCart(c.item)} className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-900">总计</span>
                <span className="font-bold text-2xl text-orange-500">¥{cartTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors"
              >
                确认支付
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowReviewModal(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl p-6 pb-safe z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">写评价</h3>
                <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                {[
                  { label: '就餐环境', value: environmentRating, setter: setEnvironmentRating },
                  { label: '服务态度', value: serviceRating, setter: setServiceRating },
                  { label: '口味如何', value: tasteRating, setter: setTasteRating }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          onClick={() => item.setter(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star 
                            size={24} 
                            className={star <= item.value ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="菜品口味如何？环境服务怎么样？分享你的就餐体验吧..."
                  className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                ></textarea>
              </div>
              
              <button 
                onClick={handleReviewSubmit}
                disabled={isSubmitting || !reviewContent.trim()}
                className={`w-full font-bold py-3 rounded-xl flex items-center justify-center transition-colors ${
                  isSubmitting || !reviewContent.trim() 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {isSubmitting ? '提交中...' : '发布评价'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
