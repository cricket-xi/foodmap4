import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Restaurant } from '../data/mockData';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RestaurantMapProps {
  restaurants: Restaurant[];
  onRestaurantClick?: (id: string) => void;
}

const RestaurantMap: React.FC<RestaurantMapProps> = ({ restaurants, onRestaurantClick }) => {
  // Default center (Guangzhou University Town roughly)
  const center: [number, number] = [23.05, 113.39];

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 relative z-0">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {restaurants.map((restaurant) => {
          // Convert mock coordinates (0-100) to actual lat/lng for demo purposes
          // This is a rough approximation based on the mock data logic
          const lat = 23.075 - (restaurant.coordinates.y / 100) * (23.075 - 23.025);
          const lng = 113.360 + (restaurant.coordinates.x / 100) * (113.420 - 113.360);

          return (
            <Marker key={restaurant.id} position={[lat, lng]}>
              <Popup>
                <div className="text-center cursor-pointer" onClick={() => onRestaurantClick?.(restaurant.id)}>
                  <div className="text-2xl mb-1">{restaurant.emoji}</div>
                  <h3 className="font-bold text-sm">{restaurant.name}</h3>
                  <p className="text-xs text-gray-500">{restaurant.university}</p>
                  <p className="text-xs text-orange-500 font-medium mt-1">查看详情 &gt;</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default RestaurantMap;
