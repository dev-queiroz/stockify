import {useEffect, useState} from 'react';
import api from '../lib/axios';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import type {Inventory} from '@/types';
import {Product} from '@/types';

export default function Inventory() {
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [type, setType] = useState<'entry' | 'exit'>('entry');

    useEffect(() => {
        fetchInventory();
        fetchProducts();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await api.get('/inventory');
            setInventory(response.data);
        } catch (err) {
            console.error('Failed to fetch inventory:', err);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        }
    };

    const handleAddInventory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/inventory', {
                productId: parseInt(productId),
                quantity: parseInt(quantity),
                type,
            });
            fetchInventory();
            setProductId('');
            setQuantity('');
            setType('entry');
        } catch (err) {
            console.error('Failed to add inventory:', err);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Inventory</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Add Inventory Movement</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddInventory} className="space-y-4">
                        <select
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                        <Input
                            type="number"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'entry' | 'exit')}
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            <option value="entry">Entry</option>
                            <option value="exit">Exit</option>
                        </select>
                        <Button type="submit">Add Movement</Button>
                    </form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Movements</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{products.find((p) => p.id === item.productId)?.name || '-'}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}