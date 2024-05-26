import { useState } from "react";
import { useBlocker } from "react-router-dom";

function useCallbackPrompt(when: boolean): [boolean, () => void, () => void] {
  const [showPrompt, setShowPrompt] = useState(false);

  const blocker = useBlocker(({ currentLocation, nextLocation, historyAction }) => {
    console.log("currentLocation", currentLocation);
    console.log("nextLocation", nextLocation);
    console.log("historyAction", historyAction);

    if (when && nextLocation.pathname !== currentLocation.pathname) {
      setShowPrompt(true);
      return true;
    }
    return false;
  });

  const cancelNavigation = () => {
    setShowPrompt(false);
    if (blocker.reset) blocker.reset();
  };

  const confirmNavigation = () => {
    setShowPrompt(false);

    if (blocker.proceed) blocker.proceed();
  };

  return [showPrompt, confirmNavigation, cancelNavigation];
}

export default useCallbackPrompt;
