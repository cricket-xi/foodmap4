import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Navigation, Crosshair, Search, Filter, X, Plus, Minus, Star } from 'lucide-react';
import { Restaurant, UNIVERSITIES, CATEGORIES } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { fetchRestaurants } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, useMap as useLeafletMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapTabProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  navigatingTo?: Restaurant | null;
  onClearNavigation?: () => void;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const UNIVERSITY_AREAS = [
  { name: '广州大学', center: { lat: 23.040, lng: 113.370 }, color: '#f97316', radius: 600 },
  { name: '中山大学', center: { lat: 23.060, lng: 113.395 }, color: '#3b82f6', radius: 700 },
  { name: '华南理工大学', center: { lat: 23.045, lng: 113.405 }, color: '#ef4444', radius: 650 },
  { name: '广东外语外贸大学', center: { lat: 23.065, lng: 113.375 }, color: '#8b5cf6', radius: 500 },
  { name: '华南师范大学', center: { lat: 23.055, lng: 113.385 }, color: '#10b981', radius: 550 },
  { name: '贝岗村', center: { lat: 23.050, lng: 113.390 }, color: '#eab308', radius: 300 },
];

function MapController({ selectedMarker }: { selectedMarker: Restaurant | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedMarker && map) {
      const lat = 23.075 - (selectedMarker.coordinates.y / 100) * (23.075 - 23.025);
      const lng = 113.360 + (selectedMarker.coordinates.x / 100) * (113.420 - 113.360);
      map.panTo({ lat, lng });
      map.setZoom(16);
    }
  }, [selectedMarker, map]);

  return null;
}

function LeafletMapController({ selectedMarker }: { selectedMarker: Restaurant | null }) {
  const map = useLeafletMap();
  
  useEffect(() => {
    if (selectedMarker && map) {
      const lat = 23.075 - (selectedMarker.coordinates.y / 100) * (23.075 - 23.025);
      const lng = 113.360 + (selectedMarker.coordinates.x / 100) * (113.420 - 113.360);
      map.flyTo([lat, lng], 16);
    }
  }, [selectedMarker, map]);

  return null;
}

function RouteDisplay({ origin, destination }: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map) return;
    polylinesRef.current.forEach(p => p.setMap(null));

    (routesLib as any).Route.computeRoutes({
      origin,
      destination,
      travelMode: 'DRIVING',
      fields: ['path', 'viewport'],
    }).then(({ routes }: any) => {
      if (routes?.[0]) {
        const newPolylines = routes[0].createPolylines();
        newPolylines.forEach((p: any) => p.setMap(map));
        polylinesRef.current = newPolylines;
        if (routes[0].viewport) map.fitBounds(routes[0].viewport);
      }
    });

    return () => polylinesRef.current.forEach(p => p.setMap(null));
  }, [routesLib, map, origin, destination]);

  return null;
}

