import React, { useState, useRef, useEffect } from 'react';

const WorkflowNode = ({ node, onAdd, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(node.label);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const menuRef = useRef(null);

  const handleEditSubmit = () => {
    onEdit(node.id, editLabel);
    setIsEditing(false);
  };

  const handleAddClick = (type, branchIndex = null) => {
    onAdd(node.id, type, branchIndex);
    setShowAddMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasChild = node.children && node.children.length > 0 && node.children[0];

  return (
    <div className="node-wrapper">
      {/* Node Card */}
      <div className={`node-card node-${node.type}`}>
        <div className="node-header">
          <span className="node-type-label">{node.type.toUpperCase()}</span>
          {node.type !== 'start' && (
            <button className="btn-delete" onClick={() => onDelete(node.id)} title="Delete Node">
              ×
            </button>
          )}
        </div>
        
        <div className="node-body">
          {isEditing ? (
            <div className="edit-mode">
              <input 
                autoFocus
                value={editLabel} 
                onChange={(e) => setEditLabel(e.target.value)}
                onBlur={handleEditSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit()}
              />
            </div>
          ) : (
            <div className="node-label" onClick={() => setIsEditing(true)} title="Click to edit">
              {node.label}
            </div>
          )}
        </div>
      </div>

      {/* Render Children */}
      {node.type === 'branch' ? (
        <div className="branch-container">
          {/* True Branch (Index 0) */}
          <div className="branch-path branch-true">
            <div className="connector-label">True</div>
            {node.children && node.children[0] ? (
              <WorkflowNode 
                node={node.children[0]} 
                onAdd={onAdd} 
                onDelete={onDelete} 
                onEdit={onEdit} 
              />
            ) : (
              // Empty Slot Add Trigger
              <div className="add-trigger add-trigger-relative">
                <button className="btn-add-circle" onClick={() => handleAddClick('action', 0)}>+</button>
              </div>
            )}
          </div>

          {/* False Branch (Index 1) */}
          <div className="branch-path branch-false">
             <div className="connector-label">False</div>
             {node.children && node.children[1] ? (
              <WorkflowNode 
                node={node.children[1]} 
                onAdd={onAdd} 
                onDelete={onDelete} 
                onEdit={onEdit} 
              />
            ) : (
              // Empty Slot Add Trigger
              <div className="add-trigger add-trigger-relative">
                <button className="btn-add-circle" onClick={() => handleAddClick('action', 1)}>+</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Standard vertical flow
        <div className="children-container">
           {node.type !== 'end' && (
             <div className="vertical-line" style={{ height: hasChild ? '2rem' : '2rem' }}></div>
           )}

           {/* Add Button Trigger (Only if no child, or if we supported insertion, but adhering to single child constraint) */}
           {node.type !== 'end' && !hasChild && (
             <div className="add-trigger" ref={menuRef}>
               <button 
                 className="btn-add-circle" 
                 onClick={() => setShowAddMenu(!showAddMenu)}
               >
                 +
               </button>
               
               {showAddMenu && (
                 <div className="context-menu-popover">
                   <button className="context-menu-item" onClick={() => handleAddClick('action')}>
                     <span className="type-indicator-action"></span> Action
                   </button>
                   <button className="context-menu-item" onClick={() => handleAddClick('branch')}>
                      <span className="type-indicator-branch"></span> Condition
                   </button>
                   <button className="context-menu-item" onClick={() => handleAddClick('end')}>
                      <span className="type-indicator-end"></span> End Flow
                   </button>
                 </div>
               )}
             </div>
           )}

           {hasChild && (
             <WorkflowNode 
               node={node.children[0]} 
               onAdd={onAdd} 
               onDelete={onDelete} 
               onEdit={onEdit} 
             />
           )}
        </div>
      )}
    </div>
  );
};

export default WorkflowNode;
