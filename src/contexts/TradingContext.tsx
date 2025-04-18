
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
  getTradeMarkers: () => Trade[]; // Nova função para obter marcadores de operações para o gráfico
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
  const [assetPrice, setAssetPrice] = useState(84421.44); // Preço inicial do BTC/USD
  const [selectedAsset, setSelectedAsset] = useState({ symbol: 'BTC/USD', name: 'Bitcoin', type: 'Crypto' });
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m');
  const [expiryTime, setExpiryTime] = useState(1); // 1 minuto padrão
  const [tradeAmount, setTradeAmount] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [priceUpdateInterval, setPriceUpdateInterval] = useState<NodeJS.Timeout | null>(null);

  // Carregar operações do localStorage
  useEffect(() => {
    if (user) {
      const storedTrades = localStorage.getItem(`trades_${user.id}`);
      if (storedTrades) {
        setTrades(JSON.parse(storedTrades));
      }
    }
  }, [user]);

  // Simular movimento do preço do ativo
  useEffect(() => {
    // Limpar qualquer intervalo existente
    if (priceUpdateInterval) {
      clearInterval(priceUpdateInterval);
    }
    
    // Configurar novo intervalo
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

  // Resolver operações em aberto
  useEffect(() => {
    const checkOpenTrades = () => {
      if (!user) return;
      
      const now = new Date();
      const updatedTrades = trades.map(trade => {
        if (trade.status === 'OPEN') {
          const createdAt = new Date(trade.createdAt);
          const expiryTimeInMs = trade.expiryTime * 60 * 1000;
          
          if (now.getTime() - createdAt.getTime() >= expiryTimeInMs) {
            // A operação expirou, vamos resolver
            const result = Math.random(); // Simula resultado
            let newStatus: 'WON' | 'LOST';
            let closePrice: number;
            let profitLoss: number;
            
            if (result > 0.5) {
              newStatus = 'WON';
              const winPercentage = 0.86; // 86% de retorno
              profitLoss = trade.amount * winPercentage;
              
              // Atualizar saldo do usuário
              if (user) {
                updateBalance(user.balance + trade.amount + profitLoss);
              }
            } else {
              newStatus = 'LOST';
              profitLoss = -trade.amount;
            }
            
            // Simular preço de fechamento
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
    // Simular movimento de preço baseado no ativo selecionado
    const volatility = 0.002; // 0.2% de volatilidade
    const randomMovement = (Math.random() - 0.5) * 2 * volatility;
    const newPrice = assetPrice * (1 + randomMovement);
    setAssetPrice(parseFloat(newPrice.toFixed(2)));
  };

  const openTrades = trades.filter(trade => trade.status === 'OPEN' && trade.userId === user?.id);

  // Obter operações para marcação no gráfico (operações recentes)
  const getTradeMarkers = (): Trade[] => {
    // Retornar operações que devem ser marcadas no gráfico (últimas 10, por exemplo)
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return trades
      .filter(trade => 
        trade.userId === user?.id && 
        new Date(trade.createdAt) > twentyFourHoursAgo &&
        trade.asset === selectedAsset.symbol)
      .slice(0, 10); // Limitar a 10 marcações para não sobrecarregar o gráfico
  };

  const placeTrade = async (direction: 'BUY' | 'SELL'): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado para operar');
      return false;
    }
    
    if (tradeAmount <= 0) {
      toast.error('Valor da operação inválido');
      return false;
    }
    
    if (tradeAmount > user.balance) {
      toast.error('Saldo insuficiente');
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // Deduzir o valor da operação do saldo
      updateBalance(user.balance - tradeAmount);
      
      // Criar nova operação com o ativo selecionado atualmente
      const newTrade: Trade = {
        id: `trade_${Date.now()}`,
        userId: user.id,
        asset: selectedAsset.symbol, // Usar o ativo selecionado atualmente
        amount: tradeAmount,
        direction,
        entryPrice: assetPrice,
        expiryTime,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        chartMarker: true, // Marcar esta operação no gráfico
      };
      
      const updatedTrades = [...trades, newTrade];
      setTrades(updatedTrades);
      
      // Salvar no localStorage
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
    return 86; // Fixo em 86% para este exemplo
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

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
};
