
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { User, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CopyTradingPage = () => {
  // Dados simulados de traders para copiar
  const traders = [
    {
      id: 1,
      name: 'Alex Ribeiro',
      avatar: '👨‍💼',
      winRate: 87,
      profit: 135.42,
      followers: 2543,
      trades: 423,
      description: 'Especialista em operações de curto prazo em criptomoedas',
    },
    {
      id: 2,
      name: 'Carolina Silva',
      avatar: '👩‍💼',
      winRate: 92,
      profit: 204.76,
      followers: 4217,
      trades: 615,
      description: 'Trader profissional focada em análise técnica de pares forex',
    },
    {
      id: 3,
      name: 'Bruno Martins',
      avatar: '👨‍💻',
      winRate: 78,
      profit: 97.33,
      followers: 1654,
      trades: 329,
      description: 'Operações baseadas em eventos econômicos e notícias de mercado',
    },
    {
      id: 4,
      name: 'Mariana Costa',
      avatar: '👩‍🎓',
      winRate: 84,
      profit: 126.19,
      followers: 1986,
      trades: 472,
      description: 'Estratégia de tendência com foco em índices de mercado',
    },
  ];

  const handleCopyTrader = (id: number, name: string) => {
    toast.success(`Você começou a copiar ${name}!`);
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="bg-trader-dark border border-gray-800 rounded-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-medium">Copy Trading</h3>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-8">
              <h4 className="text-xl text-white font-bold mb-2">Copie os melhores traders</h4>
              <p className="text-gray-400">Replique automaticamente as operações dos traders mais bem-sucedidos da plataforma</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-trader-card p-4 rounded-lg flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center mb-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h5 className="text-white font-bold text-lg">Escolha um trader</h5>
                <p className="text-gray-400 text-sm text-center mt-2">Selecione um trader com base no seu perfil de risco</p>
              </div>
              
              <div className="bg-trader-card p-4 rounded-lg flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center mb-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h5 className="text-white font-bold text-lg">Configure o valor</h5>
                <p className="text-gray-400 text-sm text-center mt-2">Defina quanto deseja investir em cada operação</p>
              </div>
              
              <div className="bg-trader-card p-4 rounded-lg flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center mb-3">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h5 className="text-white font-bold text-lg">Copie as operações</h5>
                <p className="text-gray-400 text-sm text-center mt-2">Suas operações serão executadas automaticamente</p>
              </div>
              
              <div className="bg-trader-card p-4 rounded-lg flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center mb-3">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
                <h5 className="text-white font-bold text-lg">Monitore</h5>
                <p className="text-gray-400 text-sm text-center mt-2">Acompanhe seu desempenho em tempo real</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-trader-dark border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-medium">Top Traders</h3>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {traders.map((trader) => (
              <div key={trader.id} className="bg-trader-card rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center text-2xl mr-3">
                      {trader.avatar}
                    </div>
                    <div>
                      <h5 className="text-white font-bold">{trader.name}</h5>
                      <p className="text-gray-400 text-sm">{trader.followers.toLocaleString()} seguidores</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{trader.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-trader-darker p-3 rounded">
                      <p className="text-xs text-gray-400">Taxa de acerto</p>
                      <p className="text-white font-bold">{trader.winRate}%</p>
                    </div>
                    <div className="bg-trader-darker p-3 rounded">
                      <p className="text-xs text-gray-400">Lucro (30d)</p>
                      <p className="text-trader-green font-bold">{formatPercentage(trader.profit)}%</p>
                    </div>
                    <div className="bg-trader-darker p-3 rounded">
                      <p className="text-xs text-gray-400">Operações</p>
                      <p className="text-white font-bold">{trader.trades}</p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-trader-green hover:bg-trader-green-hover"
                    onClick={() => handleCopyTrader(trader.id, trader.name)}
                  >
                    Copiar Trader
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CopyTradingPage;
