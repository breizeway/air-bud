"use client";

import { classNames } from "@/utils";
import { useEffect, useRef, useState } from "react";
import ScalingImage from "../scaling-image";

interface LoadingProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}
const NUM_DOTS = 3;
export default function Loading({
  isLoading,
  message,
  className,
}: LoadingProps) {
  const [dotIdx, _setDotIdx] = useState(-1);
  const dotIdxRef = useRef(dotIdx);
  const setDotIdx = (num: number) => {
    _setDotIdx(num);
    dotIdxRef.current = num;
  };

  useEffect(() => {
    if (!isLoading || !message) return;

    const interval = setInterval(() => {
      setDotIdx(dotIdxRef.current === NUM_DOTS - 1 ? 0 : dotIdxRef.current + 1);
    }, 300);

    return () => clearInterval(interval);
  }, [isLoading, message, setDotIdx]);

  if (!isLoading) return <></>;

  return !message ? (
    <ScalingImage
      src="/loading.gif"
      wEm={1}
      hEm={1}
      className={classNames({
        [className ?? ""]: !!className,
      })}
      alt="spinning basketball indicating a loading state"
      priority
    />
  ) : (
    <div
      className={classNames("gap-2 flex items-center", {
        [className ?? ""]: !!className,
      })}
    >
      <ScalingImage
        src="/loading.gif"
        wEm={1.5}
        hEm={1.5}
        alt="spinning basketball indicating a loading state"
        priority
      />
      <div className="flex items-end">
        {message}
        {[...Array(NUM_DOTS).keys()].map((_, idx) => (
          <div
            className={classNames({
              "pb-[0.15em]": idx === dotIdx,
              "pt-[0.15em]": idx !== dotIdx,
            })}
            key={idx}
          >
            .
          </div>
        ))}
      </div>
    </div>
  );
}
