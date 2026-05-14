from django.db import migrations, models


class Migration(migrations.Migration):
    """
    Agrega los campos 'level' e 'is_active' al modelo Course.
    Se ejecuta después de la migración inicial (0001_initial).
    """

    dependencies = [
        ('academy', '0001_initial'),
    ]

    operations = [
        # Nivel del curso: basic, intermediate o advanced
        migrations.AddField(
            model_name='course',
            name='level',
            field=models.CharField(
                choices=[
                    ('basic', 'Basic'),
                    ('intermediate', 'Intermediate'),
                    ('advanced', 'Advanced'),
                ],
                default='basic',
                max_length=20,
            ),
        ),
        # Indica si el curso está disponible para inscripción
        migrations.AddField(
            model_name='course',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
