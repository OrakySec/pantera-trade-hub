
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = React.useState(!isMobile);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex min-h-screen bg-[#111827]">
      <Sidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
      
      <div 
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          showSidebar ? 'ml-[65px]' : 'ml-0'
        }`}
      >
        <header className="h-16 bg-[#111827] border-b border-gray-800 flex justify-between items-center px-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/c5423556-2742-4426-9138-474fa5eeac1b.png" 
              alt="Pumabroker" 
              className="h-10"
            />
            <h1 className="text-white text-xl ml-2 font-bold">Pumabroker</h1>
          </div>
          <div className="flex items-center">
            <div className="text-right mr-5">
              <div className="text-gray-400 text-xs">Conta Demo</div>
              <div className="text-white font-semibold flex items-center">
                <span>R$ {user?.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <span className="ml-1 text-xs">▼</span>
              </div>
            </div>
            <button className="bg-green-500 text-white px-3 py-2 rounded flex items-center">
              Depósito 
              <svg className="w-5 h-5 ml-1" viewBox="0 0 24 24" fill="none">
                <rect width="18" height="14" x="3" y="5" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <div className="ml-4 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <footer className="bg-[#111827] border-t border-gray-800 p-3 text-xs text-gray-400">
          <div className="flex justify-between items-center px-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Gerente" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-white font-bold uppercase">Tess Garcia</p>
                  <p className="text-xs text-gray-400">GERENTE DE CONTA</p>
                </div>
              </div>
              <span className="text-gray-400">support@pumabroker.com</span>
              <button className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                CALLBACK
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span>SUPORTE - 24/7</span>
              <span>HORA ATUAL: 17 ABRIL 12:32:27 (UTC-3)</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
