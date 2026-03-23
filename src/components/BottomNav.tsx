import { Home, Map, Dices, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'random', icon: Dices, label: '吃什么' },
    { id: 'map', icon: Map, label: '地图' },
    { id: 'profile', icon: User, label: '我的' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 px-6 flex justify-between items-center z-40 md:static md:w-64 md:h-screen md:flex-col md:justify-start md:border-t-0 md:border-r md:pt-12 md:px-4 md:gap-2 md:bg-gray-50">
      
      <div className="hidden md:block mb-10 px-4">
        <h1 className="text-2xl font-bold text-orange-500">校园食集</h1>
        <p className="text-sm text-gray-500">发现大学城美食</p>
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col md:flex-row md:w-full items-center md:px-4 md:py-3 md:rounded-xl p-2 transition-colors ${
              isActive 
                ? 'text-orange-500 md:bg-orange-100 md:text-orange-600' 
                : 'text-gray-400 hover:text-gray-600 md:text-gray-600 md:hover:bg-gray-200'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="md:w-5 md:h-5 md:mr-3" />
            <span className="text-[10px] md:text-sm mt-1 md:mt-0 font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
