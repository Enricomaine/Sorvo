import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ActiveToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export function ActiveToggle({
  checked,
  onChange,
  label = "Ativo",
  id = "active-toggle",
  disabled,
  className,
  description,
}: ActiveToggleProps) {
  return (
    <div className={cn("flex flex-col gap-1 mb-2", className)}>
      <div className="flex items-center gap-3">
        <Label htmlFor={id}>{label}</Label>
        <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
      </div>
      {description ? (
        <span className="text-xs text-muted-foreground">{description}</span>
      ) : null}
    </div>
  );
}
