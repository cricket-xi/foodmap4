import { useState, useEffect } from 'react';
import { ArrowLeft, Ticket, Tag, ChevronRight } from 'lucide-react';
import { Restaurant } from '../data/mockData';
import FoodCard from './FoodCard';
import { fetchRestaurants, fetchCoupons, claimCoupon, fetchMyCoupons } from '../services/api';
import { motion } from 'motion/react';

interface DiscountsProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onBack: () => void;
  currentUser?: any;
}

export default function Discounts({ onSelectRestaurant, onBack, currentUser }: DiscountsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [myCoupons, setMyCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<number | null>(null);

  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [data, couponData, myCouponsData] = await Promise.all([
        fetchRestaurants(),
        fetchCoupons(),
        currentUser ? fetchMyCoupons(currentUser.id) : Promise.resolve([])
      ]);
      
      setAllRestaurants(data);
      
      // Filter or mock discount data
      const discounted = data.filter(r => r.discount || r.price < 25);
      setRestaurants(discounted);
      
      // Map restaurant info to coupons
      const enrichedCoupons = couponData.map((c: any) => {
        const restaurant = data.find(r => r.id === c.restaurantId.toString());
        return { ...c, restaurant };
      });
      setCoupons(enrichedCoupons);

      // Map restaurant info to my coupons
      const enrichedMyCoupons = myCouponsData.map((mc: any) => {
        const restaurant = data.find(r => r.id === mc.coupon.restaurantId.toString());
        return { ...mc, coupon: { ...mc.coupon, restaurant } };
      });
      setMyCoupons(enrichedMyCoupons);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleClaim = async (couponId: number) => {
    if (!currentUser) {
      alert('请先登录');
      return;
    }
    setClaimingId(couponId);
    try {
      const res = await claimCoupon(currentUser.id, couponId);
      if (res.success) {
        alert(res.message || '领取成功！');
        // Update remaining quantity
        setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, remainingQuantity: c.remainingQuantity - 1 } : c));
        // Refresh my coupons
        const updatedMyCoupons = await fetchMyCoupons(currentUser.id);
        const enrichedMyCoupons = updatedMyCoupons.map((mc: any) => {
          const restaurant = allRestaurants.find(r => r.id === mc.coupon.restaurantId.toString());
          return { ...mc, coupon: { ...mc.coupon, restaurant } };
        });
        setMyCoupons(enrichedMyCoupons);
      } else {
        alert(res.message || '领取失败');
      }
    } catch (error) {
      alert('领取失败，请重试');
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full overflow-y-auto bg-gray-50 pb-24 md:pb-6"
    >
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-40 shadow-sm flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">学生特惠</h1>
      </div>

      <div className="p-4">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white mb-6 shadow-md">
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
            <Ticket size={24} className="text-yellow-100" />
            凭学生证专享
          </h2>
          <p className="text-yellow-50 text-sm">以下餐厅出示学生证即可享受专属折扣</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'all' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            领券中心
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('mine')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'mine' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            我的优惠券
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : activeTab === 'all' ? (
          <div className="space-y-6">
            {coupons.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 px-1">限时优惠券</h3>
                <div className="space-y-3">
                  {coupons.map(coupon => (
                    <div key={coupon.id} className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded">
                            {coupon.restaurant?.name || '商家'}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900">{coupon.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          满 {coupon.minSpend} 元可用 · 剩余 {coupon.remainingQuantity} 张
                        </p>
                      </div>
                      <button 
                        onClick={() => handleClaim(coupon.id)}
                        disabled={claimingId === coupon.id || coupon.remainingQuantity <= 0}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                          coupon.remainingQuantity <= 0 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : claimingId === coupon.id
                              ? 'bg-orange-300 text-white cursor-wait'
                              : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                      >
                        {coupon.remainingQuantity <= 0 ? '已抢光' : claimingId === coupon.id ? '领取中...' : '立即领取'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-bold text-gray-900 mb-3 px-1">特惠餐厅</h3>
              <div className="space-y-4">
                {restaurants.map(restaurant => (
                  <div key={restaurant.id} className="relative">
                    <div className="absolute -left-2 -top-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-xl rounded-tl-xl shadow-md z-10 flex items-center gap-1">
                      <Tag size={12} />
                      {restaurant.discount || '学生8折'}
                    </div>
                    <FoodCard restaurant={restaurant} onClick={() => onSelectRestaurant(restaurant)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {myCoupons.length > 0 ? (
              myCoupons.map(myCoupon => (
                <div key={myCoupon.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative overflow-hidden">
                  {myCoupon.status === 'USED' && (
                    <div className="absolute top-4 right-4 text-gray-300 border-2 border-gray-300 rounded-full px-3 py-1 text-sm font-bold transform rotate-12">
                      已使用
                    </div>
                  )}
                  <div className={`flex justify-between items-start ${myCoupon.status === 'USED' ? 'opacity-60' : ''}`}>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded">
                          {myCoupon.coupon.restaurant?.name || '商家'}
                        </span>
                        <span className="text-xs text-gray-400">
                          有效期至 {new Date(myCoupon.coupon.validUntil).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">{myCoupon.coupon.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        满 {myCoupon.coupon.minSpend} 元可用
                      </p>
                      {myCoupon.coupon.restaurant && (
                        <button 
                          onClick={() => onSelectRestaurant(myCoupon.coupon.restaurant)}
                          className="mt-3 flex items-center text-sm text-orange-500 font-medium hover:text-orange-600"
                        >
                          去店铺看看 <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                    {myCoupon.status === 'UNUSED' && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-500 mb-1">
                          <span className="text-sm">¥</span>{myCoupon.coupon.discountAmount}
                        </div>
                        <div className="text-xs text-gray-400">
                          向商家出示使用
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-500">
                <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium mb-2">暂无优惠券</p>
                <p className="text-sm">快去领券中心看看吧~</p>
                <button 
                  onClick={() => setActiveTab('all')}
                  className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  去领券
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
