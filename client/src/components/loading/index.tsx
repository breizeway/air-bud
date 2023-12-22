"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const INIT_NUM_DOTS = 3;
const DEFAULT_MESSAGE = "Loading";
const getDots = (numDots: number) =>
  [...Array(numDots).keys()].map((_) => ".").join("");

interface LoadingProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}
export default function Loading({
  isLoading,
  message: propMessage,
  className,
}: LoadingProps) {
  const message = propMessage ?? DEFAULT_MESSAGE;
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!isLoading) return;

    let numDots = INIT_NUM_DOTS;
    let incrementing = true;

    const interval = setInterval(() => {
      if (numDots === 3) incrementing = false;
      if (numDots === 0) incrementing = true;

      numDots = numDots + (incrementing ? 1 : -1);
      const loadingMessage = message + getDots(numDots);

      if (ref.current) ref.current.innerText = loadingMessage;
    }, 400);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return <></>;

  return (
    <div className={"flex gap-2 items-center " + className ?? ""}>
      <Image
        src="/loading.gif"
        width={0}
        height={0}
        style={{ width: "1.5em", height: "1.5em" }}
        alt="spinning basketball indicating a loading state"
        priority
      />
      <span {...{ ref }}>{message + getDots(INIT_NUM_DOTS)}</span>
    </div>
  );
}
