
import { Link, useLocation } from 'react-router-dom';
import { History, BarChart3, Wallet, Calendar, Copy, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    {
      icon: Tv,
      label: 'OPERAÇÕES ABERTAS',
      path: '/dashboard',
    },
    {
      icon: History,
      label: 'HISTÓRICO DE TRADING',
      path: '/history',
    },
    {
      icon: Wallet,
      label: 'DEPÓSITO',
      path: '/deposit',
    },
    {
      icon: Calendar,
      label: 'CALENDÁRIO ECONÔMICO',
      path: '/calendar',
    },
    {
      icon: Copy,
      label: 'COPY TRADER',
      path: '/copy-trading',
    },
  ];

  return (
    <div
      className={cn(
        "h-screen bg-trader-dark border-r border-gray-800 fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out flex flex-col",
        isOpen ? "w-56" : "w-16"
      )}
    >
      <div className="p-3 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/f59ce620-95fe-4c2f-8b7b-8f3e92b23791.png" 
            alt="Pantera Trader Logo" 
            className="h-8 w-8 object-contain"
          />
          {isOpen && <span className="ml-2 text-white font-bold text-sm">Pantera Trader</span>}
        </div>
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white text-xl"
        >
          {isOpen ? "×" : "≡"}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path} className="px-2">
              <Link
                to={item.path}
                className={cn(
                  "flex items-center p-2 text-xs transition-colors rounded-md group",
                  location.pathname === item.path
                    ? "bg-trader-card text-trader-green border-l-2 border-trader-green"
                    : "text-gray-400 hover:bg-trader-card hover:text-white",
                  !isOpen && "justify-center"
                )}
              >
                <item.icon className="h-4 w-4 mr-2 group-hover:text-white" />
                {isOpen && <span className="truncate">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center">
          <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs">
            ?
          </div>
          {isOpen && (
            <div className="ml-2">
              <p className="text-xs text-white font-bold">GERENTE DE CONTA</p>
              <p className="text-xs text-gray-400">Cristina Santos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
