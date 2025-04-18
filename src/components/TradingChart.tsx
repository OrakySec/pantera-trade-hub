
import React, { useEffect, useRef, useState } from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import { Minus, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingChart: React.FC = () => {
  const { 
    selectedAsset, 
    selectedTimeframe, 
    setSelectedTimeframe, 
    assetPrice, 
    tradeAmount, 
    setTradeAmount,
    expiryTime,
    setExpiryTime,
    getEstimatedReturn,
    placeTrade,
    getTradeMarkers
  } = useTradingContext();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [estimatedProfit, setEstimatedProfit] = useState(getEstimatedReturn(tradeAmount));

  useEffect(() => {
    // Atualizar o lucro estimado quando o valor da operação muda
    setEstimatedProfit(getEstimatedReturn(tradeAmount));
  }, [tradeAmount, getEstimatedReturn]);

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
    // Recriar o widget quando o ativo ou timeframe muda
    if (window.TradingView && widgetRef.current) {
      initializeWidget();
    }
  }, [selectedAsset, selectedTimeframe]);
  
  const addMarkersToChart = () => {
    if (!widgetRef.current) return;
    
    try {
      // Obter as operações para marcar no gráfico
      const markers = getTradeMarkers();
      
      // Limpar marcadores existentes
      widgetRef.current.activeChart().executeActionById('drawingClear');
      
      markers.forEach(trade => {
        // Converter a data de criação para timestamp (milissegundos)
        const createdTime = new Date(trade.createdAt).getTime();
        
        // Calcular o tempo de expiração
        const expiryTime = createdTime + (trade.expiryTime * 60 * 1000);
        
        // Adicionar uma linha vertical no momento da entrada
        widgetRef.current.activeChart().createMultipointShape([
          { time: createdTime, price: trade.entryPrice },
          { time: createdTime, price: trade.entryPrice * 1.05 } // Linha vertical
        ], {
          shape: "vertical_line",
          lock: true,
          disableSelection: true,
          disableSave: true,
          disableUndo: true,
          overrides: {
            linecolor: trade.direction === 'BUY' ? '#0ECB81' : '#ea384c',
            linewidth: 2,
            linestyle: 0,
            showLabel: true,
            text: `${trade.direction === 'BUY' ? '⬆️ COMPRA' : '⬇️ VENDA'} - R$${trade.amount}`,
            textcolor: trade.direction === 'BUY' ? '#0ECB81' : '#ea384c',
            fontsize: 12,
            backgroundColor: '#111827'
          }
        });
        
        // Se a operação já foi fechada, mostrar o resultado
        if (trade.status !== 'OPEN' && trade.closePrice) {
          // Adicionar uma linha vertical no momento do fechamento
          widgetRef.current.activeChart().createMultipointShape([
            { time: expiryTime, price: trade.closePrice },
            { time: expiryTime, price: trade.closePrice * 1.05 } // Linha vertical
          ], {
            shape: "vertical_line",
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            overrides: {
              linecolor: trade.status === 'WON' ? '#0ECB81' : '#ea384c',
              linewidth: 2,
              linestyle: 0,
              showLabel: true,
              text: `${trade.status === 'WON' ? '✅ GANHO' : '❌ PERDA'} - ${trade.status === 'WON' ? '+' : ''}${trade.profitPercentage}%`,
              textcolor: trade.status === 'WON' ? '#0ECB81' : '#ea384c',
              fontsize: 12,
              backgroundColor: '#111827'
            }
          });
          
          // Desenhar uma linha conectando entrada e saída
          widgetRef.current.activeChart().createMultipointShape([
            { time: createdTime, price: trade.entryPrice },
            { time: expiryTime, price: trade.closePrice }
          ], {
            shape: "trend_line",
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            overrides: {
              linecolor: trade.status === 'WON' ? '#0ECB81' : '#ea384c',
              linewidth: 1,
              linestyle: 2, // linha tracejada
            }
          });
        }
      });
    } catch (error) {
      console.error('Erro ao adicionar marcadores ao gráfico:', error);
    }
  };

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
      toolbar_bg: "#111827",
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
        "paneProperties.background": "#111827",
        "paneProperties.vertGridProperties.color": "rgba(255, 255, 255, 0.05)",
        "paneProperties.horzGridProperties.color": "rgba(255, 255, 255, 0.05)",
      }
    });

    // Quando o gráfico estiver carregado, adicionar os marcadores
    widgetRef.current.onChartReady(() => {
      addMarkersToChart();
    });
  };

  const mapTimeframeToInterval = (timeframe: string): string => {
    switch (timeframe) {
      case '1m': return '1';
      case '5m': return '5';
      case '15m': return '15';
      case '30m': return '30';
      case '1h': return '60';
      case '4h': return '240';
      case '1d': return 'D';
      default: return '1';
    }
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  const increaseAmount = () => {
    setTradeAmount(tradeAmount + 10);
  };
  
  const decreaseAmount = () => {
    if (tradeAmount > 10) {
      setTradeAmount(tradeAmount - 10);
    }
  };
  
  const handleExpiryTimeChange = (time: number) => {
    setExpiryTime(time);
  };
  
  const handleTrade = async (direction: 'BUY' | 'SELL') => {
    const success = await placeTrade(direction);
    if (success) {
      // Esperar um momento para os dados serem atualizados e então atualizar as marcações
      setTimeout(addMarkersToChart, 500);
    }
  };

  return (
    <div className="bg-[#111827] border-none overflow-hidden h-full flex flex-col relative">
      <div className="absolute top-0 left-0 h-10 flex items-center z-10 bg-[#111827] text-white p-2">
        <div className="bg-yellow-500 rounded-full h-6 w-6 flex items-center justify-center mr-2">
          <span className="text-xs text-black font-bold">₿</span>
        </div>
        <div>
          <h3 className="text-white font-bold">{selectedAsset.symbol}</h3>
          <p className="text-xs text-gray-400">{selectedAsset.name} • {selectedAsset.type}</p>
        </div>
      </div>

      <div className="absolute top-0 right-0 z-10 flex flex-col gap-3 p-4">
        <div>
          <div className="text-white text-xs mb-1 text-right">Tempo</div>
          <div className="flex bg-[#1a1f2c] rounded-md">
            <div className="h-8 flex items-center justify-center">
              <button
                onClick={() => handleExpiryTimeChange(1)}
                className={`h-8 w-12 flex items-center justify-center ${expiryTime === 1 ? 'text-white' : 'text-gray-400'}`}
              >
                <span className="text-xs">1M</span>
              </button>
              <button
                onClick={() => handleExpiryTimeChange(5)}
                className={`h-8 w-12 flex items-center justify-center ${expiryTime === 5 ? 'text-white' : 'text-gray-400'}`}
              >
                <span className="text-xs">5M</span>
              </button>
              <button
                onClick={() => handleExpiryTimeChange(15)}
                className={`h-8 w-12 flex items-center justify-center ${expiryTime === 15 ? 'text-white' : 'text-gray-400'}`}
              >
                <span className="text-xs">15M</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="text-white text-xs mb-1 text-right">Valor</div>
          <div className="flex bg-[#1a1f2c] rounded-md">
            <div className="h-8 w-16 flex items-center justify-center">
              <span className="text-xs text-gray-400">R$</span>
              <span className="text-xs text-white ml-1">{tradeAmount}</span>
            </div>
            <div className="flex flex-col justify-center">
              <button
                onClick={decreaseAmount}
                className="h-4 w-8 flex items-center justify-center"
              >
                <Minus className="h-3 w-3 text-gray-400" />
              </button>
              <button
                onClick={increaseAmount}
                className="h-4 w-8 flex items-center justify-center"
              >
                <Plus className="h-3 w-3 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="text-white text-xs mb-1 text-right">Lucro</div>
          <div className="px-4 py-2 bg-[#1a1f2c] rounded-md flex justify-center items-center">
            <div className="flex flex-col items-center">
              <span className="text-[#0ECB81] text-sm">+86%</span>
              <span className="text-white text-xs">R$ {estimatedProfit.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => handleTrade('BUY')}
          className="mt-2 bg-[#0ECB81] text-white px-6 py-3 rounded-md font-bold hover:bg-opacity-90 transition-all"
        >
          COMPRAR
        </button>
        <button 
          onClick={() => handleTrade('SELL')}
          className="bg-[#ea384c] text-white px-6 py-3 rounded-md font-bold hover:bg-opacity-90 transition-all"
        >
          VENDER
        </button>
      </div>

      <div className="flex-1" id="tradingview_chart" ref={containerRef}></div>
    </div>
  );
};

export default TradingChart;
