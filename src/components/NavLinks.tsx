"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/authContext";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const { user, logout } = useAuth();
  const router = usePathname();

  return (
    <section>
      <nav className="flex justify-between px-5 py-3 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={70} height={70} />
          <h1 className="text-xl font-bold">Teatro</h1>
        </Link>
        {router === "/register" ||
        router === "/login" ? null : (
          <ul className="flex gap-4 items-center">
            <li>
              <Link href="/obras">Obras</Link>
            </li>
            {user ? (
              <>
                <li>
                  <span className="font-semibold">{`Hola, ${user.name}`}</span>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="py-2 px-4 bg-red-500 rounded-xl font-semibold text-white"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/register">
                    <button className="py-2 px-4 bg-[#F4C753] rounded-xl font-semibold text-[#403B2A]">
                      Registrarse
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/login">
                    <button className="py-2 px-4 bg-[#29384C] rounded-xl font-semibold text-white">
                      Ingresar
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}
      </nav>
    </section>
  );
}
