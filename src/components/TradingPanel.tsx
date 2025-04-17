
import React, { useState } from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import { ArrowUp, ArrowDown, Timer, Minus, Plus, Clock } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

const TradingPanel: React.FC = () => {
  const { 
    assetPrice, 
    expiryTime, 
    setExpiryTime, 
    tradeAmount, 
    setTradeAmount, 
    placeTrade, 
    isLoading,
    getEstimatedReturn,
    getProfitPercentage
  } = useTradingContext();
  
  const handleTrade = async (direction: 'BUY' | 'SELL') => {
    await placeTrade(direction);
  };
  
  const increaseAmount = () => {
    setTradeAmount(tradeAmount + 10);
  };
  
  const decreaseAmount = () => {
    if (tradeAmount > 10) {
      setTradeAmount(tradeAmount - 10);
    }
  };
  
  const setExpiry = (time: number) => {
    setExpiryTime(time);
  };
  
  const profitPercentage = getProfitPercentage();
  const estimatedReturn = getEstimatedReturn(tradeAmount);

  return (
    <div className="bg-trader-dark border border-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-3 border-b border-gray-800">
        <h3 className="text-white font-medium text-sm">Negociar</h3>
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2 text-xs">Tempo</label>
            <div className="flex gap-2 text-xs">
              <button 
                onClick={() => setExpiry(1)} 
                className={`flex-1 py-2 rounded-md flex items-center justify-center ${expiryTime === 1 ? 'bg-trader-blue text-white' : 'bg-trader-card text-gray-400'}`}
              >
                <Clock className="h-3 w-3 mr-1" />
                1M
              </button>
              <button 
                onClick={() => setExpiry(5)} 
                className={`flex-1 py-2 rounded-md flex items-center justify-center ${expiryTime === 5 ? 'bg-trader-blue text-white' : 'bg-trader-card text-gray-400'}`}
              >
                <Clock className="h-3 w-3 mr-1" />
                5M
              </button>
              <button 
                onClick={() => setExpiry(15)} 
                className={`flex-1 py-2 rounded-md flex items-center justify-center ${expiryTime === 15 ? 'bg-trader-blue text-white' : 'bg-trader-card text-gray-400'}`}
              >
                <Clock className="h-3 w-3 mr-1" />
                15M
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-400 mb-2 text-xs">Valor</label>
            <div className="flex items-center">
              <button 
                onClick={decreaseAmount}
                className="bg-trader-card p-2 rounded-l-md text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              
              <div className="flex-1 bg-trader-card py-2 px-4">
                <div className="text-center text-white">
                  <span className="text-gray-400 mr-1">R$</span>
                  <span className="text-xl">{tradeAmount}</span>
                </div>
              </div>
              
              <button 
                onClick={increaseAmount}
                className="bg-trader-card p-2 rounded-r-md text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-400 mb-2 text-xs">Lucro</label>
            <div className="flex justify-between items-center bg-trader-card p-3 rounded-md">
              <span className="text-trader-green font-medium text-xl">
                +{profitPercentage}%
              </span>
              <span className="text-white">
                {formatCurrency(estimatedReturn)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => handleTrade('BUY')}
            disabled={isLoading}
            className="bg-trader-green hover:bg-green-600 text-white font-bold py-4 rounded-md flex items-center justify-center transition-colors"
          >
            <ArrowUp className="h-5 w-5 mr-2" />
            COMPRAR
          </button>
          
          <button
            onClick={() => handleTrade('SELL')}
            disabled={isLoading}
            className="bg-trader-red hover:bg-red-600 text-white font-bold py-4 rounded-md flex items-center justify-center transition-colors"
          >
            <ArrowDown className="h-5 w-5 mr-2" />
            VENDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;
