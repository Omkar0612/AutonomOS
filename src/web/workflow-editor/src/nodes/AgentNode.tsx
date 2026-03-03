import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Bot, Users } from 'lucide-react';

export function AgentNode({ data }: { data: any }) {
  const isMultiAgent = data.agentType === 'multi';

  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-purple-500 text-white border-2 border-purple-600 min-w-[180px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        {isMultiAgent ? <Users className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        <div className="font-bold text-sm">{data.label}</div>
      </div>
      
      {data.model && (
        <div className="text-xs bg-purple-600 rounded px-2 py-1 mb-1">
          {data.model}
        </div>
      )}
      
      {isMultiAgent && data.pattern && (
        <div className="text-xs opacity-80">Pattern: {data.pattern}</div>
      )}
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
}
