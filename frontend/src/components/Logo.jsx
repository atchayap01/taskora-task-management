// A simple, intentional logo mark: a rounded gradient badge containing a
// checklist glyph. Kept as inline SVG so no icon library is needed.
const Logo = ({ size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="logo-mark"
    aria-label="Taskora logo"
  >
    <defs>
      <linearGradient id="taskora-gradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#6366F1" />
        <stop offset="1" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    <rect width="36" height="36" rx="10" fill="url(#taskora-gradient)" />
    <path
      d="M11 18.5L15.2 22.7L25 12.5"
      stroke="white"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Logo;
