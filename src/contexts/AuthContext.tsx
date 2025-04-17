
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está armazenado no localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulando uma verificação de login
      if (email && password) {
        // Verificar se o usuário está cadastrado no localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        
        if (foundUser) {
          const userData = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            balance: foundUser.balance,
          };
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          toast.success('Login realizado com sucesso!');
          return true;
        } else {
          toast.error('Email ou senha incorretos');
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Ocorreu um erro ao fazer login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Verificar se o usuário já existe
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((u: any) => u.email === email);
      
      if (userExists) {
        toast.error('Usuário já cadastrado com este email');
        return false;
      }
      
      // Criar novo usuário
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password, // Em uma aplicação real, isto seria criptografado
        balance: 10000, // Saldo inicial demo de R$10.000
        createdAt: new Date().toISOString(),
      };
      
      // Salvar no "banco de dados" (localStorage)
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Autenticar o usuário recém-criado
      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        balance: newUser.balance,
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Cadastro realizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      toast.error('Ocorreu um erro ao registrar');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Logout realizado com sucesso');
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Atualizar o usuário no "banco de dados" (localStorage)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, balance: newBalance } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateBalance
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
