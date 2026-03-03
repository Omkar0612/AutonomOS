import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface Workflow {
  nodes: Node[];
  edges: Edge[];
}

interface WorkflowStore {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  saveWorkflow: (workflow: Workflow) => void;
  loadWorkflow: () => Workflow | null;
  executeWorkflow: (workflow: Workflow) => Promise<void>;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  workflows: [],
  currentWorkflow: null,

  saveWorkflow: (workflow) => {
    localStorage.setItem('autonomos-workflow', JSON.stringify(workflow));
    set({ currentWorkflow: workflow });
  },

  loadWorkflow: () => {
    const saved = localStorage.getItem('autonomos-workflow');
    if (saved) {
      const workflow = JSON.parse(saved);
      set({ currentWorkflow: workflow });
      return workflow;
    }
    return null;
  },

  executeWorkflow: async (workflow) => {
    try {
      const response = await fetch('http://localhost:8000/api/workflow/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow),
      });
      const result = await response.json();
      console.log('Workflow executed:', result);
    } catch (error) {
      console.error('Error executing workflow:', error);
    }
  },
}));
