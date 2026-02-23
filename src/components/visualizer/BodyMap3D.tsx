import React, { useEffect, useRef, useState } from 'react';
import type { MuscleGroup } from '../../types';

interface BodyMap3DProps {
    primaryMuscles: MuscleGroup[];
    secondaryMuscles?: MuscleGroup[];
}

// Maps each MuscleGroup to SVG element IDs (f- = front, b- = back)
const MUSCLE_IDS: Partial<Record<MuscleGroup, string[]>> = {
    'Pecho': ['f-pec-l', 'f-pec-r'],
    'Espalda': ['b-lat-l', 'b-lat-r', 'b-rhom', 'b-infra-l', 'b-infra-r', 'b-teres-l', 'b-teres-r'],
    'Hombros': ['f-delt-l', 'f-delt-r', 'b-delt-l', 'b-delt-r'],
    'Brazos': ['f-bic-l', 'f-bic-r', 'b-tri-l', 'b-tri-r', 'f-fore-l', 'f-fore-r', 'b-fore-l', 'b-fore-r'],
    'Core': ['f-abs', 'f-obl-l', 'f-obl-r'],
    'Piernas': ['f-vl-l', 'f-vl-r', 'f-rf-l', 'f-rf-r', 'f-vm-l', 'f-vm-r', 'b-ham-l', 'b-ham-r', 'b-bf-l', 'b-bf-r', 'b-glute-l', 'b-glute-r', 'f-tib-l', 'f-tib-r', 'b-gas-l', 'b-gas-r'],
    'Bíceps': ['f-bic-l', 'f-bic-r'],
    'Tríceps': ['b-tri-l', 'b-tri-r'],
    'Cuádriceps': ['f-vl-l', 'f-vl-r', 'f-rf-l', 'f-rf-r', 'f-vm-l', 'f-vm-r'],
    'Isquios': ['b-ham-l', 'b-ham-r', 'b-bf-l', 'b-bf-r'],
    'Glúteos': ['b-glute-l', 'b-glute-r', 'b-gmed-l', 'b-gmed-r'],
    'Gemelos': ['b-gas-l', 'b-gas-r', 'b-sol-l', 'b-sol-r'],
    'Dorsales': ['b-lat-l', 'b-lat-r'],
    'Trapecios': ['b-trap', 'f-trap-l', 'f-trap-r'],
    'Full Body': [],
    'Cardio': [],
};

const GROUP_COLOR: Partial<Record<MuscleGroup, string>> = {
    'Pecho': '#ef4444', 'Espalda': '#3b82f6', 'Hombros': '#a855f7',
    'Brazos': '#f97316', 'Core': '#eab308', 'Piernas': '#10b981',
    'Bíceps': '#f97316', 'Tríceps': '#fb923c', 'Cuádriceps': '#06b6d4',
    'Isquios': '#6366f1', 'Glúteos': '#84cc16', 'Gemelos': '#14b8a6',
    'Dorsales': '#60a5fa', 'Trapecios': '#c084fc',
    'Full Body': '#ef4444', 'Cardio': '#ef4444',
};

