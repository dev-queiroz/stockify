import {useEffect, useState} from 'react';
import api from '../lib/axios';
import {Card, CardContent, CardHeader, CardTitle} from '../components/ui/card';
import {Metric} from '../types';

export default function Metrics() {
    const [metrics, setMetrics] = useState<Metric[]>([]);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get('/metrics');
                setMetrics(response.data);
            } catch (err) {
                console.error('Failed to fetch metrics:', err);
            }
        };
        fetchMetrics();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Metrics</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Stock Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {metrics.map((metric) => (
                            <div key={metric.id} className="flex justify-between">
                                <span>Product ID: {metric.productId}</span>
                                <span>Stock: {metric.stock}</span>
                                <span>{new Date(metric.timestamp).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}