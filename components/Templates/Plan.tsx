import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Bitcount_Prop_Double } from "next/font/google";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const bitCount = Bitcount_Prop_Double({
  subsets: ["latin"],
});

const suggestions = ["item1", "item2", "item3", "item4", "item5"];

export const Plan = () => {
  const [input, setInput] = useState<string>("");
  const [openSuggession, setOpenSuggession] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestionRefs = useRef<Array<HTMLDivElement | null>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value.includes("@")) {
      setOpenSuggession(true);
      setActiveIndex(0);
      return;
    }
    setOpenSuggession(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!openSuggession) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (activeIndex + 1 > suggestions.length - 1) {
        setActiveIndex(0);
        return;
      }
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      setInput((prev) => prev.replace(/@$/, `@${suggestions[activeIndex]}`));
      setOpenSuggession(false);
    }
  };

  useEffect(() => {
    if (openSuggession) {
      suggestionRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex, openSuggession]);

  return (
    <div className="p-5 w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-y-4 w-full h-auto items-center justify-center">
        <span
          className={cn(bitCount.className, "text-4xl text-orange-500", "")}
        >
          Start Planning
        </span>
        <div className="flex h-auto relative">
          <input
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="py-1.5 bg-muted text-md px-2 focus:outline-1 focus:outline-zinc-500 rounded-sm w-full min-w-[400px] self-center border-2 border-zinc-700"
          />

          <AnimatePresence>
            {openSuggession && (
              <motion.div
                initial={{ scale: 0, opacity: 0, filter: "blur(10px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0, opacity: 0, filter: "blur(10px)" }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  type: "spring",
                }}
                style={{ transformOrigin: "top left" }}
                className="text-white h-auto translate-y-12 
                bg-muted w-[150px] absolute rounded-md top-0 left-0"
              >
                <div className="bg-muted rounded-md gap-y-2 flex flex-col  max-h-40 overflow-y-auto scrollbar-none">
                  {suggestions.map((item, index) => (
                    <div
                      key={item}
                      ref={(el) => (suggestionRefs.current[index] = el)}
                      className={cn(
                        "px-3 py-2 cursor-pointer",
                        index === activeIndex && "bg-orange-500",
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => {
                        setInput((prev) => prev.replace(/@$/, `@${item}`));
                        setOpenSuggession(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button className="w-[25%] bg-orange-500 cursor-pointer">Plan</Button>
      </div>
    </div>
  );
};
