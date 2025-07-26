import logoVexnet from "@/assets/vexnet-logo-branco.png";

export const VexnetLogo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src={logoVexnet} 
        alt="Vexnet Logo" 
        className="h-8 w-auto"
      />
    </div>
  );
};