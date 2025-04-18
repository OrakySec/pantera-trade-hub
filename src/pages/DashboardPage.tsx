
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import TradingChart from '@/components/TradingChart';
import TradeDetails from '@/components/TradeDetails';
import { useTradingContext } from '@/contexts/TradingContext';
import { formatCurrency, formatDatetime } from '@/lib/utils';
import { Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
  const { openTrades } = useTradingContext();
  const { user } = useAuth();
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showTradeDetails, setShowTradeDetails] = useState(false);
  
  const handleShowTradeDetails = (trade: any) => {
    setSelectedTrade(trade);
    setShowTradeDetails(true);
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Saldo do usuário */}
        <div className="bg-[#111827] px-4 py-2 flex items-center justify-end">
          <div className="flex items-center bg-[#1a1f2c] px-3 py-1 rounded-md">
            <span className="text-gray-400 text-sm mr-2">Saldo:</span>
            <span className="text-white font-bold">
              {user ? formatCurrency(user.balance) : 'R$ 0,00'}
            </span>
          </div>
        </div>
        
        {/* Trading Chart - Ocupando toda a tela */}
        <div className="flex-grow h-full">
          <TradingChart />
        </div>
        
        {/* Open Trades Table - Na parte inferior */}
        <div className="max-h-48 overflow-y-auto bg-[#111827] border-t border-gray-800">
          <div className="px-4 py-2">
            <h3 className="text-white font-medium mb-2">Operações Abertas ({openTrades.length})</h3>
            
            {openTrades.length > 0 ? (
              <div className="flex flex-col gap-2">
                {openTrades.map((trade) => (
                  <div key={trade.id} className="bg-[#1a1f2c] rounded-md p-2">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className="px-3 py-1 text-xs text-gray-400 flex flex-col items-center">
                          <span>Ativo</span>
                          <span className="text-white">{trade.asset}</span>
                        </div>
                        <div className="px-3 py-1 text-xs text-gray-400 flex flex-col items-center">
                          <span>Tempo</span>
                          <span className="text-white">{trade.expiryTime}M</span>
                        </div>
                        <div className="px-3 py-1 text-xs text-gray-400 flex flex-col items-center">
                          <span>Fechar</span>
                          <span className="text-white">{formatDatetime(trade.createdAt)}</span>
                        </div>
                        <div className="px-3 py-1 text-xs text-gray-400 flex flex-col items-center">
                          <span>Abertura</span>
                          <span className="text-white">{formatCurrency(trade.entryPrice)}</span>
                        </div>
                        <div className="px-3 py-1 text-xs text-gray-400 flex flex-col items-center">
                          <span>Ação</span>
                          <span className={trade.direction === 'BUY' ? 'text-green-500' : 'text-red-500'}>
                            {trade.direction === 'BUY' ? 'COMPRA' : 'VENDA'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button 
                          className="bg-gray-700 p-1 rounded hover:bg-gray-600 transition-colors"
                          onClick={() => handleShowTradeDetails(trade)}
                        >
                          <Info className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                Nenhuma operação em andamento
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Dialog de detalhes da operação */}
      <TradeDetails 
        trade={selectedTrade} 
        isOpen={showTradeDetails} 
        onClose={() => setShowTradeDetails(false)}
      />
    </MainLayout>
  );
};

export default DashboardPage;
