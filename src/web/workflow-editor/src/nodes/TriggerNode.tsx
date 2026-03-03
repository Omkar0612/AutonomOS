import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Clock, Webhook, Zap } from 'lucide-react';

export function TriggerNode({ data }: { data: any }) {
  const getTriggerIcon = () => {
    switch (data.triggerType) {
      case 'schedule': return <Clock className="w-5 h-5" />;
      case 'webhook': return <Webhook className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-blue-500 text-white border-2 border-blue-600">
      <div className="flex items-center gap-2">
        {getTriggerIcon()}
        <div>
          <div className="font-bold text-sm">{data.label}</div>
          <div className="text-xs opacity-80">{data.triggerType || 'Trigger'}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
}
