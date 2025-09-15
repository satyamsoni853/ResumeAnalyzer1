import * as React from 'react';

const ScoreCircle = ({ score = 75, size = 100 }: { score: number; size?: number }) => {
    const id = React.useId();
    const radius = 40;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = Math.max(0, Math.min(1, score / 100));
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 100 100"
                className="transform -rotate-90"
            >
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="#3a3a3a"
                    strokeWidth={stroke}
                    fill="transparent"
                />
                <defs>
                    <linearGradient id={`grad-${id}`} x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FDBA74" />
                        <stop offset="100%" stopColor="#EA580C" />
                    </linearGradient>
                </defs>
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke={`url(#grad-${id})`}
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-semibold text-sm">{`${Math.round(progress * 100)}/100`}</span>
            </div>
        </div>
    );
};

export default ScoreCircle;
