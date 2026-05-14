# Evidencias — Módulo de Cursos (AutoSchool)

## Funcionalidades implementadas

### Backend (Django REST Framework)

- **Modelo `Course`** extendido con campos `level` (basic / intermediate / advanced) e `is_active`.
- **Serializer** con validaciones: `name` no vacío, `duration_hours` > 0, `price` >= 0.
- **ViewSet** completo con los 6 endpoints REST:
  - `GET /api/courses/` — listar cursos
  - `POST /api/courses/` — crear curso
  - `GET /api/courses/{id}/` — detalle de un curso
  - `PUT /api/courses/{id}/` — editar curso completo
  - `PATCH /api/courses/{id}/` — editar campos parciales
  - `DELETE /api/courses/{id}/` — eliminar curso
- **Filtros**: por `level` y por `is_active` (`?level=basic&is_active=true`)
- **Búsqueda de texto**: por `name` y `description` (`?search=conducción`)
- **Ordenamiento**: por `price`, `duration_hours` y `created_at` (`?ordering=-price`)
- **Swagger/OpenAPI**: endpoint documentado automáticamente en `/api/docs/`

### Frontend (Next.js + React)

- **Ruta `/dashboard/courses`** con listado completo de cursos en tabla.
- **Formulario de creación** con React Hook Form y validaciones visibles.
- **Edición en línea**: al hacer clic en el lápiz, el formulario se rellena con los datos del curso seleccionado y el botón cambia a "Actualizar Curso".
- **Eliminación con confirmación**: el botón de eliminar muestra un `confirm()` antes de borrar.
- **Manejo de estados**: indicador de carga, mensajes de error y éxito.
- **Enlace en la barra de navegación** del dashboard.

## Capturas

| Archivo | Contenido |
|---|---|
| `swagger.png` | Endpoint `/api/courses/` documentado en Swagger UI |
| `courses-list.png` | Vista del frontend con el listado de cursos |
| `courses-form.png` | Vista del frontend con el formulario de creación/edición |
