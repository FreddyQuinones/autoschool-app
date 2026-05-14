from rest_framework import serializers
from .models import Student, Instructor, Vehicle, Course, Enrollment, Lesson

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

    def validate_name(self, value):
        # El nombre no puede ser solo espacios en blanco
        if not value.strip():
            raise serializers.ValidationError("El nombre no puede estar vacío.")
        return value

    def validate_duration_hours(self, value):
        # La duración debe ser positiva (mayor que 0)
        if value <= 0:
            raise serializers.ValidationError("La duración debe ser mayor que 0.")
        return value

    def validate_price(self, value):
        # El precio no puede ser negativo
        if value < 0:
            raise serializers.ValidationError("El precio no puede ser negativo.")
        return value

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'
