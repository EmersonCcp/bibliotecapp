export interface ILibro {
    libr_codigo?: number; // opcional si lo genera la base de datos
    libr_titulo: string;
    libr_autor: string;
    libr_descripcion: string;
    libr_urlImagen: string;
    libr_urlFile: string;
    libr_categoria: string;
    libr_estado?: boolean; // opcional porque tiene valor por defecto
    libr_cantidad_vistas?: number; // opcional porque tiene valor por defecto
    selected?:any
  }