
import React from 'react';
import MainLayout from '@/components/MainLayout';
import TradingChart from '@/components/TradingChart';
import TradingPanel from '@/components/TradingPanel';
import { useTradingContext } from '@/contexts/TradingContext';
import { formatCurrency, formatDatetime } from '@/lib/utils';

const DashboardPage = () => {
  const { openTrades } = useTradingContext();
  
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <div className="flex flex-col lg:flex-row h-[calc(100vh-14rem)]">
          {/* Trading Chart - Ocupa maior parte do espaço horizontal */}
          <div className="lg:flex-grow h-[450px] lg:h-full">
            <TradingChart />
          </div>
          
          {/* Trading Panel - Fixo no lado direito */}
          <div className="lg:w-[320px] mt-4 lg:mt-0 lg:ml-4">
            <TradingPanel />
          </div>
        </div>
        
        {/* Open Trades Table */}
        <div className="mt-4 mb-4">
          <div className="bg-trader-dark border border-gray-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-white font-medium">Operações Abertas ({openTrades.length})</h3>
            </div>
            
            {openTrades.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-trader-darker">
                      <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Ativo</th>
                      <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Direção</th>
                      <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Valor</th>
                      <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Preço de Entrada</th>
                      <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Hora</th>
                      <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Expiração</th>
                      <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openTrades.map((trade) => (
                      <tr key={trade.id} className="border-t border-gray-800">
                        <td className="py-3 px-4 text-sm text-white">{trade.asset}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${trade.direction === 'BUY' ? 'bg-trader-green bg-opacity-20 text-trader-green' : 'bg-trader-red bg-opacity-20 text-trader-red'}`}>
                            {trade.direction === 'BUY' ? 'COMPRA' : 'VENDA'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-white">{formatCurrency(trade.amount)}</td>
                        <td className="py-3 px-4 text-sm text-white">{formatCurrency(trade.entryPrice)}</td>
                        <td className="py-3 px-4 text-sm text-gray-400">{formatDatetime(trade.createdAt)}</td>
                        <td className="py-3 px-4 text-sm text-white">{trade.expiryTime}M</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded text-xs bg-yellow-500 bg-opacity-20 text-yellow-500">
                            EM ANDAMENTO
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                <p>Nenhuma operação em andamento</p>
                <p className="text-sm mt-2">Faça sua primeira operação utilizando o painel de trading</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
