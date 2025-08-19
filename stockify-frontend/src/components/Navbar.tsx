import {User} from 'lucide-react';
import {Button} from './ui/button';

export function Navbar() {
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-primary">Stockify</h1>
            <Button variant="outline">
                <User className="mr-2 h-5 w-5"/>
                Profile
            </Button>
        </header>
    );
}