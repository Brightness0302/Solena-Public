import { useState } from "react";
import { LoadingContext } from "./context";
import loadingForever from "./Images/loading-forever.gif";

const LoadingProvider = ({ children }) => {
  const [loadingState, setLoadingState] = useState({
    loading: false,
  });

  return (
    <LoadingContext.Provider value={[loadingState, setLoadingState]}>
      {loadingState.loading && (
        <div className="w-full h-full bg-black/30 z-40 fixed left-0 top-0">
          <img
            src={loadingForever}
            className="absolute w-24 h-24 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
            alt="Loading..."
          />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
