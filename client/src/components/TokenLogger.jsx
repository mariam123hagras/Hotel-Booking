import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

const TokenLogger = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    (async () => {
      const token = await getToken();
      console.log("Clerk JWT token:", token);
    })();
  }, []);

  return null;
};

export default TokenLogger;
