"use client";

import ScalingImage from "../scaling-image";

const NUM_ADS = 32;
export default function BannerAd() {
  return (
    <a href="https://tannor.net" target="_blank" className="w-fit">
      <ScalingImage
        alt="banner ad"
        src={`/ads/ad_${Math.round(Math.random() * (NUM_ADS - 1))}.gif`}
      />
    </a>
  );
}
