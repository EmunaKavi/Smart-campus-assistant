import React from 'react';
import { motion } from 'framer-motion';

export const ScanningLoader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-64 w-full">
            <div className="relative w-24 h-24 mb-6">
                {/* Fingerprint / Data Grid Base */}
                <div className="absolute inset-0 border-2 border-primary/20 rounded-lg grid grid-cols-4 grid-rows-4 gap-1 p-1">
                    {[...Array(16)].map((_, i) => (
                        <div key={i} className={`bg-primary/10 rounded-sm ${i % 2 === 0 ? 'opacity-50' : 'opacity-20'}`} />
                    ))}
                </div>

                {/* Scanning Laser */}
                <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 w-full h-1 bg-primary/80 shadow-[0_0_15px_rgba(255,215,0,0.6)] z-10"
                />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="text-primary font-mono text-sm tracking-widest uppercase"
            >
                System Scanning...
            </motion.div>
        </div>
    );
};
