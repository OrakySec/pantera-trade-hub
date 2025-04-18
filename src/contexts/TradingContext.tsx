import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface Trade {
  id: string;
  userId: string;
  asset: string;
  amount: number;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  closePrice?: number;
  profitLoss?: number;
  profitPercentage?: number;
  expiryTime: number; // em minutos (1, 5, 15)
  status: 'OPEN' | 'WON' | 'LOST';
  createdAt: string;
  closedAt?: string;
  chartMarker?: boolean; // Indica se esta operação deve ser marcada no gráfico
}

interface TradingContextType {
  trades: Trade[];
  openTrades: Trade[];
  assetPrice: number;
  selectedAsset: { symbol: string; name: string; type: string };
  selectedTimeframe: string;
  expiryTime: number;
  tradeAmount: number;
  isLoading: boolean;
  setSelectedAsset: (asset: { symbol: string; name: string; type: string }) => void;
  setSelectedTimeframe: (timeframe: string) => void;
  setExpiryTime: (time: number) => void;
  setTradeAmount: (amount: number) => void;
  placeTrade: (direction: 'BUY' | 'SELL') => Promise<boolean>;
  getEstimatedReturn: (amount: number) => number;
  getProfitPercentage: () => number;
  simulatePriceMovement: () => void;
  getTradeMarkers: () => Trade[];
}

const TradingContext = createContext<TradingContextType | null>(null);

