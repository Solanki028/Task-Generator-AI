import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSpecById, updateSpec, deleteSpec } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Loader2, ArrowLeft, Download, Save, GripVertical, Trash2, AlertCircle } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';

const SortableTask = ({ task, onUpdate }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-4 bg-card border rounded-xl shadow-sm group hover:border-primary/50 hover:shadow-md transition-all duration-200"
        >
            <div {...attributes} {...listeners} className="cursor-grab text-muted-foreground/50 hover:text-foreground p-1 rounded hover:bg-muted transition-colors">
                <GripVertical className="h-5 w-5" />
            </div>
            <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                <Input
                    value={task.title}
                    onChange={(e) => onUpdate(task.id, 'title', e.target.value)}
                    className="col-span-8 border-transparent hover:border-input focus:border-primary shadow-none bg-transparent h-9 px-2 font-medium"
                />
                <div className="col-span-4 flex justify-end">
                    <div className="relative">
                        <Input
                            value={task.group}
                            onChange={(e) => onUpdate(task.id, 'group', e.target.value)}
                            className="w-full text-right border-transparent hover:border-input focus:border-primary shadow-none bg-secondary/30 h-7 px-2 text-xs text-muted-foreground rounded-md"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SpecDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [spec, setSpec] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Sensors for DND
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadSpec();
    }, [id]);

    const loadSpec = async () => {
        try {
            const data = await getSpecById(id);
            setSpec(data);
        } catch (error) {
            alert("Failed to load spec");
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setSpec((items) => {
                const oldIndex = items.tasks.findIndex((t) => t.id === active.id);
                const newIndex = items.tasks.findIndex((t) => t.id === over.id);

                const newTasks = arrayMove(items.tasks, oldIndex, newIndex);
                return { ...items, tasks: newTasks };
            });
        }
    };

    const updateTask = (taskId, field, value) => {
        setSpec(prev => ({
            ...prev,
            tasks: prev.tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t)
        }));
    };

    const saveChanges = async () => {
        setSaving(true);
        try {
            await updateSpec(spec._id, { tasks: spec.tasks });
        } catch (error) {
            alert("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this spec? This action cannot be undone.")) {
            try {
                await deleteSpec(spec._id);
                navigate('/');
            } catch (error) {
                alert("Failed to delete spec");
            }
        }
    };

    const exportMarkdown = () => {
        if (!spec) return;

        let md = `# ${spec.title}\n\n`;
        md += `## Goal\n${spec.goal}\n\n`;
        md += `## Target Users\n${spec.users}\n\n`;
        md += `## Constraints\n${spec.constraints || 'None'}\n\n`;

        md += `## User Stories\n`;
        spec.userStories.forEach(s => md += `- ${s}\n`);
        md += `\n`;

        md += `## Engineering Tasks\n`;
        // Group tasks by group name for export
        const grouped = spec.tasks.reduce((acc, t) => {
            acc[t.group] = acc[t.group] || [];
            acc[t.group].push(t);
            return acc;
        }, {});

        Object.keys(grouped).forEach(group => {
            md += `### ${group}\n`;
            grouped[group].forEach(t => md += `- [ ] ${t.title}\n`);
            md += `\n`;
        });

        md += `## Risks\n`;
        spec.risks.forEach(r => md += `- ${r}\n`);

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${spec.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
    if (!spec) return <div>Spec not found</div>;

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-secondary/30 to-background pointer-events-none"></div>

            <div className="relative container mx-auto p-6 max-w-5xl animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 mt-8">
                    <Button variant="ghost" onClick={() => navigate('/')} className="pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
                    </Button>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" onClick={saveChanges} disabled={saving} className="flex-1 md:flex-none">
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save
                        </Button>
                        <Button onClick={exportMarkdown} className="flex-1 md:flex-none">
                            <Download className="mr-2 h-4 w-4" /> Export MD
                        </Button>
                        <Button variant="destructive" size="icon" onClick={handleDelete} className="flex-none">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid gap-8">
                    {/* Header Card */}
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-gradient">{spec.title}</h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl border-l-4 border-primary/20 pl-4">
                            {spec.goal}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-start">

                        {/* Sidebar */}
                        <div className="space-y-6 md:col-span-1">
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" /> Target Users
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">{spec.users}</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-purple-500" /> User Stories
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {spec.userStories.map((s, i) => (
                                            <li key={i} className="text-sm text-muted-foreground flex gap-3">
                                                <span className="text-primary/50 font-mono text-xs mt-0.5">0{i + 1}</span>
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {spec.risks && spec.risks.length > 0 && (
                                <Card className="bg-destructive/5 border-destructive/20">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-destructive flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4" /> Risks & Checks
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {spec.risks.map((r, i) => (
                                                <li key={i} className="text-sm text-destructive/80 flex gap-2 items-start">
                                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive/40 shrink-0" />
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Main Tasks Area */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="border-none shadow-none bg-transparent">
                                <CardHeader className="px-0 pt-0">
                                    <CardTitle className="text-2xl flex items-center gap-2">
                                        Engineering Tasks
                                        <span className="text-sm font-normal text-muted-foreground px-2 py-1 bg-secondary rounded-full">
                                            {spec.tasks.length} items
                                        </span>
                                    </CardTitle>
                                    <p className="text-muted-foreground">
                                        Drag to prioritize. Group tasks by feature.
                                    </p>
                                </CardHeader>
                                <CardContent className="px-0">
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={spec.tasks.map(t => t.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-3">
                                                {spec.tasks.map((task) => (
                                                    <SortableTask key={task.id} task={task} onUpdate={updateTask} />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpecDetailPage;
