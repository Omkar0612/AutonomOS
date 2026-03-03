import React from 'react';
import { Clock, Bot, Users, Code, Mail, GitBranch, Database } from 'lucide-react';

const nodeCategories = [
  {
    name: 'Triggers',
    nodes: [
      { type: 'trigger', label: 'Schedule', icon: Clock, color: 'blue' },
      { type: 'trigger', label: 'Webhook', icon: Code, color: 'blue' },
    ]
  },
  {
    name: 'Agents',
    nodes: [
      { type: 'agent', label: 'Single Agent', icon: Bot, color: 'purple' },
      { type: 'agent', label: 'Multi-Agent Team', icon: Users, color: 'purple' },
    ]
  },
  {
    name: 'Actions',
    nodes: [
      { type: 'action', label: 'Send Email', icon: Mail, color: 'green' },
      { type: 'action', label: 'API Call', icon: Code, color: 'green' },
    ]
  },
  {
    name: 'Logic',
    nodes: [
      { type: 'logic', label: 'If/Else', icon: GitBranch, color: 'orange' },
      { type: 'logic', label: 'Transform', icon: Database, color: 'orange' },
    ]
  },
];

export function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Node Palette</h2>
      
      {nodeCategories.map((category) => (
        <div key={category.name} className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            {category.name}
          </h3>
          <div className="space-y-2">
            {category.nodes.map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.label}
                  draggable
                  onDragStart={(e) => onDragStart(e, node.type)}
                  className={`
                    flex items-center gap-2 p-3 rounded-lg cursor-move
                    bg-${node.color}-50 border border-${node.color}-200
                    hover:bg-${node.color}-100 transition-colors
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{node.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
