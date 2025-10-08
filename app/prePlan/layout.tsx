import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#0f0f0f] relative text-white">
      {/* Circuit Board - Dark Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(34, 197, 94, 0.15) 19px, rgba(34, 197, 94, 0.15) 20px, transparent 20px, transparent 39px, rgba(34, 197, 94, 0.15) 39px, rgba(34, 197, 94, 0.15) 40px),
        repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(34, 197, 94, 0.15) 19px, rgba(34, 197, 94, 0.15) 20px, transparent 20px, transparent 39px, rgba(34, 197, 94, 0.15) 39px, rgba(34, 197, 94, 0.15) 40px),
        radial-gradient(circle at 20px 20px, rgba(16, 185, 129, 0.18) 2px, transparent 2px),
        radial-gradient(circle at 40px 40px, rgba(16, 185, 129, 0.18) 2px, transparent 2px)
      `,
          backgroundSize: "40px 40px, 40px 40px, 40px 40px, 40px 40px",
        }}
      />
      {children}
    </div>
  );
}
