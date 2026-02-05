'use client';

/**
 * Seasonal Progression - Visual showing meadow across 12 months
 * Illustrative only - shows timing and color shifts
 */

export function SeasonalProgression() {
  const seasons = [
    {
      name: 'Spring',
      months: 'Mar-May',
      color: '#8BA888',
      description: 'Fresh growth, early wildflowers emerge',
      height: '30%',
      flowers: 3
    },
    {
      name: 'Summer',
      months: 'Jun-Aug',
      color: '#C9A66B',
      description: 'Peak bloom, maximum color and biodiversity',
      height: '90%',
      flowers: 12
    },
    {
      name: 'Autumn',
      months: 'Sep-Nov',
      color: '#D4A373',
      description: 'Seed heads form, cut in late August, wildlife activity',
      height: '50%',
      flowers: 5
    },
    {
      name: 'Winter',
      months: 'Dec-Feb',
      color: '#A09E9C',
      description: 'Structure visible, seed heads stand, wildlife shelter',
      height: '35%',
      flowers: 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-heading text-lg uppercase tracking-wider text-copper mb-2 font-bold">
          Seasonal Progression
        </h3>
        <p className="text-xs text-stone/70 uppercase tracking-wider">
          What your meadow looks like across 12 months
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {seasons.map((season, idx) => (
          <div key={idx} className="bg-dark/50 border border-white/10 p-4">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading text-sm uppercase tracking-wider text-mist font-bold">
                  {season.name}
                </span>
                <span className="text-xs text-stone/70">
                  {season.months}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <svg
                viewBox="0 0 100 120"
                className="w-full"
                style={{ backgroundColor: '#2C2C2C' }}
              >
                {/* Grass base */}
                {Array.from({ length: 15 }).map((_, i) => {
                  const x = 8 + i * 6;
                  const baseHeight = parseInt(season.height);
                  const height = baseHeight + (Math.random() - 0.5) * 15;
                  return (
                    <line
                      key={i}
                      x1={x}
                      y1={110}
                      x2={x}
                      y2={110 - height}
                      stroke={season.color}
                      strokeWidth="2"
                      opacity="0.7"
                    />
                  );
                })}

                {/* Flowers */}
                {Array.from({ length: season.flowers }).map((_, i) => {
                  const x = 15 + (i * 70) / Math.max(season.flowers, 1);
                  const y = 90 - Math.random() * 30;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3"
                      fill="#C9A66B"
                      opacity="0.8"
                    />
                  );
                })}
              </svg>
            </div>

            <p className="text-xs text-stone leading-relaxed">
              {season.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-moss/10 border border-moss/30 p-4">
        <h4 className="font-heading text-xs uppercase tracking-wider text-moss mb-2 font-bold">
          Key Seasonal Notes
        </h4>
        <ul className="space-y-2 text-xs text-stone">
          <li className="flex items-start gap-2">
            <span className="text-moss">•</span>
            <span>
              <strong>Late summer cut (August):</strong> After wildflowers have set seed
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-moss">•</span>
            <span>
              <strong>Leave standing over winter:</strong> Seed heads provide wildlife food and shelter
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-moss">•</span>
            <span>
              <strong>Remove cuttings:</strong> Maintains low fertility, prevents grass dominance
            </span>
          </li>
        </ul>
      </div>

      <div className="bg-copper/10 border border-copper/30 p-4 text-center">
        <p className="text-xs text-stone leading-relaxed">
          <strong className="text-copper">Illustrative only:</strong> Actual bloom timing
          varies by postcode, weather, and local conditions. Your meadow will develop its own rhythm.
        </p>
      </div>
    </div>
  );
}
