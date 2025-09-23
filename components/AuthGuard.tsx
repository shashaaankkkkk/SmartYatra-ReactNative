import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useSegments } from "expo-router";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("access");
      setIsAuth(!!token);
    };
    checkAuth();
  }, [segments]);

  // While checking auth, render nothing (or a loader)
  if (isAuth === null) return null;

  // Redirect non-logged-in users trying to access protected routes
  if (!isAuth && segments[0] === "tabs") {
    return <Redirect href="/login" />;
  }

  // Redirect logged-in users away from login/register
  if (isAuth && (segments[0] === "login" || segments[0] === "register")) {
    return <Redirect href="/tabs/home" />;
  }

  return <>{children}</>;
}

