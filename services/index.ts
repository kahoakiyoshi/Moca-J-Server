import { auth, db } from "@/lib/firebase";
import { ROLES } from "@/lib/constants";
import {
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { User, Patient, TestResultSummary, TestResult } from "../types";

// Mock data for other services
const MOCK_PATIENTS: Patient[] = [
  {
    uid: "mock-1",
    id: "000001",
    lastName: "田中",
    firstName: "太郎",
    lastNameKana: "たなか",
    firstNameKana: "たろう",
    gender: "male",
    birthYear: "1960",
    birthMonth: "1",
    birthDay: "1",
    zip: "100-0001",
    prefecture: "東京都",
    city: "千代田区",
    address1: "千代田1-1",
    building: "",
    education: "16",
  },
];

export const patientService = {
  getPatients: async (params?: {
    page?: number;
    limit?: number;
    id?: string;
    searchName?: string;
  }): Promise<{ patients: Patient[]; totalCount: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.id) queryParams.append("id", params.id);
    if (params?.searchName) queryParams.append("searchName", params.searchName);

    const response = await fetch(`/api/patients?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch patients");
    }
    return await response.json();
  },

  savePatient: async (patient: Patient, isNew: boolean = true): Promise<void> => {
    const url = isNew ? "/api/patients" : `/api/patients/${patient.uid}`;
    const method = isNew ? "POST" : "PATCH";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save patient");
    }
  },

  deletePatient: async (uid: string): Promise<void> => {
    const response = await fetch(`/api/patients/${uid}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete patient");
    }
  },
};

export const userService = {
  getUsers: async (params?: { id?: string; searchName?: string }): Promise<User[]> => {
    const queryParams = new URLSearchParams();
    if (params?.id) queryParams.append("uid", params.id);
    if (params?.searchName) queryParams.append("searchName", params.searchName);

    const response = await fetch(`/api/users?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await response.json();
    return data.users;
  },

  saveUser: async (user: User, isNew: boolean = false): Promise<void> => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, isNew }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save user");
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete user");
    }
  },
};

export const authService = {
  login: async (credentials: any) => {
    const { email, password } = credentials;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Get additional user info from Firestore (safely handle permission errors)
    let userData = null;
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      userData = userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.warn("Firestore read failed during login, will retry via API in AuthContext:", error);
    }

    return {
      uid: firebaseUser.uid,
      id: userData?.id || "",
      email: firebaseUser.email || "",
      lastName: userData?.lastName || "",
      firstName: userData?.firstName || "",
      role: userData?.role || ROLES.USER,
    } as User;
  },

  logout: async () => {
    await signOut(auth);
  },

  changePassword: async (passwords: any) => {
    const { currentPassword, newPassword } = passwords;
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("User not logged in");

    // Re-authenticate user before updating password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  },
};

export const testResultService = {
  getTestResults: async (params?: {
    patientId?: string;
    approved?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<TestResult[]> => {
    const queryParams = new URLSearchParams();
    if (params?.patientId) queryParams.append("patientId", params.patientId);

    if (params?.approved === "approved") queryParams.append("approved", "true");
    else if (params?.approved === "unapproved") queryParams.append("approved", "false");

    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const response = await fetch(`/api/test-results?${queryParams.toString()}`);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.results;
  },

  getTestResultDetail: async (
    id: string
  ): Promise<{ testResult: TestResult; patient: Patient | null }> => {
    const response = await fetch(`/api/test-results/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch test result detail");
    }
    return await response.json();
  },

  updateTestResult: async (id: string, data: Partial<TestResult>): Promise<void> => {
    const response = await fetch(`/api/test-results/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update test result");
    }
  },

  saveTestResult: async (result: Partial<TestResult>): Promise<TestResult> => {
    const response = await fetch("/api/test-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save test result");
    }
    return await response.json();
  },
};
