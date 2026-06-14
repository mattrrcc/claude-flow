export default function ReaperMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
      <path
        d="M24 10c-6.6 0-12 5-12 11.5 0 4 2 7 4.5 9v3.5c0 1 .8 1.5 1.5 1.5h1.5v-2.5h2v2.5h2v-2.5h2v2.5h2v-2.5h1.5c.7 0 1.5-.5 1.5-1.5V30.5c2.5-2 4.5-5 4.5-9C36 15 30.6 10 24 10z"
        fill="currentColor"
      />
      <circle cx="19.5" cy="21" r="2.5" fill="#0b0b0d" />
      <circle cx="28.5" cy="21" r="2.5" fill="#0b0b0d" />
      <path d="M22 26h4l-2 3-2-3z" fill="#0b0b0d" />
    </svg>
  );
}
