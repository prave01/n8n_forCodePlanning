"use client";

import { Bitcount_Prop_Double } from "next/font/google";
import { useState } from "react";
import GridLoader from "react-spinners/GridLoader";
import { cn } from "@/lib/utils";
import "@xyflow/react/dist/style.css";
import { PlanInput } from "../Atoms/PlanInput";
import { PlannerFlow } from "../Pages/PlannerFlow";
import { usePlan } from "@/store/store";

const bitCount = Bitcount_Prop_Double({
  subsets: ["latin"],
});

export const Plan = ({ tree }: { tree: Record<string, any> }) => {
  const [loading, setLoading] = useState(false);

  const plan = usePlan((s) => s.plan);

  if (plan.length !== 0) {
    return <PlannerFlow tree={tree} />;
  }

  return (
    <div
      className="p-5 w-full bg-transparent relative h-full flex items-center
        justify-center"
    >
      {loading && (
        <div
          className="backdrop-blur-md flex items-center justify-center absolute
            inset-0 z-20"
        >
          <GridLoader color="#ff4d00" />
        </div>
      )}
      <div
        className="flex flex-col gap-y-4 w-full h-auto items-center
          justify-center"
      >
        <span className={cn(bitCount.className, "text-5xl text-orange-500")}>
          Start Planning
        </span>

        <div
          className="flex transition-all duration-75 ease-in-out h-auto relative
            flex-col"
        >
          <PlanInput setLoading={setLoading} tree={tree} />
        </div>
      </div>
    </div>
  );
};
