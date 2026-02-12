import React, { useEffect, useState } from 'react';
import { getStatus } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';

const StatusPage = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkSystemStatus = async () => {
        setLoading(true);
        try {
            const data = await getStatus();
            setStatus(data);
        } catch (error) {
            setStatus({ backend: 'error', database: 'unknown', llm: 'unknown' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkSystemStatus();
    }, []);

    const StatusItem = ({ label, value }) => {
        let icon = <AlertCircle className="text-yellow-500" />;
        let text = "Unknown";
        let color = "text-yellow-500";

        if (value === 'ok') {
            icon = <CheckCircle2 className="text-green-500" />;
            text = "Operational";
            color = "text-green-500";
        } else if (value === 'error' || value === 'disconnected') {
            icon = <XCircle className="text-red-500" />;
            text = "Error";
            color = "text-red-500";
        }

        return (
            <div className={`
                flex items-center justify-between p-5 border rounded-xl bg-card/60 backdrop-blur-md transition-all duration-300
                ${value === 'error' || value === 'disconnected' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-border shadow-sm hover:shadow-md'}
            `}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${value === 'ok' ? 'bg-green-500/10' : value === 'error' ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
                        {icon}
                    </div>
                    <span className="font-medium text-lg">{label}</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${value === 'ok' ? 'bg-green-500 animate-pulse' :
                            value === 'error' ? 'bg-red-500' :
                                'bg-yellow-500'
                        }`} />
                    <span className={`text-sm font-semibold ${color}`}>{text}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="w-full max-w-2xl relative z-10 animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">System Status</h1>
                        <p className="text-muted-foreground">Real-time health check of all system components.</p>
                    </div>
                    <Button
                        onClick={checkSystemStatus}
                        disabled={loading}
                        variant="outline"
                        size="sm"
                        className="h-9"
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                <div className="grid gap-4">
                    <StatusItem label="Backend API" value={status?.backend} />
                    <StatusItem label="Database Connection" value={status?.database} />
                    <StatusItem label="LLM Integration" value={status?.llm} />
                </div>

                <div className="mt-8 text-center">
                    <Button variant="link" onClick={() => window.history.back()} className="text-muted-foreground hover:text-foreground">
                        &larr; Return to application
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
