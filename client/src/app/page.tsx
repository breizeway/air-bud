import Image from "next/image";

export default function Home() {
  return (
    <section className="flex h-full flex-col items-center justify-between">
      <Image
        src="/under-construction.gif"
        alt="website under construction"
        width={200} // 1/2 scale
        height={200} // 1/2 scale
      />
      <Image
        src="/bouncing-ball.gif"
        alt="bouncing baskeball"
        width={105} // 1/2 scale
        height={175} // 1/2 scale
      />
    </section>
  );
}
