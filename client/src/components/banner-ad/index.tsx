"use client";

import { useEffect, useState } from "react";
import ScalingImage from "../scaling-image";

const NUM_ADS = 59;
export default function BannerAd() {
  const [src, setSrc] = useState("");
  useEffect(() => {
    setSrc(`/ads/ad_${Math.round(Math.random() * (NUM_ADS - 1))}.gif`);
  }, []);

  return (
    <>
      {!!src && (
        <a href="https://tannor.net" target="_blank" className="w-fit">
          <ScalingImage alt="banner ad" src={src} />
        </a>
      )}
    </>
  );
}
