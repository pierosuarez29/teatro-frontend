import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto mt-5">
      <section className="relative">
        <Image
          src="/images/hero.webp"
          alt="teatro hero"
          width={1024}
          height={585}
          className="rounded-xl"
        />

        <h1 className="absolute bottom-16 left-4 text-4xl font-bold text-white">
          Bienvenido al teatro
        </h1>

        <Link
          href="/obras"
          className="absolute bottom-4 left-4 py-2 px-4 bg-[#F4C753] rounded-xl font-semibold text-[#403B2A] z-10"
        >
          Ver obras
        </Link>
      </section>
    </div>
  );
}
