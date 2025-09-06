import React from 'react';
import { CheckCircle, Circle, Users, BookOpen } from 'lucide-react';
import { useData } from '../context/DataContext';

const BatchSubjectSelector = ({ 
  selectedSubject, 
  onSubjectChange, 
  showBatchInfo = true, 
  title = "Select Subject & View Batches" 
}) => {
  const { data, getBatchesBySubject } = useData();

  const handleSubjectChange = (subjectId) => {
    onSubjectChange(subjectId);
  };

  const currentBatches = selectedSubject ? getBatchesBySubject(parseInt(selectedSubject)) : [];

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '20px',
      background: '#f9fafb',
      marginBottom: '20px'
    }}>
      <h4 style={{ 
        margin: '0 0 15px 0', 
        fontSize: '1.1rem', 
        fontWeight: '600',
        color: '#374151'
      }}>
        {title}
      </h4>

      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label className="form-label" style={{ fontWeight: '500' }}>
          <BookOpen size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Subject
        </label>
        <select
          className="form-select"
          value={selectedSubject || ''}
          onChange={(e) => handleSubjectChange(e.target.value)}
          style={{ width: '100%' }}
        >
          <option value="">Select a subject</option>
          {data.subjects.map(subject => {
            const batches = getBatchesBySubject(subject.id);
            return (
              <option key={subject.id} value={subject.id}>
                {subject.name} {subject.icon} ({batches.length} batch{batches.length !== 1 ? 'es' : ''})
              </option>
            );
          })}
        </select>
      </div>

      {selectedSubject && showBatchInfo && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <Users size={16} style={{ marginRight: '6px', color: '#6b7280' }} />
            <span style={{ fontWeight: '500', color: '#374151' }}>
              Available in {currentBatches.length} batch{currentBatches.length !== 1 ? 'es' : ''}
            </span>
          </div>

          {currentBatches.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '12px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {currentBatches.map(batch => (
                <div
                  key={batch.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px',
                    background: 'white',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <CheckCircle 
                    size={16} 
                    style={{ 
                      color: '#10b981', 
                      marginRight: '8px',
                      flexShrink: 0
                    }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: '#374151',
                      truncate: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden'
                    }}>
                      {batch.name}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '2px'
                    }}>
                      Class {batch.class} • {batch.students} students
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              background: '#fef3c7',
              borderRadius: '6px',
              border: '1px solid #f59e0b'
            }}>
              <Circle size={16} style={{ color: '#f59e0b', marginRight: '8px' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#92400e' }}>
                  Not assigned to any batches
                </div>
                <div style={{ fontSize: '0.8rem', color: '#92400e', marginTop: '2px' }}>
                  Assign this subject to batches from the Manage Subjects section
                </div>
              </div>
            </div>
          )}

          {currentBatches.length > 0 && (
            <div style={{
              marginTop: '12px',
              padding: '10px',
              background: '#ecfdf5',
              borderRadius: '6px',
              border: '1px solid #10b981'
            }}>
              <div style={{
                fontSize: '0.8rem',
                color: '#065f46',
                fontWeight: '500'
              }}>
                ✨ Content Impact
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#065f46',
                marginTop: '4px'
              }}>
                When you add content to this subject, it will be available to{' '}
                <strong>
                  {currentBatches.reduce((sum, batch) => sum + batch.students, 0)} students
                </strong>{' '}
                across {currentBatches.length} batch{currentBatches.length !== 1 ? 'es' : ''}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BatchSubjectSelector;
