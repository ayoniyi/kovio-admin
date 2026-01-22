import React, { createContext, useEffect, useState, type ReactNode } from "react";

interface AuthState {
  user: any;
}

const userString = localStorage.getItem("kvAdmin");
let user = null;
if (userString) {
  try {
    user = JSON.parse(userString);
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    // Clear invalid data from localStorage
    localStorage.removeItem("kvAdmin");
  }
}

const INITIAL_STATE: AuthState = {
  user: user,
};

export const AuthContext = createContext<
  [AuthState, React.Dispatch<React.SetStateAction<AuthState>>]
>([INITIAL_STATE, () => {}]);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>(INITIAL_STATE);

  useEffect(() => {
    // Only save to localStorage if user data exists
    if (authState.user) {
      localStorage.setItem("kvAdmin", JSON.stringify(authState.user));
      console.log("AuthContext: Saved user to localStorage", authState.user);
    } else {
      console.log(
        "AuthContext: user is null/undefined, not saving to localStorage"
      );
    }
  }, [authState.user]);

  return (
    <AuthContext.Provider value={[authState, setAuthState]}>
      {children}
    </AuthContext.Provider>
  );
};
