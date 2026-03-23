import { Restaurant, RESTAURANTS } from '../data/mockData';

export const API_BASE_URL = 'http://localhost:8080/api';
const USE_MOCK = true; // Set to false when connecting to real backend

// Initialize localStorage with mock data if empty
const getLocalRestaurants = (): Restaurant[] => {
  const stored = localStorage.getItem('restaurants');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('restaurants', JSON.stringify(RESTAURANTS));
  return RESTAURANTS;
};

const saveLocalRestaurants = (restaurants: Restaurant[]) => {
  localStorage.setItem('restaurants', JSON.stringify(restaurants));
};

// Map backend response to frontend interface
const mapRestaurant = (data: any): Restaurant => {
  return {
    id: data.id ? data.id.toString() : '',
    name: data.name || '',
    location: data.distance || '', // Using distance as location for now
    university: data.university || '',
    category: data.category || '',
    rating: data.rating || 0,
    price: data.price || 0,
    emoji: data.emoji || '🍽️',
    discount: '',
    reviews: data.reviews || [],
    tags: data.tags || [],
    coordinates: { 
      x: data.longitude ? (data.longitude - 113.360) / (113.420 - 113.360) * 100 : 50, 
      y: data.latitude ? (23.075 - data.latitude) / (23.075 - 23.025) * 100 : 50 
    },
    menu: [],
    dietaryFeatures: data.dietaryFeatures || []
  };
};

export const login = async (username: string, password: string, role: 'user' | 'merchant' | 'admin') => {
  if (USE_MOCK) {
    return new Promise<{ success: boolean; message?: string; user?: any }>((resolve) => {
      setTimeout(() => {
        const validUsers = ['student', 'student2', 'student3', 'student4', 'testuser'];
        const validMerchants = ['merchant', 'merchant2', 'merchant3', 'merchant4', 'testmerchant'];
        const validAdmins = ['admin', 'admin2', 'superadmin'];

        if (role === 'user' && validUsers.includes(username) && password === '123456') {
          resolve({ success: true, user: { id: validUsers.indexOf(username) + 1, username, role: 'user', avatar: `https://picsum.photos/seed/${username}/200/200` } });
        } else if (role === 'merchant' && validMerchants.includes(username) && password === '123456') {
          resolve({ success: true, user: { id: validMerchants.indexOf(username) + 101, username, role: 'merchant', avatar: `https://picsum.photos/seed/${username}/200/200` } });
        } else if (role === 'admin' && validAdmins.includes(username) && password === '123456') {
          resolve({ success: true, user: { id: validAdmins.indexOf(username) + 201, username, role: 'admin', avatar: `https://picsum.photos/seed/${username}/200/200` } });
        } else {
          resolve({ success: false, message: '账号或密码错误' });
        }
      }, 800);
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, role }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock data.', error);
    return { success: false, message: '网络错误' };
  }
};

export const fetchMerchantStats = async (merchantId?: number | string) => {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const isMerchant2 = merchantId === 102 || merchantId === 'merchant2';
        resolve({
          storeName: isMerchant2 ? 'Gogo新天地·柳州螺蛳粉' : '张亮麻辣烫 (广大商业中心店)',
          todayViews: isMerchant2 ? 850 : 1245,
          todayCoupons: isMerchant2 ? 45 : 86,
          todayRedeemed: isMerchant2 ? 20 : 42,
          trustScore: isMerchant2 ? 88 : 92,
          totalRevenue: isMerchant2 ? 2150.0 : 3580.5,
          activeOrders: isMerchant2 ? 5 : 12,
          completedOrders: isMerchant2 ? 85 : 145,
          trafficData: isMerchant2 ? [
            { date: '周一', views: 500, clicks: 120 },
            { date: '周二', views: 600, clicks: 150 },
            { date: '周三', views: 750, clicks: 200 },
            { date: '周四', views: 700, clicks: 180 },
            { date: '周五', views: 900, clicks: 250 },
            { date: '周六', views: 1200, clicks: 350 },
            { date: '周日', views: 1100, clicks: 300 },
          ] : [
            { date: '周一', views: 800, clicks: 200 },
            { date: '周二', views: 950, clicks: 250 },
            { date: '周三', views: 1100, clicks: 300 },
            { date: '周四', views: 1050, clicks: 280 },
            { date: '周五', views: 1400, clicks: 450 },
            { date: '周六', views: 1800, clicks: 600 },
            { date: '周日', views: 1600, clicks: 550 },
          ],
          schoolData: isMerchant2 ? [
            { name: '广东外语外贸大学', value: 75 },
            { name: '中山大学', value: 15 },
            { name: '其他', value: 10 },
          ] : [
            { name: '广州大学', value: 65 },
            { name: '华南师范大学', value: 20 },
            { name: '广东工业大学', value: 10 },
            { name: '其他', value: 5 },
          ],
          recentReviews: isMerchant2 ? [
            { id: 1, user: 'student3', rating: 5, content: '粉很劲道，汤底浓郁！', date: '2023-10-26' },
            { id: 2, user: 'student4', rating: 4, content: '稍微有点辣，下次点微辣。', date: '2023-10-25' },
          ] : [
            { id: 1, user: 'student', rating: 5, content: '味道很好，分量很足！', date: '2023-10-25' },
            { id: 2, user: 'student2', rating: 4, content: '上菜速度挺快的，就是稍微有点咸。', date: '2023-10-24' },
            { id: 3, user: 'testuser', rating: 5, content: '经常来吃，老板人很好，还送了饮料。', date: '2023-10-23' },
          ]
        });
      }, 600);
    });
  }

  try {
    const url = merchantId ? `${API_BASE_URL}/merchant/stats?merchantId=${merchantId}` : `${API_BASE_URL}/merchant/stats`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock data.', error);
    return null;
  }
};

