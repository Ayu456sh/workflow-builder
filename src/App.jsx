import React from 'react';
import WorkflowNode from './WorkflowNode';
import { useWorkflow } from './hooks/useWorkflow';
import './App.css';

export default function App() {
  const { 
    workflow, 
    addNode, 
    deleteNode, 
    updateNodeLabel,
    undo,
    redo,
    canUndo,
    canRedo
  } = useWorkflow();

  const handleSave = () => {
    console.log("Current Workflow Structure:", JSON.stringify(workflow, null, 2));
    alert("Workflow structure logged to console (Press F12 to view).");
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Workflow Builder</h1>
        <div className="toolbar">
          <button className="btn-secondary" onClick={undo} disabled={!canUndo}>Undo</button>
          <button className="btn-secondary" onClick={redo} disabled={!canRedo}>Redo</button>
          <button className="btn-primary" onClick={handleSave}>
            Save Workflow
          </button>
        </div>
      </header>
      
      <div className="canvas">
        <div className="children-container">
          <WorkflowNode 
            node={workflow} 
            onAdd={addNode} 
            onDelete={deleteNode} 
            onEdit={updateNodeLabel} 
          />
        </div>
      </div>
    </div>
  );
}