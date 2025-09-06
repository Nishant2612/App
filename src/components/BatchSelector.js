import React, { useState } from 'react';
import { CheckCircle, Circle, Users, Target, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

const BatchSelector = ({ 
  selectedSubject, 
  selectedBatches = [], 
  onBatchesChange,
  title = "Select Target Batches",
  showStudentCount = true,
  required = false
}) => {
  const { data, getBatchesBySubject } = useData();
  const [selectAll, setSelectAll] = useState(false);

  // Get batches that have the selected subject
  const availableBatches = selectedSubject ? getBatchesBySubject(parseInt(selectedSubject)) : [];
  
  const handleBatchToggle = (batchId) => {
    const isSelected = selectedBatches.includes(batchId);
    let newSelectedBatches;
    
    if (isSelected) {
      newSelectedBatches = selectedBatches.filter(id => id !== batchId);
    } else {
      newSelectedBatches = [...selectedBatches, batchId];
    }
    
    onBatchesChange(newSelectedBatches);
    setSelectAll(newSelectedBatches.length === availableBatches.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      onBatchesChange([]);
      setSelectAll(false);
    } else {
      const allBatchIds = availableBatches.map(batch => batch.id);
      onBatchesChange(allBatchIds);
      setSelectAll(true);
    }
  };

  // Calculate total students affected
  const totalStudents = availableBatches
    .filter(batch => selectedBatches.includes(batch.id))
    .reduce((sum, batch) => sum + batch.students, 0);

  if (!selectedSubject) {
    return (
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        background: '#f9fafb',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          color: '#6b7280'
        }}>
          <Target size={16} style={{ marginRight: '8px' }} />
          <span style={{ fontSize: '0.9rem' }}>Please select a subject first to choose target batches</span>
        </div>
      </div>
    );
  }

  if (availableBatches.length === 0) {
    return (
      <div style={{
        border: '1px solid #f59e0b',
        borderRadius: '8px',
        padding: '20px',
        background: '#fef3c7',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          color: '#92400e'
        }}>
          <AlertCircle size={16} style={{ marginRight: '8px' }} />
          <div>
            <div style={{ fontWeight: '500', marginBottom: '4px' }}>No Batches Available</div>
            <div style={{ fontSize: '0.8rem' }}>
              The selected subject is not assigned to any batches. 
              Please assign the subject to batches first from the Manage Subjects section.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '20px',
      background: '#f9fafb',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h4 style={{ 
          margin: 0, 
          fontSize: '1.1rem', 
          fontWeight: '600',
          color: '#374151',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Target size={16} style={{ marginRight: '8px' }} />
          {title}
          {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        </h4>
        
        {availableBatches.length > 1 && (
          <button
            type="button"
            onClick={handleSelectAll}
            style={{
              background: 'none',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '0.8rem',
              color: '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {selectAll ? (
              <>
                <CheckCircle size={12} />
                Deselect All
              </>
            ) : (
              <>
                <Circle size={12} />
                Select All
              </>
            )}
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '12px',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        {availableBatches.map(batch => {
          const isSelected = selectedBatches.includes(batch.id);
          return (
            <div
              key={batch.id}
              onClick={() => handleBatchToggle(batch.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                background: isSelected ? '#ecfdf5' : 'white',
                borderRadius: '8px',
                border: `2px solid ${isSelected ? '#10b981' : '#e5e7eb'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 2px 4px rgba(16, 185, 129, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              {isSelected ? (
                <CheckCircle 
                  size={18} 
                  style={{ 
                    color: '#10b981', 
                    marginRight: '12px',
                    flexShrink: 0
                  }} 
                />
              ) : (
                <Circle 
                  size={18} 
                  style={{ 
                    color: '#6b7280', 
                    marginRight: '12px',
                    flexShrink: 0
                  }} 
                />
              )}
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: isSelected ? '#065f46' : '#374151',
                  marginBottom: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {batch.name}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8rem',
                  color: isSelected ? '#047857' : '#6b7280'
                }}>
                  <span>Class {batch.class}</span>
                  {showStudentCount && (
                    <>
                      <span>•</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} />
                        <span>{batch.students} students</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedBatches.length > 0 && (
        <div style={{
          marginTop: '15px',
          padding: '12px',
          background: '#ecfdf5',
          borderRadius: '6px',
          border: '1px solid #10b981'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: '#065f46',
              fontWeight: '500'
            }}>
              ✅ {selectedBatches.length} batch{selectedBatches.length > 1 ? 'es' : ''} selected
            </div>
            
            {showStudentCount && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.85rem',
                color: '#047857',
                fontWeight: '600'
              }}>
                <Users size={14} />
                <span>{totalStudents} students will receive this content</span>
              </div>
            )}
          </div>
          
          {selectedBatches.length > 0 && (
            <div style={{
              marginTop: '8px',
              fontSize: '0.8rem',
              color: '#065f46',
              fontStyle: 'italic'
            }}>
              Content will be visible to students in: {
                availableBatches
                  .filter(batch => selectedBatches.includes(batch.id))
                  .map(batch => batch.name)
                  .join(', ')
              }
            </div>
          )}
        </div>
      )}

      {/* Warning for no selection */}
      {required && selectedBatches.length === 0 && (
        <div style={{
          marginTop: '12px',
          padding: '10px',
          background: '#fef3c7',
          borderRadius: '6px',
          border: '1px solid #f59e0b',
          fontSize: '0.85rem',
          color: '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <AlertCircle size={14} />
          Please select at least one batch to continue
        </div>
      )}
    </div>
  );
};

export default BatchSelector;