export const fetchRestaurants = async (university?: string, category?: string, query?: string): Promise<Restaurant[]> => {
  if (USE_MOCK) {
    let filtered = getLocalRestaurants();
    if (university && university !== '全部') {
      filtered = filtered.filter(r => r.university === university);
    }
    if (category && category !== '全部') {
      filtered = filtered.filter(r => r.category === category);
    }
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(lowerQuery) || 
        r.tags.some(t => t.toLowerCase().includes(lowerQuery))
      );
    }
    return filtered;
  }

  try {
    const params = new URLSearchParams();
    if (university && university !== '全部') params.append('university', university);
    if (category && category !== '全部') params.append('category', category);
    if (query) params.append('query', query);

    const response = await fetch(`${API_BASE_URL}/restaurants?${params.toString()}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.map(mapRestaurant);
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock data.', error);
    return [];
  }
};

export const fetchRestaurantById = async (id: number | string): Promise<Restaurant | undefined> => {
  if (USE_MOCK) {
    return getLocalRestaurants().find(r => r.id === id.toString());
  }

  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return mapRestaurant(data);
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock data.', error);
    return undefined;
  }
};

export const updateRestaurantMenu = async (restaurantId: string, menu: any[]) => {
  if (USE_MOCK) {
    const restaurants = getLocalRestaurants();
    const index = restaurants.findIndex(r => r.id === restaurantId);
    if (index !== -1) {
      restaurants[index].menu = menu;
      saveLocalRestaurants(restaurants);
      return { success: true };
    }
    return { success: false, message: 'Restaurant not found' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menu),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn('Backend not reachable, updating local mock data.', error);
    return { success: false, message: '网络错误' };
  }
};

export const submitReview = async (restaurantId: number, reviewData: any) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReview = {
          id: Math.random().toString(36).substr(2, 9),
          ...reviewData,
          date: new Date().toISOString().split('T')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${reviewData.user}`
        };
        
        const restaurants = getLocalRestaurants();
        const index = restaurants.findIndex(r => r.id === restaurantId.toString());
        if (index !== -1) {
          restaurants[index].reviews = [newReview, ...restaurants[index].reviews];
          restaurants[index].rating = Number(((restaurants[index].rating * (restaurants[index].reviews.length - 1) + reviewData.rating) / restaurants[index].reviews.length).toFixed(1));
          saveLocalRestaurants(restaurants);
        }
        
        resolve(newReview);
      }, 500);
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock data.', error);
    return null;
  }
};

const getMockCoupons = () => {
  const stored = localStorage.getItem('mock_coupons');
  if (stored) return JSON.parse(stored);
  const initial = [
    { id: 1, restaurantId: 1, title: '满50减10', discountAmount: 10, minSpend: 50, remainingQuantity: 50, validUntil: '2026-12-31' },
    { id: 2, restaurantId: 2, title: '全场8折', discountAmount: 0, minSpend: 0, remainingQuantity: 100, validUntil: '2026-12-31' },
    { id: 3, restaurantId: 3, title: '新客立减15', discountAmount: 15, minSpend: 30, remainingQuantity: 200, validUntil: '2026-12-31' },
    { id: 4, restaurantId: 4, title: '满100减30', discountAmount: 30, minSpend: 100, remainingQuantity: 20, validUntil: '2026-12-31' },
    { id: 5, restaurantId: 5, title: '下午茶特惠满30减8', discountAmount: 8, minSpend: 30, remainingQuantity: 80, validUntil: '2026-12-31' },
    { id: 6, restaurantId: 1, title: '无门槛5元代金券', discountAmount: 5, minSpend: 0, remainingQuantity: 500, validUntil: '2026-12-31' },
    { id: 7, restaurantId: 2, title: '双人套餐立减20', discountAmount: 20, minSpend: 80, remainingQuantity: 30, validUntil: '2026-12-31' },
  ];
  localStorage.setItem('mock_coupons', JSON.stringify(initial));
  return initial;
};

