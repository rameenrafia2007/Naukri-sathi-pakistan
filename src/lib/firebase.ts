import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, getDocs, Timestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Simple connection test
async function testConnection() {
  try {
    await getDoc(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Profile Service
export interface ExperienceEntry {
  title: string;
  company: string;
  duration: string;
  responsibilities: string;
}

export interface UserProfile {
  userId: string;
  profession: string;
  skillsDescription: string;
  
  // Personal Info
  name: string;
  phone: string;
  email?: string;
  city: string;
  dob?: string;
  cnic?: string;

  // Work Experience
  experiences: ExperienceEntry[];
  
  // Education
  education: {
    level: string;
    institute?: string;
    year?: string;
    certifications?: string;
  };

  // Skills
  technicalSkills: string[];
  softSkills: string[];
  languages: string[];

  // Additional
  linkedin?: string;
  awards?: string;
  referencesAvailable: boolean;

  // Goals & Preferences
  goals: string[];
  salaryExpectation: number;
  
  createdAt?: any;
  updatedAt?: any;
}

export const saveProfile = async (profileData: Omit<UserProfile, 'userId'>) => {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
  const uid = auth.currentUser!.uid;
  const path = `profiles/${uid}`;
  
  try {
    const profileRef = doc(db, 'profiles', uid);
    const snap = await getDoc(profileRef);
    if (!snap.exists()) {
      await setDoc(profileRef, {
        ...profileData,
        userId: uid,
        createdAt: serverTimestamp()
      });
    } else {
      await updateDoc(profileRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
    }
    return uid;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const saveResult = async (resultData: any) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    const uid = auth.currentUser.uid;
    const path = `results/${uid}`;
    try {
      await setDoc(doc(db, 'results', uid), {
        ...resultData,
        userId: uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
};

export const getResult = async () => {
    if (!auth.currentUser) return null;
    const uid = auth.currentUser.uid;
    const path = `results/${uid}`;
    try {
      const docSnap = await getDoc(doc(db, 'results', uid));
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
       handleFirestoreError(error, OperationType.GET, path);
    }
}

export const getProfile = async () => {
  if (!auth.currentUser) return null;
  const uid = auth.currentUser.uid;
  const path = `profiles/${uid}`;
  try {
    const docSnap = await getDoc(doc(db, 'profiles', uid));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};
