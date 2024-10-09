import { useAuth } from "@clerk/clerk-expo";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

const MainRoutes = () => {
  const router = useRouter();
  const rootSegment = useSegments()[0];
  const { isLoaded, isSignedIn } = useAuth();

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      return router.replace("/sign-in");
    }

    /*
       NOTE: isSignedIn is needed here in to prevent "Error: Maximum update depth exceeded" from being thrown.
       Ensure user authentication state is maintained during redirects to prevent infinite loops between (auth) group and main route "/"
    */
    // if (isSignedIn && rootSegment !== "(auth)" && !siteId) {
    //   return router.replace("/select-site");
    // }

    // if (isSignedIn && rootSegment === "") {
    //   return router.replace("/");
    // }
  }, [isSignedIn, rootSegment]);

  return <Slot />;
};

export default MainRoutes;
