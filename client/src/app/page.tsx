import Image from "next/image";

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-10"
      style={{
        backgroundImage: "url('/wood.svg')",
        backgroundSize: "720px",
      }}
    >
      <h1 className="text-3xl">
        Welcome to the official Ball Is Lyf3 World Wide Web site
      </h1>
      <Image
        src="/bouncing-ball.gif"
        alt="bouncing baskeball"
        width={100}
        height={200}
      />
    </main>
  );
}
