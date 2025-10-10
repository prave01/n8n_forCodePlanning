import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { Button } from "../ui/button";

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />;
      <EdgeLabelRenderer>
        <Button
          type="button"
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan rounded-full size-8 text-xl bg-black border-red-500 border-1 text-red-500"
          onClick={() => {
            setEdges((es) => es.filter((e) => e.id !== id));
          }}
        >
          x
        </Button>
      </EdgeLabelRenderer>
    </>
  );
}
