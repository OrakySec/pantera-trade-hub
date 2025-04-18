
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trade } from '@/contexts/TradingContext';
import { formatCurrency, formatDatetime } from '@/lib/utils';
import { ArrowDownCircle, ArrowUpCircle, Clock, DollarSign, Percent } from 'lucide-react';

interface TradeDetailsProps {
  trade: Trade | null;
  isOpen: boolean;
  onClose: () => void;
}

const TradeDetails: React.FC<TradeDetailsProps> = ({ trade, isOpen, onClose }) => {
  if (!trade) return null;

  const isCompleted = trade.status !== 'OPEN';
  const isWon = trade.status === 'WON';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111827] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes da Operação</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                <span className="text-sm text-black font-bold">₿</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">{trade.asset}</h3>
                <p className="text-sm text-gray-400">{formatDatetime(trade.createdAt)}</p>
              </div>
            </div>
            <div className={`flex items-center ${trade.direction === 'BUY' ? 'text-[#0ECB81]' : 'text-[#ea384c]'}`}>
              {trade.direction === 'BUY' ? (
                <ArrowUpCircle className="mr-2 h-5 w-5" />
              ) : (
                <ArrowDownCircle className="mr-2 h-5 w-5" />
              )}
              <span className="font-bold">{trade.direction === 'BUY' ? 'COMPRA' : 'VENDA'}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#1a1f2c] p-3 rounded-md">
              <div className="text-gray-400 text-xs mb-1 flex items-center">
                <DollarSign className="h-3 w-3 mr-1" /> Valor Investido
              </div>
              <div className="text-white font-bold">
                {formatCurrency(trade.amount)}
              </div>
            </div>
            
            <div className="bg-[#1a1f2c] p-3 rounded-md">
              <div className="text-gray-400 text-xs mb-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> Tempo de Expiração
              </div>
              <div className="text-white font-bold">
                {trade.expiryTime} minuto{trade.expiryTime > 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="bg-[#1a1f2c] p-3 rounded-md">
              <div className="text-gray-400 text-xs mb-1">Preço de Entrada</div>
              <div className="text-white font-bold">
                {formatCurrency(trade.entryPrice)}
              </div>
            </div>
            
            {isCompleted && trade.closePrice && (
              <div className="bg-[#1a1f2c] p-3 rounded-md">
                <div className="text-gray-400 text-xs mb-1">Preço de Saída</div>
                <div className="text-white font-bold">
                  {formatCurrency(trade.closePrice)}
                </div>
              </div>
            )}
          </div>
          
          {isCompleted ? (
            <div className={`p-4 rounded-md ${isWon ? 'bg-[#0ECB81]/10' : 'bg-[#ea384c]/10'} flex justify-between items-center`}>
              <div>
                <p className="text-gray-400 text-sm">Resultado</p>
                <h3 className={`text-xl font-bold ${isWon ? 'text-[#0ECB81]' : 'text-[#ea384c]'}`}>
                  {isWon ? 'GANHOU' : 'PERDEU'}
                </h3>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end">
                  <Percent className={`h-4 w-4 mr-1 ${isWon ? 'text-[#0ECB81]' : 'text-[#ea384c]'}`} />
                  <span className={`font-bold ${isWon ? 'text-[#0ECB81]' : 'text-[#ea384c]'}`}>
                    {isWon ? '+' : ''}{trade.profitPercentage}%
                  </span>
                </div>
                <p className={`font-bold ${isWon ? 'text-[#0ECB81]' : 'text-[#ea384c]'}`}>
                  {isWon ? '+' : ''}{formatCurrency(trade.profitLoss || 0)}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-md bg-yellow-500/10 flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <h3 className="text-xl font-bold text-yellow-500">EM ANDAMENTO</h3>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end">
                  <Clock className="h-4 w-4 mr-1 text-yellow-500" />
                  <span className="font-bold text-yellow-500">
                    Aguardando resultado
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradeDetails;
