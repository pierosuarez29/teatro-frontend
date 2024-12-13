// src/types.ts
export interface Presentacion {
    _id: string;
    titulo: string;
    descripcion: string;
    fechaHora: string;
    lugar: string;
    precioButaca: number;
    totalAsientos: number;
    asientosDisponibles: number;
  }
  
export interface Butaca {
    _id: string;
    idPresentacion: string;
    fila: string;
    columna: number;
    estado: 'disponible' | 'reservado';
    socketId: string | null;
  }

export interface Comentario {
    _id: string;
    idUsuario: {
      _id: string;
      name: string;
    };
    comentario: string;
    fechaComentario: string;
  }
  