export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="M.R.A. logo"
    >
      <rect width="40" height="40" rx="8" fill="currentColor" fillOpacity="0.08" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="'Crimson Pro', Georgia, serif"
        fontWeight="700"
        fontSize="13"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        MRA
      </text>
    </svg>
  );
}
