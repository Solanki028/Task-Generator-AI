import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSpec } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Loader2, ArrowLeft, Wand2 } from 'lucide-react';

const GenerateSpecPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        goal: '',
        users: '',
        constraints: '',
        templateType: 'General'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await generateSpec(formData);
            navigate(`/spec/${data._id}`);
        } catch (error) {
            alert("Failed to generate spec: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="container mx-auto p-6 max-w-3xl flex-1 flex flex-col justify-center animate-slide-up relative z-10 w-full">
                <Button variant="ghost" onClick={() => navigate('/')} className="self-start mb-8 pl-0 hover:pl-2 transition-all hover:bg-transparent text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                    <Card className="border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl relative">
                        <CardHeader className="space-y-1 pb-2">
                            <CardTitle className="text-3xl font-bold tracking-tight">Generate New Spec</CardTitle>
                            <p className="text-muted-foreground">Describe your idea, and we'll architect the engineering tasks for you.</p>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between">
                                        Goal <span className="text-muted-foreground font-normal text-xs">What do you want to build?</span>
                                    </label>
                                    <Textarea
                                        name="goal"
                                        placeholder="E.g. A real-time collaboration tool for remote teams with video chat and task boards..."
                                        required
                                        value={formData.goal}
                                        onChange={handleChange}
                                        className="min-h-[120px] resize-none bg-background/50 focus:bg-background transition-colors border-2 focus:ring-0 focus:border-primary/50 rounded-xl p-4 text-base"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium leading-none flex justify-between">
                                            Target Users <span className="text-muted-foreground font-normal text-xs">Who is this for?</span>
                                        </label>
                                        <Input
                                            name="users"
                                            placeholder="E.g. Managers, Developers..."
                                            required
                                            value={formData.users}
                                            onChange={handleChange}
                                            className="h-12 bg-background/50 focus:bg-background transition-colors border-2 focus:ring-0 focus:border-primary/50 rounded-xl px-4"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-medium leading-none block mb-2">Template Strategy</label>
                                        <div className="relative">
                                            <select
                                                name="templateType"
                                                value={formData.templateType}
                                                onChange={handleChange}
                                                className="flex h-12 w-full items-center justify-between rounded-xl border-2 border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                            >
                                                <option>General</option>
                                                <option>MVP</option>
                                                <option>Scale-up</option>
                                                <option>Internal Tool</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                                <Wand2 className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium leading-none">
                                        Constraints (Optional)
                                    </label>
                                    <Textarea
                                        name="constraints"
                                        placeholder="E.g. Must use Next.js, Mobile-first design, 2 week timeline..."
                                        value={formData.constraints}
                                        onChange={handleChange}
                                        className="min-h-[80px] bg-background/50 focus:bg-background transition-colors border-2 focus:ring-0 focus:border-primary/50 rounded-xl p-4"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 text-lg font-medium rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all bg-gradient-to-r from-primary to-primary/90 hover:to-primary shadow-lg shadow-primary/20"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Architecting Solution...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Wand2 className="h-5 w-5" />
                                            <span>Generate Specification</span>
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default GenerateSpecPage;
