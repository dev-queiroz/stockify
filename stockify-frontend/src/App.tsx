import {Navigate, Route, Routes} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Metrics from './pages/Metrics';
import {Navbar} from './components/Navbar';
import {Sidebar} from './components/Sidebar';
import { ReactNode } from "react";

const ProtectedRoute = ({children}: { children: ReactNode }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace/>;
};

export default function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <div className="flex justify-center items-center min-h-screen bg-gray-100">
                        <Login/>
                    </div>
                }
            />
            <Route
                path="/register"
                element={
                    <div className="flex justify-center items-center min-h-screen bg-gray-100">
                        <Register/>
                    </div>
                }
            />
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <div className="flex min-h-screen bg-gray-100">
                            <Sidebar/>
                            <div className="flex-1">
                                <Navbar/>
                                <main className="p-6">
                                    <Routes>
                                        <Route path="/dashboard" element={<Dashboard/>}/>
                                        <Route path="/products" element={<Products/>}/>
                                        <Route path="/inventory" element={<Inventory/>}/>
                                        <Route path="/metrics" element={<Metrics/>}/>
                                        <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
                                    </Routes>
                                </main>
                            </div>
                        </div>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}