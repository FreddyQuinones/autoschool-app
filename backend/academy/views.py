from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Student, Instructor, Vehicle, Course, Enrollment, Lesson
from .serializers import (
    StudentSerializer, InstructorSerializer, VehicleSerializer,
    CourseSerializer, EnrollmentSerializer, LessonSerializer
)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    search_fields = ['first_name', 'last_name', 'email']
    ordering_fields = ['created_at', 'first_name', 'last_name']

class InstructorViewSet(viewsets.ModelViewSet):
    pass

class VehicleViewSet(viewsets.ModelViewSet):
    pass

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    # Filtros exactos: ?level=basic  o  ?is_active=true
    filterset_fields = ['level', 'is_active']

    # Búsqueda de texto: ?search=conduccion
    search_fields = ['name', 'description']

    # Ordenamiento: ?ordering=price  o  ?ordering=-created_at
    ordering_fields = ['price', 'duration_hours', 'created_at']

    # Orden por defecto: más recientes primero
    ordering = ['-created_at']

class EnrollmentViewSet(viewsets.ModelViewSet):
    pass

class LessonViewSet(viewsets.ModelViewSet):
    pass
