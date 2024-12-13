"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/authContext";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function NavLinks() {
  const { user, logout } = useAuth();
  const router = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // Retraso de 200 ms antes de cerrar el menú
  };

  return (
    <section>
      <nav className="flex justify-between px-5 py-3 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={70} height={70} />
          <h1 className="text-xl font-bold">Teatro</h1>
        </Link>
        {router === "/register" || router === "/login" ? null : (
          <ul className="flex gap-4 items-center">
            <li>
              <Link href="/obras">Obras</Link>
            </li>
            <li>
              <Link href="/presentaciones">Presentaciones</Link>
            </li>
            {user?.role === 'admin' && (
              <li>
                <Link href="/presentaciones/create">Crear Presentación</Link>
              </li>
            )}
            {user ? (
              <li
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="font-semibold cursor-pointer flex items-center gap-2">
                  <FaUserCircle size={24} />
                  {`Hola, ${user.name}`}
                </span>
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Perfil
                    </Link>
                    <Link
                      href="/mis-compras"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Mis Compras
                    </Link>
                    <Link
                      href="/mis-reservas"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Mis Reservas
                    </Link>
                    <Link
                      href="/configuracion"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Configuración
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
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
