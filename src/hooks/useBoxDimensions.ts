import { useState, useEffect } from "react";

interface BoxDimensionsProps {
  ref: React.RefObject<HTMLDivElement>;
}
export default function useBoxDimensions({ ref }: BoxDimensionsProps) {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const getHeight = () => {
      if (ref.current) {
        const heightTemp = ref.current.clientHeight;
        const widthTemp = ref.current.clientWidth;
        setHeight(heightTemp);
        setWidth(widthTemp);
      }
    };
    const resizeObserver = new ResizeObserver(getHeight);
    const currentRef = ref.current;
    if (currentRef) {
      resizeObserver.observe(currentRef);
    }

    getHeight();
    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, [ref, ref.current]);

  return {
    height,
    width
  };
}
