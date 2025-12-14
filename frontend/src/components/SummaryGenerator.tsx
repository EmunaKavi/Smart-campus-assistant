import React, { useState } from 'react';
import client from '../api/client';
import ReactMarkdown from 'react-markdown';
import { FileText, Download, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export const SummaryGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        setSummary('');

        try {
            const res = await client.post('/summarize', { topic });
            if (res.data.success) {
                setSummary(res.data.summary);
            } else {
                toast.error(res.data.error || "Failed to generate summary");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to generate summary");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (!summary) return;

        try {
            const html2canvas = (await import('html2canvas')).default;
            const jsPDF = (await import('jspdf')).default;

            const content = document.getElementById('summary-content');
            if (!content) return;

            const canvas = await html2canvas(content, {
                scale: 2,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`summary-${topic.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`);

            toast.success("Summary exported as PDF!");
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Failed to export PDF");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <FileText className="mr-2 text-primary" />
                    Generate Summary
                </h2>
                <p className="text-muted-foreground mb-6">
                    Enter a topic to generate a comprehensive summary from your uploaded documents.
                </p>

                <form onSubmit={handleGenerate} className="flex gap-4 items-center bg-background p-2 pr-2 rounded-xl border-2 border-border focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter topic (e.g., 'Thermodynamics Laws', 'History of Rome')"
                        className="flex-1 px-4 py-3 rounded-lg border-none bg-transparent focus:outline-none text-lg placeholder:text-muted-foreground/50"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !topic.trim()}
                        className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <FileText className="h-5 w-5" />}
                        {loading ? "Generating..." : "Generate"}
                    </button>
                </form>
            </div>

            {summary && (
                <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex justify-between items-center p-6 bg-muted/30 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <FileText className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Summary: {topic}</h3>
                        </div>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border hover:bg-muted text-sm font-medium transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            Export PDF
                        </button>
                    </div>
                    <div id="summary-content" className="prose prose-lg dark:prose-invert max-w-none p-10 bg-card">
                        <h1 className="text-3xl font-bold mb-8 pb-4 border-b border-border/50 text-center text-primary">{topic}</h1>
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-8 mb-4 text-foreground" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-6 mb-3 text-primary border-l-4 border-primary pl-4" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-5 mb-2 text-foreground" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2 text-muted-foreground" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2 text-muted-foreground" {...props} />,
                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-muted-foreground" {...props} />,
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary/50 pl-4 italic my-4 bg-muted/20 p-4 rounded-r-lg" {...props} />,
                            }}
                        >
                            {summary}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
};
