"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Presentacion, Butaca, Comentario } from '../../../types';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import io from 'socket.io-client';
import { FaUserCircle } from 'react-icons/fa';

const socket = io('http://localhost:4000');

const PresentacionDetails = () => {
  const params = useParams();
  const { id } = params; // Obteniendo el ID de los parámetros de la URL
  const [presentacion, setPresentacion] = useState<Presentacion | null>(null);
  const [butacas, setButacas] = useState<Butaca[]>([]); // Estado para las butacas
  const [selectedButacas, setSelectedButacas] = useState<Set<string>>(new Set()); // Estado para las butacas seleccionadas
  const [comentarios, setComentarios] = useState<Comentario[]>([]); // Estado para los comentarios
  const [nuevoComentario, setNuevoComentario] = useState(''); // Estado para el nuevo comentario
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      const fetchPresentacion = async () => {
        try {
          const response = await axios.get(`/api/presentaciones/${id}`);
          setPresentacion(response.data);
        } catch (error) {
          console.error('Error al obtener la presentación:', error);
        }
      };

      const fetchButacas = async () => {
        try {
          const response = await axios.get(`/api/butacas/${id}`);
          setButacas(response.data);
        } catch (error) {
          console.error('Error al obtener las butacas:', error);
        }
      };

      const fetchComentarios = async () => {
        try {
          const response = await axios.get(`/api/comentarios/${id}`);
          setComentarios(response.data);
        } catch (error) {
          console.error('Error al obtener los comentarios:', error);
        }
      };

      fetchPresentacion();
      fetchButacas();
      fetchComentarios();
    }
  }, [id]);

  useEffect(() => {
    socket.on('butacaSelected', (data) => {
      setButacas((prev) =>
        prev.map((butaca) =>
          butaca._id === data.butacaId ? { ...butaca, estado: data.estado, socketId: data.socketId } : butaca
        )
      );
    });

    return () => {
      socket.off('butacaSelected');
    };
  }, []);

  const handleButacaClick = (butacaId: string) => {
    const butaca = butacas.find((b) => b._id === butacaId);
    if (butaca?.socketId && butaca.socketId !== socket.id) {
      Swal.fire('Error', 'Este asiento está seleccionado por otro usuario.', 'error');
      return;
    }

    if (selectedButacas.has(butacaId)) {
      // Deseleccionar butaca
      setSelectedButacas((prev) => {
        const newSelected = new Set(prev);
        newSelected.delete(butacaId);
        socket.emit('selectButaca', { butacaId, estado: 'disponible', socketId: null });
        return newSelected;
      });
    } else {
      // Seleccionar butaca
      setSelectedButacas((prev) => {
        const newSelected = new Set(prev);
        newSelected.add(butacaId);
        socket.emit('selectButaca', { butacaId, estado: 'seleccionado', socketId: socket.id });
        return newSelected;
      });
    }
  };

  const handleReservar = async () => {
    const butacasSeleccionadas = Array.from(selectedButacas).map((id) => {
      const butaca = butacas.find((b) => b._id === id);
      return `${butaca?.fila}${butaca?.columna}`;
    }).join(', ');

    Swal.fire({
      title: 'Confirmar Reserva',
      html: `Usted va a reservar los asientos:<br>${butacasSeleccionadas}.<br>¿Proceder con la reserva?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await reservarButacas();
        if (response) {
          router.push(`/reservas/${response.data.reserva._id}`);
        }
      }
    });
  };

  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

  const reservarButacas = async () => {
    try {
      const response = await axios.post('/api/reservas', {
        idPresentacion: id,
        asientos: Array.from(selectedButacas),
      });
      setButacas(
        butacas.map((butaca) =>
          selectedButacas.has(butaca._id) ? { ...butaca, estado: 'reservado' } : butaca
        )
      );
      setSelectedButacas(new Set());
      return response;
    } catch (error) {
      console.error('Error al reservar las butacas:', error);
      Swal.fire('Error', 'Hubo un problema al reservar las butacas', 'error');
      return null;
    }
  };

  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNuevoComentario(e.target.value);
  };

  const handleComentarioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const commentResponse = await axios.post('/api/comentarios', { idPresentacion: id, comentario: nuevoComentario });
      setNuevoComentario('');
      const fetchResponse = await axios.get(`/api/comentarios/${id}`);
      setComentarios(fetchResponse.data);
    } catch (error) {
      console.error('Error al agregar el comentario:', error);
    }
  };

  if (!presentacion) return <p className="text-center text-white">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{presentacion.titulo}</h2>
          <p className="mb-2">{presentacion.descripcion}</p>
          <p className="mb-2">
            <strong>Fecha y Hora:</strong> {new Date(presentacion.fechaHora).toLocaleString()}
          </p>
          <p className="mb-2">
            <strong>Lugar:</strong> {presentacion.lugar}
          </p>
          <p className="mb-2">
            <strong>Precio de la Butaca:</strong> {presentacion.precioButaca}
          </p>
          <p className="mb-2">
            <strong>Total de Asientos:</strong> {presentacion.totalAsientos}
          </p>
          <p className="mb-2">
            <strong>Asientos Disponibles:</strong> {presentacion.asientosDisponibles}
          </p>
          {selectedButacas.size > 0 && (
            <button
              onClick={handleReservar}
              className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
            >
              Reservar
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-10 gap-2 mt-6">
        {butacas.map((butaca) => {
          const isOwner = butaca.socketId === socket.id;
          return (
            <div
              key={butaca._id}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer ${
                butaca.estado === 'disponible'
                  ? selectedButacas.has(butaca._id)
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                  : isOwner
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              } ${butaca.estado === 'reservado' ? 'cursor-not-allowed' : ''}`}
              onClick={() => butaca.estado !== 'reservado' && handleButacaClick(butaca._id)}
            >
              {butaca.fila}
              {butaca.columna}
            </div>
          );
        })}
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6 w-full max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-4 text-center">Comentarios</h3>
        <form onSubmit={handleComentarioSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 mb-4 text-black rounded-lg"
            placeholder="Agregar un comentario..."
            value={nuevoComentario}
            onChange={handleComentarioChange}
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md"
            >
              Enviar
            </button>
          </div>
        </form>
        <div className="mt-4 space-y-4">
          {comentarios.slice().reverse().map((comentario: Comentario) => (
            <div key={comentario._id} className="bg-gray-700 p-4 rounded-lg shadow-lg flex items-center">
              <FaUserCircle size={24} className="mr-2" />
              <div>
                <p className="text-sm text-gray-300">
                  <strong>{comentario.idUsuario?.name}:</strong> {comentario.comentario}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(comentario.fechaComentario).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PresentacionDetails;
