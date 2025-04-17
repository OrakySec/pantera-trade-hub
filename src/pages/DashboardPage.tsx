
import React from 'react';
import MainLayout from '@/components/MainLayout';
import TradingChart from '@/components/TradingChart';
import { useTradingContext } from '@/contexts/TradingContext';
import { formatCurrency, formatDatetime } from '@/lib/utils';

const DashboardPage = () => {
  const { openTrades } = useTradingContext();
  
  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Trading Chart - Ocupando toda a tela */}
        <div className="flex-grow h-full">
          <TradingChart />
        </div>
        
        {/* Open Trades Table - Na parte inferior */}
        <div className="h-16 bg-[#111827] border-t border-gray-800">
          <div className="px-4 h-full flex items-center justify-between">
            <h3 className="text-white font-medium">Operações Abertas ({openTrades.length})</h3>
            
            {openTrades.length > 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex">
                  <div className="px-3 py-1 text-xs text-gray-400 flex flex-col items-center">
                    <span>Ativo</span>
                    <span className="text-white">{openTrades[0].asset}</span>
                  </div>
                  <div className="px-3 py-1 text-xs text-gray-400 flex flex-col items-center">
                    <span>Tempo</span>
                    <span className="text
-white">{openTrades[0].expiryTime}M</span>
                  </div>
                  <div className="px-3 py-1 text-xs text-gray-400 flex flex-col items-center">
                    <span>Fechar</span>
                    <span className="text-white">{formatDatetime(openTrades[0].createdAt)}</span>
                  </div>
                  <div className="px-3 py-1 text-xs text-gray-400 flex flex-col items-center">
                    <span>Abertura</span>
                    <span className="text-white">{formatCurrency(openTrades[0].entryPrice)}</span>
                  </div>
                  <div className="px-3 py-1 text-xs text-gray-400 flex flex-col items-center">
                    <span>Ação</span>
                    <span className={openTrades[0].direction === 'BUY' ? 'text-green-500' : 'text-red-500'}>
                      {openTrades[0].direction === 'BUY' ? 'COMPRA' : 'VENDA'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-gray-700 p-1 rounded">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 9H5C3.89543 9 3 9.89543 3 11V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V11C21 9.89543 20.1046 9 19 9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 9V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button className="bg-gray-700 p-1 rounded">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                Nenhuma operação em andamento
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
