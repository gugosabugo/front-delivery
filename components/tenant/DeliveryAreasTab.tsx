"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Plus, Trash2, Layers, Clock, HelpCircle, Search, Loader2 } from "lucide-react";

interface DeliveryRadius {
    id: string;
    name: string;
    distanceKm: number;
    fee: number;
    time: string;
    color: string;
    strokeColor: string;
}

export default function DeliveryAreasTab() {
    // Coordenadas reais da loja [Latitude, Longitude] - Inicializado em uma posição padrão (Ex: São Paulo)
    const [storeCoords, setStoreCoords] = useState<{ lat: number; lng: number }>({
        lat: -23.55052,
        lng: -46.633308
    });

    // Configuração dos raios de entrega
    const [radii, setRadii] = useState<DeliveryRadius[]>([
        { id: "1", name: "Raio Próximo", distanceKm: 1.5, fee: 5.00, time: "15-25 min", color: "#3b82f6", strokeColor: "#1d4ed8" }, // Azul
        { id: "2", name: "Raio Intermediário", distanceKm: 3.5, fee: 9.00, time: "25-40 min", color: "#f59e0b", strokeColor: "#b45309" }, // Âmbar
        { id: "3", name: "Raio Limite", distanceKm: 6.0, fee: 15.00, time: "40-60 min", color: "#ef4444", strokeColor: "#b91c1c" }, // Vermelho
    ]);

    // Estados do Formulário de Cadastro
    const [newName, setNewName] = useState("");
    const [newDistance, setNewDistance] = useState("");
    const [newFee, setNewFee] = useState("");
    const [newTime, setNewTime] = useState("");

    // Estados de Busca de Endereço
    const [addressSearch, setAddressSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Controle de comunicação com o Mapa Real (Iframe)
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isMapReady, setIsMapReady] = useState(false);

    const colorPalette = [
        { color: "#a855f7", stroke: "#7e22ce" }, // Roxo
        { color: "#10b981", stroke: "#047857" }, // Verde
        { color: "#06b6d4", stroke: "#0e7490" }  // Ciano
    ];

    // Sincroniza as coordenadas e círculos com o mapa real sempre que houver mudanças
    useEffect(() => {
        if (isMapReady && iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'UPDATE_MAP',
                lat: storeCoords.lat,
                lng: storeCoords.lng,
                radii: radii
            }, '*');
        }
    }, [storeCoords, radii, isMapReady]);

    // Escuta eventos vindos de dentro do mapa (ex: quando o usuário clica no mapa para mudar o pin)
    useEffect(() => {
        const handleMapMessages = (event: MessageEvent) => {
            if (event.data.type === 'MAP_READY') {
                setIsMapReady(true);
            }
            if (event.data.type === 'MAP_CLICKED') {
                setStoreCoords({ lat: event.data.lat, lng: event.data.lng });
            }
        };

        window.addEventListener('message', handleMapMessages);
        return () => window.removeEventListener('message', handleMapMessages);
    }, []);

    // Função de busca de endereço por texto (Geocoding via OpenStreetMap Nominatim API)
    const handleSearchAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addressSearch.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch)}&limit=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setStoreCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
            } else {
                alert("Endereço não encontrado. Tente incluir nome da rua, número e cidade.");
            }
        } catch (error) {
            console.error("Erro ao buscar coordenadas:", error);
            alert("Erro de conexão ao buscar endereço.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddRadius = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || !newDistance || !newFee || !newTime) return;

        const pickColor = colorPalette[radii.length % colorPalette.length];

        const newRadiusItem: DeliveryRadius = {
            id: Date.now().toString(),
            name: newName.trim(),
            distanceKm: parseFloat(newDistance),
            fee: parseFloat(newFee),
            time: newTime,
            color: pickColor.color,
            strokeColor: pickColor.stroke
        };

        // Ordena para que os círculos maiores fiquem por baixo no mapa
        setRadii([...radii, newRadiusItem].sort((a, b) => a.distanceKm - b.distanceKm));
        
        setNewName("");
        setNewDistance("");
        setNewFee("");
        setNewTime("");
    };

    const handleDeleteRadius = (id: string) => {
        setRadii(radii.filter(r => r.id !== id));
    };

    // Código HTML do mapa real injetado com segurança (Evita bugs de Hydration e Window no Next.js)
    const mapHtmlContainer = `
        <!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                body, html, #map { margin: 0; padding: 0; height: 100%; width: 100%; }
                .leaflet-container { font-family: sans-serif; }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                var map;
                var storeMarker;
                var circles = [];

                function init() {
                    map = L.map('map', { attributionControl: false }).setView([${storeCoords.lat}, ${storeCoords.lng}], 13);
                    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

                    window.parent.postMessage({ type: 'MAP_READY' }, '*');

                    map.on('click', function(e) {
                        window.parent.postMessage({
                            type: 'MAP_CLICKED',
                            lat: e.latlng.lat,
                            lng: e.latlng.lng
                        }, '*');
                    });
                }

                window.addEventListener('message', function(event) {
                    if (event.data.type === 'UPDATE_MAP') {
                        var lat = event.data.lat;
                        var lng = event.data.lng;
                        var radiiList = event.data.radii;

                        if (!map) return;

                        map.setView([lat, lng]);

                        if (storeMarker) {
                            storeMarker.setLatLng([lat, lng]);
                        } else {
                            storeMarker = L.marker([lat, lng]).addTo(map);
                        }

                        // Limpa círculos anteriores
                        circles.forEach(function(c) { map.removeLayer(c); });
                        circles = [];

                        // Desenha círculos matemáticos redondos e perfeitos com base nos metros (KM * 1000)
                        // Renderiza na ordem reversa para que os menores fiquem clicáveis/visíveis por cima
                        var reverseRadii = [...radiiList].reverse();
                        reverseRadii.forEach(function(r) {
                            var circle = L.circle([lat, lng], {
                                color: r.strokeColor,
                                weight: 2,
                                fillColor: r.color,
                                fillOpacity: 0.18,
                                radius: r.distanceKm * 1000
                            }).addTo(map);
                            
                            circle.bindTooltip(r.name + " (" + r.distanceKm + " km)", { direction: 'top' });
                            circles.push(circle);
                        });
                    }
                });

                window.onload = init;
            </script>
        </body>
        </html>
    `;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-slate-900">Logística por Raio de Entrega</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                    Digite o endereço da sua loja ou clique diretamente no mapa real para posicionar o marcador central.
                </p>
            </div>

            {/* BARRA DE BUSCA DE ENDEREÇO */}
            <form onSubmit={handleSearchAddress} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex gap-2 items-center">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Digite o endereço da sua loja (Ex: Av. Paulista, 1500, São Paulo)" 
                        value={addressSearch}
                        onChange={(e) => setAddressSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-slate-950"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isSearching}
                    className="bg-slate-950 text-white text-xs font-bold px-4 h-[34px] rounded-lg cursor-pointer flex items-center gap-1.5 hover:bg-slate-900 disabled:opacity-50 transition-all"
                >
                    {isSearching ? <Loader2 size={14} className="animate-spin" /> : "Localizar Loja"}
                </button>
            </form>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* MAPA EM TEMPO REAL */}
                <div className="xl:col-span-2 flex flex-col gap-3">
                    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <Layers size={14} className="text-blue-600" /> Mapa de Cobertura Geográfica Real
                            </span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                Lat: {storeCoords.lat.toFixed(4)} | Lng: {storeCoords.lng.toFixed(4)}
                            </span>
                        </div>

                        {/* Iframe que hospeda o mapa real isolado de problemas com Window/SSR */}
                        <div className="w-full h-[440px] bg-slate-50 rounded-lg overflow-hidden border border-slate-200 relative">
                            <iframe 
                                ref={iframeRef}
                                srcDoc={mapHtmlContainer}
                                className="w-full h-full border-none"
                                title="Real Delivery Map"
                            />
                        </div>
                    </div>
                </div>

                {/* PAINEL DE CONFIGURAÇÕES E FORMULÁRIOS DE TAXA */}
                <div className="space-y-4">
                    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        <h3 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Novo Raio Tarifado</h3>
                        
                        <form onSubmit={handleAddRadius} className="space-y-3">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nome da Região / Raio</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Entrega Expressa Centro" 
                                    value={newName} 
                                    onChange={(e) => setNewName(e.target.value)} 
                                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-slate-950" 
                                    required 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Alcance Máx (KM)</label>
                                    <input 
                                        type="number" 
                                        step="0.1"
                                        placeholder="Ex: 3.5" 
                                        value={newDistance} 
                                        onChange={(e) => setNewDistance(e.target.value)} 
                                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-slate-950" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Preço da Taxa</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        placeholder="Ex: 7.00" 
                                        value={newFee} 
                                        onChange={(e) => setNewFee(e.target.value)} 
                                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-slate-950" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tempo Estimado</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: 25-35 min" 
                                    value={newTime} 
                                    onChange={(e) => setNewTime(e.target.value)} 
                                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-slate-950" 
                                    required 
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-slate-950 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-slate-900 transition-colors cursor-pointer"
                            >
                                <Plus size={14} /> Adicionar Raio
                            </button>
                        </form>
                    </div>

                    {/* LISTAGEM DOS VALORES CADASTRADOS */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-3 bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Raios Ativos e Valores
                        </div>
                        <div className="divide-y divide-slate-100 max-h-[200px] overflow-y-auto">
                            {radii.map((r) => (
                                <div key={r.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: r.color, borderColor: r.strokeColor }}></div>
                                        <div>
                                            <div className="font-bold text-slate-800">{r.name}</div>
                                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                <span>Até {r.distanceKm} km</span>
                                                <span>•</span>
                                                <Clock size={10} /> <span>{r.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                                            {r.fee.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                        </span>
                                        <button 
                                            onClick={() => handleDeleteRadius(r.id)} 
                                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {radii.length === 0 && (
                                <div className="p-6 text-center text-slate-400 text-xs flex flex-col items-center gap-1">
                                    <HelpCircle size={18} /> Nenhum raio ativo configurado.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}