import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

const DataContext = createContext(null);

// ============================================================
// Provider
// ============================================================

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  // ==========================================================
  // Get Data
  // ==========================================================

  const getData = useCallback(
    async (path = "") => {
      try {
        setLoading(true);
        setError(null);

        const cleanPath =
          String(path)
            .replace(/^\/+/, "")
            .replace(/\/+$/, "");

        const url = cleanPath
          ? `/all/${cleanPath}/totals.json`
          : `/all/totals.json`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Could not load data from ${url}`
          );
        }

        const data = await response.json();
        console.log(data);

        return data;
      } catch (err) {
        console.error(
          "Failed to load data:",
          err
        );

        setError(err.message);

        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================================
  // Context
  // ==========================================================

  return (
    <DataContext.Provider
      value={{
        getData,
        loading,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error(
      "useData must be used inside DataProvider"
    );
  }

  return context;
}