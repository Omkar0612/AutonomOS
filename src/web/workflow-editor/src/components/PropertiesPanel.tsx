import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import { X } from 'lucide-react';

interface PropertiesPanelProps {
  node: Node;
  onClose: () => void;
}

export function PropertiesPanel({ node, onClose }: PropertiesPanelProps) {
  const [properties, setProperties] = useState(node.data);

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Properties</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Label</label>
          <input
            type="text"
            value={properties.label || ''}
            onChange={(e) => setProperties({ ...properties, label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {node.type === 'agent' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Agent Type</label>
              <select
                value={properties.agentType || 'single'}
                onChange={(e) => setProperties({ ...properties, agentType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="single">Single Agent</option>
                <option value="multi">Multi-Agent Team</option>
              </select>
            </div>

            {properties.agentType === 'multi' && (
              <div>
                <label className="block text-sm font-medium mb-1">Pattern</label>
                <select
                  value={properties.pattern || 'hierarchical'}
                  onChange={(e) => setProperties({ ...properties, pattern: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="hierarchical">Hierarchical</option>
                  <option value="swarm">Swarm</option>
                  <option value="council">Council</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Model</label>
              <select
                value={properties.model || 'gpt-4'}
                onChange={(e) => setProperties({ ...properties, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="claude-3">Claude 3</option>
                <option value="llama3">Llama 3 (Local)</option>
              </select>
            </div>
          </>
        )}

        {node.type === 'trigger' && (
          <div>
            <label className="block text-sm font-medium mb-1">Trigger Type</label>
            <select
              value={properties.triggerType || 'schedule'}
              onChange={(e) => setProperties({ ...properties, triggerType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="schedule">Schedule (Cron)</option>
              <option value="webhook">Webhook</option>
              <option value="event">Event</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
