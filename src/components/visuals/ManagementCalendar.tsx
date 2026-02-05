'use client';

/**
 * Management Calendar - Visual showing yearly meadow management tasks
 * Illustrative only - shows timing of cutting, leaving standing, and maintenance
 */

export function ManagementCalendar() {
  const months = [
    { name: 'Jan', season: 'winter', task: 'Leave standing', color: '#A09E9C', taskType: 'passive' },
    { name: 'Feb', season: 'winter', task: 'Leave standing', color: '#A09E9C', taskType: 'passive' },
    { name: 'Mar', season: 'spring', task: 'Growth begins', color: '#8BA888', taskType: 'observation' },
    { name: 'Apr', season: 'spring', task: 'Monitor', color: '#8BA888', taskType: 'observation' },
    { name: 'May', season: 'spring', task: 'Early bloom', color: '#8BA888', taskType: 'observation' },
    { name: 'Jun', season: 'summer', task: 'Peak bloom', color: '#C9A66B', taskType: 'observation' },
    { name: 'Jul', season: 'summer', task: 'Setting seed', color: '#C9A66B', taskType: 'observation' },
    { name: 'Aug', season: 'summer', task: 'CUT & REMOVE', color: '#D4A373', taskType: 'action' },
    { name: 'Sep', season: 'autumn', task: 'Recovery', color: '#D4A373', taskType: 'observation' },
    { name: 'Oct', season: 'autumn', task: 'Seed heads form', color: '#D4A373', taskType: 'observation' },
    { name: 'Nov', season: 'autumn', task: 'Leave standing', color: '#A09E9C', taskType: 'passive' },
    { name: 'Dec', season: 'winter', task: 'Leave standing', color: '#A09E9C', taskType: 'passive' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-heading text-lg uppercase tracking-wider text-copper mb-2 font-bold">
          Management Calendar
        </h3>
        <p className="text-xs text-stone/70 uppercase tracking-wider">
          Annual maintenance rhythm for your meadow
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {months.map((month, idx) => (
          <div
            key={idx}
            className={`
              bg-dark/50 border p-4 text-center transition-all
              ${
                month.taskType === 'action'
                  ? 'border-copper/60 shadow-lg shadow-copper/20'
                  : 'border-white/10'
              }
            `}
          >
            <div className="mb-3">
              <span className="font-heading text-sm uppercase tracking-wider text-mist font-bold block mb-1">
                {month.name}
              </span>
              <span
                className="text-xs uppercase tracking-wider"
                style={{ color: month.color }}
              >
                {month.season}
              </span>
            </div>

            <div className="mb-3">
              <svg
                viewBox="0 0 60 50"
                className="w-full"
                style={{ backgroundColor: '#2C2C2C' }}
              >
                {month.taskType === 'action' ? (
                  // Scissors icon for cutting
                  <>
                    <line x1="20" y1="15" x2="35" y2="30" stroke={month.color} strokeWidth="2" />
                    <line x1="25" y1="15" x2="40" y2="30" stroke={month.color} strokeWidth="2" />
                    <circle cx="20" cy="15" r="3" fill={month.color} />
                    <circle cx="40" cy="30" r="3" fill={month.color} />
                  </>
                ) : month.taskType === 'observation' ? (
                  // Grass visualization
                  <>
                    {Array.from({ length: 8 }).map((_, i) => {
                      const x = 10 + i * 6;
                      const height = 15 + Math.random() * 10;
                      return (
                        <line
                          key={i}
                          x1={x}
                          y1={40}
                          x2={x}
                          y2={40 - height}
                          stroke={month.color}
                          strokeWidth="2"
                          opacity="0.7"
                        />
                      );
                    })}
                    {month.season === 'summer' && (
                      <>
                        <circle cx="20" cy="20" r="2" fill="#C9A66B" opacity="0.9" />
                        <circle cx="35" cy="22" r="2" fill="#C9A66B" opacity="0.9" />
                        <circle cx="45" cy="18" r="2" fill="#C9A66B" opacity="0.9" />
                      </>
                    )}
                  </>
                ) : (
                  // Seed heads (winter/passive)
                  <>
                    {Array.from({ length: 5 }).map((_, i) => {
                      const x = 15 + i * 8;
                      return (
                        <g key={i}>
                          <line
                            x1={x}
                            y1={40}
                            x2={x}
                            y2={25}
                            stroke={month.color}
                            strokeWidth="2"
                            opacity="0.6"
                          />
                          <circle
                            cx={x}
                            cy={23}
                            r="2"
                            fill={month.color}
                            opacity="0.8"
                          />
                        </g>
                      );
                    })}
                  </>
                )}
              </svg>
            </div>

            <p
              className={`
                text-xs leading-tight
                ${month.taskType === 'action' ? 'text-copper font-bold' : 'text-stone'}
              `}
            >
              {month.task}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-copper/10 border border-copper/30 p-4">
        <h4 className="font-heading text-xs uppercase tracking-wider text-copper mb-3 font-bold">
          Critical Management Rules
        </h4>
        <ul className="space-y-3 text-xs text-stone">
          <li className="flex items-start gap-2">
            <span className="text-copper font-bold flex-shrink-0">•</span>
            <span>
              <strong className="text-copper">Single annual cut in late August:</strong> After wildflowers have set seed but before autumn growth
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-copper font-bold flex-shrink-0">•</span>
            <span>
              <strong className="text-copper">Always remove cuttings:</strong> Essential for maintaining low fertility. Leaving cuttings enriches soil and encourages grass dominance
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-copper font-bold flex-shrink-0">•</span>
            <span>
              <strong className="text-copper">Leave standing over winter:</strong> Seed heads provide wildlife food and shelter. Cut back in early spring if needed
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-copper font-bold flex-shrink-0">•</span>
            <span>
              <strong className="text-copper">No fertilizer, ever:</strong> Meadows thrive in poor soil. Fertility promotes aggressive grasses at expense of wildflowers
            </span>
          </li>
        </ul>
      </div>

      <div className="bg-moss/10 border border-moss/30 p-4 text-center">
        <p className="text-xs text-stone leading-relaxed">
          <strong className="text-moss">Regional variation:</strong> Timing may shift by 2-3 weeks depending on your location and weather patterns. Observe your meadow and adjust accordingly.
        </p>
      </div>
    </div>
  );
}
