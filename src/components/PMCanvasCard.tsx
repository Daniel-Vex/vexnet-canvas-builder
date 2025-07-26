import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface PMCanvasCardProps {
  title: string;
  number: number;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  rows?: number;
}

export const PMCanvasCard = ({ 
  title, 
  number, 
  icon, 
  value, 
  onChange, 
  className,
  rows = 4 
}: PMCanvasCardProps) => {
  return (
    <Card className={cn(
      "bg-gradient-card border-border/20 shadow-lg hover:shadow-xl transition-all duration-300",
      className
    )}>
      <CardContent className="p-4 h-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-vexnet-accent">
            {icon}
          </div>
          <h3 className="text-foreground font-semibold text-sm flex-1">
            {title}
          </h3>
          <div className="w-6 h-6 rounded-full bg-vexnet-accent/20 text-vexnet-accent text-xs font-bold flex items-center justify-center">
            {number}
          </div>
        </div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Digite ${title.toLowerCase()}...`}
          className={`bg-vexnet-secondary/50 border-border/30 text-foreground placeholder:text-muted-foreground resize-none ${title === "Requisitos" ? "flex-1 h-full" : "flex-1 min-h-[200px]"}`}
          rows={rows}
        />
      </CardContent>
    </Card>
  );
};