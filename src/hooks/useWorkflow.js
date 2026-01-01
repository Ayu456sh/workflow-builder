import { useState, useCallback } from 'react';

const initialWorkflow = {
  id: 'root',
  type: 'action',
  label: 'Start Workflow',
  children: [],
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useWorkflow = () => {
  const [workflow, setWorkflow] = useState(initialWorkflow);

  const cloneWorkflow = (data) => JSON.parse(JSON.stringify(data));

  const addNode = useCallback((parentId, type, index = null) => {
    const newWorkflow = cloneWorkflow(workflow);

    const findAndAdd = (node) => {
      if (node.id === parentId) {
        const newNode = {
          id: generateId(),
          type,
          label: type === 'branch' ? 'New Condition' : 'New Step',
          children: []
        };

        if (index !== null) {
          node.children[index] = newNode;
        } else {
          if (node.type !== 'branch') {
             node.children = [newNode];
          } else {
             node.children.push(newNode);
          }
        }
        return true;
      }

      if (node.children) {
        for (const child of node.children) {
          if (child && findAndAdd(child)) return true;
        }
      }
      return false;
    };

    findAndAdd(newWorkflow);
    setWorkflow(newWorkflow);
  }, [workflow]);

  const deleteNode = useCallback((nodeId) => {
    if (nodeId === 'root') return;
    const newWorkflow = cloneWorkflow(workflow);

    const findAndDelete = (parentNode) => {
      if (!parentNode.children) return false;

      for (let i = 0; i < parentNode.children.length; i++) {
        const child = parentNode.children[i];
        if (!child) continue;

        if (child.id === nodeId) {
          const orphans = child.children || [];
          const adopted = orphans[0] || orphans[1] || null;
          
          parentNode.children[i] = adopted;
          
          return true;
        }

        if (findAndDelete(child)) return true;
      }
      return false;
    };

    findAndDelete(newWorkflow);
    setWorkflow(newWorkflow);
  }, [workflow]);

  const updateNodeLabel = useCallback((nodeId, newLabel) => {
    const newWorkflow = cloneWorkflow(workflow);

    const findAndUpdate = (node) => {
      if (node.id === nodeId) {
        node.label = newLabel;
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (child && findAndUpdate(child)) return true;
        }
      }
    };

    findAndUpdate(newWorkflow);
    setWorkflow(newWorkflow);
  }, [workflow]);

  return { 
    workflow, 
    addNode, 
    deleteNode, 
    updateNodeLabel 
  };
};