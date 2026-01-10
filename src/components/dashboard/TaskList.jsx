import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, ArrowRight, ListChecks } from 'lucide-react';

export function TaskList({ tasks, onToggle, onDelete, onAdd }) {
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');

    const handleSubmit = () => {
        if (!newTaskText.trim()) {
            setIsAdding(false);
            return;
        }
        onAdd(newTaskText);
        setNewTaskText('');
        setIsAdding(false);
    };

    return (
        <motion.div 
            className="card tasks-module"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="card-title">
                Active Missions
                <ListChecks size={18} />
            </div>

            <div style={{ marginTop: '24px' }}>
                <AnimatePresence mode='popLayout'>
                    {tasks.map((task, index) => (
                        <motion.div
                            layout
                            key={task._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            className={`task-row ${task.completed ? 'completed' : ''}`}
                        >
                            <div 
                                className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
                                onClick={() => onToggle(task._id)}
                            >
                                {task.completed && <Check size={14} strokeWidth={3} color="white" />}
                            </div>
                            <div className="task-content" onClick={() => onToggle(task._id)}>
                                <span className="task-label">{task.text}</span>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                                    Mission Priority: High
                                </div>
                            </div>
                            <button 
                                className="delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(task._id);
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                    
                    {isAdding ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="task-row"
                            style={{ borderBottom: '2px solid var(--primary)' }}
                        >
                            <input 
                                autoFocus
                                type="text" 
                                style={{ 
                                    background: 'transparent', 
                                    border: 'none', 
                                    color: 'white', 
                                    width: '100%', 
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                                placeholder="Define mission objective..."
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                onBlur={handleSubmit}
                            />
                        </motion.div>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="task-row"
                            style={{ cursor: 'pointer', justifyContent: 'center', border: '1px dashed var(--border-card)' }}
                            onClick={() => setIsAdding(true)}
                        >
                            <Plus size={18} style={{ color: 'var(--primary)' }} />
                            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Initialize New Mission</span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
