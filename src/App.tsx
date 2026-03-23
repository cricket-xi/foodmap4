import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Home from './components/Home';
import Randomizer from './components/Randomizer';
import BottomNav from './components/BottomNav';
import FoodDetail from './components/FoodDetail';
import MapTab from './components/MapTab';
import ProfileTab from './components/ProfileTab';
import Leaderboard from './components/Leaderboard';
import Discounts from './components/Discounts';
import Categories from './components/Categories';
import Login from './components/Login';
import MerchantDashboard from './components/MerchantDashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { Restaurant } from './data/mockData';

export default function App() {
  const [userRole, setUserRole] = useState<'user' | 'merchant' | 'admin' | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [navigatingTo, setNavigatingTo] = useState<Restaurant | null>(null);

  const handleLogin = (role: 'user' | 'merchant' | 'admin', user?: any) => {
    if (role === 'admin' && !user) {
      setShowAdminLogin(true);
      return;
    }
    setUserRole(role);
    setCurrentUser(user);
    setShowAdminLogin(false);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setShowAdminLogin(false);
  };

  const handleNavigate = (restaurant: Restaurant) => {
    setNavigatingTo(restaurant);
    setSelectedRestaurant(null);
    setActiveTab('map');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onSelectRestaurant={setSelectedRestaurant} onNavigateTo={setActiveTab} currentUser={currentUser} />;
      case 'random':
        return <Randomizer onSelectRestaurant={setSelectedRestaurant} />;
      case 'map':
        return (
          <MapTab 
            onSelectRestaurant={setSelectedRestaurant} 
            navigatingTo={navigatingTo} 
            onClearNavigation={() => setNavigatingTo(null)} 
          />
        );
      case 'profile':
        return <ProfileTab onSelectRestaurant={setSelectedRestaurant} onLogout={handleLogout} currentUser={currentUser} />;
      case 'leaderboard':
        return <Leaderboard onSelectRestaurant={setSelectedRestaurant} onBack={() => setActiveTab('home')} />;
      case 'discounts':
        return <Discounts onSelectRestaurant={setSelectedRestaurant} onBack={() => setActiveTab('home')} currentUser={currentUser} />;
      case 'categories':
        return <Categories onSelectRestaurant={setSelectedRestaurant} onBack={() => setActiveTab('home')} />;
      default:
        return <Home onSelectRestaurant={setSelectedRestaurant} onNavigateTo={setActiveTab} currentUser={currentUser} />;
    }
  };

  if (showAdminLogin) {
    return <AdminLogin onLogin={handleLogin} onBack={() => setShowAdminLogin(false)} />;
  }

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  if (userRole === 'admin') {
    return <AdminDashboard onLogout={handleLogout} currentUser={currentUser} />;
  }

  if (userRole === 'merchant') {
    return <MerchantDashboard onLogout={handleLogout} currentUser={currentUser} />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden relative">
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 relative overflow-hidden bg-white md:rounded-3xl md:shadow-xl md:m-4 md:border md:border-gray-200 flex flex-col">
        {renderContent()}
      </div>

      <AnimatePresence>
        {selectedRestaurant && (
          <FoodDetail 
            restaurant={selectedRestaurant} 
            onBack={() => setSelectedRestaurant(null)} 
            onNavigate={handleNavigate}
            currentUser={currentUser}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
