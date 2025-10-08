import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Bitcount_Prop_Double } from "next/font/google";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const bitCount = Bitcount_Prop_Double({
  subsets: ["latin"],
});

export const Plan = ({ tree }: { tree: Record<string, any> }) => {
  const [input, setInput] = useState("");
  const [openSuggession, setOpenSuggession] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [suggestionData, setSuggestionData] = useState<string[]>(["No data"]);
  const [contextItems, setContextItems] = useState<Array<string>>([]);
  const [allSuggestions, setAllSuggestions] = useState<Array<string>>([]);

  const suggestionRefs = useRef<Array<HTMLDivElement | null>>([]);

  // useEffect(() => {
  //   if (!tree || typeof tree !== "object") return;
  //
  //   const traverse = (node: Record<string, any>, prefix = "") => {
  //     Object.entries(node).forEach(([name, value]) => {
  //       const isObject = value && typeof value === "object";
  //       const isFile = isObject && "data" in value;
  //
  //       if (isFile) {
  //         suggestions.push(name);
  //       } else if (isObject) {
  //         const nextPrefix = prefix ? `${prefix}/${name}` : name;
  //         traverse(value as Record<string, any>, nextPrefix);
  //       }
  //     });
  //   };
  //   traverse(tree);
  //   setSuggestionData(suggestions.length > 0 ? suggestions : ["No data"]);
  // }, [tree]);
  //
  //

  const traverse = (tree: Record<string, any>, results: string[] = []) => {
    Object.entries(tree).forEach(([key, value]) => {
      const isFolder = value && typeof value === "object" && !("data" in value);
      if (isFolder) traverse(value, results);
      else results.push(key);
    });
    return results;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.includes("@")) {
      setOpenSuggession(true);

      const splitWord = value.split("@")[1].trim();

      let baseSuggestions = allSuggestions;
      if (baseSuggestions.length === 0) {
        const all = traverse(tree);
        setAllSuggestions(all);
        baseSuggestions = all;
      }

      if (splitWord === "") {
        setSuggestionData(
          baseSuggestions.length > 0 ? baseSuggestions : ["No data"],
        );
        return;
      }

      const matches = baseSuggestions.filter((s) =>
        s.toLowerCase().includes(splitWord.toLowerCase()),
      );

      setSuggestionData(matches.length > 0 ? matches : ["No matches"]);
    } else {
      setOpenSuggession(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!openSuggession) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestionData.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? suggestionData.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      setContextItems((prev) => [...prev, suggestionData[activeIndex]]);
      setInput("");
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
      <div
        className="flex flex-col gap-y-4 w-full h-auto items-center
          justify-center"
      >
        <span className={cn(bitCount.className, "text-4xl text-orange-500")}>
          Start Planning
        </span>

        <div className="flex transition-all gap-y-2 duration-75 ease-in-out h-auto relative flex-col">
          <div className="flex gap-x-2">
            {contextItems.length > 0 &&
              contextItems.map((item, idx) => (
                <motion.div
                  key={item}
                  animate={{ scale: [0, 1] }}
                  transition={{ type: "spring", ease: "easeInOut" }}
                  className="text-xs text-orange-500 rounded-lg border-1 bg-muted font-semibold 
                flex items-center justify-center w-fit gap-x-2 py-2 px-2"
                >
                  {item}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setContextItems(contextItems.filter((i) => i !== item));
                    }}
                    className="cursor-pointer text-foreground"
                  >
                    x
                  </button>
                </motion.div>
              ))}{" "}
          </div>
          <input
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="py-1.5 bg-muted text-md px-2 focus:outline-1
              focus:outline-zinc-500 rounded-sm w-full min-w-[400px] self-center
              border-2 border-zinc-700"
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
                className="text-white h-auto translate-y-12 bg-muted w-[150px]
                  absolute rounded-md top-0 left-0"
              >
                <div
                  className="bg-muted rounded-md gap-y-1 flex flex-col max-h-40
                    overflow-y-auto scrollbar-none"
                >
                  {suggestionData.map((item, index) => (
                    <div
                      key={index}
                      ref={(el) => {
                        suggestionRefs.current[index] = el;
                      }}
                      className={cn(
                        "px-3 py-2 cursor-pointer text-sm",
                        index === activeIndex && "bg-orange-500",
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => {
                        setContextItems((prev) => [
                          ...prev,
                          suggestionData[activeIndex],
                        ]);
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
