import {NavLink} from 'react-router-dom';
import {BarChart2, Home, LogOut, Package} from 'lucide-react';
import {Button} from './ui/button';
import {cn} from '../lib/utils';

export function Sidebar() {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <aside className="w-64 bg-white shadow-md">
            <div className="p-4">
                <h2 className="text-xl font-bold text-primary">Stockify</h2>
            </div>
            <nav className="mt-4">
                <NavLink
                    to="/dashboard"
                    className={({isActive}) =>
                        cn('flex items-center p-4', isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100')
                    }
                >
                    <Home className="mr-2 h-5 w-5"/>
                    Dashboard
                </NavLink>
                <NavLink
                    to="/products"
                    className={({isActive}) =>
                        cn('flex items-center p-4', isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100')
                    }
                >
                    <Package className="mr-2 h-5 w-5"/>
                    Products
                </NavLink>
                <NavLink
                    to="/inventory"
                    className={({isActive}) =>
                        cn('flex items-center p-4', isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100')
                    }
                >
                    <Package className="mr-2 h-5 w-5"/>
                    Inventory
                </NavLink>
                <NavLink
                    to="/metrics"
                    className={({isActive}) =>
                        cn('flex items-center p-4', isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100')
                    }
                >
                    <BarChart2 className="mr-2 h-5 w-5"/>
                    Metrics
                </NavLink>
                <Button variant="outline" className="m-4 w-[calc(100%-2rem)]" onClick={handleLogout}>
                    <LogOut className="mr-2 h-5 w-5"/>
                    Logout
                </Button>
            </nav>
        </aside>
    );
}