import { ref, set, get, onValue, push, update, remove, off } from 'firebase/database';
import { database } from './config';

// Initial sample data (same as before)
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
      subjects: [1, 2, 3, 4, 5],
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
      subjects: [1, 2, 3, 4, 5],
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
      subjects: [1, 2, 6, 7],
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
    1: [
      { id: 1, title: "Quadrilaterals L1", subject: "MATHS", duration: "45 min", uploadDate: "2024-03-15", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [1, 2, 3] },
      { id: 2, title: "Quadrilaterals L2", subject: "MATHS", duration: "40 min", uploadDate: "2024-03-16", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [1, 2] },
    ],
    2: [
      { id: 11, title: "Matter in Our Surroundings L1", subject: "SCIENCE", duration: "45 min", uploadDate: "2024-03-15", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", availableInBatches: [1, 2] },
    ]
  },
  notes: {
    1: [
      { id: 1, title: "Quadrilaterals - Complete Notes", type: "PDF", addedOn: "2024-03-15", fileName: "quadrilaterals.pdf", availableInBatches: [1, 2] },
    ],
    2: [
      { id: 4, title: "Matter - States and Properties", type: "PDF", addedOn: "2024-03-15", fileName: "matter.pdf", availableInBatches: [1, 2] },
    ]
  },
  dpps: {
    1: [
      { id: 1, title: "Quadrilaterals - Practice Set 1", questions: 25, addedOn: "2024-03-15", fileName: "quad-practice-1.pdf", availableInBatches: [1, 2] },
    ],
    2: [
      { id: 4, title: "Matter & Atoms - Practice Set 1", questions: 20, addedOn: "2024-03-15", fileName: "matter-atoms-practice-1.pdf", availableInBatches: [1, 2] },
    ]
  }
};

class FirebaseDataService {
  constructor() {
    this.dataRef = ref(database, 'eduverse-data');
    this.listeners = [];
    this.isInitialized = false;
  }

  // Initialize data if it doesn't exist
  async initializeData() {
    if (this.isInitialized) return;
    
    try {
      const snapshot = await get(this.dataRef);
      if (!snapshot.exists()) {
        // No data exists, initialize with sample data
        await set(this.dataRef, initialData);
        console.log('Firebase initialized with sample data');
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing Firebase data:', error);
      // Fallback to localStorage if Firebase fails
      const localData = localStorage.getItem('eduverse-data');
      if (localData) {
        try {
          await set(this.dataRef, JSON.parse(localData));
          console.log('Migrated localStorage data to Firebase');
        } catch (migrationError) {
          console.error('Error migrating localStorage data:', migrationError);
        }
      }
    }
  }

  // Subscribe to data changes with automatic sync to localStorage as backup
  subscribeToData(callback) {
    const listener = onValue(this.dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Update localStorage as backup
        localStorage.setItem('eduverse-data', JSON.stringify(data));
        callback(data);
      }
    }, (error) => {
      console.error('Firebase subscription error:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem('eduverse-data');
      if (localData) {
        callback(JSON.parse(localData));
      }
    });

    this.listeners.push(listener);
    return () => this.unsubscribe(listener);
  }

