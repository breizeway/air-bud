import ScalingImage from "../scaling-image";

const NUM_ADS = 32;
export default function BannerAd() {
  const src = `/ads/ad_${Math.round(Math.random() * (NUM_ADS - 1))}.gif`;
  return (
    <a href="https://tannor.net" target="_blank" className="w-fit">
      <ScalingImage alt="banner ad" {...{ src }} />
    </a>
  );
}