export const fetchCoupons = async () => {
  if (USE_MOCK) {
    return getMockCoupons();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/coupons`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock.', error);
    return [];
  }
};

export const publishCoupon = async (couponData: any) => {
  if (USE_MOCK) {
    const coupons = getMockCoupons();
    const newCoupon = {
      ...couponData,
      id: Date.now(),
    };
    coupons.unshift(newCoupon);
    localStorage.setItem('mock_coupons', JSON.stringify(coupons));
    
    const notifications = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    notifications.unshift({
      id: Date.now(),
      title: '新优惠券提醒',
      content: `附近商家发布了新优惠券：${couponData.title}`,
      time: new Date().toISOString(),
      read: false,
      type: 'coupon',
      couponId: newCoupon.id
    });
    localStorage.setItem('mock_notifications', JSON.stringify(notifications));

    return new Promise((resolve) => setTimeout(() => resolve({ success: true, message: '发布成功！已推送到周边学生端。' }), 500));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponData),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock.', error);
    return { success: false, message: '网络错误' };
  }
};

export const claimCoupon = async (userId: number, couponId: number) => {
  if (USE_MOCK) {
    const coupons = getMockCoupons();
    const couponIndex = coupons.findIndex((c: any) => c.id === couponId);
    if (couponIndex !== -1 && coupons[couponIndex].remainingQuantity > 0) {
      // Check if already claimed
      const myCoupons = JSON.parse(localStorage.getItem(`mock_my_coupons_${userId}`) || '[]');
      if (myCoupons.some((c: any) => c.couponId === couponId)) {
        return new Promise((resolve) => setTimeout(() => resolve({ success: false, message: '您已经领取过该优惠券了' }), 500));
      }

      coupons[couponIndex].remainingQuantity -= 1;
      localStorage.setItem('mock_coupons', JSON.stringify(coupons));
      
      // Add to my coupons
      myCoupons.unshift({
        id: Date.now(),
        couponId: couponId,
        claimedAt: new Date().toISOString(),
        status: 'UNUSED', // UNUSED, USED, EXPIRED
        coupon: coupons[couponIndex]
      });
      localStorage.setItem(`mock_my_coupons_${userId}`, JSON.stringify(myCoupons));

      return new Promise((resolve) => setTimeout(() => resolve({ success: true, message: '领取成功！' }), 500));
    }
    return new Promise((resolve) => setTimeout(() => resolve({ success: false, message: '优惠券已被领完或不存在' }), 500));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user-coupons/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, couponId }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock.', error);
    return { success: false, message: '网络错误' };
  }
};

export const fetchMyCoupons = async (userId: number) => {
  if (USE_MOCK) {
    const myCoupons = JSON.parse(localStorage.getItem(`mock_my_coupons_${userId}`) || '[]');
    return new Promise((resolve) => setTimeout(() => resolve(myCoupons), 500));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user-coupons/${userId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock.', error);
    return [];
  }
};

export const verifyCoupon = async (code: string) => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true, message: '核销成功！' }), 500));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/merchant/verify-coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock.', error);
    return { success: false, message: '网络错误' };
  }
};

export const replyToReview = async (reviewId: number, replyContent: string) => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true, message: '回复成功！' }), 500));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/merchant/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replyContent }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock.', error);
    return { success: false, message: '网络错误' };
  }
};

export const appealReview = async (reviewId: number, reason: string) => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true, message: '申诉已提交，平台将尽快处理。' }), 500));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/merchant/reviews/${reviewId}/appeal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock.', error);
    return { success: false, message: '网络错误' };
  }
};

export const toggleFavorite = async (userId: number, restaurantId: number) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const profile = fetchUserProfileMock(userId);
        const isCurrentlyFavorite = profile.favorites.some((f: any) => f.id.toString() === restaurantId.toString());
        
        let newFavorites;
        if (isCurrentlyFavorite) {
          newFavorites = profile.favorites.filter((f: any) => f.id.toString() !== restaurantId.toString());
        } else {
          const restaurant = RESTAURANTS.find(r => r.id === restaurantId.toString());
          newFavorites = restaurant ? [...profile.favorites, restaurant] : profile.favorites;
        }
        
        // Save to localStorage
        const allProfiles = JSON.parse(localStorage.getItem('mock_user_profiles') || '{}');
        allProfiles[userId] = { ...profile, favorites: newFavorites };
        localStorage.setItem('mock_user_profiles', JSON.stringify(allProfiles));

        resolve({ isFavorite: !isCurrentlyFavorite });
      }, 300);
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites/${restaurantId}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock data.', error);
    return { isFavorite: false };
  }
};

// Helper function for mock data
const fetchUserProfileMock = (userId: number) => {
  const storedProfiles = JSON.parse(localStorage.getItem('mock_user_profiles') || '{}');
  if (storedProfiles[userId]) {
    return storedProfiles[userId];
  }

  const isUser2 = userId === 2;
  const defaultProfile = {
    id: userId,
    username: isUser2 ? '不想早起' : '广大干饭王',
    avatar: isUser2 ? 'https://picsum.photos/seed/student2/200/200' : 'https://picsum.photos/seed/student/200/200',
    university: isUser2 ? '广东外语外贸大学' : '广州大学',
    level: isUser2 ? 2 : 4,
    exp: isUser2 ? 150 : 450,
    nextLevelExp: isUser2 ? 200 : 500,
    favorites: isUser2 ? RESTAURANTS.slice(2, 4) : RESTAURANTS.slice(0, 2),
    reviews: isUser2 ? [
      {
        id: 3,
        rating: 4,
        content: "上菜速度挺快的，就是稍微有点咸。",
        date: "2023-10-24",
        restaurant: RESTAURANTS[0]
      }
    ] : [
      {
        id: 1,
        rating: 4,
        content: "味道很不错，环境也很好，下次还会再来！推荐大家尝试一下招牌菜。",
        date: "2023-10-15",
        restaurant: RESTAURANTS[2]
      },
      {
        id: 2,
        rating: 5,
        content: "非常棒的体验，服务态度很好，菜品也很新鲜。",
        date: "2023-10-10",
        restaurant: RESTAURANTS[3]
      }
    ]
  };
  
  storedProfiles[userId] = defaultProfile;
  localStorage.setItem('mock_user_profiles', JSON.stringify(storedProfiles));
  return defaultProfile;
};

export const fetchLogs = async (adminId?: number | string) => {
  if (USE_MOCK) {
    const isAdmin2 = adminId === 202 || adminId === 'admin2';
    return isAdmin2 ? [
      { id: 1, createdAt: new Date().toISOString(), actionType: 'SYSTEM_ALERT', actorRole: 'SYSTEM', actorId: null, description: '检测到服务器 CPU 占用率过高' },
      { id: 2, createdAt: new Date(Date.now() - 3600000).toISOString(), actionType: 'USER_LOGIN', actorRole: 'USER', actorId: 3, description: '用户 student3 登录系统' },
    ] : [
      { id: 1, createdAt: new Date().toISOString(), actionType: 'COUPON_PUBLISHED', actorRole: 'MERCHANT', actorId: 101, description: '商家发布了新优惠券：满50减10' },
      { id: 2, createdAt: new Date(Date.now() - 3600000).toISOString(), actionType: 'USER_LOGIN', actorRole: 'USER', actorId: 1, description: '用户 student 登录系统' },
      { id: 3, createdAt: new Date(Date.now() - 7200000).toISOString(), actionType: 'SYSTEM_ALERT', actorRole: 'SYSTEM', actorId: null, description: '检测到异常高频请求，IP: 192.168.1.100' },
      { id: 4, createdAt: new Date(Date.now() - 86400000).toISOString(), actionType: 'COUPON_CLAIMED', actorRole: 'USER', actorId: 2, description: '用户 student2 领取了优惠券：全场8折' },
      { id: 5, createdAt: new Date(Date.now() - 90000000).toISOString(), actionType: 'MERCHANT_REGISTER', actorRole: 'MERCHANT', actorId: 102, description: '新商家 merchant2 注册成功' },
    ];
  }

  try {
    const url = adminId ? `${API_BASE_URL}/logs?adminId=${adminId}` : `${API_BASE_URL}/logs`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock logs.', error);
    return [];
  }
};

export const fetchUserProfile = async (userId: number) => {
  if (USE_MOCK) {
    return fetchUserProfileMock(userId);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return {
      ...data,
      favorites: data.favorites ? data.favorites.map(mapRestaurant) : [],
      reviews: data.reviews ? data.reviews.map((review: any) => ({
        ...review,
        restaurant: review.restaurant ? mapRestaurant(review.restaurant) : null
      })) : []
    };
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock data.', error);
    return null;
  }
};
