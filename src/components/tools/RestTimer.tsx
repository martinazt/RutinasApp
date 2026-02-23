import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X } from 'lucide-react';

interface RestTimerProps {
    onClose: () => void;
    defaultSeconds?: number;
}

export function RestTimer({ onClose, defaultSeconds = 60 }: RestTimerProps) {
    const [seconds, setSeconds] = useState(defaultSeconds);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsActive(false);
            // Optional: Play sound or notify
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const toggle = () => setIsActive(!isActive);
    const reset = () => {
        setIsActive(false);
        setSeconds(defaultSeconds);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const secs = time % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-2xl z-50 w-64">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">Descanso</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X size={18} />
                </button>
            </div>

            <div className="text-4xl font-mono text-center font-bold text-primary mb-4">
                {formatTime(seconds)}
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={toggle}
                    className={`p-3 rounded-full ${isActive ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'} transition-colors`}
                >
                    {isActive ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button
                    onClick={reset}
                    className="p-3 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                >
                    <RotateCcw size={24} />
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
                {[30, 60, 90].map(t => (
                    <button
                        key={t}
                        onClick={() => { setSeconds(t); setIsActive(false); }}
                        className="px-2 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700 text-gray-300"
                    >
                        {t}s
                    </button>
                ))}
            </div>
        </div>
    );
}
