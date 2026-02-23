import { useState } from 'react';
import type { MuscleGroup } from '../../types';
import { Rotate3d, Box } from 'lucide-react';
import { BodyMap3D } from './BodyMap3D';

interface BodyMapProps {
    highlightedMuscles: MuscleGroup[];
    primaryMuscles?: MuscleGroup[];
    secondaryMuscles?: MuscleGroup[];
}

type ViewAngle = 'front' | 'back';

export function BodyMap({ highlightedMuscles, primaryMuscles, secondaryMuscles }: BodyMapProps) {
    const [view, setView] = useState<ViewAngle>('front');
    const [is3D, setIs3D] = useState(false);

    // Use specific muscle lists if provided, else fall back to highlightedMuscles
    const effectivePrimary = primaryMuscles ?? highlightedMuscles;
    const effectiveSecondary = secondaryMuscles ?? [];

    // Helper to determine fill color for overlay (invisible if not active)
    const getOverlayColor = (muscle: string, broaderGroup?: string) => {
        const isActive = highlightedMuscles.includes(muscle as MuscleGroup) ||
            (broaderGroup && highlightedMuscles.includes(broaderGroup as MuscleGroup));

        if (isActive) return 'rgba(239, 68, 68, 0.6)'; // Red-500 with 60% opacity
        return 'transparent'; // Completely invisible otherwise
    };

    // Aspect ratios for Gray's Anatomy plates
    // Front: 546/1023 ~= 0.533
    // Back:  562/1024 ~= 0.548
    const aspectRatio = view === 'front' ? '546/1023' : '562/1024';

    if (is3D) {
        return (
            <div className="relative w-full h-[600px]">
                <BodyMap3D
                    primaryMuscles={effectivePrimary}
                    secondaryMuscles={effectiveSecondary}
                />
                {/* 3D/2D Toggle - Absolute positioning on top of the 3D container */}
                <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
                    <button
                        onClick={() => setIs3D(false)}
                        className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-transform active:scale-95 border border-gray-700"
                        title="Volver a 2D"
                    >
                        <Box size={24} className="text-primary" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative group w-full h-[600px] flex items-center justify-center bg-[#0a0a0a] rounded-xl overflow-hidden border border-gray-800">
            {/* Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <button
                    onClick={() => setIs3D(true)}
                    className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-transform active:scale-95 border border-gray-700"
                    title="Ver en 3D (Experimental)"
                >
                    <Box size={24} className="text-white" />
                </button>
                <button
                    onClick={() => setView(v => v === 'front' ? 'back' : 'front')}
                    className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-transform active:scale-95 border border-gray-700"
                    title="Rotar Vista"
                >
                    <Rotate3d size={24} className={view === 'back' ? 'text-primary' : 'text-white'} />
                </button>
            </div>

            {/* Main Visualizer - Dynamic Aspect Ratio Container */}
            <div className="relative h-full w-full p-4 flex justify-center items-center">
                <div
                    className="relative h-full transition-all duration-300 ease-in-out"
                    style={{ aspectRatio }}
                >
                    {view === 'front' ? (
                        <>
                            {/* 1. UNLABELED ANATOMY BASE (Front) */}
                            <img
                                src="/assets/body_front.png"
                                alt="Anatomía Frontal"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                        const errDiv = document.createElement('div');
                                        errDiv.className = "flex items-center justify-center h-full w-full text-gray-500 text-center p-4 border border-dashed border-gray-700 rounded-xl";
                                        errDiv.innerHTML = "Imagen no encontrada.<br/>Verifique /assets/body_front.png";
                                        parent.appendChild(errDiv);
                                    }
                                }}
                            />

                            {/* 2. SVG OVERLAY (Front) - Stretches to fit container */}
                            {/* Coordinate system based on approx 100x200 grid relative to image frame */}
                            <svg
                                viewBox="0 0 100 200"
                                preserveAspectRatio="none"
                                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                            >
                                {/* Neck/Traps */}
                                <path d="M35 15 L65 15 L75 25 L25 25 Z" fill={getOverlayColor('Trapecios')} />

                                {/* Shoulders (Deltoids) */}
                                <ellipse cx="22" cy="33" rx="12" ry="10" fill={getOverlayColor('Hombros')} />
                                <ellipse cx="78" cy="33" rx="12" ry="10" fill={getOverlayColor('Hombros')} />

                                {/* Chest (Pectoralis) */}
                                <path d="M30 35 L70 35 L65 55 L35 55 Z" fill={getOverlayColor('Pecho')} />

                                {/* Biceps */}
                                <ellipse cx="18" cy="60" rx="7" ry="14" fill={getOverlayColor('Bíceps', 'Brazos')} transform="rotate(10 18 60)" />
                                <ellipse cx="82" cy="60" rx="7" ry="14" fill={getOverlayColor('Bíceps', 'Brazos')} transform="rotate(-10 82 60)" />

                                {/* Forearms */}
                                <ellipse cx="12" cy="85" rx="6" ry="18" fill={getOverlayColor('Brazos')} transform="rotate(15 12 85)" />
                                <ellipse cx="88" cy="85" rx="6" ry="18" fill={getOverlayColor('Brazos')} transform="rotate(-15 88 85)" />

                                {/* Abs/Core */}
                                <rect x="38" y="55" width="24" height="35" rx="5" fill={getOverlayColor('Core')} />
                                <path d="M38 90 L62 90 L50 100 Z" fill={getOverlayColor('Core')} />

                                {/* Quads */}
                                <path d="M32 100 Q28 130 35 150 L48 145 L48 100 Z" fill={getOverlayColor('Cuádriceps', 'Piernas')} />
                                <path d="M68 100 Q72 130 65 150 L52 145 L52 100 Z" fill={getOverlayColor('Cuádriceps', 'Piernas')} />

                                {/* Adductors */}
                                <path d="M48 100 L48 145 L52 145 L52 100 Z" fill={getOverlayColor('Piernas')} />

                                {/* Calves (Tibialis) */}
                                <ellipse cx="36" cy="170" rx="7" ry="18" fill={getOverlayColor('Gemelos', 'Piernas')} />
                                <ellipse cx="64" cy="170" rx="7" ry="18" fill={getOverlayColor('Gemelos', 'Piernas')} />
                            </svg>
                        </>
                    ) : (
                        <>
                            {/* 1. UNLABELED ANATOMY BASE (Back) */}
                            <img
                                src="/assets/body_back.png"
                                alt="Anatomía Dorsal"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />

                            {/* 2. SVG OVERLAY (Back) */}
                            <svg
                                viewBox="0 0 100 200"
                                preserveAspectRatio="none"
                                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                            >
                                {/* Traps (Upper Back) */}
                                <path d="M35 20 L65 20 L50 45 Z" fill={getOverlayColor('Trapecios')} />

                                {/* Lats */}
                                <path d="M30 50 L70 50 L60 85 L40 85 Z" fill={getOverlayColor('Espalda')} />

                                {/* Shoulders (Rear Delts) */}
                                <circle cx="20" cy="35" r="10" fill={getOverlayColor('Hombros')} />
                                <circle cx="80" cy="35" r="10" fill={getOverlayColor('Hombros')} />

                                {/* Triceps */}
                                <ellipse cx="15" cy="60" rx="7" ry="14" fill={getOverlayColor('Tríceps', 'Brazos')} transform="rotate(10 15 60)" />
                                <ellipse cx="85" cy="60" rx="7" ry="14" fill={getOverlayColor('Tríceps', 'Brazos')} transform="rotate(-10 85 60)" />

                                {/* Glutes */}
                                <path d="M30 85 Q20 100 30 115 L50 115 L50 85 Z" fill={getOverlayColor('Glúteos', 'Piernas')} />
                                <path d="M70 85 Q80 100 70 115 L50 115 L50 85 Z" fill={getOverlayColor('Glúteos', 'Piernas')} />

                                {/* Hamstrings */}
                                <rect x="35" y="115" width="13" height="35" rx="4" fill={getOverlayColor('Isquios', 'Piernas')} />
                                <rect x="52" y="115" width="13" height="35" rx="4" fill={getOverlayColor('Isquios', 'Piernas')} />

                                {/* Calves (Gastrocnemius) */}
                                <ellipse cx="38" cy="165" rx="9" ry="18" fill={getOverlayColor('Gemelos', 'Piernas')} />
                                <ellipse cx="62" cy="165" rx="9" ry="18" fill={getOverlayColor('Gemelos', 'Piernas')} />
                            </svg>
                        </>
                    )}
                </div>
            </div>

            <div className="absolute bottom-4 left-0 w-full text-center">
                <div className="inline-flex gap-2 items-center bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-gray-200 text-xs font-medium uppercase tracking-widest">
                        {view === 'front' ? 'Vista Frontal' : 'Vista Dorsal'}
                    </span>
                </div>
            </div>
        </div>
    );
}
