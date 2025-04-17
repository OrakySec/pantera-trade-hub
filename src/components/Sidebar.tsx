
import { Link, useLocation } from 'react-router-dom';
import { Tv, History, Wallet, Calendar, Copy } from 'lucide-react';
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
        "h-screen bg-[#111827] border-r border-gray-800 fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out flex flex-col",
        isOpen ? "w-[65px]" : "w-[65px]"
      )}
    >
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-4 mt-16">
          {menuItems.map((item) => (
            <li key={item.path} className="px-2">
              <Link
                to={item.path}
                className={cn(
                  "flex flex-col items-center p-2 text-[9px] transition-colors rounded-md",
                  location.pathname === item.path
                    ? "text-white"
                    : "text-gray-400 hover:text-white",
                  "justify-center"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-center leading-tight">{item.label.split(' ').map(word => <div key={word}>{word}</div>)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
