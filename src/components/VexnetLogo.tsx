export const VexnetLogo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        {/* Geometric shapes based on the uploaded logo */}
        <svg width="40" height="32" viewBox="0 0 40 32" fill="none" className="text-vexnet-accent">
          {/* Top triangle */}
          <path 
            d="M20 0 L32 16 L8 16 Z" 
            fill="currentColor" 
            opacity="0.9"
          />
          {/* Left triangle */}
          <path 
            d="M0 8 L16 20 L16 -4 Z" 
            fill="currentColor" 
            opacity="0.7"
            transform="translate(4, 12)"
          />
          {/* Right triangle */}
          <path 
            d="M24 8 L40 20 L24 20 Z" 
            fill="currentColor" 
            opacity="0.7"
            transform="translate(-8, 4)"
          />
          {/* Bottom quarter circle */}
          <path 
            d="M12 20 Q20 28 28 20 L20 20 Z" 
            fill="currentColor" 
            opacity="0.8"
          />
        </svg>
      </div>
      <div>
        <span className="text-xl font-bold text-foreground">Vexnet</span>
        <div className="text-xs text-muted-foreground -mt-1">TELECOM</div>
      </div>
    </div>
  );
};