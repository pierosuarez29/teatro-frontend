"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import axios from 'axios';

const ReservaConfirmacion = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Obteniendo el ID de los parámetros de la URL
  const [reserva, setReserva] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const fetchReserva = async () => {
        try {
          console.log(`Fetching reserva with ID: ${id}`); // Log para depuración
          const response = await axios.get(`/api/reservas/${id}`);
          console.log('Reserva fetched:', response.data); // Log para depuración
          setReserva(response.data);
        } catch (error) {
          console.error('Error al obtener la reserva:', error);
        }
      };

      fetchReserva();
    }
  }, [id]);

  if (!reserva) return <p className="text-center text-white">Cargando...</p>;

  const handleAceptar = async () => {
    try {
      await axios.put(`/api/reservas/${id}`, { estado: 'aceptada' });
      Swal.fire({
        title: 'Éxito',
        text: 'Reserva realizada',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        router.push('/'); // Redirigir a la página raíz
      });
    } catch (error) {
      console.error('Error al aceptar la reserva:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Confirmación de Reserva</h2>
          <p className="mb-2"><strong>Presentación:</strong> {reserva.idPresentacion.titulo}</p>
          <p className="mb-2"><strong>Fecha y Hora:</strong> {new Date(reserva.idPresentacion.fechaHora).toLocaleString()}</p>
          <p className="mb-2"><strong>Lugar:</strong> {reserva.idPresentacion.lugar}</p>
          <p className="mb-2"><strong>Asientos:</strong> {reserva.butacas.map((butaca: any) => `${butaca.fila}${butaca.columna}`).join(', ')}</p>
          <p className="mb-2"><strong>Cantidad de Asientos:</strong> {reserva.butacas.length}</p>
          <p className="mb-2"><strong>Precio por Asiento:</strong> {reserva.idPresentacion.precioButaca}</p>
          <p className="mb-2"><strong>Total a Pagar:</strong> {reserva.totalPago}</p>
          <button
            onClick={handleAceptar}
            className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservaConfirmacion;
