import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, FileText, GraduationCap, Upload, Sparkles, TrendingUp, Clock, BookOpen, Activity, Zap, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { motion } from 'framer-motion';
import { ScanningLoader } from '../components/ScanningLoader';
import { FunnyQuote } from '../components/FunnyQuote';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [statsData, setStatsData] = useState({
        documents: 0,
        questions: 0,
        study_hours: 0,
        quiz_score: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Simulate scanning delay for effect
                await new Promise(resolve => setTimeout(resolve, 2000));

                const res = await client.get('/dashboard');
                if (res.data.success) {
                    setStatsData(res.data.stats);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        {
            to: '/dashboard/upload',
            icon: Upload,
            title: 'Upload Data',
            desc: 'Ingest course materials',
            color: 'text-blue-500'
        },
        {
            to: '/dashboard/chat',
            icon: MessageSquare,
            title: 'AI Neural Link',
            desc: 'Execute query protocol',
            color: 'text-purple-500'
        },
        {
            to: '/dashboard/summary',
            icon: FileText,
            title: 'Data Compression',
            desc: 'Generate concise summaries',
            color: 'text-green-500'
        },
        {
            to: '/dashboard/quiz',
            icon: GraduationCap,
            title: 'Skill Assessment',
            desc: 'Initiate testing sequence',
            color: 'text-amber-500'
        },
    ];

    if (loading) {
        return <ScanningLoader />;
    }

    return (
        <div className="min-h-screen -m-8 p-8 relative overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-grid-animate opacity-20 pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-8">

                {/* HUD Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-8 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-amber-600 p-[2px] animate-spin-slow">
                            <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                                <Cpu className="h-8 w-8 text-primary animate-pulse" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-indigo-600 dark:from-primary dark:to-white">
                                Command Center
                            </h1>
                            <div className="flex items-center gap-3 text-sm font-mono text-primary font-bold">
                                <span>STATUS: ONLINE</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span>{new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col items-center bg-card/50 border border-white/10 p-3 rounded-xl min-w-[100px]">
                            <span className="text-xs text-muted-foreground font-mono uppercase">System Load</span>
                            <span className="text-xl font-bold text-primary">12%</span>
                        </div>
                        <div className="flex flex-col items-center bg-card/50 border border-white/10 p-3 rounded-xl min-w-[100px]">
                            <span className="text-xs text-muted-foreground font-mono uppercase">Brain Power</span>
                            <span className="text-xl font-bold text-primary">98%</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Stats & Quotes (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Stats Panel */}
                        <div className="bg-card/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                                <Activity className="h-5 w-5" />
                                PERFORMANCE METRICS
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-background/50 rounded-xl border border-white/5">
                                    <BookOpen className="h-5 w-5 text-blue-400 mb-2" />
                                    <div className="text-2xl font-bold">{statsData.documents}</div>
                                    <div className="text-xs text-muted-foreground uppercase">Archives</div>
                                </div>
                                <div className="p-4 bg-background/50 rounded-xl border border-white/5">
                                    <MessageSquare className="h-5 w-5 text-purple-400 mb-2" />
                                    <div className="text-2xl font-bold">{statsData.questions}</div>
                                    <div className="text-xs text-muted-foreground uppercase">Queries</div>
                                </div>
                                <div className="p-4 bg-background/50 rounded-xl border border-white/5">
                                    <Clock className="h-5 w-5 text-green-400 mb-2" />
                                    <div className="text-2xl font-bold">{statsData.study_hours}h</div>
                                    <div className="text-xs text-muted-foreground uppercase">Uptime</div>
                                </div>
                                <div className="p-4 bg-background/50 rounded-xl border border-white/5">
                                    <TrendingUp className="h-5 w-5 text-amber-400 mb-2" />
                                    <div className="text-2xl font-bold">{statsData.quiz_score}%</div>
                                    <div className="text-xs text-muted-foreground uppercase">Accuracy</div>
                                </div>
                            </div>
                        </div>

                        {/* Funny Quote Widget */}
                        <FunnyQuote />
                    </div>

                    {/* RIGHT COLUMN: Action Grid (8 cols) */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                            {cards.map((card, idx) => (
                                <motion.div
                                    key={card.to}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="h-full"
                                >
                                    <Link to={card.to} className="block h-full group relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-primary/50 transition-all duration-500">
                                        {/* Hover Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative p-8 flex flex-col justify-between h-full z-10">
                                            <div className={`h-14 w-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${card.color}`}>
                                                <card.icon className="h-8 w-8" />
                                            </div>

                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                                    {card.title}
                                                </h3>
                                                <p className="text-zinc-400 font-mono text-sm">
                                                    {card.desc}
                                                </p>
                                            </div>

                                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                                <Zap className="h-6 w-6 text-primary" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
