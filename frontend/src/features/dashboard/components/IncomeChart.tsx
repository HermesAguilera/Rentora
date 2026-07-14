import { useMemo, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import { useIncomeBalance, useIncomeYears } from '../hooks/useDashboardData';
import { formatLempiras } from '../../../utils/currency';
import { MONTH_LABELS_ES, MONTH_LABELS_ES_LONG } from '../../../utils/date';

const CHART_WIDTH = 760;
const CHART_HEIGHT = 220;
const PADDING_X = 12;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 28;

/** Catmull-Rom to cubic-Bezier conversion for a smooth, non-overshooting curve. */
function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return path;
}

export default function IncomeChart() {
  const [yearMenuOpen, setYearMenuOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { data: years } = useIncomeYears();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const year = selectedYear ?? years?.[0] ?? new Date().getFullYear();

  const { data: balance, isPending } = useIncomeBalance(year);

  const points = useMemo(() => {
    if (!balance) return [];
    const values = balance.points.map((p) => p.total);
    const max = Math.max(...values, 1);
    const plotWidth = CHART_WIDTH - PADDING_X * 2;
    const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

    return balance.points.map((p, i) => ({
      x: PADDING_X + (plotWidth * i) / (balance.points.length - 1),
      y: PADDING_TOP + plotHeight - (p.total / max) * plotHeight,
      total: p.total,
      monthIndex: p.monthIndex,
    }));
  }, [balance]);

  const linePath = useMemo(() => buildSmoothPath(points), [points]);
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${CHART_HEIGHT - PADDING_BOTTOM} L ${points[0].x} ${CHART_HEIGHT - PADDING_BOTTOM} Z`
    : '';

  const active = hoverIndex !== null ? points[hoverIndex] : null;

  function handlePointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (!points.length) return;
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * CHART_WIDTH;

    let closest = 0;
    let closestDistance = Infinity;
    points.forEach((point, index) => {
      const distance = Math.abs(point.x - relativeX);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });
    setHoverIndex(closest);
  }

  return (
    <section className="flex flex-1 flex-col gap-4 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
      <div className="flex items-center justify-between">
        <h2 className="font-['Poppins',sans-serif] text-base font-semibold text-[#2b3073]">
          Balance de ingresos {year}
        </h2>

        <div className="relative">
          <button
            type="button"
            onClick={() => setYearMenuOpen((open) => !open)}
            aria-haspopup="listbox"
            aria-expanded={yearMenuOpen}
            className="flex items-center gap-2 rounded-full border border-[#eef0f9] px-4 py-2 font-['Quicksand',sans-serif] text-sm font-medium text-[#2b3073]"
          >
            {year}
            <ChevronDown className="size-4" />
          </button>

          {yearMenuOpen && years && years.length > 0 && (
            <ul
              role="listbox"
              className="absolute right-0 z-10 mt-2 w-24 overflow-hidden rounded-2xl border border-[#eef0f9] bg-white py-1 shadow-lg"
            >
              {years.map((y) => (
                <li key={y}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={y === year}
                    onClick={() => {
                      setSelectedYear(y);
                      setYearMenuOpen(false);
                      setHoverIndex(null);
                    }}
                    className={`w-full px-4 py-2 text-left font-['Quicksand',sans-serif] text-sm ${
                      y === year ? 'bg-[#f4f5fc] font-semibold text-[#2b3073]' : 'text-[#8b899e]'
                    }`}
                  >
                    {y}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="relative">
        {isPending && (
          <div className="h-[220px] w-full animate-pulse rounded-2xl bg-[#f4f5fc]" />
        )}

        {!isPending && points.length > 0 && (
          <>
            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              className="w-full touch-none"
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setHoverIndex(null)}
              role="img"
              aria-label={`Ingresos mensuales de ${year}`}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f2703c" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#f2703c" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path d={areaPath} fill="url(#incomeGradient)" />
              <path d={linePath} fill="none" stroke="#f2703c" strokeWidth={2.5} strokeLinecap="round" />

              {active && (
                <line
                  x1={active.x}
                  x2={active.x}
                  y1={PADDING_TOP}
                  y2={CHART_HEIGHT - PADDING_BOTTOM}
                  stroke="#2b3073"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  opacity={0.35}
                />
              )}

              {points.map((point) => (
                <circle
                  key={point.monthIndex}
                  cx={point.x}
                  cy={point.y}
                  r={hoverIndex === point.monthIndex ? 5 : 0}
                  fill="#f2703c"
                  stroke="white"
                  strokeWidth={2}
                />
              ))}

              {MONTH_LABELS_ES.map((label, i) => (
                <text
                  key={label}
                  x={PADDING_X + ((CHART_WIDTH - PADDING_X * 2) * i) / (MONTH_LABELS_ES.length - 1)}
                  y={CHART_HEIGHT - 6}
                  textAnchor="middle"
                  className="fill-[#8b899e] font-['Quicksand',sans-serif] text-[10px]"
                >
                  {label}
                </text>
              ))}
            </svg>

            {active && (
              <div
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-xl bg-[#2b3073] px-3 py-2 text-center shadow-lg"
                style={{
                  left: `${(active.x / CHART_WIDTH) * 100}%`,
                  top: `${(active.y / CHART_HEIGHT) * 100 - 4}%`,
                }}
              >
                <p className="font-['Poppins',sans-serif] text-sm font-bold text-white">
                  {formatLempiras(active.total)}
                </p>
                <p className="font-['Quicksand',sans-serif] text-[10px] text-white/70">
                  {MONTH_LABELS_ES_LONG[active.monthIndex]} {year}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
