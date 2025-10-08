import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Bitcount_Prop_Double } from "next/font/google";
import { useState, useRef, useEffect, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { generatePlan } from "@/app/actions";

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
  const [contextData, setContextData] = useState<Record<string, string>>();

  const suggestionRefs = useRef<Array<HTMLDivElement | null>>([]);

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

      baseSuggestions = baseSuggestions.filter(
        (s) => !contextItems.includes(s),
      );

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
      const dupCheck = contextItems.filter(
        (i) => i !== suggestionData[activeIndex],
      );
      setContextItems(() => [...dupCheck, suggestionData[activeIndex]]);
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

  function findDataByKey(
    tree: Record<string, any>,
    key: string,
  ): string | null {
    for (const [k, value] of Object.entries(tree)) {
      const isFolder = value && typeof value === "object" && !("data" in value);

      if (k === key && !isFolder) {
        return value.data;
      }

      if (isFolder) {
        const result = findDataByKey(value, key);
        if (result !== null) return result;
      }
    }
    return null;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (contextItems.length === 0) {
      toast.error("Please add some context");
      return;
    }
    contextItems.forEach((i) => {
      const data = findDataByKey(tree, i);
      setContextData((prev) => ({
        ...prev,
        [i]: data as string,
      }));
    });

    // generate plan
    if (!contextData) return toast.error("No context added");
    try {
      await generatePlan(contextData, input);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-5 w-full bg-transparent h-full flex items-center justify-center">
      <div
        className="flex flex-col gap-y-4 w-full h-auto items-center
          justify-center"
      >
        <span className={cn(bitCount.className, "text-5xl text-orange-500")}>
          Start Planning
        </span>

        <div className="flex transition-all gap-y-2 duration-75 ease-in-out h-auto relative flex-col">
          <div className="flex gap-x-2 p-1 rounded-t-lg border-t-1 border-x-1 border-zinc-700">
            {contextItems.length > 0 &&
              contextItems.map((item) => (
                <motion.div
                  key={item}
                  animate={{ scale: [0, 1] }}
                  transition={{ ease: "easeInOut" }}
                  style={{ transformOrigin: "top left" }}
                  className="text-xs text-orange-500 rounded-lg border-1 bg-muted font-semibold 
                flex items-center justify-center w-fit gap-x-2 py-2 px-2"
                >
                  {item}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setContextItems(contextItems.filter((i) => i !== item));
                      setContextData((prev) => {
                        const updated = { ...prev };
                        delete updated[item];
                        return updated;
                      });
                    }}
                    className="cursor-pointer text-foreground"
                  >
                    x
                  </button>
                </motion.div>
              ))}{" "}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-col">
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
                  className="text-white h-auto bg-muted shadow-lg w-[150px]
                  absolute rounded-md top-22 left-0"
                >
                  <div
                    className="bg-muted rounded-md border-2 border-zinc-700 gap-y-1 flex flex-col max-h-40
                    overflow-y-auto scrollbar-none"
                  >
                    {suggestionData.map((item, index) => (
                      <div
                        key={index}
                        ref={(el) => {
                          suggestionRefs.current[index] = el;
                        }}
                        className={cn(
                          "px-3 py-2 cursor-pointer text-sm dark:text-white text-black",
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
            <Button
              type="submit"
              className="w-[25%] mx-auto bg-orange-500 cursor-pointer"
            >
              Plan
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
