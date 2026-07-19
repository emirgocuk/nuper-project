import { cn } from "@/lib/utils";

interface PageShellProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    maxWidth?: "4xl" | "6xl";
    glow?: "blue" | "indigo" | "cyan" | "none";
    className?: string;
}

const glowClasses = {
    blue: "bg-blue-600/10",
    indigo: "bg-indigo-600/10",
    cyan: "bg-cyan-600/10",
    none: "",
};

const maxWidthClasses = {
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
};

export function PageShell({
    children,
    title,
    subtitle,
    maxWidth = "6xl",
    glow = "blue",
    className,
}: PageShellProps) {
    return (
        <div className={cn(
            "min-h-screen pt-24 pb-12 bg-[#0b1120] text-white relative overflow-hidden font-sans",
            className
        )}>
            {glow !== "none" && (
                <div className={cn(
                    "absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] blur-[180px] rounded-full pointer-events-none z-0",
                    glowClasses[glow]
                )} />
            )}
            <div className={cn("px-4 mx-auto relative z-10", maxWidthClasses[maxWidth])}>
                {(title || subtitle) && (
                    <div className="mb-12 text-center md:text-left">
                        {title && (
                            <h1 className="mb-4 text-4xl font-bold font-heading tracking-wide text-white">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="text-gray-400 text-lg max-w-2xl">{subtitle}</p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
