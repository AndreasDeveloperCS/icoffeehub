export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  // Concept A from the brand book: a coffee cup whose rising steam traces a globe line.
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="24" cy="18" r="9" stroke="#C9A227" strokeWidth="2" />
      <path d="M15 18a9 9 0 0 1 18 0" stroke="#C9A227" strokeWidth="2" strokeOpacity="0.4" />
      <path
        d="M13 24h20l-1.6 12.2A4 4 0 0 1 27.4 40H18.6a4 4 0 0 1-3.98-3.8L13 24Z"
        fill="#3E2723"
      />
      <path
        d="M33 26h2.5a4 4 0 0 1 0 8H32.6"
        stroke="#3E2723"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M24 24v-2" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LogoWordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="font-heading text-lg font-bold tracking-tight text-espresso-800">
        iCoffee<span className="text-gold-600">Hub</span>
      </span>
    </span>
  );
}
