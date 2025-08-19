import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {BarChart2, Package} from 'lucide-react';
import {Button} from "@/components/ui/button";

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Package className="mr-2 h-5 w-5"/>
                            Products Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Total Products: 50</p>
                        <p>Low Stock: 5</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BarChart2 className="mr-2 h-5 w-5"/>
                            Recent Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Stock Updates: 10 today</p>
                        <p>Revenue: $1,200</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Download Mobile App</CardTitle>
                </CardHeader>
                <CardContent>
                    <a href="/apk/app.apk" download>
                        <Button>Download App</Button>
                    </a>
                </CardContent>
            </Card>
        </div>
    );
}