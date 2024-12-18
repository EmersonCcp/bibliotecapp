export interface Book {
  id?: string; // ID opcional (Document ID en Firebase)
  title: string; // Título del libro
  author?: string; // Autor del libro
  description?: string; // Descripción opcional
  urlImage?: string; // URL de la imagen del libro
  urlFile?: string; // URL de la imagen del libro
  publishedDate?: string; // Fecha de publicación (opcional)
  category?: string; // Categoría a la que pertenece el libro
}
