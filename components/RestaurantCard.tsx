
import React from 'react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
      <div className="h-44 bg-gray-100 relative overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${encodeURIComponent(restaurant.name)}/600/400`} 
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur shadow-sm px-2.5 py-1.5 rounded-lg flex items-center text-[10px] font-bold text-emerald-700 border border-emerald-100 uppercase tracking-tight">
           <i className="fas fa-check-circle mr-1.5 text-emerald-500"></i>
           <span>Maps Verified</span>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-emerald-700 transition-colors">
          {restaurant.name}
        </h3>
        <p className="text-xs text-gray-500 mb-4 flex items-center font-medium">
          <i className="fas fa-tag mr-1.5 text-gray-400"></i>
          {restaurant.category || "在地美食與餐廳"}
        </p>
        
        <div className="bg-emerald-50/50 p-4 rounded-xl mb-5 flex-grow border border-emerald-50">
          <p className="text-sm text-gray-700 leading-relaxed italic mb-3">
            "{restaurant.matchReason}"
          </p>
          
          {restaurant.reviewSnippets && restaurant.reviewSnippets.length > 0 && (
            <div className="space-y-2 mt-3 pt-3 border-t border-emerald-100">
              {restaurant.reviewSnippets.slice(0, 2).map((snippet, idx) => (
                <p key={idx} className="text-[11px] text-gray-500 flex items-start">
                  <i className="fas fa-quote-left mr-1.5 mt-1 text-emerald-300 text-[8px]"></i>
                  <span className="line-clamp-2">{snippet}</span>
                </p>
              ))}
            </div>
          )}
        </div>

        <a 
          href={restaurant.mapUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-emerald-600 text-white text-center py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all flex items-center justify-center group/btn shadow-md shadow-emerald-100 active:scale-[0.97]"
        >
          <span>在 Google 地圖查看</span>
          <i className="fas fa-external-link-alt ml-2 text-[10px] opacity-70 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"></i>
        </a>
      </div>
    </div>
  );
};

export default RestaurantCard;
