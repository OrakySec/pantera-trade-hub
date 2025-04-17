
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { useTradingContext } from '@/contexts/TradingContext';
import { formatCurrency, formatDatetime, formatPercentage } from '@/lib/utils';

const HistoryPage = () => {
  const { trades } = useTradingContext();
  
  // Filtrar para mostrar apenas as operações concluídas
  const completedTrades = trades.filter(trade => trade.status !== 'OPEN');
  
  return (
    <MainLayout>
      <div className="p-6">
        <div className="bg-trader-dark border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-white font-medium">Histórico de Trading</h3>
          </div>
          
          {completedTrades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-trader-darker">
                    <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Ativo</th>
                    <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Direção</th>
                    <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Valor</th>
                    <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Preço de Entrada</th>
                    <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Preço de Saída</th>
                    <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Lucro/Perda</th>
                    <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Expiração</th>
                    <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Data</th>
                    <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedTrades.map((trade) => (
                    <tr key={trade.id} className="border-t border-gray-800">
                      <td className="py-3 px-4 text-sm text-white">{trade.asset}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${trade.direction === 'BUY' ? 'bg-trader-green bg-opacity-20 text-trader-green' : 'bg-trader-red bg-opacity-20 text-trader-red'}`}>
                          {trade.direction === 'BUY' ? 'COMPRA' : 'VENDA'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-white">{formatCurrency(trade.amount)}</td>
                      <td className="py-3 px-4 text-sm text-white">{formatCurrency(trade.entryPrice)}</td>
                      <td className="py-3 px-4 text-sm text-white">{trade.closePrice ? formatCurrency(trade.closePrice) : '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className={`text-sm ${trade.status === 'WON' ? 'text-trader-green' : 'text-trader-red'}`}>
                            {trade.profitLoss ? formatCurrency(trade.profitLoss) : '-'}
                          </span>
                          {trade.profitPercentage && (
                            <span className={`text-xs ${trade.status === 'WON' ? 'text-trader-green' : 'text-trader-red'}`}>
                              {formatPercentage(trade.profitPercentage)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-white">{trade.expiryTime}M</td>
                      <td className="py-3 px-4 text-sm text-gray-400">{formatDatetime(trade.createdAt)}</td>
                      <td className="py-3 px-4">
                        {trade.status === 'WON' ? (
                          <span className="px-2 py-1 rounded text-xs bg-trader-green bg-opacity-20 text-trader-green">
                            GANHOU
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs bg-trader-red bg-opacity-20 text-trader-red">
                            PERDEU
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              <p>Nenhuma operação concluída</p>
              <p className="text-sm mt-2">Seu histórico de operações aparecerá aqui</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HistoryPage;
