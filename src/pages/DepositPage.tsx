
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreditCard, DollarSign, Wallet } from 'lucide-react';
import { toast } from 'sonner';

const DepositPage = () => {
  const { user, updateBalance } = useAuth();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('creditCard');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Por favor, insira um valor válido');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulação de processamento
    setTimeout(() => {
      if (user) {
        const newBalance = user.balance + Number(amount);
        updateBalance(newBalance);
        
        toast.success(`Depósito de ${formatCurrency(Number(amount))} realizado com sucesso!`);
        setAmount('');
      }
      
      setIsProcessing(false);
    }, 1500);
  };

  const paymentMethods = [
    {
      id: 'creditCard',
      label: 'Cartão de Crédito',
      icon: CreditCard,
    },
    {
      id: 'bankTransfer',
      label: 'Transferência Bancária',
      icon: DollarSign,
    },
    {
      id: 'pix',
      label: 'PIX',
      icon: Wallet,
    },
  ];

  return (
    <MainLayout>
      <div className="p-6">
        <div className="bg-trader-dark border border-gray-800 rounded-lg overflow-hidden max-w-3xl mx-auto">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-medium">Depósito</h3>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <h4 className="text-white font-medium mb-2">Saldo atual</h4>
              <div className="bg-trader-card p-4 rounded-md">
                <p className="text-2xl font-bold text-white">
                  {user ? formatCurrency(user.balance) : 'R$ 0,00'}
                </p>
                <p className="text-sm text-gray-400 mt-1">Conta demo</p>
              </div>
            </div>
            
            <form onSubmit={handleDeposit}>
              <div className="mb-6">
                <h4 className="text-white font-medium mb-4">Método de pagamento</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map(method => (
                    <div
                      key={method.id}
                      className={`border ${selectedMethod === method.id ? 'border-trader-green' : 'border-gray-700'} rounded-md p-4 cursor-pointer transition-colors`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${selectedMethod === method.id ? 'bg-trader-green' : 'bg-trader-card'}`}>
                          <method.icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="ml-3 text-white">{method.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="text-white font-medium mb-4">Valor do depósito</h4>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-400">R$</span>
                  </div>
                  <Input
                    type="text"
                    placeholder="0,00"
                    className="pl-10 bg-trader-darker border-gray-700 text-white text-lg h-14"
                    value={amount}
                    onChange={(e) => {
                      // Permitir apenas números
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setAmount(value);
                    }}
                  />
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {[100, 250, 500, 1000, 5000].map(value => (
                    <button
                      type="button"
                      key={value}
                      className="bg-trader-card text-white text-sm px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                      onClick={() => setAmount(value.toString())}
                    >
                      {formatCurrency(value)}
                    </button>
                  ))}
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-trader-green hover:bg-trader-green-hover h-12 text-lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></span>
                    Processando...
                  </span>
                ) : 'Depositar'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DepositPage;
