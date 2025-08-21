import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <img
          src="https://www.landsurveys.in/images/ldr.png"
          alt="LDR Surveys"
          className="w-10 h-10 object-contain"
        />
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}


