import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseDataService from '../firebase/dataService';

// Initial sample data
const initialData = {
  batches: [
    {
      id: 1,
      name: "Aarambh Batch 2.0 - Class 9",
      class: 9,
      originalPrice: 4500,
      discountPrice: 2500,
      currentPrice: 0,
      teachers: ["AK", "RS", "MP"],
      students: 245,
      status: "active",
      subjects: [1, 2, 3, 4, 5], // Array of subject IDs available in this batch
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "Excellence Batch - Class 10",
      class: 10,
      originalPrice: 5000,
      discountPrice: 3000,
      currentPrice: 0,
      teachers: ["SK", "RG", "AT"],
      students: 312,
      status: "active",
      subjects: [1, 2, 3, 4, 5], // Array of subject IDs available in this batch
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      name: "Foundation Plus - Class 11",
      class: 11,
      originalPrice: 6000,
      discountPrice: 4000,
      currentPrice: 0,
      teachers: ["VK", "NP", "MJ"],
      students: 189,
      status: "active",
      subjects: [1, 2, 6, 7], // Array of subject IDs available in this batch
      createdAt: new Date().toISOString()
    }
  ],
  subjects: [
    { id: 1, name: "Mathematics", icon: "📐", class: "math", topics: 8, createdAt: new Date().toISOString() },
    { id: 2, name: "Science", icon: "⚗️", class: "science", topics: 12, createdAt: new Date().toISOString() },
    { id: 3, name: "Social Science", icon: "🌍", class: "social", topics: 10, createdAt: new Date().toISOString() },
    { id: 4, name: "Hindi", icon: "📖", class: "hindi", topics: 6, createdAt: new Date().toISOString() },
    { id: 5, name: "English", icon: "🔤", class: "english", topics: 7, createdAt: new Date().toISOString() },
    { id: 6, name: "Sanskrit", icon: "📜", class: "sanskrit", topics: 5, createdAt: new Date().toISOString() },
    { id: 7, name: "Information Technology", icon: "💻", class: "it", topics: 9, createdAt: new Date().toISOString() }
  ],
  lectures: {
    1: [ // Mathematics
      { id: 1, title: "Quadrilaterals L1", subject: "MATHS", duration: "45 min", uploadDate: "2024-03-15", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [1, 2, 3] },
      { id: 2, title: "Quadrilaterals L2", subject: "MATHS", duration: "40 min", uploadDate: "2024-03-16", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [1, 2] },
      { id: 3, title: "Quadrilaterals L3", subject: "MATHS", duration: "50 min", uploadDate: "2024-03-17", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [1, 2] },
      { id: 4, title: "Quadrilaterals L4", subject: "MATHS", duration: "35 min", uploadDate: "2024-03-18", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [1] },
      { id: 5, title: "Heron's Formula L1", subject: "MATHS", duration: "55 min", uploadDate: "2024-03-19", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [1, 2, 3] },
      { id: 6, title: "Heron's Formula L2", subject: "MATHS", duration: "45 min", uploadDate: "2024-03-20", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [2, 3] },
      { id: 7, title: "Euclid's Geometry (Intro + Lecture)", subject: "MATHS", duration: "60 min", uploadDate: "2024-03-21", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [3] },
      { id: 8, title: "Triangles L1", subject: "MATHS", duration: "40 min", uploadDate: "2024-03-22", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [1, 2] },
      { id: 9, title: "Triangles L2", subject: "MATHS", duration: "45 min", uploadDate: "2024-03-23", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [1, 2, 3] },
      { id: 10, title: "Lines and Angles L1", subject: "MATHS", duration: "50 min", uploadDate: "2024-03-24", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [1] }
    ],
    2: [ // Science
      { id: 11, title: "Matter in Our Surroundings L1", subject: "SCIENCE", duration: "45 min", uploadDate: "2024-03-15", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [1, 2] },
      { id: 12, title: "Atoms and Molecules L1", subject: "SCIENCE", duration: "50 min", uploadDate: "2024-03-16", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [1, 2] },
      { id: 13, title: "Motion L1", subject: "SCIENCE", duration: "40 min", uploadDate: "2024-03-17", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [2] },
      { id: 14, title: "Force and Laws of Motion L1", subject: "SCIENCE", duration: "55 min", uploadDate: "2024-03-18", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [1, 2] }
    ]
  },
  notes: {
    1: [
      { id: 1, title: "Quadrilaterals - Complete Notes", type: "PDF", addedOn: "2024-03-15", fileName: "quadrilaterals.pdf", availableInBatches: [1, 2] },
      { id: 2, title: "Heron's Formula - Formula Sheet", type: "PDF", addedOn: "2024-03-16", fileName: "herons-formula.pdf", availableInBatches: [1, 2, 3] },
      { id: 3, title: "Triangles - Properties & Theorems", type: "PDF", addedOn: "2024-03-17", fileName: "triangles.pdf", availableInBatches: [1] }
    ],
    2: [
      { id: 4, title: "Matter - States and Properties", type: "PDF", addedOn: "2024-03-15", fileName: "matter.pdf", availableInBatches: [1, 2] },
      { id: 5, title: "Atomic Structure - Basic Concepts", type: "PDF", addedOn: "2024-03-16", fileName: "atomic-structure.pdf", availableInBatches: [2] }
    ]
  },
  dpps: {
    1: [
      { id: 1, title: "Quadrilaterals - Practice Set 1", questions: 25, addedOn: "2024-03-15", fileName: "quad-practice-1.pdf", availableInBatches: [1, 2] },
      { id: 2, title: "Triangles - Practice Set 1", questions: 30, addedOn: "2024-03-16", fileName: "triangles-practice-1.pdf", availableInBatches: [1] },
      { id: 3, title: "Geometry Mixed - Practice Set 1", questions: 40, addedOn: "2024-03-17", fileName: "geometry-mixed-1.pdf", availableInBatches: [2, 3] }
    ],
    2: [
      { id: 4, title: "Matter & Atoms - Practice Set 1", questions: 20, addedOn: "2024-03-15", fileName: "matter-atoms-practice-1.pdf", availableInBatches: [1, 2] },
      { id: 5, title: "Motion & Force - Practice Set 1", questions: 35, addedOn: "2024-03-16", fileName: "motion-force-practice-1.pdf", availableInBatches: [2] }
    ]
  }
};

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    // Initialize Firebase and subscribe to real-time updates
    const initializeFirebase = async () => {
      try {
        await firebaseDataService.initializeData();
        
        // Subscribe to real-time updates
        const unsubscribe = firebaseDataService.subscribeToData((updatedData) => {
          setData(updatedData);
          setLastSyncTime(new Date().toISOString());
          setIsLoading(false);
        });

        // Cleanup subscription on unmount
        return unsubscribe;
      } catch (error) {
        console.error('Failed to initialize Firebase:', error);
        // Fallback to localStorage
        const savedData = localStorage.getItem('eduverse-data');
        if (savedData) {
          setData(JSON.parse(savedData));
        }
        setIsLoading(false);
      }
    };

    const unsubscribePromise = initializeFirebase();

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      // Cleanup
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
      firebaseDataService.cleanup();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper function to get next ID
  const getNextId = (items) => {
    if (Array.isArray(items)) {
      return Math.max(0, ...items.map(item => item.id)) + 1;
    }
    // For objects like lectures, notes, dpps
    const allItems = Object.values(items).flat();
    return Math.max(0, ...allItems.map(item => item.id)) + 1;
  };

  // BATCH OPERATIONS with Firebase sync
  const addBatch = async (batchData) => {
    try {
      const newBatch = await firebaseDataService.addBatch(batchData, data.batches);
      return newBatch;
    } catch (error) {
      console.error('Error adding batch:', error);
      // Fallback to local update if Firebase fails
      const newBatch = {
        id: getNextId(data.batches),
        ...batchData,
        students: 0,
        status: "active",
        subjects: [],
        createdAt: new Date().toISOString()
      };
      setData(prev => ({
        ...prev,
        batches: [...prev.batches, newBatch]
      }));
      return newBatch;
    }
  };

  // Add subject to batch
  const addSubjectToBatch = async (batchId, subjectId) => {
    try {
      await firebaseDataService.addSubjectToBatch(batchId, subjectId, data.batches);
    } catch (error) {
      console.error('Error adding subject to batch:', error);
      // Fallback to local update
      setData(prev => ({
        ...prev,
        batches: prev.batches.map(batch =>
          batch.id === batchId
            ? { ...batch, subjects: [...(batch.subjects || []), subjectId] }
            : batch
        )
      }));
    }
  };

  // Remove subject from batch
  const removeSubjectFromBatch = async (batchId, subjectId) => {
    try {
      await firebaseDataService.removeSubjectFromBatch(batchId, subjectId, data.batches);
    } catch (error) {
      console.error('Error removing subject from batch:', error);
      // Fallback to local update
      setData(prev => ({
        ...prev,
        batches: prev.batches.map(batch =>
          batch.id === batchId
            ? { ...batch, subjects: (batch.subjects || []).filter(id => id !== subjectId) }
            : batch
        )
      }));
    }
  };

  const updateBatch = async (id, updates) => {
    try {
      await firebaseDataService.updateBatch(id, updates, data.batches);
    } catch (error) {
      console.error('Error updating batch:', error);
      // Fallback to local update
      setData(prev => ({
        ...prev,
        batches: prev.batches.map(batch =>
          batch.id === id ? { ...batch, ...updates } : batch
        )
      }));
    }
  };

  const deleteBatch = async (id) => {
    try {
      await firebaseDataService.deleteBatch(id, data.batches);
    } catch (error) {
      console.error('Error deleting batch:', error);
      // Fallback to local update
      setData(prev => ({
        ...prev,
        batches: prev.batches.filter(batch => batch.id !== id)
      }));
    }
  };

  // SUBJECT OPERATIONS with Firebase sync
  const addSubject = async (subjectData) => {
    try {
      const newSubject = await firebaseDataService.addSubject(
        subjectData, 
        data.subjects, 
        data.lectures, 
        data.notes, 
        data.dpps
      );
      return newSubject;
    } catch (error) {
      console.error('Error adding subject:', error);
      // Fallback to local update
      const newSubject = {
        id: getNextId(data.subjects),
        ...subjectData,
        topics: 0,
        createdAt: new Date().toISOString()
      };
      setData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject],
        lectures: { ...prev.lectures, [newSubject.id]: [] },
        notes: { ...prev.notes, [newSubject.id]: [] },
        dpps: { ...prev.dpps, [newSubject.id]: [] }
      }));
      return newSubject;
    }
  };

  const updateSubject = async (id, updates) => {
    try {
      await firebaseDataService.updateSubject(id, updates, data.subjects);
    } catch (error) {
      console.error('Error updating subject:', error);
      // Fallback to local update
      setData(prev => ({
        ...prev,
        subjects: prev.subjects.map(subject =>
          subject.id === id ? { ...subject, ...updates } : subject
        )
      }));
    }
  };

  const deleteSubject = async (id) => {
    try {
      await firebaseDataService.deleteSubject(
        id, 
        data.subjects, 
        data.lectures, 
        data.notes, 
        data.dpps
      );
    } catch (error) {
      console.error('Error deleting subject:', error);
      // Fallback to local update
      setData(prev => {
        const newData = { ...prev };
        newData.subjects = prev.subjects.filter(subject => subject.id !== id);
        delete newData.lectures[id];
        delete newData.notes[id];
        delete newData.dpps[id];
        return newData;
      });
    }
  };

  // LECTURE OPERATIONS with Firebase sync
  const addLecture = async (subjectId, lectureData) => {
    try {
      const newLecture = await firebaseDataService.addLecture(subjectId, lectureData, data.lectures);
      return newLecture;
    } catch (error) {
      console.error('Error adding lecture:', error);
      // Fallback to local update
      const newLecture = {
        id: getNextId(data.lectures),
        ...lectureData,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setData(prev => ({
        ...prev,
        lectures: {
          ...prev.lectures,
          [subjectId]: [...(prev.lectures[subjectId] || []), newLecture]
        }
      }));
      return newLecture;
    }
  };

  const updateLecture = async (subjectId, lectureId, updates) => {
    try {
      await firebaseDataService.updateLecture(subjectId, lectureId, updates, data.lectures);
    } catch (error) {
      console.error('Error updating lecture:', error);
      // Fallback to local update
      setData(prev => ({
        ...prev,
        lectures: {
          ...prev.lectures,
          [subjectId]: (prev.lectures[subjectId] || []).map(lecture =>
            lecture.id === lectureId ? { ...lecture, ...updates } : lecture
          )
        }
      }));
    }
  };

  const deleteLecture = async (subjectId, lectureId) => {
    try {
      await firebaseDataService.deleteLecture(subjectId, lectureId, data.lectures);
    } catch (error) {
      console.error('Error deleting lecture:', error);
      // Fallback to local update
      setData(prev => ({
        ...prev,
        lectures: {
          ...prev.lectures,
          [subjectId]: (prev.lectures[subjectId] || []).filter(lecture =>
            lecture.id !== lectureId
          )
        }
      }));
    }
  };

  // NOTES OPERATIONS with Firebase sync
  const addNote = async (subjectId, noteData) => {
    try {
      const newNote = await firebaseDataService.addNote(subjectId, noteData, data.notes);
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      // Fallback to local update
      const newNote = {
        id: getNextId(data.notes),
        ...noteData,
        addedOn: new Date().toISOString().split('T')[0]
      };
      setData(prev => ({
        ...prev,
        notes: {
          ...prev.notes,
          [subjectId]: [...(prev.notes[subjectId] || []), newNote]
        }
      }));
      return newNote;
    }
  };

  const updateNote = async (subjectId, noteId, updates) => {
    try {
      await firebaseDataService.updateNote(subjectId, noteId, updates, data.notes);
    } catch (error) {
      console.error('Error updating note:', error);
      // Fallback to local update
      setData(prev => ({
        ...prev,
        notes: {
          ...prev.notes,
          [subjectId]: (prev.notes[subjectId] || []).map(note =>
            note.id === noteId ? { ...note, ...updates } : note
          )
        }
      }));
    }
  };

  const deleteNote = async (subjectId, noteId) => {
    try {
      await firebaseDataService.deleteNote(subjectId, noteId, data.notes);
    } catch (error) {
      console.error('Error deleting note:', error);
      // Fallback to local update
      setData(prev => ({
        ...prev,
        notes: {
          ...prev.notes,
          [subjectId]: (prev.notes[subjectId] || []).filter(note =>
            note.id !== noteId
          )
        }
      }));
    }
  };

  // DPP OPERATIONS with Firebase sync
  const addDpp = async (subjectId, dppData) => {
    try {
      const newDpp = await firebaseDataService.addDpp(subjectId, dppData, data.dpps);
      return newDpp;
    } catch (error) {
      console.error('Error adding DPP:', error);
      // Fallback to local update
      const newDpp = {
        id: getNextId(data.dpps),
        ...dppData,
        addedOn: new Date().toISOString().split('T')[0]
      };
      setData(prev => ({
        ...prev,
        dpps: {
          ...prev.dpps,
          [subjectId]: [...(prev.dpps[subjectId] || []), newDpp]
        }
      }));
      return newDpp;
    }
  };

  const updateDpp = async (subjectId, dppId, updates) => {
    try {
      await firebaseDataService.updateDpp(subjectId, dppId, updates, data.dpps);
    } catch (error) {
      console.error('Error updating DPP:', error);
      // Fallback to local update
      setData(prev => ({
        ...prev,
        dpps: {
          ...prev.dpps,
          [subjectId]: (prev.dpps[subjectId] || []).map(dpp =>
            dpp.id === dppId ? { ...dpp, ...updates } : dpp
          )
        }
      }));
    }
  };

  const deleteDpp = async (subjectId, dppId) => {
    try {
      await firebaseDataService.deleteDpp(subjectId, dppId, data.dpps);
    } catch (error) {
      console.error('Error deleting DPP:', error);
      // Fallback to local update
      setData(prev => ({
        ...prev,
        dpps: {
          ...prev.dpps,
          [subjectId]: (prev.dpps[subjectId] || []).filter(dpp =>
            dpp.id !== dppId
          )
        }
      }));
    }
  };

  // HELPER FUNCTIONS FOR BATCH-SUBJECT RELATIONSHIPS
  const getBatchesBySubject = (subjectId) => {
    return data.batches.filter(batch => 
      batch.subjects && batch.subjects.includes(subjectId)
    );
  };

  const getSubjectsByBatch = (batchId) => {
    const batch = data.batches.find(b => b.id === batchId);
    if (!batch || !batch.subjects) return [];
    return data.subjects.filter(subject => batch.subjects.includes(subject.id));
  };

  const getAllBatchSubjectCombinations = () => {
    const combinations = [];
    data.batches.forEach(batch => {
      if (batch.subjects) {
        batch.subjects.forEach(subjectId => {
          const subject = data.subjects.find(s => s.id === subjectId);
          if (subject) {
            combinations.push({
              batchId: batch.id,
              batchName: batch.name,
              subjectId: subject.id,
              subjectName: subject.name,
              combination: `${batch.name} - ${subject.name}`
            });
          }
        });
      }
    });
    return combinations;
  };

  // RESET DATA with Firebase sync
  const resetData = async () => {
    try {
      await firebaseDataService.resetData();
    } catch (error) {
      console.error('Error resetting data:', error);
      // Fallback to local reset
      setData(initialData);
      localStorage.setItem('eduverse-data', JSON.stringify(initialData));
    }
  };

  const value = {
    data,
    isLoading,
    isOnline,
    lastSyncTime,
    // Batch operations
    addBatch,
    updateBatch,
    deleteBatch,
    addSubjectToBatch,
    removeSubjectFromBatch,
    // Subject operations
    addSubject,
    updateSubject,
    deleteSubject,
    // Lecture operations
    addLecture,
    updateLecture,
    deleteLecture,
    // Notes operations
    addNote,
    updateNote,
    deleteNote,
    // DPP operations
    addDpp,
    updateDpp,
    deleteDpp,
    // Helper functions
    getBatchesBySubject,
    getSubjectsByBatch,
    getAllBatchSubjectCombinations,
    // Utility
    resetData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
