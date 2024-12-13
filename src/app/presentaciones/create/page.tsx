"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const CreatePresentacion = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaHora: '',
    lugar: '',
    precioButaca: 0,
    totalAsientos: 0,
  });

  const [image, setImage] = useState<File | null>(null);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, (formData as any)[key]);
    }
    if (image) {
      form.append('image', image);
    }

    try {
      const response = await axios.post('/api/presentaciones', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/presentaciones');
    } catch (error) {
      console.error('Error al crear la presentación:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-indigo-500">Crear Presentación</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-300">Título</label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Título"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300">Descripción</label>
              <input
                id="descripcion"
                name="descripcion"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Descripción"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="fechaHora" className="block text-sm font-medium text-gray-300">Fecha y Hora</label>
              <input
                id="fechaHora"
                name="fechaHora"
                type="datetime-local"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="lugar" className="block text-sm font-medium text-gray-300">Lugar</label>
              <input
                id="lugar"
                name="lugar"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Lugar"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="precioButaca" className="block text-sm font-medium text-gray-300">Precio Butaca</label>
              <input
                id="precioButaca"
                name="precioButaca"
                type="number"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Precio Butaca"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="totalAsientos" className="block text-sm font-medium text-gray-300">Total Asientos</label>
              <input
                id="totalAsientos"
                name="totalAsientos"
                type="number"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Total Asientos"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-300">Imagen</label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Crear Presentación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePresentacion;
