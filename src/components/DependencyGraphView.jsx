import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import CivicStepNode from './CivicStepNode';
import { CheckCircle2, ArrowRight, Lock, Clock, Info, ShieldCheck, Zap } from 'lucide-react';

const nodeTypes = {
  civicStep: CivicStepNode
};

export default function DependencyGraphView({
  graphData,
  onNodeClick,
  onToggleStep,
  onOpenWhyBlocked
}) {
  const { nodes = [], edges = [], stats = {} } = graphData || {};

  // Auto-layout nodes in progressive columns based on prerequisites
  const layoutedNodes = useMemo(() => {
    if (!nodes || nodes.length === 0) return [];

    // Calculate topological depth
    const depthMap = new Map();
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    function getDepth(nodeId, visited = new Set()) {
      if (depthMap.has(nodeId)) return depthMap.get(nodeId);
      if (visited.has(nodeId)) return 0;
      visited.add(nodeId);

      const node = nodeMap.get(nodeId);
      if (!node || !node.prerequisites || node.prerequisites.length === 0) {
        depthMap.set(nodeId, 0);
        return 0;
      }

      let maxPrereqDepth = 0;
      for (const pId of node.prerequisites) {
        maxPrereqDepth = Math.max(maxPrereqDepth, getDepth(pId, visited) + 1);
      }

      depthMap.set(nodeId, maxPrereqDepth);
      return maxPrereqDepth;
    }

    nodes.forEach(n => getDepth(n.id));

    // Group by depth
    const levels = [];
    nodes.forEach(n => {
      const d = depthMap.get(n.id) || 0;
      if (!levels[d]) levels[d] = [];
      levels[d].push(n);
    });

    const HORIZONTAL_GAP = 360;
    const VERTICAL_GAP = 220;

    return nodes.map(node => {
      const d = depthMap.get(node.id) || 0;
      const colNodes = levels[d] || [node];
      const indexInCol = colNodes.findIndex(cn => cn.id === node.id);
      const totalInCol = colNodes.length;

      const yPos = (indexInCol - (totalInCol - 1) / 2) * VERTICAL_GAP + 180;
      const xPos = d * HORIZONTAL_GAP + 80;

      return {
        id: node.id,
        type: 'civicStep',
        position: node.position || { x: xPos, y: Math.max(50, yPos) },
        data: {
          ...node,
          onWhyBlockedClick: (data) => onOpenWhyBlocked(data),
          onToggleClick: (stepId) => onToggleStep(stepId)
        }
      };
    });
  }, [nodes, onOpenWhyBlocked, onToggleStep]);

  // Generate directed edges
  const flowEdges = useMemo(() => {
    if (edges && edges.length > 0) {
      return edges.map(edge => ({
        ...edge,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: edge.style?.stroke || '#94a3b8'
        }
      }));
    }

    // Auto-generate edges from prerequisites if not explicitly provided
    const generated = [];
    const completedSet = new Set(nodes.filter(n => n.status === 'COMPLETED').map(n => n.id));

    nodes.forEach(node => {
      (node.prerequisites || []).forEach(pId => {
        const isCompleted = completedSet.has(pId);
        generated.push({
          id: `edge_${pId}_to_${node.id}`,
          source: pId,
          target: node.id,
          type: 'smoothstep',
          animated: isCompleted && node.status !== 'COMPLETED',
          style: {
            stroke: isCompleted ? '#10b981' : '#94a3b8',
            strokeWidth: isCompleted ? 2.5 : 1.5,
            strokeDasharray: isCompleted ? undefined : '5 5'
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 16,
            height: 16,
            color: isCompleted ? '#10b981' : '#94a3b8'
          }
        });
      });
    });

    return generated;
  }, [edges, nodes]);

  const [currentNodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [currentEdges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  React.useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(flowEdges);
  }, [layoutedNodes, flowEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (event, node) => {
      if (onNodeClick) {
        onNodeClick(node.data);
      }
    },
    [onNodeClick]
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 240px)', minHeight: 600, backgroundColor: '#f8fafc', borderRadius: 14, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      
      {/* Top Floating Control Bar: Legend & Statistics */}
      <div
        className="civic-glass"
        style={{
          position: 'absolute',
          top: 16,
          left: 20,
          right: 20,
          zIndex: 10,
          borderRadius: 12,
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
        }}
      >
        {/* Left: Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Graph States:
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600, color: '#065f46' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} />
            ✓ Completed
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600, color: '#1e40af' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#3b82f6' }} />
            ● Available (Unlocked)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600, color: '#991b1b' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
            🔒 Blocked
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600, color: '#3730a3' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#6366f1' }} />
            ⏳ In Progress
          </div>
        </div>

        {/* Right: Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Progress:
            </span>
            <div style={{ width: 100, height: 8, backgroundColor: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${stats.progressPercent || 0}%`,
                  backgroundColor: '#10b981',
                  borderRadius: 9999,
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a' }}>
              {stats.progressPercent || 0}%
            </span>
          </div>

          <span className="badge badge-verified" style={{ fontSize: '0.6875rem' }}>
            <ShieldCheck size={12} /> Reacts to Documents
          </span>
        </div>
      </div>

      {/* React Flow Graph Canvas */}
      <ReactFlow
        nodes={currentNodes}
        edges={currentEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.3}
        maxZoom={1.5}
        attributionPosition="bottom-left"
      >
        <Background color="#cbd5e1" gap={20} size={1} />
        <Controls position="bottom-right" />
        <MiniMap
          position="bottom-left"
          nodeColor={(node) => {
            if (node.data.status === 'COMPLETED') return '#10b981';
            if (node.data.status === 'AVAILABLE') return '#3b82f6';
            if (node.data.status === 'BLOCKED') return '#ef4444';
            return '#94a3b8';
          }}
          style={{
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        />
      </ReactFlow>

      {/* Bottom Hint Banner */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ffffff',
          borderRadius: 9999,
          padding: '6px 18px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '0.75rem',
          color: '#475569',
          pointerEvents: 'none'
        }}
      >
        <Info size={14} color="#2563eb" />
        <span>Click any node to inspect details, or click a blocked node to see <strong>"Why am I blocked?"</strong></span>
      </div>

    </div>
  );
}