export default function MapTab({ onSelectRestaurant, navigatingTo, onClearNavigation }: MapTabProps) {
  const [selectedMarker, setSelectedMarker] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('全部');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [showFilters, setShowFilters] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  
  const center = { lat: 23.050, lng: 113.390 }; // Center of HEMC

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (navigatingTo) {
      setSelectedMarker(navigatingTo);
    }
  }, [navigatingTo]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      const matchesSearch = !searchQuery || 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesUni = selectedUniversity === '全部' || r.university === selectedUniversity;
      const matchesCat = selectedCategory === '全部' || r.category === selectedCategory;
      return matchesSearch && matchesUni && matchesCat;
    });
  }, [searchQuery, selectedUniversity, selectedCategory, restaurants]);

  return (
    <div className="relative h-screen w-full bg-[#e8f4f8] overflow-hidden pb-20">
      {/* Header & Search */}
      <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-md px-4 pt-12 pb-4 z-[1001] shadow-sm border-b border-gray-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">美食地图</h1>
            <p className="text-sm text-gray-500 mt-1">广州大学城</p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showFilters ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <Filter size={20} />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索餐厅、地点或标签..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl py-2.5 pl-10 pr-10 text-sm transition-all outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Prompt */}
      <AnimatePresence>
        {navigatingTo && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-[156px] left-4 right-4 md:w-96 md:right-auto z-[1001] bg-emerald-500 text-white rounded-xl p-3 shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2 animate-pulse">
                <Navigation size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">正在导航中...</p>
                <p className="text-xs text-emerald-100">前往：{navigatingTo.name}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                if (onClearNavigation) onClearNavigation();
              }}
              className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute top-[156px] left-0 right-0 md:w-96 md:right-auto md:rounded-br-3xl md:rounded-bl-none md:border-r bg-white z-[1000] shadow-lg rounded-b-3xl border-t border-gray-100 px-4 py-5 max-h-[50vh] overflow-y-auto"
          >
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">按大学筛选</h3>
                <div className="flex flex-wrap gap-2">
                  {UNIVERSITIES.map(uni => (
                    <button 
                      key={uni}
                      onClick={() => setSelectedUniversity(uni)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedUniversity === uni ? 'bg-orange-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {uni}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">按分类筛选</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedCategory === cat ? 'bg-orange-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Map Area */}
      <div className="absolute inset-0 pt-[156px] pb-20 md:pb-0 z-0">
        {hasValidKey ? (
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={center}
              defaultZoom={14}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              disableDefaultUI={true}
            >
              <MapController selectedMarker={selectedMarker} />
              
              {navigatingTo && (
                <RouteDisplay origin={center} destination={{ 
                  lat: 23.075 - (navigatingTo.coordinates.y / 100) * (23.075 - 23.025), 
                  lng: 113.360 + (navigatingTo.coordinates.x / 100) * (113.420 - 113.360) 
                }} />
              )}

              {filteredRestaurants.map((restaurant) => {
                const lat = 23.075 - (restaurant.coordinates.y / 100) * (23.075 - 23.025);
                const lng = 113.360 + (restaurant.coordinates.x / 100) * (113.420 - 113.360);
                return (
                <AdvancedMarker
                  key={restaurant.id}
                  position={{ lat, lng }}
                  onClick={() => setSelectedMarker(restaurant)}
                >
                  <div className={`relative group ${selectedMarker?.id === restaurant.id ? 'scale-110 z-10' : 'scale-100'} transition-transform`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 ${selectedMarker?.id === restaurant.id ? 'bg-orange-500 border-white text-white' : 'bg-white border-orange-500 text-orange-500'}`}>
                      <span className="text-sm">{restaurant.emoji}</span>
                    </div>
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold shadow-sm transition-opacity ${selectedMarker?.id === restaurant.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {restaurant.name}
                    </div>
                  </div>
                </AdvancedMarker>
              )})}
            </Map>
          </APIProvider>
        ) : (
          <MapContainer center={[center.lat, center.lng]} zoom={14} scrollWheelZoom={true} className="h-full w-full z-0">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LeafletMapController selectedMarker={selectedMarker} />
            {filteredRestaurants.map((restaurant) => {
              const lat = 23.075 - (restaurant.coordinates.y / 100) * (23.075 - 23.025);
              const lng = 113.360 + (restaurant.coordinates.x / 100) * (113.420 - 113.360);
              return (
              <Marker 
                key={restaurant.id} 
                position={[lat, lng]}
                eventHandlers={{
                  click: () => setSelectedMarker(restaurant),
                }}
              >
                <Popup>
                  <div className="text-center cursor-pointer" onClick={() => onSelectRestaurant(restaurant)}>
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
        )}
      </div>

      {/* Selected Restaurant Card Overlay */}
      <AnimatePresence>
        {selectedMarker && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-24 md:bottom-6 left-4 right-4 md:right-auto md:w-96 z-[1000]"
          >
            <div className="bg-white rounded-2xl p-3 shadow-xl border border-gray-100 flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center flex-shrink-0">
                <span className="text-4xl filter drop-shadow-sm">{selectedMarker.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 text-base truncate pr-2">{selectedMarker.name}</h3>
                  <div className="flex items-center text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded text-xs font-bold flex-shrink-0">
                    <Star size={12} className="fill-current mr-0.5" />
                    {selectedMarker.rating}
                  </div>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{selectedMarker.location}</p>
                <div className="flex items-center gap-2 mt-2 overflow-x-auto no-scrollbar pb-1">
                  <span className="text-orange-500 font-bold text-sm flex-shrink-0">¥{selectedMarker.price}</span>
                  <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                    {selectedMarker.category}
                  </span>
                  {selectedMarker.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="bg-orange-50 text-orange-600 text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => onSelectRestaurant(selectedMarker)}
                  className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-md"
                >
                  <Navigation size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
