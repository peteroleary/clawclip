import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../lib/firebase.js"; // Adjust extension for vite

export type EmployeeType = "human" | "agent";

export interface WorkforceMember {
  id: string;
  type: EmployeeType;
  name: string;
  role: string;
  status: "active" | "offline" | "busy";
  avatarUrl?: string;
  createdAt: number;
}

const WORKFORCE_COLLECTION = "workforce";

export const getWorkforceMembers = async (type?: EmployeeType): Promise<WorkforceMember[]> => {
  const workforceRef = collection(db, WORKFORCE_COLLECTION);
  const q = type ? query(workforceRef, where("type", "==", type)) : query(workforceRef);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkforceMember));
};

export const addWorkforceMember = async (member: Omit<WorkforceMember, "id" | "createdAt">): Promise<WorkforceMember> => {
  const newDocRef = doc(collection(db, WORKFORCE_COLLECTION));
  const newMember: WorkforceMember = {
    ...member,
    id: newDocRef.id,
    createdAt: Date.now(),
  };
  
  await setDoc(newDocRef, newMember);
  return newMember;
};

export const removeWorkforceMember = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, WORKFORCE_COLLECTION, id));
};
