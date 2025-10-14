import Link from "next/link";
import { HomeParticles } from "./home-particles";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center p-4">
      <Link
        href="/docs"
        className="-mt-24 mx-auto block font-semibold text-fd-foreground underline"
      >
        <div className="relative grid place-items-center grid-cols-1 grid-rows-1">
          <HomeParticles className="col-start-1 row-start-1 relative -top-16 sm:w-[500px] " />
          <img
            className="block row-start-1 col-start-1"
            width={300}
            height={207}
            alt="Mahou UI"
            src="/mahou.webp"
          />
        </div>
      </Link>
      <h1 className="mb-4 font-semibold text-2xl">Mahou UI</h1>
      <p className="text-fd-muted-foreground">
        You can open{" "}
        <Link
          href="/docs"
          className="font-semibold text-fd-foreground underline"
        >
          /docs
        </Link>{" "}
        and see the documentation.
      </p>
    </main>
  );
}
