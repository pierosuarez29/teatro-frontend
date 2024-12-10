"use client";

import { useState } from "react";
import { loginUser } from "@/services/api";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, user } = await loginUser(form);
      login(token, user);
      router.push("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return ( 
    <section className="w-full">
    <h1 className="text-3xl text-center font-semibold">Crear Cuenta</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-1 p-5 max-w-3xl mx-auto [&>input]:p-3 [&>input]:rounded-xl [&>input]:bg-[#1C2A36] [&>input]:mb-4 [&>input]:border [&>input]:border-neutral-700">
      <label htmlFor="email">E-mail</label>
      <input
        type="email"
        placeholder="Correo"
        value={form.email}
        name="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <label htmlFor="password">Contraseña</label>
      <input
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit" className="bg-[#F4C751] py-2 text-[#151C25] font-semibold rounded-xl hover:">Iniciar Sesión</button>
      <Link href="/register" className="text-center my-2 underline">No tienes cuenta?. Registrate</Link>
    </form>
  </section>

  );
}
