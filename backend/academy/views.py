from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Student, Instructor, Vehicle, Course, Enrollment, Lesson
from .serializers import (
    StudentSerializer, StudentPictureSerializer, InstructorSerializer, VehicleSerializer,
    CourseSerializer, EnrollmentSerializer, LessonSerializer
)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    search_fields = ['first_name', 'last_name', 'email']
    ordering_fields = ['created_at', 'first_name', 'last_name']

    @action(detail=True, methods=['post'], url_path='upload-picture',
            parser_classes=[MultiPartParser, FormParser])
    def upload_picture(self, request, pk=None):
        # Obtiene el estudiante por su pk; lanza 404 si no existe
        student = self.get_object()

        # Valida que el archivo haya llegado en la petición
        incoming_file = request.FILES.get('profile_picture')
        if not incoming_file:
            return Response(
                {'detail': 'Debes enviar el archivo profile_picture.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Usa StudentPictureSerializer para validar tipo/tamaño y persistir el archivo
        serializer = StudentPictureSerializer(
            student,
            data=request.FILES,
            partial=True,
        )
        if not serializer.is_valid():
            # Retorna los errores de validación con 400
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        # Retorna el estudiante completo (con la URL pública de la imagen) al frontend
        return Response(
            StudentSerializer(student, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )

class InstructorViewSet(viewsets.ModelViewSet):
    pass

class VehicleViewSet(viewsets.ModelViewSet):
    pass

class CourseViewSet(viewsets.ModelViewSet):
    pass
class EnrollmentViewSet(viewsets.ModelViewSet):
    pass

class LessonViewSet(viewsets.ModelViewSet):
    pass
