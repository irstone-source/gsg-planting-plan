'use client';

/**
 * Meadow Phase Timeline - Visual diagram showing 3-year establishment
 * Illustrative only - shows structure and density progression
 */

export function MeadowPhaseTimeline() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-heading text-lg uppercase tracking-wider text-copper mb-2 font-bold">
          3-Year Establishment Timeline
        </h3>
        <p className="text-xs text-stone/70 uppercase tracking-wider">
          Illustrative diagram — actual meadow varies by site
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Year 1 */}
        <div className="bg-dark/50 border border-white/10 p-4">
          <div className="mb-3 text-center">
            <span className="px-3 py-1 bg-copper/20 border border-copper/30 text-copper text-xs uppercase tracking-wider font-bold">
              Year 1
            </span>
            <p className="text-xs text-stone mt-2">Establishment</p>
          </div>

          <svg
            viewBox="0 0 200 150"
            className="w-full"
            style={{ backgroundColor: '#2C2C2C' }}
          >
            {/* Sparse grass blades - low density */}
            {Array.from({ length: 15 }).map((_, i) => {
              const x = 20 + (i % 5) * 35;
              const y = 120 - (Math.floor(i / 5) * 20);
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={y}
                    x2={x}
                    y2={y - 25}
                    stroke="#8BA888"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                </g>
              );
            })}
            {/* Few small wildflower dots */}
            <circle cx="50" cy="100" r="3" fill="#C9A66B" opacity="0.7" />
            <circle cx="120" cy="90" r="3" fill="#C9A66B" opacity="0.7" />
            <circle cx="160" cy="105" r="3" fill="#C9A66B" opacity="0.7" />
          </svg>

          <p className="text-xs text-stone mt-3 leading-relaxed">
            Sparse, mostly green. Regular cutting controls grass vigor. This is correct.
          </p>
        </div>

        {/* Year 2 */}
        <div className="bg-dark/50 border border-white/10 p-4">
          <div className="mb-3 text-center">
            <span className="px-3 py-1 bg-moss/20 border border-moss/30 text-moss text-xs uppercase tracking-wider font-bold">
              Year 2
            </span>
            <p className="text-xs text-stone mt-2">Diversity Emerges</p>
          </div>

          <svg
            viewBox="0 0 200 150"
            className="w-full"
            style={{ backgroundColor: '#2C2C2C' }}
          >
            {/* Medium density grass */}
            {Array.from({ length: 30 }).map((_, i) => {
              const x = 15 + (i % 10) * 18;
              const y = 130 - (Math.floor(i / 10) * 25);
              return (
                <line
                  key={i}
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={y - 30}
                  stroke="#8BA888"
                  strokeWidth="2"
                  opacity="0.7"
                />
              );
            })}
            {/* More wildflowers */}
            <circle cx="40" cy="95" r="4" fill="#C9A66B" opacity="0.9" />
            <circle cx="80" cy="85" r="4" fill="#D4A373" opacity="0.9" />
            <circle cx="120" cy="100" r="4" fill="#C9A66B" opacity="0.9" />
            <circle cx="160" cy="90" r="4" fill="#D4A373" opacity="0.9" />
            <circle cx="100" cy="75" r="4" fill="#C9A66B" opacity="0.9" />
          </svg>

          <p className="text-xs text-stone mt-3 leading-relaxed">
            Wildflowers bloom, meadow character develops, balance emerges.
          </p>
        </div>

        {/* Year 3 */}
        <div className="bg-dark/50 border border-white/10 p-4">
          <div className="mb-3 text-center">
            <span className="px-3 py-1 bg-moss/30 border border-moss/50 text-moss text-xs uppercase tracking-wider font-bold">
              Year 3+
            </span>
            <p className="text-xs text-stone mt-2">Mature Meadow</p>
          </div>

          <svg
            viewBox="0 0 200 150"
            className="w-full"
            style={{ backgroundColor: '#2C2C2C' }}
          >
            {/* Dense grass matrix */}
            {Array.from({ length: 50 }).map((_, i) => {
              const x = 10 + (i % 10) * 18;
              const y = 135 - (Math.floor(i / 10) * 15);
              return (
                <line
                  key={i}
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={y - 35}
                  stroke="#8BA888"
                  strokeWidth="2"
                  opacity="0.8"
                />
              );
            })}
            {/* Rich wildflower display */}
            {[
              [30, 90],
              [60, 95],
              [90, 80],
              [120, 105],
              [150, 85],
              [180, 100],
              [50, 70],
              [110, 95],
              [140, 75]
            ].map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="5"
                fill={i % 2 === 0 ? '#C9A66B' : '#D4A373'}
                opacity="0.95"
              />
            ))}
          </svg>

          <p className="text-xs text-stone mt-3 leading-relaxed">
            Balanced ecosystem. Peak biodiversity and beauty. Self-sustaining.
          </p>
        </div>
      </div>

      <div className="bg-copper/10 border border-copper/30 p-4 text-center">
        <p className="text-xs text-stone leading-relaxed">
          <strong className="text-copper">Remember:</strong> This diagram shows structure
          and density progression. Your actual meadow will vary based on local conditions,
          weather, and natural variation. Trust the process.
        </p>
      </div>
    </div>
  );
}
