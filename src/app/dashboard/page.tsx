"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    availableSeats: number;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    availableSeats: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/events"); // Asegúrate que el endpoint esté bien configurado
      setEvents(response.data);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;
    if (name === "fecha"){
      const date = new Date(value);
      const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      value = formattedDate;
    }
    setFormData({ ...formData, [name]: value });
  };

  const createEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/events",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEvents([...events, response.data.event]);
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        availableSeats: "",
      });
    } catch (error) {
      console.error("Error al crear el evento:", error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
    }
  };

  const editEvent = async (id: string) => {
    try {
      const updatedEvent = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        availableSeats: formData.availableSeats,
      };

      const response = await axios.put(
        `http://localhost:4000/api/events/${id}`,
        updatedEvent,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Actualiza la lista de eventos con los datos actualizados
      setEvents(
        events.map((event) => (event._id === id ? response.data.event : event))
      );

      // Limpia el formulario después de editar
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        availableSeats: "",
      });
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingId) {
      await editEvent(editingId);
      setEditingId(null); // Limpia el estado de edición
    } else {
      await createEvent(e);
    }
  };

  const handleEditClick = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      availableSeats: String(event.availableSeats),
    });
    setEditingId(event._id);
  };
  
  const [editingId, setEditingId] = useState<string | null>(null);
  

  return (
    <section className="w-full">
      <form
        className="flex flex-col max-w-2xl mx-auto [&>input]:p-3 [&>input]:rounded-xl [&>input]:bg-[#1C2A36] [&>input]:mb-4 [&>input]:border [&>input]:border-neutral-700"
        onSubmit={handleSubmit}
      >
        <input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Título"
          required
        />
        <textarea
          className="p-3 rounded-xl bg-[#1C2A36] mb-4 border border-neutral-700"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Descripción"
          required
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <input
          name="time"
          type="time"
          value={formData.time}
          onChange={handleInputChange}
          required
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Ubicación"
          required
        />
        <input
          name="availableSeats"
          type="number"
          value={formData.availableSeats}
          onChange={handleInputChange}
          placeholder="Asientos disponibles"
          required
        />
        <button
          type="submit"
          className="bg-[#F4C751] py-2 text-[#151C25] font-semibold rounded-xl hover:"
        >
          Crear Evento
        </button>
      </form>

      <table className="w-full max-w-4xl mx-auto mt-5">
        <thead>
          <tr className="bg-slate-800">
            <th className="rounded-tl-xl">Título</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Ubicación</th>
            <th>Asientos disponibles</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id} className="border border-x-0 [&>td]:px-2">
              <td>{event.title}</td>
              <td>{event.description}</td>
              <td>
                Fecha: {event.date} | Hora: {event.time}
              </td>
              <td>Ubicación: {event.location}</td>
              <td>Asientos disponibles: {event.availableSeats}</td>
              <td className="text-black space-y-3">
                <button
                  onClick={() => deleteEvent(event._id)}
                  className="rounded-xl w-full px-2 py-1 bg-red-500"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => handleEditClick(event)}
                  className="w-full rounded-xl px-2 py-1 bg-yellow-400"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
