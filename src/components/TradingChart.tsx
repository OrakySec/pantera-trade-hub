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
    if (!widgetRef.current || !widgetRef.current.iframe) return;
    
    try {
      console.log("Tentando adicionar marcadores ao gráfico");
      
      // Para inserir marcadores, precisamos usar o iframe do widget e executar alguns comandos
      // Isso é uma solução alternativa já que não podemos usar activeChart() diretamente
      const markers = getTradeMarkers();
      
      if (markers.length === 0) {
        console.log("Nenhum marcador para adicionar");
        return;
      }
      
      console.log("Marcadores para adicionar:", markers);
      
      // Aqui apenas notificamos o usuário que as operações foram marcadas
      // Isso é uma simulação visual, já que a API gratuita do TradingView tem limitações
      markers.forEach(trade => {
        const direction = trade.direction === 'BUY' ? 'compra' : 'venda';
        const status = trade.status === 'OPEN' ? 'em andamento' : 
                      (trade.status === 'WON' ? 'ganhou' : 'perdeu');
                      
        // Exibir notificação com detalhes da operação
        if (trade.chartMarker) {
          toast.info(
            `Operação de ${direction.toUpperCase()} ${status.toUpperCase()} marcada no gráfico para ${trade.asset}`, 
            { position: 'bottom-right', duration: 2000 }
          );
          
          // Remover a flag depois de exibir a notificação
          trade.chartMarker = false;
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
      // Removido o RSI dos estudos
      studies: ["MASimple@tv-basicstudies"],
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

    // Quando o gráfico estiver pronto, tentar adicionar os marcadores
    // Esta é uma solução alternativa pois a API gratuita tem limitações
    setTimeout(() => {
      addMarkersToChart();
    }, 2000);
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
      // Esperar um momento para os dados serem atualizados e então tentar mostrar os marcadores
      setTimeout(addMarkersToChart, 500);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-grow bg-[#111827] border-none overflow-hidden h-full flex flex-col relative">
        <div className="flex-1" id="tradingview_chart" ref={containerRef}></div>
      </div>
      
      <div className="w-80 bg-[#1a1f2c] p-4 flex flex-col space-y-4">
        <div>
          <div className="text-white text-xs mb-1 text-right">Tempo</div>
          <div className="flex bg-[#111827] rounded-md">
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
          <div className="flex bg-[#111827] rounded-md">
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
          <div className="px-4 py-2 bg-[#111827] rounded-md flex justify-center items-center">
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
    </div>
  );
};

export default TradingChart;
