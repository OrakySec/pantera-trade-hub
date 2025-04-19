
import React, { useState, useEffect, useRef } from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import { useTradingViewWidget } from '@/hooks/useTradingViewWidget';
import { Minus, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

// Function to map timeframe to interval needs to be defined before usage
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
  
  const [estimatedProfit, setEstimatedProfit] = useState(getEstimatedReturn(tradeAmount));
  
  const { addMarker } = useTradingViewWidget({
    container_id: 'tradingview_chart',
    symbol: selectedAsset.symbol,
    interval: mapTimeframeToInterval(selectedTimeframe),
    onReady: () => {
      console.log('Chart ready, adding markers...');
      addInitialMarkers();
    }
  });

  useEffect(() => {
    setEstimatedProfit(getEstimatedReturn(tradeAmount));
  }, [tradeAmount, getEstimatedReturn]);

  const addInitialMarkers = () => {
    try {
      const markers = getTradeMarkers();
      
      markers.forEach(trade => {
        const timestamp = new Date(trade.createdAt).getTime() / 1000;
        addMarker(
          timestamp,
          trade.entryPrice,
          trade.direction,
          `${trade.direction} ${formatCurrency(trade.amount)}`
        );
        
        if (trade.chartMarker) {
          const direction = trade.direction === 'BUY' ? 'compra' : 'venda';
          const status = trade.status === 'OPEN' ? 'em andamento' : 
                        (trade.status === 'WON' ? 'ganhou' : 'perdeu');
                        
          toast.info(
            `Operação de ${direction.toUpperCase()} ${status.toUpperCase()} marcada no gráfico para ${trade.asset}`, 
            { position: 'bottom-right', duration: 2000 }
          );
          trade.chartMarker = false;
        }
      });
    } catch (error) {
      console.error('Erro ao adicionar marcadores ao gráfico:', error);
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
      setTimeout(addInitialMarkers, 500);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-grow bg-[#111827] border-none overflow-hidden h-full flex flex-col relative">
        <div className="flex-1" id="tradingview_chart"></div>
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
