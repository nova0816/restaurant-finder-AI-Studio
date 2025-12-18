
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import RestaurantCard from './components/RestaurantCard';
import { searchRestaurants } from './services/geminiService';
import { SearchState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    error: null,
    results: [],
    aiResponse: '',
    groundingSources: [],
  });

  const handleSearch = useCallback(async (location: string, preference: string, minRating: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, aiResponse: '', results: [], groundingSources: [] }));
    
    try {
      // Try to parse coordinates from the location string (added by SearchForm geolocation)
      let coords: { latitude: number, longitude: number } | undefined;
      const coordMatch = location.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/);
      if (coordMatch) {
        coords = {
          latitude: parseFloat(coordMatch[1]),
          longitude: parseFloat(coordMatch[2])
        };
      }
      
      const res = await searchRestaurants(location, preference, minRating, coords);
      
      setState({
        isLoading: false,
        error: null,
        results: res.restaurants,
        aiResponse: res.text,
        groundingSources: res.sources,
      });
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Something went wrong.",
        results: [],
        aiResponse: '',
        groundingSources: [],
      }));
    }
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-gray-50 text-gray-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 mt-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight sm:text-6xl mb-6">
            Find Your Next <span className="text-emerald-600">Flavor</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            DineWise 使用 Gemini AI 的實體地圖數據，為您精準過濾、搜尋在地評價最高的完美餐廳。
          </p>
        </div>

        <SearchForm onSearch={handleSearch} isLoading={state.isLoading} />

        {state.error && (
          <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center text-red-800 shadow-sm animate-pulse">
            <i className="fas fa-exclamation-triangle mr-4 text-2xl"></i>
            <div>
              <p className="font-bold">Oops! 搜尋失敗</p>
              <p className="text-sm opacity-80">{state.error}</p>
            </div>
          </div>
        )}

        {(state.aiResponse || state.results.length > 0) && (
          <div className="mt-16 space-y-12">
            {state.aiResponse && (
              <section className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-2xl relative">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-emerald-500 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
                    <i className="fas fa-sparkles"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">AI 專家推薦分析</h3>
                </div>
                
                <div className="prose max-w-none mb-10">
                  <p className="text-xl leading-relaxed text-gray-800 whitespace-pre-wrap font-medium">
                    {state.aiResponse}
                  </p>
                </div>

                {/* Explicit Grounding Sources (REQUIRED LINKS) */}
                {state.groundingSources.length > 0 && (
                  <div className="pt-8 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                        <i className="fas fa-map-location-dot mr-3 text-emerald-500"></i> 地圖來源驗證
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {state.groundingSources.map((source, idx) => (
                        <a 
                          key={idx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between group bg-gray-50 hover:bg-emerald-600 p-4 rounded-xl border border-gray-200 hover:border-emerald-500 transition-all duration-300"
                        >
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="bg-white p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                              <i className="fab fa-google text-emerald-500 group-hover:text-white"></i>
                            </div>
                            <span className="font-bold text-sm text-gray-700 group-hover:text-white truncate">
                              {source.title}
                            </span>
                          </div>
                          <i className="fas fa-chevron-right text-[10px] text-gray-400 group-hover:text-white/50 group-hover:translate-x-1 transition-all"></i>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {state.results.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-900 text-white w-10 h-10 rounded-xl flex items-center justify-center">
                      <i className="fas fa-list-ul"></i>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">
                      符合條件的餐廳
                    </h3>
                  </div>
                  <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black">
                    {state.results.length} 個結果
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {state.results.map((res) => (
                    <RestaurantCard key={res.id} restaurant={res} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {!state.isLoading && !state.aiResponse && !state.error && (
          <div className="mt-24 text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-10 animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white shadow-xl border border-gray-50 mb-8">
                <i className="fas fa-utensils text-5xl text-emerald-500"></i>
              </div>
            </div>
            <p className="text-gray-400 font-bold tracking-tight text-lg">準備好開始您的美食冒險了嗎？</p>
            <p className="text-gray-300 text-sm mt-2">輸入地點與想吃的，剩下的交給 AI 專家</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
