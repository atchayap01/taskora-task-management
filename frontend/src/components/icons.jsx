// Lightweight inline SVG icons. Kept in one file so we don't add an icon
// library dependency - matches the "no unnecessary libraries" requirement.
// All icons accept standard SVG props (className, etc.) via ...props.

export const SearchIcon = (props) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M18 18L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const ListIcon = (props) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="4.5" width="14" height="2" rx="1" fill="currentColor" />
    <rect x="3" y="9" width="14" height="2" rx="1" fill="currentColor" />
    <rect x="3" y="13.5" width="9" height="2" rx="1" fill="currentColor" />
  </svg>
);

export const ClockIcon = (props) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.6" />
    <path d="M10 6V10L12.5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ProgressIcon = (props) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M3 15L7.5 9.5L11 12.5L17 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12.5 5H17V9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckCircleIcon = (props) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.6" />
    <path d="M6.5 10L9 12.5L13.5 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FlameIcon = (props) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M10 2.5C10 2.5 6 6.5 6 10.5C6 13.5 7.8 15.5 10 15.5C12.2 15.5 14 13.5 14 10.5C14 9.2 13.3 8 12.5 7C12.5 8.5 11.8 9 11.2 9C11.6 7.5 11 5.5 9.3 4.3C9.6 5.5 9 6.3 8.3 7C7.5 7.8 7 8.6 7 9.7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