// ─────────────────────────────────────────────
//  FRONT BODY SVG
// ─────────────────────────────────────────────
const FrontBody = ({ ms }: { ms: (id: string) => React.CSSProperties }) => (
    <svg viewBox="0 0 220 520" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
            <radialGradient id="skin-grad-f" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#e8cba8" />
                <stop offset="100%" stopColor="#c9a87a" />
            </radialGradient>
        </defs>

        {/* ── Body silhouette (skin base) ── */}
        {/* Head */}
        <ellipse cx="110" cy="40" rx="26" ry="28" fill="url(#skin-grad-f)" stroke="#b8936a" strokeWidth="0.8" />
        {/* Neck */}
        <path d="M 100 68 Q 98 76 97 90 Q 103 93 110 93 Q 117 93 123 90 Q 122 76 120 68 Q 115 66 110 66 Q 105 66 100 68 Z" fill="url(#skin-grad-f)" stroke="#b8936a" strokeWidth="0.5" />
        {/* Torso */}
        <path d="M 68 96 Q 56 100 50 116 L 48 200 Q 50 220 56 236 L 72 246 L 72 278 L 148 278 L 148 246 L 164 236 Q 170 220 172 200 L 170 116 Q 164 100 152 96 Q 136 90 110 88 Q 84 90 68 96 Z" fill="url(#skin-grad-f)" stroke="#b8936a" strokeWidth="0.8" />
        {/* Left upper arm */}
        <path d="M 50 106 Q 38 120 35 155 Q 33 180 36 200 Q 44 205 54 200 Q 60 178 62 152 Q 64 120 56 106 Z" fill="url(#skin-grad-f)" stroke="#b8936a" strokeWidth="0.6" />
        {/* Left forearm */}
        <path d="M 36 202 Q 28 225 28 252 Q 34 258 44 256 Q 50 225 52 202 Z" fill="url(#skin-grad-f)" stroke="#b8936a" strokeWidth="0.6" />
        {/* Right upper arm */}
        <path d="M 170 106 Q 182 120 185 155 Q 187 180 184 200 Q 176 205 166 200 Q 160 178 158 152 Q 156 120 164 106 Z" fill="url(#skin-grad-f)" stroke="#b8936a" strokeWidth="0.6" />
        {/* Right forearm */}
        <path d="M 184 202 Q 192 225 192 252 Q 186 258 176 256 Q 170 225 168 202 Z" fill="url(#skin-grad-f)" stroke="#b8936a" strokeWidth="0.6" />
        {/* Left thigh */}
        <path d="M 72 278 Q 64 310 66 356 Q 72 372 84 370 Q 96 368 100 352 Q 100 308 98 278 Z" fill="url(#skin-grad-f)" stroke="#b8936a" strokeWidth="0.6" />
        {/* Right thigh */}
        <path d="M 148 278 Q 156 310 154 356 Q 148 372 136 370 Q 124 368 120 352 Q 120 308 122 278 Z" fill="url(#skin-grad-f)" stroke="#b8936a" strokeWidth="0.6" />
        {/* Left shin */}
        <path d="M 70 372 Q 66 408 70 448 Q 76 458 85 456 Q 94 454 96 444 Q 98 408 94 372 Z" fill="url(#skin-grad-f)" stroke="#b8936a" strokeWidth="0.6" />
        {/* Right shin */}
        <path d="M 150 372 Q 154 408 150 448 Q 144 458 135 456 Q 126 454 124 444 Q 122 408 126 372 Z" fill="url(#skin-grad-f)" stroke="#b8936a" strokeWidth="0.6" />

        {/* ── Muscles FRONT ── */}

        {/* TRAPECIOS (front visible slope) */}
        <path id="f-trap-l" style={ms('f-trap-l')} d="M 100 76 Q 86 80 70 92 Q 66 96 70 100 Q 80 98 90 94 Q 97 88 100 82 Z" />
        <path id="f-trap-r" style={ms('f-trap-r')} d="M 120 76 Q 134 80 150 92 Q 154 96 150 100 Q 140 98 130 94 Q 123 88 120 82 Z" />

        {/* DELTOIDES anterior */}
        <path id="f-delt-l" style={ms('f-delt-l')} d="M 55 98 Q 44 106 42 124 Q 44 134 54 136 Q 63 128 66 114 Q 66 104 60 98 Z" />
        <path id="f-delt-r" style={ms('f-delt-r')} d="M 165 98 Q 176 106 178 124 Q 176 134 166 136 Q 157 128 154 114 Q 154 104 160 98 Z" />

        {/* PECTORALES */}
        <path id="f-pec-l" style={ms('f-pec-l')} d="M 70 100 Q 58 110 60 138 Q 68 148 88 146 Q 100 144 102 132 Q 100 112 84 106 Z" />
        <path id="f-pec-r" style={ms('f-pec-r')} d="M 150 100 Q 162 110 160 138 Q 152 148 132 146 Q 120 144 118 132 Q 120 112 136 106 Z" />

        {/* BICEPS */}
        <path id="f-bic-l" style={ms('f-bic-l')} d="M 43 128 Q 35 150 36 180 Q 43 186 53 182 Q 59 158 58 130 Z" />
        <path id="f-bic-r" style={ms('f-bic-r')} d="M 177 128 Q 185 150 184 180 Q 177 186 167 182 Q 161 158 162 130 Z" />

        {/* ANTEBRAZO (front) */}
        <path id="f-fore-l" style={ms('f-fore-l')} d="M 37 184 Q 29 214 29 248 Q 37 255 46 252 Q 51 218 51 184 Z" />
        <path id="f-fore-r" style={ms('f-fore-r')} d="M 183 184 Q 191 214 191 248 Q 183 255 174 252 Q 169 218 169 184 Z" />

        {/* ABDOMINALES (recto) */}
        <path id="f-abs" style={ms('f-abs')} d="M 92 148 Q 90 175 90 205 Q 96 214 110 214 Q 124 214 130 205 Q 130 175 128 148 Q 120 144 110 143 Q 100 144 92 148 Z" />

        {/* OBLICUOS */}
        <path id="f-obl-l" style={ms('f-obl-l')} d="M 66 142 Q 56 165 58 198 Q 66 212 78 210 Q 88 204 90 182 Q 90 160 76 144 Z" />
        <path id="f-obl-r" style={ms('f-obl-r')} d="M 154 142 Q 164 165 162 198 Q 154 212 142 210 Q 132 204 130 182 Q 130 160 144 144 Z" />

        {/* CUÁDRICEPS – vastus lateralis */}
        <path id="f-vl-l" style={ms('f-vl-l')} d="M 72 282 Q 62 318 64 355 Q 72 366 80 362 Q 84 338 82 298 Q 80 284 74 282 Z" />
        <path id="f-vl-r" style={ms('f-vl-r')} d="M 148 282 Q 158 318 156 355 Q 148 366 140 362 Q 136 338 138 298 Q 140 284 146 282 Z" />

        {/* CUÁDRICEPS – recto femoral */}
        <path id="f-rf-l" style={ms('f-rf-l')} d="M 82 280 Q 78 316 80 355 Q 86 364 94 360 Q 98 320 96 280 Z" />
        <path id="f-rf-r" style={ms('f-rf-r')} d="M 138 280 Q 142 316 140 355 Q 134 364 126 360 Q 122 320 124 280 Z" />

        {/* CUÁDRICEPS – vastus medialis (teardrop) */}
        <path id="f-vm-l" style={ms('f-vm-l')} d="M 92 334 Q 85 352 88 368 Q 97 372 104 365 Q 108 348 100 334 Z" />
        <path id="f-vm-r" style={ms('f-vm-r')} d="M 128 334 Q 135 352 132 368 Q 123 372 116 365 Q 112 348 120 334 Z" />

        {/* TIBIALIS anterior */}
        <path id="f-tib-l" style={ms('f-tib-l')} d="M 74 374 Q 68 406 72 444 Q 79 450 86 446 Q 90 408 88 374 Z" />
        <path id="f-tib-r" style={ms('f-tib-r')} d="M 146 374 Q 152 406 148 444 Q 141 450 134 446 Q 130 408 132 374 Z" />
    </svg>
);

