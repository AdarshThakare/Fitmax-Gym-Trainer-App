import { LucideIcon } from "lucide-react";
import CornerElements from "./CornerElements";

interface Props {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const SectionWrapper = ({ title, icon: Icon, children }: Props) => {
  return (
    <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
      <CornerElements />
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-mono font-bold text-primary">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export default SectionWrapper;
