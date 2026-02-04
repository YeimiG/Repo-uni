/* auth hook */
import { useState } from "react";

export function useAuth() {
  // inicializar estado
  const [token] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });

  return {
    isAuth: !!token,
  };
}
