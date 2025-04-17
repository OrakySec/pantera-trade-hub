
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-trader-dark border-b border-gray-800 py-3 px-6 sticky top-0 z-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden mr-2 text-gray-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-white font-medium">Pantera Trader</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">Conta Demo</p>
            <p className="text-white font-semibold">
              {user ? formatCurrency(user.balance) : 'R$ 0,00'}
            </p>
          </div>

          <Link
            to="/deposit"
            className="bg-trader-green px-4 py-2 rounded text-white text-sm font-medium hover:bg-trader-green-hover transition-colors"
          >
            Depósito
          </Link>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="text-gray-400 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
