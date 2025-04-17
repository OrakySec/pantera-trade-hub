
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = React.useState(!isMobile);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex min-h-screen bg-trader-darker">
      <Sidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
      
      <div 
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          showSidebar ? 'ml-56' : 'ml-16'
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto px-4 pb-4">
          {children}
        </main>
        <footer className="bg-trader-dark p-3 text-xs text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-2 md:mb-0">
              <span>Suporte: support@panteratrader.com</span>
              <button className="bg-trader-green text-white px-2 py-1 rounded text-xs">
                CALLBACK
              </button>
            </div>
            <div className="flex flex-col md:flex-row md:gap-4">
              <span>SUPORTE - 24/7</span>
              <span>HORA ATUAL: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
