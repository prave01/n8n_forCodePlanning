import {
  addEdge,
  Background,
  Controls,
  type DefaultEdgeOptions,
  type Edge,
  type FitViewOptions,
  type Node,
  type OnConnect,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback, useEffect } from "react";
import type { Plan_ResponseType } from "@/app/types";
import PlanCard from "../Atoms/PlanCard";
import CustomEdge from "../ReactFlow/CustomEdge";
import { useRunConnectedNodes } from "@/store/store";

export const PlannerFlow = ({
  contextData,
  AI_Response,
}: {
  contextData: Record<string, string>;
  AI_Response: Plan_ResponseType;
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  useEffect(() => {
    if (!AI_Response || AI_Response.length === 0) return;

    const generatedNodes: Node[] = AI_Response.map((plan, index) => ({
      id: `n${index + 1}`,
      position: { x: index * 510, y: 0 },
      type: "plan",
      data: {
        planName: plan.planName,
        planPrompt: plan.planPrompt,
        planDescription: plan.planDescription,
        targetFile: plan.targetFile,
        codeData: contextData[plan.targetFile],
        nodeId: `n${index + 1}`,
      },
    }));

    setNodes(generatedNodes);
  }, [AI_Response, contextData, setEdges, setNodes]);

  const edgeTypes = {
    "custom-edge": CustomEdge,
  };

  const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: true,
  };

  const fitViewOptions: FitViewOptions = {
    padding: 0.2,
  };

  const setRunState = useRunConnectedNodes((s) => s.setRunState);

  const onConnect: OnConnect = useCallback(
    (params) => {
      const edge = { ...params, type: "custom-edge" };
      setEdges((eds) => addEdge(edge, eds));
      setRunState({ nodeId: params.source, status: false });
    },
    [setEdges],
  );

  const nodeTypes = { plan: PlanCard };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        className="bg-transparent text-black"
      >
        <Background className="bg-transparent text-black" />
        <Controls className="bg-transparent text-black" />
      </ReactFlow>
    </div>
  );
};
