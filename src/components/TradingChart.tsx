
import React, { useEffect, useRef } from 'react';
import { useTradingContext } from '@/contexts/TradingContext';

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingChart: React.FC = () => {
  const { selectedAsset, selectedTimeframe, setSelectedTimeframe } = useTradingContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Carrega o script da TradingView se ainda não estiver carregado
    if (!document.getElementById('tradingview-widget-script')) {
      const script = document.createElement('script');
      script.id = 'tradingview-widget-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initializeWidget;
      document.head.appendChild(script);
    } else {
      initializeWidget();
    }

    return () => {
      if (widgetRef.current) {
        try {
          // Limpar o widget quando o componente é desmontado
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }
          widgetRef.current = null;
        } catch (error) {
          console.error('Erro ao limpar o widget TradingView:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    // Recriar o widget quando o ativo muda
    if (window.TradingView && widgetRef.current) {
      initializeWidget();
    }
  }, [selectedAsset, selectedTimeframe]);

  const initializeWidget = () => {
    if (!containerRef.current || !window.TradingView) return;

    // Limpar o container antes de criar um novo widget
    containerRef.current.innerHTML = '';

    // Mapear o timeframe selecionado para o formato do TradingView
    const interval = mapTimeframeToInterval(selectedTimeframe);

    // Criar o widget da TradingView
    widgetRef.current = new window.TradingView.widget({
      container_id: containerRef.current.id,
      autosize: true,
      symbol: selectedAsset.symbol.replace('/', ':'),
      interval: interval,
      timezone: "America/Sao_Paulo",
      theme: "dark",
      style: "1",
      locale: "br",
      toolbar_bg: "#1A1F2C",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      show_popup_button: true,
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      studies: ["RSI@tv-basicstudies", "MASimple@tv-basicstudies"],
      overrides: {
        "mainSeriesProperties.candleStyle.upColor": "#0ECB81",
        "mainSeriesProperties.candleStyle.downColor": "#f23645",
        "mainSeriesProperties.candleStyle.borderUpColor": "#0ECB81",
        "mainSeriesProperties.candleStyle.borderDownColor": "#f23645",
        "mainSeriesProperties.candleStyle.wickUpColor": "#0ECB81",
        "mainSeriesProperties.candleStyle.wickDownColor": "#f23645",
        "paneProperties.background": "#1A1F2C",
        "paneProperties.vertGridProperties.color": "rgba(255, 255, 255, 0.05)",
        "paneProperties.horzGridProperties.color": "rgba(255, 255, 255, 0.05)",
      }
    });
  };

  const mapTimeframeToInterval = (timeframe: string): string => {
    switch (timeframe) {
      case '5m': return '5';
      case '15m': return '15';
      case '30m': return '30';
      case '1h': return '60';
      case '4h': return '240';
      case '1d': return 'D';
      default: return '30';
    }
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  return (
    <div className="bg-trader-dark border border-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-3 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-yellow-500 rounded-full h-6 w-6 flex items-center justify-center mr-2">
            <span className="text-xs text-black font-bold">₿</span>
          </div>
          <div>
            <h3 className="text-white font-bold">{selectedAsset.symbol}</h3>
            <p className="text-xs text-gray-400">{selectedAsset.name} • {selectedAsset.type}</p>
          </div>
        </div>
        
        <div className="flex gap-1 text-xs">
          <button 
            onClick={() => handleTimeframeChange('5m')} 
            className={`px-3 py-1 rounded ${selectedTimeframe === '5m' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
          >
            5m
          </button>
          <button 
            onClick={() => handleTimeframeChange('15m')} 
            className={`px-3 py-1 rounded ${selectedTimeframe === '15m' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
          >
            15m
          </button>
          <button 
            onClick={() => handleTimeframeChange('30m')} 
            className={`px-3 py-1 rounded ${selectedTimeframe === '30m' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
          >
            30m
          </button>
          <button 
            onClick={() => handleTimeframeChange('1h')} 
            className={`px-3 py-1 rounded ${selectedTimeframe === '1h' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
          >
            1h
          </button>
          <button 
            onClick={() => handleTimeframeChange('4h')} 
            className={`px-3 py-1 rounded ${selectedTimeframe === '4h' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
          >
            4h
          </button>
          <button 
            onClick={() => handleTimeframeChange('1d')} 
            className={`px-3 py-1 rounded ${selectedTimeframe === '1d' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
          >
            1d
          </button>
        </div>
      </div>
      
      <div className="flex-1" id="tradingview_chart" ref={containerRef}></div>
    </div>
  );
};

export default TradingChart;
