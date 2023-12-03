import Image from "next/image";

export default function Home() {
  return (
    <section className="grow p-2">
      Hi! If you are a member of the ESPN fantasy basketball league "Ball is
      Lyf3" and want to know all about the scores and the players that make it
      up - you have come to the right place.
      <Image
        src="/under-construction.gif"
        alt="website under construction"
        width={300}
        height={228.31}
      />
    </section>
  );
}
