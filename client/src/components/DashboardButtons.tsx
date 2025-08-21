import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Users, FolderOpen, MapPin, Target, MessagesSquare, BarChart3 } from "lucide-react";

function gradientStyle(gradient: string) {
  return { backgroundImage: gradient } as React.CSSProperties;
}

export default function DashboardButtons() {
  const { user } = useAuth();

  const buttons = [
    {
      href: "/",
      title: "Dashboard",
      description: "Overview & Analytics",
      icon: LayoutDashboard,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      textClass: "text-white",
      borderClass: "",
    },
    {
      href: "/customers",
      title: "Customers",
      description: "Manage Client Base",
      icon: Users,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      textClass: "text-white",
      borderClass: "",
    },
    {
      href: "/projects",
      title: "Projects",
      description: "Survey Projects",
      icon: FolderOpen,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      textClass: "text-white",
      borderClass: "",
    },
    {
      href: "/survey-records",
      title: "Survey Records",
      description: "Field Data & Maps",
      icon: MapPin,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      textClass: "text-white",
      borderClass: "",
    },
    // Admin-only button is handled below
    {
      href: "/pipeline",
      title: "Leads",
      description: "Sales Pipeline",
      icon: Target,
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      textClass: "text-slate-800",
      borderClass: "",
    },
    {
      href: "/communications",
      title: "Communications",
      description: "Client Interactions",
      icon: MessagesSquare,
      gradient: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
      textClass: "text-slate-800",
      borderClass: "",
    },
    {
      href: "/reports",
      title: "Reports",
      description: "Analytics & Insights",
      icon: BarChart3,
      gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
      textClass: "text-white",
      borderClass: "",
    },
  ];

  const adminButton = {
    href: "https://ldrsurveys.com/ldr/admin/home.php",
    external: true,
    title: "LDR Survey Admin",
    description: "Live Admin Panel",
    icon: MapPin,
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    textClass: "text-white",
    borderClass: "border-2 border-[#ff6b6b]",
  } as const;

  const renderButton = (
    key: string,
    href: string,
    title: string,
    description: string,
    Icon: any,
    gradient: string,
    textClass: string,
    borderClass: string,
    external?: boolean
  ) => {
    const content = (
      <div
        className={`h-[120px] rounded-lg shadow-md transition transform hover:-translate-y-1 hover:shadow-xl p-4 flex flex-col items-center justify-center text-center ${textClass} ${borderClass}`}
        style={gradientStyle(gradient)}
      >
        <Icon className="w-6 h-6 mb-2" />
        <span className="text-base font-semibold mb-1">{title}</span>
        <small className="text-xs opacity-90">{description}</small>
      </div>
    );

    if (external) {
      return (
        <a key={key} href={href} target="_blank" rel="noreferrer" className="block">
          {content}
        </a>
      );
    }
    return (
      <Link key={key} href={href}>
        <a className="block">{content}</a>
      </Link>
    );
  };

  return (
    <div className="mt-2">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-blue-300">Quick Access</h3>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {buttons.map((b) =>
          renderButton(
            b.title,
            b.href,
            b.title,
            b.description,
            b.icon,
            b.gradient,
            b.textClass,
            b.borderClass
          )
        )}
        {user?.role === "admin" &&
          renderButton(
            adminButton.title,
            adminButton.href,
            adminButton.title,
            adminButton.description,
            adminButton.icon,
            adminButton.gradient,
            adminButton.textClass,
            adminButton.borderClass,
            true
          )}
      </div>
    </div>
  );
}


