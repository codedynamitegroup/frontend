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
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    getHeight();
    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [ref]);

  return {
    height,
    width
  };
}
