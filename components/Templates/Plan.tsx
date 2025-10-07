import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Bitcount_Prop_Double } from "next/font/google";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const bitCount = Bitcount_Prop_Double({
  subsets: ["latin"],
});

export const Plan = () => {
  const [input, setInput] = useState<string>("");

  const [openSuggession, setOpenSuggession] = useState(false);

  const handleChange = (e) => {
    setInput(e.target.value);
    if (String(e.target.value).includes("@")) {
      setOpenSuggession(true);
      return;
    }
    setOpenSuggession(false);
  };

  return (
    <div className="p-5 w-full h-full flex items-center justify-center">
      <div
        className="flex flex-col gap-y-4 w-full h-auto 
              items-center justify-center"
      >
        <span
          className={cn(bitCount.className, "text-4xl text-orange-500", "")}
        >
          Start Planning
        </span>
        <div className="flex h-auto relative">
          <input
            onChange={handleChange}
            className="py-1.5 bg-muted text-md px-2 focus:outline-1 focus:outline-zinc-500  rounded-sm w-full 
                min-w-[400px] self-center border-2 border-zinc-700"
          ></input>
          <AnimatePresence>
            {openSuggession && (
              <motion.div
                animate={{
                  scale: [0, 1],
                  opacity: [0, 1],
                  transformOrigin: "top left",
                }}
                exit={{ scale: [1, 0], opacity: [1, 0] }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  type: "spring",
                }}
                className="text-white translate-y-40 bg-muted w-[150px] 
            rounded-md left-0 bottom-0 absolute"
              >
                <ul className="p-2 flex-col flex gap-y-1">
                  <div>item</div>
                  <div>item</div>
                  <div>item</div>
                  <div>item</div>
                  <div>item</div>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button className="w-[25%] bg-orange-500 cursor-pointer">Plan</Button>
      </div>
    </div>
  );
};
