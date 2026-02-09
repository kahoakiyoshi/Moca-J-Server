export type UserRole = "admin" | "user";

export interface User {
  uid: string; // Firebase Auth UID
  id: string; // Sequential ID (e.g. 000001)
  lastName: string;
  firstName: string;
  email: string;
  role: UserRole;
  hospitalName?: string;
  name?: string; // For compatibility with existing useAuth
}

export interface Patient {
  uid: string; // Firebase unique document ID
  id: string; // Human-readable sequential ID (e.g. 000001)
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  gender: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  zip: string;
  prefecture: string;
  city: string;
  address1: string;
  building?: string;
  education?: string | null;
}

export interface TestResultSummary {
  id: string;
  name: string;
  date: string;
  score: number;
  approval: string;
}

export interface TestResult {
  uid: string;
  patientId: string;
  created_at: string;
  score: number;
  approved: boolean;
  duration: string;
  result: any; // JSON result
}

export interface TestItem {
  no: string;
  name: string;
  result: string;
  score: string | number;
  value:
    | string
    | {
        ids: string[];
        repairCount: number;
      };
  repairCount?: number;
  criterion: string;
  score_auto: string;
  mocaJ: string;
  time: string;
  btn?: string;
  taskKey?: string;
  answer:
    | string
    | {
        ids: string[];
        repairCount: number;
      }
    | any;
  judgmentCriteria: string;
  questionKey: string;
  gpsDetail?: string;
  isCorrect?: boolean;
  durationStr?: string;
  tapSummary?: string;
}
