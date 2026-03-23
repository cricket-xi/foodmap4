import React from 'react';
import { MapPin, Star, Tag, Heart } from 'lucide-react';
import { Restaurant } from '../data/mockData';

interface FoodCardProps {
  key?: string | number;
  restaurant: Restaurant;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export default function FoodCard({ restaurant, onClick, isFavorite = false, onToggleFavorite }: FoodCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98] transform duration-200 relative"
    >
      <div className="relative h-48 w-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <span className="text-7xl filter drop-shadow-md transform transition-transform group-hover:scale-110">{restaurant.emoji}</span>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-orange-600 flex items-center shadow-sm">
          <Star size={12} className="fill-orange-500 mr-1" />
          {restaurant.rating}
        </div>
        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-white flex items-center">
          <MapPin size={12} className="mr-1" />
          {restaurant.university}
        </div>
        
        {onToggleFavorite && (
          <button 
            onClick={onToggleFavorite}
            className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm z-10"
          >
            <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
          </button>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 leading-tight pr-2">{restaurant.name}</h3>
          <span className="text-orange-500 font-bold whitespace-nowrap ml-2">¥{restaurant.price}<span className="text-xs text-gray-400 font-normal">/人</span></span>
        </div>
        
        <p className="text-gray-500 text-xs mb-3 flex items-center">
          {restaurant.location}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {restaurant.tags.map((tag, idx) => (
            <span key={idx} className="bg-orange-50 text-orange-600 text-[10px] px-2 py-1 rounded-md font-medium">
              {tag}
            </span>
          ))}
        </div>

        {restaurant.discount && (
          <div className="flex items-center text-xs text-red-500 bg-red-50 p-2 rounded-lg">
            <Tag size={12} className="mr-1 flex-shrink-0" />
            <span className="font-medium truncate">学生特权: {restaurant.discount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
