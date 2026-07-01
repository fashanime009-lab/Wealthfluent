import { useEffect, useState } from "react";

import { getGoals } from "../services/goalEngine";
import { buildNetWorth } from "../services/netWorthEngine";

export default function useNetWorth() {
  const [state, setState] = useState(
    buildNetWorth(getGoals())
  );

  useEffect(() => {
    const refresh = () => {
      setState(buildNetWorth(getGoals()));
    };

    window.addEventListener(
      "finaiw:goals-updated",
      refresh
    );

    return () =>
      window.removeEventListener(
        "finaiw:goals-updated",
        refresh
      );
  }, []);

  return state;
}