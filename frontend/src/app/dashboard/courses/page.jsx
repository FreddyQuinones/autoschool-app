"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { coursesService } from "@/services/courses.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle2, Pencil, Trash2 } from "lucide-react";

// Mapa de etiquetas en español para mostrar en la UI
const LEVEL_LABELS = {
  basic: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

// Esquema de validación con Zod.
// z.coerce.number() convierte el string del input HTML a número antes de validar.
const courseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional().default(""),
  duration_hours: z.coerce
    .number({ invalid_type_error: "Debe ser un número" })
    .int("Debe ser un número entero")
    .positive("Debe ser mayor que 0"),
  price: z.coerce
    .number({ invalid_type_error: "Debe ser un número" })
    .nonnegative("No puede ser negativo"),
  level: z.enum(["basic", "intermediate", "advanced"], {
    errorMap: () => ({ message: "Selecciona un nivel válido" }),
  }),
  is_active: z.boolean().default(true),
});

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // null = modo creación; objeto = modo edición con los datos del curso seleccionado
  const [editingCourse, setEditingCourse] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      is_active: true,
      level: "basic",
      description: "",
    },
  });

  // Carga la lista de cursos desde la API
  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const data = await coursesService.getCourses();
      setCourses(data);
    } catch {
      setError("Error al cargar los cursos. Verifica la conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Rellena el formulario con los datos del curso y activa el modo edición
  const handleEdit = (course) => {
    setEditingCourse(course);
    setError("");
    setSuccess("");
    setValue("name", course.name);
    setValue("description", course.description || "");
    setValue("duration_hours", course.duration_hours);
    setValue("price", Number(course.price));
    setValue("level", course.level);
    setValue("is_active", course.is_active);
  };

  // Vuelve al modo creación y limpia el formulario
  const handleCancelEdit = () => {
    setEditingCourse(null);
    setError("");
    setSuccess("");
    reset({ is_active: true, level: "basic", description: "" });
  };

  // Pide confirmación y elimina el curso por id
  const handleDelete = async (course) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar el curso "${course.name}"?\nEsta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");
      await coursesService.deleteCourse(course.id);
      setSuccess(`Curso "${course.name}" eliminado exitosamente.`);
      // Si estábamos editando ese curso, salimos del modo edición
      if (editingCourse?.id === course.id) handleCancelEdit();
      loadCourses();
    } catch {
      setError("Error al eliminar el curso. Intenta de nuevo.");
    }
  };

  // Maneja tanto la creación como la actualización según el modo activo
  const onSubmit = async (data) => {
    try {
      setError("");
      setSuccess("");

      if (editingCourse) {
        await coursesService.updateCourse(editingCourse.id, data);
        setSuccess("Curso actualizado exitosamente.");
        setEditingCourse(null);
      } else {
        await coursesService.createCourse(data);
        setSuccess("Curso creado exitosamente.");
      }

      reset({ is_active: true, level: "basic", description: "" });
      loadCourses();
    } catch (err) {
      // Muestra los mensajes de error que devuelve la API (validaciones del serializer)
      const apiErrors = err.response?.data;
      if (apiErrors && typeof apiErrors === "object") {
        const messages = Object.values(apiErrors).flat().join(" ");
        setError(messages);
      } else {
        setError("Error al guardar el curso. Intenta de nuevo.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
        <p className="text-gray-500 mt-2">Gestiona el catálogo de cursos.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* ── Columna izquierda: formulario de creación / edición ── */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingCourse ? "Editar curso" : "Registrar nuevo"}
              </CardTitle>
              <CardDescription>
                {editingCourse
                  ? `Editando: ${editingCourse.name}`
                  : "Añade un nuevo curso al catálogo."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input id="description" {...register("description")} />
                </div>

                {/* Duración en horas */}
                <div className="space-y-2">
                  <Label htmlFor="duration_hours">Duración (horas)</Label>
                  <Input
                    id="duration_hours"
                    type="number"
                    min="1"
                    {...register("duration_hours")}
                  />
                  {errors.duration_hours && (
                    <p className="text-sm text-red-500">
                      {errors.duration_hours.message}
                    </p>
                  )}
                </div>

                {/* Precio */}
                <div className="space-y-2">
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("price")}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price.message}</p>
                  )}
                </div>

                {/* Nivel — select nativo con estilo coherente al resto de inputs */}
                <div className="space-y-2">
                  <Label htmlFor="level">Nivel</Label>
                  <select
                    id="level"
                    {...register("level")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="basic">Básico</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avanzado</option>
                  </select>
                  {errors.level && (
                    <p className="text-sm text-red-500">{errors.level.message}</p>
                  )}
                </div>

                {/* Estado activo/inactivo */}
                <div className="flex items-center gap-2">
                  <input
                    id="is_active"
                    type="checkbox"
                    {...register("is_active")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="is_active">Curso activo</Label>
                </div>

                {/* Botones submit / cancelar */}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Guardando..."
                      : editingCourse
                      ? "Actualizar Curso"
                      : "Guardar Curso"}
                  </Button>
                  {editingCourse && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>

              {/* Alertas de error y éxito */}
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mt-4 border-green-500 text-green-700">
                  <CheckCircle2 className="h-4 w-4" color="green" />
                  <AlertTitle>Éxito</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Columna derecha: tabla de cursos ── */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Listado de Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-gray-500 py-4">
                  Cargando cursos...
                </p>
              ) : courses.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No hay cursos registrados.
                </p>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Horas</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Nivel</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">
                            {course.name}
                          </TableCell>
                          {/* Trunca la descripción para no romper el layout */}
                          <TableCell className="max-w-[140px] truncate text-gray-500">
                            {course.description || "—"}
                          </TableCell>
                          <TableCell>{course.duration_hours}h</TableCell>
                          <TableCell>
                            ${Number(course.price).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {LEVEL_LABELS[course.level] || course.level}
                          </TableCell>
                          <TableCell>
                            {/* Badge de color según estado */}
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                course.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {course.is_active ? "Activo" : "Inactivo"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {/* Botón editar */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(course)}
                                title="Editar curso"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              {/* Botón eliminar */}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(course)}
                                title="Eliminar curso"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