// ─────────────────────────────────────────────
//  BACK BODY SVG
// ─────────────────────────────────────────────
const BackBody = ({ ms }: { ms: (id: string) => React.CSSProperties }) => (
    <svg viewBox="0 0 220 520" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ transform: 'scaleX(-1)' }}>
        <defs>
            <radialGradient id="skin-grad-b" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#e0c09a" />
                <stop offset="100%" stopColor="#c09870" />
            </radialGradient>
        </defs>

        {/* ── Body silhouette (skin base) ── */}
        <ellipse cx="110" cy="40" rx="26" ry="28" fill="url(#skin-grad-b)" stroke="#b8936a" strokeWidth="0.8" />
        <path d="M 100 68 Q 98 76 97 90 Q 103 93 110 93 Q 117 93 123 90 Q 122 76 120 68 Q 115 66 110 66 Q 105 66 100 68 Z" fill="url(#skin-grad-b)" stroke="#b8936a" strokeWidth="0.5" />
        <path d="M 68 96 Q 56 100 50 116 L 48 200 Q 50 220 56 236 L 72 246 L 72 278 L 148 278 L 148 246 L 164 236 Q 170 220 172 200 L 170 116 Q 164 100 152 96 Q 136 90 110 88 Q 84 90 68 96 Z" fill="url(#skin-grad-b)" stroke="#b8936a" strokeWidth="0.8" />
        <path d="M 50 106 Q 38 120 35 155 Q 33 180 36 200 Q 44 205 54 200 Q 60 178 62 152 Q 64 120 56 106 Z" fill="url(#skin-grad-b)" stroke="#b8936a" strokeWidth="0.6" />
        <path d="M 36 202 Q 28 225 28 252 Q 34 258 44 256 Q 50 225 52 202 Z" fill="url(#skin-grad-b)" stroke="#b8936a" strokeWidth="0.6" />
        <path d="M 170 106 Q 182 120 185 155 Q 187 180 184 200 Q 176 205 166 200 Q 160 178 158 152 Q 156 120 164 106 Z" fill="url(#skin-grad-b)" stroke="#b8936a" strokeWidth="0.6" />
        <path d="M 184 202 Q 192 225 192 252 Q 186 258 176 256 Q 170 225 168 202 Z" fill="url(#skin-grad-b)" stroke="#b8936a" strokeWidth="0.6" />
        <path d="M 72 278 Q 64 310 66 356 Q 72 372 84 370 Q 96 368 100 352 Q 100 308 98 278 Z" fill="url(#skin-grad-b)" stroke="#b8936a" strokeWidth="0.6" />
        <path d="M 148 278 Q 156 310 154 356 Q 148 372 136 370 Q 124 368 120 352 Q 120 308 122 278 Z" fill="url(#skin-grad-b)" stroke="#b8936a" strokeWidth="0.6" />
        <path d="M 70 372 Q 66 408 70 448 Q 76 458 85 456 Q 94 454 96 444 Q 98 408 94 372 Z" fill="url(#skin-grad-b)" stroke="#b8936a" strokeWidth="0.6" />
        <path d="M 150 372 Q 154 408 150 448 Q 144 458 135 456 Q 126 454 124 444 Q 122 408 126 372 Z" fill="url(#skin-grad-b)" stroke="#b8936a" strokeWidth="0.6" />

        {/* ── Muscles BACK ── */}

        {/* TRAPECIOS */}
        <path id="b-trap" style={ms('b-trap')} d="M 84 74 Q 62 82 54 98 Q 55 112 68 120 Q 80 124 100 122 Q 120 124 132 120 Q 145 112 146 98 Q 138 82 116 74 L 110 68 Z" />

        {/* DELTOIDES posterior */}
        <path id="b-delt-l" style={ms('b-delt-l')} d="M 50 98 Q 40 108 40 126 Q 43 136 54 136 Q 64 128 66 114 Q 65 102 58 98 Z" />
        <path id="b-delt-r" style={ms('b-delt-r')} d="M 170 98 Q 180 108 180 126 Q 177 136 166 136 Q 156 128 154 114 Q 155 102 162 98 Z" />

        {/* DORSAL ANCHO (latissimus) */}
        <path id="b-lat-l" style={ms('b-lat-l')} d="M 62 120 Q 50 150 52 192 Q 58 212 72 214 Q 84 210 88 188 Q 90 162 82 132 Q 76 120 66 120 Z" />
        <path id="b-lat-r" style={ms('b-lat-r')} d="M 158 120 Q 170 150 168 192 Q 162 212 148 214 Q 136 210 132 188 Q 130 162 138 132 Q 144 120 154 120 Z" />

        {/* ROMBOIDES */}
        <path id="b-rhom" style={ms('b-rhom')} d="M 82 126 Q 76 144 80 162 Q 90 166 110 164 Q 130 166 140 162 Q 144 144 138 126 Q 124 120 110 118 Q 96 120 82 126 Z" />

        {/* INFRAESPINOSO */}
        <path id="b-infra-l" style={ms('b-infra-l')} d="M 64 122 Q 58 138 62 154 Q 70 160 82 155 Q 90 145 86 125 Q 78 118 68 120 Z" />
        <path id="b-infra-r" style={ms('b-infra-r')} d="M 156 122 Q 162 138 158 154 Q 150 160 138 155 Q 130 145 134 125 Q 142 118 152 120 Z" />

        {/* TERES MAJOR */}
        <path id="b-teres-l" style={ms('b-teres-l')} d="M 60 152 Q 55 168 60 184 Q 68 188 78 182 Q 84 168 80 152 Z" />
        <path id="b-teres-r" style={ms('b-teres-r')} d="M 160 152 Q 165 168 160 184 Q 152 188 142 182 Q 136 168 140 152 Z" />

        {/* TRÍCEPS */}
        <path id="b-tri-l" style={ms('b-tri-l')} d="M 42 120 Q 34 148 36 182 Q 43 188 53 184 Q 60 155 58 122 Z" />
        <path id="b-tri-r" style={ms('b-tri-r')} d="M 178 120 Q 186 148 184 182 Q 177 188 167 184 Q 160 155 162 122 Z" />

        {/* ANTEBRAZO (back) */}
        <path id="b-fore-l" style={ms('b-fore-l')} d="M 37 184 Q 29 214 29 248 Q 37 255 46 252 Q 51 218 51 184 Z" />
        <path id="b-fore-r" style={ms('b-fore-r')} d="M 183 184 Q 191 214 191 248 Q 183 255 174 252 Q 169 218 169 184 Z" />

        {/* GLUTEO MAYOR */}
        <path id="b-glute-l" style={ms('b-glute-l')} d="M 70 256 Q 60 276 63 304 Q 74 314 90 308 Q 100 295 100 272 Q 98 256 88 254 Z" />
        <path id="b-glute-r" style={ms('b-glute-r')} d="M 150 256 Q 160 276 157 304 Q 146 314 130 308 Q 120 295 120 272 Q 122 256 132 254 Z" />

        {/* GLUTEO MEDIO */}
        <path id="b-gmed-l" style={ms('b-gmed-l')} d="M 68 244 Q 60 256 64 270 Q 74 276 86 268 Q 92 256 88 244 Z" />
        <path id="b-gmed-r" style={ms('b-gmed-r')} d="M 152 244 Q 160 256 156 270 Q 146 276 134 268 Q 128 256 132 244 Z" />

        {/* ISQUIOTIBIALES – bíceps femoral */}
        <path id="b-bf-l" style={ms('b-bf-l')} d="M 86 308 Q 80 340 82 366 Q 90 374 98 368 Q 103 338 100 308 Z" />
        <path id="b-bf-r" style={ms('b-bf-r')} d="M 134 308 Q 140 340 138 366 Q 130 374 122 368 Q 117 338 120 308 Z" />

        {/* ISQUIOTIBIALES – semitendinoso */}
        <path id="b-ham-l" style={ms('b-ham-l')} d="M 74 308 Q 68 340 72 366 Q 80 372 87 366 Q 88 338 86 308 Z" />
        <path id="b-ham-r" style={ms('b-ham-r')} d="M 146 308 Q 152 340 148 366 Q 140 372 133 366 Q 132 338 134 308 Z" />

        {/* GEMELOS – gastrocnemio medial */}
        <path id="b-gas-l" style={ms('b-gas-l')} d="M 73 370 Q 65 402 69 436 Q 77 444 85 440 Q 89 406 86 370 Z" />
        <path id="b-gas-r" style={ms('b-gas-r')} d="M 147 370 Q 155 402 151 436 Q 143 444 135 440 Q 131 406 134 370 Z" />

        {/* SÓLEO */}
        <path id="b-sol-l" style={ms('b-sol-l')} d="M 84 374 Q 88 406 88 440 Q 94 446 99 442 Q 100 408 96 374 Z" />
        <path id="b-sol-r" style={ms('b-sol-r')} d="M 136 374 Q 132 406 132 440 Q 126 446 121 442 Q 120 408 124 374 Z" />
    </svg>
);

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────
export function BodyMap3D({ primaryMuscles, secondaryMuscles = [] }: BodyMap3DProps) {
    const [angle, setAngle] = useState(0);
    const [isRotating, setIsRotating] = useState(true);
    const angleRef = useRef(0);
    const lastTimeRef = useRef(0);
    const rafRef = useRef<number>(null!);
    const isRotatingRef = useRef(isRotating);
    isRotatingRef.current = isRotating;

    useEffect(() => {
        const animate = (now: number) => {
            if (lastTimeRef.current === 0) lastTimeRef.current = now;
            const delta = now - lastTimeRef.current;
            lastTimeRef.current = now;
            if (isRotatingRef.current) {
                angleRef.current = (angleRef.current + delta * 0.035) % 360;
                setAngle(angleRef.current);
            }
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, []);

    // Build active muscle ID sets
    const primaryIds = new Set<string>();
    const secondaryIds = new Set<string>();

    const isFullBody = primaryMuscles.includes('Full Body');
    if (isFullBody) {
        Object.values(MUSCLE_IDS).flat().forEach(id => primaryIds.add(id));
    } else {
        for (const group of primaryMuscles) {
            (MUSCLE_IDS[group] ?? []).forEach(id => primaryIds.add(id));
        }
        for (const group of secondaryMuscles) {
            (MUSCLE_IDS[group] ?? []).forEach(id => {
                if (!primaryIds.has(id)) secondaryIds.add(id);
            });
        }
    }

    // Style calculator: primary = vivid + glow, secondary = dimmer no-glow
    const ms = (id: string): React.CSSProperties => {
        if (primaryIds.has(id)) {
            let color = '#ef4444';
            for (const [group, ids] of Object.entries(MUSCLE_IDS)) {
                if (ids?.includes(id)) { color = GROUP_COLOR[group as MuscleGroup] ?? '#ef4444'; break; }
            }
            return {
                fill: color + 'cc',
                stroke: color,
                strokeWidth: 1.2,
                filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 3px ${color})`,
            };
        }
        if (secondaryIds.has(id)) {
            let color = '#ef4444';
            for (const [group, ids] of Object.entries(MUSCLE_IDS)) {
                if (ids?.includes(id)) { color = GROUP_COLOR[group as MuscleGroup] ?? '#ef4444'; break; }
            }
            return {
                fill: color + '55',
                stroke: color + '88',
                strokeWidth: 0.8,
            };
        }
        return { fill: 'rgba(180,160,140,0.18)', stroke: 'rgba(180,150,120,0.30)', strokeWidth: 0.4 };
    };

    const isFront = angle < 90 || angle > 270;
    const allActive = [...primaryMuscles, ...secondaryMuscles].filter(g => g !== 'Cardio' && g !== 'Full Body');

    return (
        <div
            className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-800 relative cursor-pointer select-none"
            style={{ background: 'radial-gradient(ellipse at center, #0d0d1a 0%, #050508 100%)' }}
            onClick={() => setIsRotating(r => !r)}
        >
            {/* Header */}
            <div className="absolute top-4 left-4 z-20 flex gap-2 items-center pointer-events-none">
                <span className="bg-black/60 backdrop-blur px-3 py-1 rounded-lg border border-indigo-700/60 text-xs text-indigo-300 font-bold uppercase tracking-wider">
                    Vista Muscular 3D
                </span>
                {!isRotating && (
                    <span className="bg-black/60 backdrop-blur px-2 py-1 rounded-lg border border-yellow-700/60 text-xs text-yellow-400">⏸</span>
                )}
            </div>

            {/* View label */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
                <span className="bg-black/50 backdrop-blur px-3 py-1 rounded-lg border border-gray-700 text-xs text-gray-400 uppercase tracking-widest">
                    {isFront ? 'Vista Frontal' : 'Vista Dorsal'}
                </span>
            </div>

            {/* Active muscles legend */}
            {allActive.length > 0 && (
                <div className="absolute bottom-12 right-4 z-20 flex flex-col gap-1 pointer-events-none">
                    {primaryMuscles.filter(g => g !== 'Cardio' && g !== 'Full Body').map(group => (
                        <span key={group} className="flex items-center gap-1.5 bg-black/70 backdrop-blur px-2 py-1 rounded-md border border-gray-700/60 text-xs text-white">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: GROUP_COLOR[group] ?? '#888' }} />
                            {group}
                        </span>
                    ))}
                    {secondaryMuscles.filter(g => g !== 'Cardio').map(group => (
                        <span key={group} className="flex items-center gap-1.5 bg-black/70 backdrop-blur px-2 py-0.5 rounded-md border border-gray-600/40 text-xs text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-60" style={{ backgroundColor: GROUP_COLOR[group] ?? '#888' }} />
                            {group} <span className="text-[10px] opacity-50">(sec.)</span>
                        </span>
                    ))}
                </div>
            )}

            {/* 3D Rotation Stage */}
            <div className="w-full h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
                <div
                    style={{
                        width: '220px',
                        height: '510px',
                        position: 'relative',
                        transformStyle: 'preserve-3d',
                        transform: `rotateY(${angle}deg)`,
                    }}
                >
                    {/* FRONT FACE */}
                    <div style={{
                        position: 'absolute', width: '100%', height: '100%',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                    }}>
                        <FrontBody ms={ms} />
                    </div>

                    {/* BACK FACE */}
                    <div style={{
                        position: 'absolute', width: '100%', height: '100%',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}>
                        <BackBody ms={ms} />
                    </div>
                </div>
            </div>

            {/* Footer hint */}
            <div className="absolute bottom-3 w-full text-center pointer-events-none">
                <p className="text-gray-600 text-xs">Clic para pausar · Rota 360° automáticamente</p>
            </div>
        </div>
    );
}
