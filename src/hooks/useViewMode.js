import { useEffect, useState } from "react";

function useViewMode(key, defaultView = "compact") {
  const storageKey = `restaurantos-${key}-view`;

  const [view, setView] = useState(() => {
    return localStorage.getItem(storageKey) || defaultView;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, view);
  }, [storageKey, view]);

  return [view, setView];
}

export default useViewMode;
