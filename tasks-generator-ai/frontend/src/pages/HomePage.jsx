import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSpecs } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Plus, Clock, Server } from 'lucide-react';

const HomePage = () => {
    const [recentSpecs, setRecentSpecs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSpecs();
    }, []);

    const loadSpecs = async () => {
        try {
            const data = await getSpecs();
            setRecentSpecs(data);
        } catch (error) {
            console.error("Failed to load specs", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            <div className="relative container mx-auto p-6 md:p-12 max-w-6xl animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 text-gradient">
                            Task Generator AI
                        </h1>
                        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                            Turn your ambitious ideas into structured, actionable engineering specifications in seconds.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/status">
                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 hover:bg-secondary/80 transition-all">
                                <Server className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/generate">
                            <Button size="lg" className="h-12 px-8 rounded-full gap-2 text-md font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:scale-105">
                                <Plus className="h-5 w-5" /> Generate Spec
                            </Button>
                        </Link>
                    </div>
                </div>

                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <span className="text-foreground">Recent Specifications</span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-48 rounded-xl bg-muted/50 animate-pulse" />
                            ))}
                        </div>
                    ) : recentSpecs.length === 0 ? (
                        <Card className="bg-muted/30 border-dashed border-2">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="p-4 rounded-full bg-muted mb-4">
                                    <Plus className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-medium mb-2">No specs generated yet</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm">
                                    Start by creating your first project specification. It only takes a few seconds.
                                </p>
                                <Link to="/generate">
                                    <Button variant="outline" className="rounded-full">Create first spec</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {recentSpecs.map((spec, i) => (
                                <Link key={spec._id} to={`/spec/${spec._id}`} className="group">
                                    <div className="h-full relative overflow-hidden rounded-xl border bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                                        style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="p-6 flex flex-col h-full relative z-10">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-2 rounded-lg bg-secondary/50 group-hover:bg-primary/10 transition-colors">
                                                    <Server className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary/50 text-secondary-foreground">
                                                    {spec.templateType}
                                                </span>
                                            </div>

                                            <h3 className="font-semibold text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                                {spec.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                                {spec.goal}
                                            </p>

                                            <div className="flex items-center text-xs text-muted-foreground mt-auto pt-4 border-t border-border/50">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                    {spec.tasks.length} tasks generated
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default HomePage;
