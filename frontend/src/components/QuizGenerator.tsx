import React, { useState } from 'react';
import client from '../api/client';
import { GraduationCap, Check, X, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface Question {
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

export const QuizGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [quiz, setQuiz] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        setQuiz([]);
        setAnswers({});
        setShowResults(false);

        try {
            const res = await client.post('/quiz', { topic, num_questions: numQuestions });
            if (res.data.success) {
                setQuiz(res.data.quiz);
            } else {
                toast.error(res.data.error || "Failed to generate quiz");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to generate quiz");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (qIndex: number, option: string) => {
        if (showResults) return;
        setAnswers(prev => ({ ...prev, [qIndex]: option }));
    };

    const handleSubmit = async () => {
        let newScore = 0;
        quiz.forEach((q, idx) => {
            if (answers[idx] === q.correct_answer) {
                newScore++;
            }
        });

        // Show calculating state
        setLoading(true);
        setTimeout(async () => {
            setScore(newScore);
            setShowResults(true);
            setLoading(false);

            // Trigger confetti if score is decent (> 60%)
            if ((newScore / quiz.length) > 0.6) {
                const confetti = (await import('canvas-confetti')).default;
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }

            // Save score to backend
            try {
                await client.post('/quiz/submit', {
                    score: newScore,
                    total: quiz.length,
                    topic: topic
                });
            } catch (error) {
                console.error("Failed to save quiz score", error);
            }
        }, 1500); // 1.5s calculating delay
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-10">
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <GraduationCap className="mr-2 text-primary" />
                    Practice Quiz
                </h2>
                <p className="text-muted-foreground mb-6">
                    Test your knowledge. Generate a quiz from your course materials.
                </p>

                <form onSubmit={handleGenerate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground">Topic</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Quantum Mechanics"
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground">Number of Questions</label>
                            <select
                                value={numQuestions}
                                onChange={(e) => setNumQuestions(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                                disabled={loading}
                            >
                                <option value={3}>3 Questions</option>
                                <option value={5}>5 Questions</option>
                                <option value={10}>10 Questions</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !topic.trim()}
                        className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                        {loading && !showResults ? <Loader2 className="animate-spin h-5 w-5" /> : <RefreshCw className="h-5 w-5" />}
                        {loading && !showResults ? "Generating Quiz..." : "Generate Quiz"}
                    </button>
                </form>
            </div>

            {quiz.length > 0 && (
                <div className="space-y-6">
                    {quiz.map((q, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-card p-6 md:p-8 rounded-2xl shadow-lg border border-border/50 relative overflow-hidden group"
                        >
                            {/* Decorative number */}
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                            <div className="absolute top-4 right-6 text-4xl font-black text-primary/10 select-none">
                                {String(idx + 1).padStart(2, '0')}
                            </div>

                            <h3 className="text-xl font-bold mb-6 pr-12 relative z-10 leading-snug">
                                {q.question}
                            </h3>

                            <div className="space-y-3 relative z-10">
                                {q.options.map((option, optIdx) => {
                                    const isSelected = answers[idx] === option;
                                    const isCorrect = q.correct_answer === option;
                                    let className = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group/opt ";

                                    if (showResults) {
                                        if (isCorrect) className += "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400 font-medium";
                                        else if (isSelected) className += "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400";
                                        else className += "border-border opacity-50 bg-background";
                                    } else {
                                        if (isSelected) className += "border-primary bg-primary/5 text-primary shadow-sm font-medium";
                                        else className += "border-border bg-background hover:border-primary/50 hover:bg-muted";
                                    }

                                    return (
                                        <button
                                            key={optIdx}
                                            onClick={() => handleOptionSelect(idx, option)}
                                            disabled={showResults || loading}
                                            className={className}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] 
                                                    ${isSelected || (showResults && isCorrect) ? 'border-current' : 'border-muted-foreground/30 text-muted-foreground'}`}>
                                                    {String.fromCharCode(65 + optIdx)}
                                                </div>
                                                <span>{option}</span>
                                            </div>
                                            {showResults && isCorrect && <Check className="h-5 w-5 text-green-600" />}
                                            {showResults && isSelected && !isCorrect && <X className="h-5 w-5 text-red-600" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {showResults && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-xl text-sm leading-relaxed"
                                >
                                    <span className="font-bold text-primary block mb-1">Explanation: </span>
                                    <span className="text-foreground/80">{q.explanation}</span>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}

                    {!showResults ? (
                        <button
                            onClick={handleSubmit}
                            disabled={Object.keys(answers).length !== quiz.length || loading}
                            className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-bold text-lg shadow-md transition-all flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    Calculating Result...
                                </>
                            ) : (
                                "Submit Answers"
                            )}
                        </button>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="text-center p-8 bg-card rounded-lg border border-border shadow-lg"
                        >
                            <h3 className="text-3xl font-bold mb-2 text-primary">
                                Score: {score} / {quiz.length}
                            </h3>
                            <p className="text-lg text-muted-foreground mb-4">
                                {score === quiz.length ? "Perfect Score! 🎉" : (score / quiz.length) > 0.6 ? "Great Job! 👏" : "Keep practicing! 💪"}
                            </p>

                            <button
                                onClick={() => {
                                    setQuiz([]);
                                    setTopic('');
                                    setShowResults(false);
                                    setAnswers({});
                                }}
                                className="px-6 py-2 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
                            >
                                Try Another Quiz
                            </button>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
};
