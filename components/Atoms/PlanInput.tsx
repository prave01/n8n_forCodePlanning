import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { generatePlan } from "@/actions/PlannerAI";
import type { Plan_ResponseType } from "@/app/types";
import { cn, findDataByKey, traverse } from "@/lib/utils";
import { Button } from "../ui/button";
import { useContextData, usePlan } from "@/store/store";

export const PlanInput = ({
  tree,
  setLoading,
}: {
  tree: Record<string, any>;
  setLoading: (data: boolean) => void;
}) => {
  const [input, setInput] = useState("");
  const [openSuggession, setOpenSuggession] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [suggestionData, setSuggestionData] = useState<string[]>(["No data"]);
  const [contextItems, setContextItems] = useState<Array<string>>([]);
  const [allSuggestions, setAllSuggestions] = useState<Array<string>>([]);

  const suggestionRefs = useRef<Array<HTMLDivElement | null>>([]);

  const setPlan = usePlan((s) => s.setPlan);
  const plan = usePlan((s) => s.plan);

  const setContextData = useContextData((s) => s.setContextData);
  const contextData = useContextData((s) => s.contextData);

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (contextItems.length === 0) {
      toast.error("Please add some context");
      return;
    }

    const newContextData: Record<string, string> = {};
    contextItems.forEach((i) => {
      const data = findDataByKey(tree, i);
      if (data) newContextData[i] = data;
    });

    if (Object.keys(newContextData).length === 0) {
      return toast.error("No context added");
    }

    console.log("newcontextdata", newContextData);

    setContextData({
      ...contextData,
      ...Object.fromEntries(
        Object.entries(newContextData).filter(([key]) => !contextData[key]),
      ),
    });

    try {
      setLoading(true);
      const response: Plan_ResponseType = await generatePlan(
        newContextData,
        input,
      );

      setPlan([...plan, ...response]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <>
      <div
        className="flex gap-1 flex-wrap p-1 rounded-t-lg border-t-1
              border-x-1 border-orange-500 dark:border-zinc-700"
      >
        {contextItems.length > 0 &&
          contextItems.map((item) => (
            <motion.div
              key={item}
              animate={{ scale: [0, 1] }}
              transition={{ ease: "easeInOut" }}
              style={{ transformOrigin: "top left" }}
              className="text-xs text-orange-500 rounded-lg border-1
                    bg-black dark:bg-muted font-semibold flex items-center
                    justify-center w-fit gap-x-2 py-2 px-2"
            >
              {item}{" "}
              <button
                type="button"
                onClick={() => {
                  setContextItems(contextItems.filter((i) => i !== item));
                }}
                className="cursor-pointer dark:text-foreground text-white"
              >
                x
              </button>
            </motion.div>
          ))}{" "}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 relative flex-col">
        <input
          value={input}
          required
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="py-1.5 bg-zinc-800 text-md px-2 focus:outline-1
                focus:outline-zinc-500 text-white rounded-sm w-full min-w-[400px]
                self-center border-2 border-zinc-700"
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
                    absolute rounded-md top-12 left-0"
            >
              <div
                className="bg-muted rounded-md border-2 dark:border-zinc-700
                      border-orange-500 gap-y-1 flex flex-col max-h-40
                      overflow-y-auto scrollbar-none"
              >
                {suggestionData.map((item, index) => (
                  <div
                    key={item}
                    ref={(el) => {
                      suggestionRefs.current[index] = el;
                    }}
                    className={cn(
                      `px-3 py-2 cursor-pointer text-sm dark:text-white
                          text-black`,
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
    </>
  );
};
