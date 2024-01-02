"use client";

import { classNames } from "@/utils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

  return (
    <div
      className={classNames("flex gap-2 items-center", {
        [className ?? ""]: !!className,
      })}
    >
      <Image
        src="/loading.gif"
        width={0}
        height={0}
        style={{ width: "1.5em", height: "1.5em" }}
        alt="spinning basketball indicating a loading state"
        priority
      />
      {!!message && (
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
      )}
    </div>
  );
}
