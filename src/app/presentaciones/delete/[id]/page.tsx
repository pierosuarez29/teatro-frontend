"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

const DeletePresentacion = () => {
  const router = useRouter();
  const { id } = useParams(); // Obteniendo el ID de los parámetros de la URL

  useEffect(() => {
    if (id) {
      const deletePresentacion = async () => {
        try {
          await axios.delete(`/api/presentaciones/${id}`);
          router.push('/presentaciones');
        } catch (error) {
          console.error(error);
        }
      };
      deletePresentacion();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full" role="status">
          <span className="sr-only">Eliminando...</span>
        </div>
        <p className="mt-3">Eliminando Presentación...</p>
      </div>
    </div>
  );
};

export default DeletePresentacion;
