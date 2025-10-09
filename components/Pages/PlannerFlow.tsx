import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import type { Plan_ResponseType } from "@/app/types";
import PlanCard from "../Atoms/PlanCard";

export const PlannerFlow = ({
  contextData,
  AI_Response,
}: {
  contextData: Record<string, string>;
  AI_Response: Plan_ResponseType;
}) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  useEffect(() => {
    if (!AI_Response || AI_Response.length === 0) return;

    const generatedNodes = AI_Response.map((plan, index) => ({
      id: `n${index + 1}`,
      position: { x: index * 300, y: 0 },
      type: "plan",
      data: {
        planName: plan.planName,
        planPrompt: plan.planPrompt,
        planDescription: plan.planDescription,
        targetFile: plan.targetFile,
        codeData: contextData[plan.targetFile],
      },
    }));

    const generatedEdges = AI_Response.slice(1).map((_, index) => ({
      id: `e${index + 1}`,
      source: `n${index + 1}`,
      target: `n${index + 2}`,
    }));

    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [AI_Response, contextData]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const nodeTypes = { plan: PlanCard };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="bg-transparent text-black"
      >
        <Background className="bg-transparent text-black" />
        <Controls className="bg-transparent text-black" />
      </ReactFlow>
    </div>
  );
};
