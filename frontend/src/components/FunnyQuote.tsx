import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, RefreshCcw } from 'lucide-react';

const QUOTES = [
    "I have not failed. I've just found 10,000 ways that won't work. - Edison (me debugging)",
    "Artificial Intelligence is no match for natural stupidity.",
    "The code works! ... I have no idea why.",
    "My code is compiling... time for a coffee break.",
    "Sleep is for the weak... or those without compile errors.",
    "404: Motivation not found.",
    "It works on my machine.",
    "Debugging: Being the detective in a crime movie where you are also the murderer.",
    "Measuring programming progress by lines of code is like measuring aircraft building progress by weight. - Bill Gates",
    "First, solve the problem. Then, write the code. - John Johnson"
];

export const FunnyQuote: React.FC = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Random start
        setIndex(Math.floor(Math.random() * QUOTES.length));
    }, []);

    const nextQuote = () => {
        setIndex((prev) => (prev + 1) % QUOTES.length);
    };

    return (
        <div className="relative overflow-hidden rounded-xl bg-card border border-border p-6 shadow-lg group">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={nextQuote}
                    className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                >
                    <RefreshCcw className="h-4 w-4" />
                </button>
            </div>

            <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <Quote className="h-6 w-6" />
                </div>

                <AnimatePresence mode='wait'>
                    <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-lg font-medium text-foreground italic leading-relaxed"
                    >
                        "{QUOTES[index]}"
                    </motion.p>
                </AnimatePresence>

                <p className="mt-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Daily Wisdom
                </p>
            </div>
        </div>
    );
};
