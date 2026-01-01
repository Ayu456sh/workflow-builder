import { useState, useCallback } from 'react';

const initialWorkflow = {
  id: 'root',
  type: 'action',
  label: 'Start Workflow',
  children: [],
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useWorkflow = () => {
  // History is an array of workflow snapshots: [Version1, Version2, Version3]
  const [history, setHistory] = useState([initialWorkflow]);
  // Current Index tells us which version we are looking at
  const [currentIndex, setCurrentIndex] = useState(0);

  // The "Current" workflow is just the one at the current index
  const workflow = history[currentIndex];

  const cloneWorkflow = (data) => JSON.parse(JSON.stringify(data));

  // Helper to save a new state to history
  const pushState = (newWorkflow) => {
    // 1. Cut off any "future" history if we were in the middle of undoing
    const historySoFar = history.slice(0, currentIndex + 1);
    // 2. Add the new version
    const newHistory = [...historySoFar, newWorkflow];
    // 3. Update state
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

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

    if (findAndAdd(newWorkflow)) {
      pushState(newWorkflow);
    }
  }, [workflow, currentIndex, history]);

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

    if (findAndDelete(newWorkflow)) {
      pushState(newWorkflow);
    }
  }, [workflow, currentIndex, history]);

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

    if (findAndUpdate(newWorkflow)) {
      pushState(newWorkflow);
    }
  }, [workflow, currentIndex, history]);

  return { 
    workflow, 
    addNode, 
    deleteNode, 
    updateNodeLabel,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1
  };
};