  // Unsubscribe from data changes
  unsubscribe(listener) {
    off(this.dataRef, 'value', listener);
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // Generic update method with offline support
  async updateData(updates) {
    try {
      await update(this.dataRef, updates);
      // Also update localStorage immediately for better responsiveness
      const currentLocal = localStorage.getItem('eduverse-data');
      if (currentLocal) {
        const localData = JSON.parse(currentLocal);
        const updatedData = { ...localData, ...updates };
        localStorage.setItem('eduverse-data', JSON.stringify(updatedData));
      }
    } catch (error) {
      console.error('Firebase update error:', error);
      // If Firebase fails, at least update localStorage
      const currentLocal = localStorage.getItem('eduverse-data');
      if (currentLocal) {
        const localData = JSON.parse(currentLocal);
        const updatedData = { ...localData, ...updates };
        localStorage.setItem('eduverse-data', JSON.stringify(updatedData));
      }
      throw error; // Re-throw to let components handle the error
    }
  }

  // Batch operations
  async addBatch(batchData, currentBatches) {
    const newBatch = {
      id: Math.max(0, ...currentBatches.map(item => item.id)) + 1,
      ...batchData,
      students: 0,
      status: "active",
      subjects: [],
      createdAt: new Date().toISOString()
    };

    const updatedBatches = [...currentBatches, newBatch];
    await this.updateData({ batches: updatedBatches });
    return newBatch;
  }

  async updateBatch(id, updates, currentBatches) {
    const updatedBatches = currentBatches.map(batch =>
      batch.id === id ? { ...batch, ...updates } : batch
    );
    await this.updateData({ batches: updatedBatches });
  }

  async deleteBatch(id, currentBatches) {
    const updatedBatches = currentBatches.filter(batch => batch.id !== id);
    await this.updateData({ batches: updatedBatches });
  }

  // Subject operations
  async addSubject(subjectData, currentSubjects, currentLectures, currentNotes, currentDpps) {
    const newSubject = {
      id: Math.max(0, ...currentSubjects.map(item => item.id)) + 1,
      ...subjectData,
      topics: 0,
      createdAt: new Date().toISOString()
    };

    const updates = {
      subjects: [...currentSubjects, newSubject],
      lectures: { ...currentLectures, [newSubject.id]: [] },
      notes: { ...currentNotes, [newSubject.id]: [] },
      dpps: { ...currentDpps, [newSubject.id]: [] }
    };

    await this.updateData(updates);
    return newSubject;
  }

  async updateSubject(id, updates, currentSubjects) {
    const updatedSubjects = currentSubjects.map(subject =>
      subject.id === id ? { ...subject, ...updates } : subject
    );
    await this.updateData({ subjects: updatedSubjects });
  }

  async deleteSubject(id, currentSubjects, currentLectures, currentNotes, currentDpps) {
    const updatedSubjects = currentSubjects.filter(subject => subject.id !== id);
    const updatedLectures = { ...currentLectures };
    const updatedNotes = { ...currentNotes };
    const updatedDpps = { ...currentDpps };

    delete updatedLectures[id];
    delete updatedNotes[id];
    delete updatedDpps[id];

    await this.updateData({
      subjects: updatedSubjects,
      lectures: updatedLectures,
      notes: updatedNotes,
      dpps: updatedDpps
    });
  }

  // Lecture operations
  async addLecture(subjectId, lectureData, currentLectures) {
    const allLectures = Object.values(currentLectures).flat();
    const newLecture = {
      id: Math.max(0, ...allLectures.map(item => item.id)) + 1,
      ...lectureData,
      uploadDate: new Date().toISOString().split('T')[0]
    };

    const updatedSubjectLectures = [...(currentLectures[subjectId] || []), newLecture];
    await this.updateData({
      [`lectures/${subjectId}`]: updatedSubjectLectures
    });
    return newLecture;
  }

  async updateLecture(subjectId, lectureId, updates, currentLectures) {
    const updatedSubjectLectures = (currentLectures[subjectId] || []).map(lecture =>
      lecture.id === lectureId ? { ...lecture, ...updates } : lecture
    );
    await this.updateData({
      [`lectures/${subjectId}`]: updatedSubjectLectures
    });
  }

  async deleteLecture(subjectId, lectureId, currentLectures) {
    const updatedSubjectLectures = (currentLectures[subjectId] || []).filter(lecture =>
      lecture.id !== lectureId
    );
    await this.updateData({
      [`lectures/${subjectId}`]: updatedSubjectLectures
    });
  }

  // Notes operations
  async addNote(subjectId, noteData, currentNotes) {
    const allNotes = Object.values(currentNotes).flat();
    const newNote = {
      id: Math.max(0, ...allNotes.map(item => item.id)) + 1,
      ...noteData,
      addedOn: new Date().toISOString().split('T')[0]
    };

    const updatedSubjectNotes = [...(currentNotes[subjectId] || []), newNote];
    await this.updateData({
      [`notes/${subjectId}`]: updatedSubjectNotes
    });
    return newNote;
  }

  async updateNote(subjectId, noteId, updates, currentNotes) {
    const updatedSubjectNotes = (currentNotes[subjectId] || []).map(note =>
      note.id === noteId ? { ...note, ...updates } : note
    );
    await this.updateData({
      [`notes/${subjectId}`]: updatedSubjectNotes
    });
  }

  async deleteNote(subjectId, noteId, currentNotes) {
    const updatedSubjectNotes = (currentNotes[subjectId] || []).filter(note =>
      note.id !== noteId
    );
    await this.updateData({
      [`notes/${subjectId}`]: updatedSubjectNotes
    });
  }

  // DPP operations
  async addDpp(subjectId, dppData, currentDpps) {
    const allDpps = Object.values(currentDpps).flat();
    const newDpp = {
      id: Math.max(0, ...allDpps.map(item => item.id)) + 1,
      ...dppData,
      addedOn: new Date().toISOString().split('T')[0]
    };

    const updatedSubjectDpps = [...(currentDpps[subjectId] || []), newDpp];
    await this.updateData({
      [`dpps/${subjectId}`]: updatedSubjectDpps
    });
    return newDpp;
  }

  async updateDpp(subjectId, dppId, updates, currentDpps) {
    const updatedSubjectDpps = (currentDpps[subjectId] || []).map(dpp =>
      dpp.id === dppId ? { ...dpp, ...updates } : dpp
    );
    await this.updateData({
      [`dpps/${subjectId}`]: updatedSubjectDpps
    });
  }

  async deleteDpp(subjectId, dppId, currentDpps) {
    const updatedSubjectDpps = (currentDpps[subjectId] || []).filter(dpp =>
      dpp.id !== dppId
    );
    await this.updateData({
      [`dpps/${subjectId}`]: updatedSubjectDpps
    });
  }

  // Batch-Subject relationship operations
  async addSubjectToBatch(batchId, subjectId, currentBatches) {
    const updatedBatches = currentBatches.map(batch =>
      batch.id === batchId
        ? { ...batch, subjects: [...(batch.subjects || []), subjectId] }
        : batch
    );
    await this.updateData({ batches: updatedBatches });
  }

  async removeSubjectFromBatch(batchId, subjectId, currentBatches) {
    const updatedBatches = currentBatches.map(batch =>
      batch.id === batchId
        ? { ...batch, subjects: (batch.subjects || []).filter(id => id !== subjectId) }
        : batch
    );
    await this.updateData({ batches: updatedBatches });
  }

  // Reset data
  async resetData() {
    await set(this.dataRef, initialData);
    localStorage.setItem('eduverse-data', JSON.stringify(initialData));
  }

  // Cleanup method
  cleanup() {
    this.listeners.forEach(listener => {
      off(this.dataRef, 'value', listener);
    });
    this.listeners = [];
  }
}

export default new FirebaseDataService();
