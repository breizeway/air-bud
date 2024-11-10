"use client";

import { classNames } from "@/utils";
import { useEffect, useState } from "react";
import ScalingImage from "../scaling-image";

const NUM_ADS = 63;
export default function BannerAd() {
  const [src, setSrc] = useState("");
  const [invisible, setInvisible] = useState(true);
  useEffect(() => {
    setSrc(`/ads/ad_${Math.round(Math.random() * (NUM_ADS - 1))}.gif`);
    setTimeout(() => setInvisible(false), 2000 + Math.random() * 3000);
  }, []);

  return (
    <>
      {!!src && (
        <a
          href="https://tannor.net"
          target="_blank"
          className={classNames("w-fit hidden sm:inline", { invisible })}
        >
          <ScalingImage alt="banner ad" src={src} />
        </a>
      )}
    </>
  );
}
