/** Hình ngôi sao răng cưa làm nền cho icon (SVG thuần, dùng được ở mọi nơi). */
export default function Burst({
  points = 14,
  color,
  size = 40,
  inner = 0.82,
  stroke,
  className = "",
  children,
}: {
  points?: number;
  color: string;
  size?: number;
  inner?: number;
  stroke?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const coords: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? 50 : 50 * inner;
    const angle = (Math.PI * i) / points - Math.PI / 2;
    coords.push(`${(50 + r * Math.cos(angle)).toFixed(2)},${(50 + r * Math.sin(angle)).toFixed(2)}`);
  }
  return (
    <span
      className={`${className.includes("absolute") ? "" : "relative"} inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="-2 -2 104 104" className="absolute inset-0 h-full w-full" aria-hidden>
        <polygon points={coords.join(" ")} fill={color} stroke={stroke} strokeWidth={stroke ? 2.5 : 0} strokeLinejoin="round" />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}
