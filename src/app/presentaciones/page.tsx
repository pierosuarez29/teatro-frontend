"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/authContext";

const ListPresentaciones = () => {
  const { user } = useAuth();
  const [presentaciones, setPresentaciones] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPresentaciones = async () => {
      try {
        const response = await axios.get('/api/presentaciones'); // La solicitud se redirige a http://localhost:4000/api/presentaciones
        setPresentaciones(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPresentaciones();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/presentaciones/${id}`);
      setPresentaciones(presentaciones.filter((presentacion: any) => presentacion._id !== id));
    } catch (error) {
      console.error('Error al eliminar la presentación:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Presentaciones</h1>
        {user?.role === 'admin' && (
          <Link href="/presentaciones/create">
            <button className="mb-6 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md">
              Crear Nueva Presentación
            </button>
          </Link>
        )}
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {presentaciones.map((presentacion: any) => (
            <li key={presentacion._id} className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
              <Link href={`/presentaciones/${presentacion._id}`}>
                <h2 className="text-xl font-semibold mb-2">{presentacion.titulo}</h2>
                <p className="text-gray-400">{presentacion.descripcion}</p>
              </Link>
              {user?.role === 'admin' && (
                <div className="flex justify-between mt-4">
                  <Link href={`/presentaciones/edit/${presentacion._id}`}>
                    <button className="py-1 px-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                      Editar
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(presentacion._id)}
                    className="py-1 px-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListPresentaciones;
