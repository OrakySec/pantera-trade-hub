
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      
      if (!success) {
        // Mensagem de erro já exibida pelo contexto
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Ocorreu um erro ao fazer login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-trader-dark">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-trader-card px-6 py-8 rounded-lg shadow-md w-full">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/f59ce620-95fe-4c2f-8b7b-8f3e92b23791.png" 
              alt="Pantera Trader Logo" 
              className="h-16 w-16 object-contain" 
            />
          </div>
          
          <h1 className="mb-8 text-2xl text-center text-white font-bold">Login</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-400 text-sm mb-2">Email</label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-trader-darker border-gray-700 text-white"
                placeholder="Seu email"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-400 text-sm mb-2">Senha</label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-trader-darker border-gray-700 text-white"
                placeholder="Sua senha"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-trader-green hover:bg-trader-green-hover"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></span>
                  Entrando...
                </span>
              ) : 'Entrar'}
            </Button>
          </form>
          
          <div className="text-center mt-6 text-gray-400 text-sm">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-trader-green hover:underline">
              Registre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
