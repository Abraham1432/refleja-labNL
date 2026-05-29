/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Category, Resource } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, ExternalLink, Filter, Search, Globe, Lock, Map as MapIcon, List as ListIcon, AlertCircle } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

interface DirectoryPageProps {
  resources: Resource[];
}

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY !== 'MY_GOOGLE_MAPS_KEY';

interface MarkerWithInfoProps {
  res: Resource;
}

const MarkerWithInfo: React.FC<MarkerWithInfoProps> = ({ res }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(false);

  if (!res.lat || !res.lng) return null;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: res.lat, lng: res.lng }}
        onClick={() => setInfoOpen(true)}
      >
        <Pin 
          background={res.category.includes(Category.WOMEN) ? "#4F46E5" : "#10B981"} 
          glyphColor="#fff" 
          borderColor="#fff"
        />
      </AdvancedMarker>
      {infoOpen && (
        <InfoWindow anchor={marker} onCloseClick={() => setInfoOpen(false)}>
          <div className="p-2 max-w-[200px]">
            <h4 className="font-bold text-gray-900 text-sm mb-1">{res.name}</h4>
            <p className="text-[10px] text-gray-500 line-clamp-2 mb-2">{res.description}</p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600">
              <Phone size={10} />
              {res.contact}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default function DirectoryPage({ resources }: DirectoryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      if (!res.isPublic) return false;
      const matchesCategory = selectedCategory === 'Todos' || res.category.includes(selectedCategory as Category);
      const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           res.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [resources, selectedCategory, searchQuery]);

  const mapCenter = useMemo(() => {
    const withCoords = filteredResources.filter(r => r.lat && r.lng);
    if (withCoords.length > 0) {
      return { lat: withCoords[0].lat!, lng: withCoords[0].lng! };
    }
    return { lat: 25.6866, lng: -100.3161 }; // Monterrey default
  }, [filteredResources]);

  const renderMap = () => {
    if (!hasValidKey) {
      return (
        <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-3xl p-12 text-center space-y-4">
          <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm text-indigo-600">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-indigo-900">Configuración de Mapa Requerida</h3>
          <p className="text-indigo-600 max-w-md mx-auto text-sm leading-relaxed">
            Para visualizar los recursos en el mapa geográfico, se requiere una <strong>API Key de Google Maps Platform</strong> configurada en los Secretos del Applet bajo el nombre <code>GOOGLE_MAPS_PLATFORM_KEY</code>.
          </p>
          <div className="flex flex-col items-center gap-2 pt-4">
             <a href="https://console.cloud.google.com/google/maps-apis/start" target="_blank" rel="noreferrer" className="text-xs font-black uppercase text-indigo-700 underline underline-offset-4">Conseguir API Key</a>
          </div>
        </div>
      );
    }

    return (
      <div className="h-[600px] w-full rounded-3xl overflow-hidden border border-gray-100 shadow-xl relative">
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            defaultCenter={mapCenter}
            defaultZoom={11}
            mapId="REFLEJA_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
          >
            {filteredResources.map(res => (
              <MarkerWithInfo key={res.id} res={res} />
            ))}
          </Map>
        </APIProvider>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl max-w-sm">
             <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Leyenda</h4>
             <div className="flex gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                   <span className="text-[10px] font-bold text-gray-700">Mujeres</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-green-500"></div>
                   <span className="text-[10px] font-bold text-gray-700">General</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight font-display italic">Directorio Territorial</h1>
          <p className="text-gray-500 text-sm font-medium">
            Encuentra instituciones y organizaciones que brindan apoyo gratuito y especializado.
          </p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <ListIcon size={20} />
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <MapIcon size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-24 z-10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o servicio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          <Filter size={18} className="text-gray-400 ml-2 shrink-0" />
          <button
            onClick={() => setSelectedCategory('Todos')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === 'Todos' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            Todos
          </button>
          {Object.values(Category).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((res) => (
              <motion.div
                key={res.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between h-full hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {res.category.map(c => (
                      <span key={c} className="text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{res.name}</h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed font-medium">{res.description}</p>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500">
                        <MapPin size={16} />
                      </div>
                      <span className="text-xs font-bold">{res.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-green-50 rounded-xl text-green-500">
                        <Phone size={16} />
                      </div>
                      <span className="text-xs font-bold">{res.contact}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    {res.isPublic ? <Globe size={12} /> : <Lock size={12} />}
                    {res.isPublic ? "Acceso Público" : "Restringido"}
                  </div>
                  <button className="flex items-center gap-2 text-xs font-black uppercase text-indigo-600 hover:text-indigo-800 transition-colors">
                    Ver más
                    <ExternalLink size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {renderMap()}
        </motion.div>
      )}

      {filteredResources.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <Search size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Sin coincidencias territoriales</p>
          <p className="text-gray-500 mt-2 text-sm">Prueba ajustando los filtros o el término de búsqueda.</p>
        </div>
      )}
    </div>
  );
}
