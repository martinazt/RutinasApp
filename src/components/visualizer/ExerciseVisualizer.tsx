interface ExerciseVisualizerProps {
    videoUrl?: string;
    name: string;
}

export function ExerciseVisualizer({ videoUrl, name }: ExerciseVisualizerProps) {
    if (!videoUrl) return null;

    return (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-gray-800">
            <img
                src={videoUrl}
                alt={name}
                className="w-full h-full object-cover"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <p className="text-white font-medium">{name}</p>
            </div>
        </div>
    );
}
