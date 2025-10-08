import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen absolute  w-full">
      <div
        className="absolute inset-0 "
        style={{
          background: "#000000",
          backgroundImage: `
        radial-gradient(circle, rgba(255, 255, 255, 0.2) 1.5px, transparent 1.5px)
      `,
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0",
        }}
      />
      {children}
    </div>
  );
}
