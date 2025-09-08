import { useCallback, useRef, useState } from "react";

interface PreviewSectionRef {
  container: HTMLDivElement | null;
}

export const useCanvas = () => {
  // Local state for canvas UI
  const [showAllBoxes, setShowAllBoxes] = useState<boolean>(true);
  const [activeLine, setActiveLine] = useState<number | null>(null);

  const previewSectionRef = useRef<PreviewSectionRef>(null);

  const handleSetActiveLine = useCallback(
    (index: number) => {
      setActiveLine(index);
    },
    [setActiveLine]
  );

  const handleToggleAllBoxes = useCallback(() => {
    setShowAllBoxes(!showAllBoxes);
  }, [showAllBoxes, setShowAllBoxes]);

  return {
    showAllBoxes,
    activeLine,
    previewSectionRef,
    handleSetActiveLine,
    handleToggleAllBoxes,
  };
};