export const useTradingContext = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
};

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateBalance } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [assetPrice, setAssetPrice] = useState(84421.44);
  const [selectedAsset, setSelectedAsset] = useState({ symbol: 'BTC/USD', name: 'Bitcoin', type: 'Crypto' });
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m');
  const [expiryTime, setExpiryTime] = useState(1);
  const [tradeAmount, setTradeAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [priceUpdateInterval, setPriceUpdateInterval] = useState<NodeJS.Timeout | null>(null);
  const [dailyLossLimit, setDailyLossLimit] = useState(0);
  const [consecutiveLosses, setConsecutiveLosses] = useState(0);
  const [operationsCount, setOperationsCount] = useState({ count: 0, lastReset: new Date() });

  useEffect(() => {
    if (user) {
      const storedTrades = localStorage.getItem(`trades_${user.id}`);
      if (storedTrades) {
        setTrades(JSON.parse(storedTrades));
      }
    }
  }, [user]);

  useEffect(() => {
    if (priceUpdateInterval) {
      clearInterval(priceUpdateInterval);
    }
    
    const interval = setInterval(() => {
      simulatePriceMovement();
    }, 2000);
    
    setPriceUpdateInterval(interval);
    
    return () => {
      if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
      }
    };
  }, [assetPrice, selectedAsset]);

  useEffect(() => {
    const checkOpenTrades = () => {
      if (!user) return;
      
      const now = new Date();
      const updatedTrades = trades.map(trade => {
        if (trade.status === 'OPEN') {
          const createdAt = new Date(trade.createdAt);
          const expiryTimeInMs = trade.expiryTime * 60 * 1000;
          
          if (now.getTime() - createdAt.getTime() >= expiryTimeInMs) {
            const result = Math.random();
            let newStatus: 'WON' | 'LOST';
            let closePrice: number;
            let profitLoss: number;
            
            if (result > 0.5) {
              newStatus = 'WON';
              const winPercentage = 0.86;
              profitLoss = trade.amount * winPercentage;
              setConsecutiveLosses(0);
              
              if (user) {
                updateBalance(user.balance + trade.amount + profitLoss);
              }
            } else {
              newStatus = 'LOST';
              profitLoss = -trade.amount;
              setConsecutiveLosses(prev => prev + 1);
              setDailyLossLimit(prev => prev + trade.amount);
            }
            
            if (trade.direction === 'BUY') {
              closePrice = newStatus === 'WON' ? trade.entryPrice * 1.01 : trade.entryPrice * 0.99;
            } else {
              closePrice = newStatus === 'WON' ? trade.entryPrice * 0.99 : trade.entryPrice * 1.01;
            }
            
            const profitPercentage = newStatus === 'WON' ? 86 : -100;
            
            return {
              ...trade,
              status: newStatus,
              closePrice,
              profitLoss,
              profitPercentage,
              closedAt: now.toISOString()
            };
          }
          
          return trade;
        }
        
        return trade;
      });
      
      setTrades(updatedTrades);
      localStorage.setItem(`trades_${user.id}`, JSON.stringify(updatedTrades));
    };
    
    const interval = setInterval(checkOpenTrades, 1000);
    
    return () => clearInterval(interval);
  }, [trades, user, updateBalance]);

  const simulatePriceMovement = () => {
    const volatility = 0.002;
    const randomMovement = (Math.random() - 0.5) * 2 * volatility;
    const newPrice = assetPrice * (1 + randomMovement);
    setAssetPrice(parseFloat(newPrice.toFixed(2)));
  };

  const openTrades = trades.filter(trade => trade.status === 'OPEN' && trade.userId === user?.id);

  const getTradeMarkers = (): Trade[] => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return trades
      .filter(trade => 
        trade.userId === user?.id && 
        new Date(trade.createdAt) > twentyFourHoursAgo &&
        trade.asset === selectedAsset.symbol)
      .slice(0, 10);
  };

  const placeTrade = async (direction: 'BUY' | 'SELL'): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado para operar');
      return false;
    }
    
    if (tradeAmount < 10) {
      toast.error('Valor mínimo por operação: R$ 10,00');
      return false;
    }
    
    if (tradeAmount > 1000 || tradeAmount > user.balance * 0.2) {
      toast.error('Valor máximo excedido. Limite: R$ 1.000,00 ou 20% do saldo');
      return false;
    }

    if (dailyLossLimit >= user.balance * 0.5) {
      toast.error('Limite de perda diária atingido (50% do saldo inicial)');
      return false;
    }

    if (consecutiveLosses >= 3) {
      toast.warning('Atenção: Você teve 3 perdas consecutivas. Considere fazer uma pausa.');
    }

    if (operationsCount.lastReset < new Date(Date.now() - 30 * 60 * 1000)) {
      setOperationsCount({ count: 1, lastReset: new Date() });
    } else if (operationsCount.count >= 10) {
      toast.warning('Você realizou muitas operações em um curto período. Considere fazer uma pausa.');
    }
    
    try {
      setIsLoading(true);
      
      updateBalance(user.balance - tradeAmount);
      
      const newTrade: Trade = {
        id: `trade_${Date.now()}`,
        userId: user.id,
        asset: selectedAsset.symbol,
        amount: tradeAmount,
        direction,
        entryPrice: assetPrice,
        expiryTime,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        chartMarker: true,
      };
      
      const updatedTrades = [...trades, newTrade];
      setTrades(updatedTrades);
      setOperationsCount(prev => ({ ...prev, count: prev.count + 1 }));
      
      localStorage.setItem(`trades_${user.id}`, JSON.stringify(updatedTrades));
      
      toast.success(`Operação de ${direction === 'BUY' ? 'COMPRA' : 'VENDA'} realizada com sucesso para ${selectedAsset.symbol}!`);
      return true;
    } catch (error) {
      console.error('Erro ao realizar operação:', error);
      toast.error('Ocorreu um erro ao realizar a operação');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getEstimatedReturn = (amount: number): number => {
    const profitPercentage = getProfitPercentage();
    return amount * (profitPercentage / 100);
  };

  const getProfitPercentage = (): number => {
    return 86;
  };

  const value: TradingContextType = {
    trades,
    openTrades,
    assetPrice,
    selectedAsset,
    selectedTimeframe,
    expiryTime,
    tradeAmount,
    isLoading,
    setSelectedAsset,
    setSelectedTimeframe,
    setExpiryTime,
    setTradeAmount,
    placeTrade,
    getEstimatedReturn,
    getProfitPercentage,
    simulatePriceMovement,
    getTradeMarkers
  };

  useEffect(() => {
    const resetDailyLimits = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setDailyLossLimit(0);
        setConsecutiveLosses(0);
        setOperationsCount({ count: 0, lastReset: now });
      }
    };

    const interval = setInterval(resetDailyLimits, 60000);
    return () => clearInterval(interval);
  }, []);

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
};
