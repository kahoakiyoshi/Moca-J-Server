"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { User } from "@/types";
import { ROLES } from "@/lib/constants";

/**
 * Interface for authentication context
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component to wrap the application
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log("Firebase Auth State Changed:", firebaseUser?.email || "No User");
      if (firebaseUser) {
        // Fetch additional user data from our API helper (uses Admin SDK to bypass permissions)
        try {
          // Get ID token first to authenticate the API request
          const idToken = await firebaseUser.getIdToken();
          Cookies.set("id_token", idToken, { expires: 1 });

          const response = await fetch("/api/auth/me");
          if (!response.ok) {
            throw new Error("Failed to fetch user profile from API");
          }

          const { user: userData } = await response.json();

          setUser(userData);
          localStorage.setItem("admin_user", JSON.stringify(userData));
          Cookies.set("is_authenticated", "true", { expires: 1 });
          Cookies.set("user_role", userData.role, { expires: 1 });
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback basic user object if API fails
          const fallbackUser: User = {
            uid: firebaseUser.uid,
            id: "",
            email: firebaseUser.email || "",
            lastName: "",
            firstName: "",
            role: ROLES.USER,
            name: firebaseUser.displayName || "User",
          };
          setUser(fallbackUser);
        }
      } else {
        setUser(null);
        localStorage.removeItem("admin_user");
        Cookies.remove("is_authenticated");
        Cookies.remove("id_token");
        Cookies.remove("user_role");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("admin_user", JSON.stringify(userData));
    Cookies.set("is_authenticated", "true", { expires: 1 });
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    localStorage.removeItem("admin_user");
    Cookies.remove("is_authenticated");
    Cookies.remove("id_token");
    Cookies.remove("user_role");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("admin_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context in components
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
