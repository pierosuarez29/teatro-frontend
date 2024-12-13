"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Presentacion } from '../../../../types';

const EditPresentacion = () => {
  const router = useRouter();
  const { id } = useParams(); // Obteniendo el ID de los parámetros de la ruta

  console.log('ID obtenido de los parámetros de la ruta:', id); // Depuración

  const [formData, setFormData] = useState<Presentacion | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPresentacion = async () => {
        try {
          console.log('Haciendo solicitud a la API para obtener los datos de la presentación'); // Depuración
          const response = await axios.get(`/api/presentaciones/${id}`);
          console.log('Datos recibidos de la API:', response.data); // Depuración
          setFormData(response.data);
        } catch (error) {
          console.error('Error al obtener la presentación:', error);
        }
      };
      fetchPresentacion();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      try {
        await axios.put(`/api/presentaciones/${id}`, formData);
        router.push('/presentaciones');
      } catch (error) {
        console.error('Error al actualizar la presentación:', error);
      }
    }
  };

  return formData ? (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">Editar Presentación</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="titulo" className="sr-only">Título</label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Título"
                value={formData.titulo}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="descripcion" className="sr-only">Descripción</label>
              <input
                id="descripcion"
                name="descripcion"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="fechaHora" className="sr-only">Fecha y Hora</label>
              <input
                id="fechaHora"
                name="fechaHora"
                type="datetime-local"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.fechaHora.substring(0, 16)} // Ajustar el formato de fecha y hora
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="lugar" className="sr-only">Lugar</label>
              <input
                id="lugar"
                name="lugar"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Lugar"
                value={formData.lugar}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="precioButaca" className="sr-only">Precio Butaca</label>
              <input
                id="precioButaca"
                name="precioButaca"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Precio Butaca"
                value={formData.precioButaca}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="totalAsientos" className="sr-only">Total Asientos</label>
              <input
                id="totalAsientos"
                name="totalAsientos"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Total Asientos"
                value={formData.totalAsientos}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Actualizar Presentación
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <p className="text-center text-white">Cargando...</p>
  );
};

export default EditPresentacion;
