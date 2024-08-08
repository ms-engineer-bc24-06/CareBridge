# Generated by Django 4.2.15 on 2024-08-08 18:48

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Facility',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('facility_name', models.CharField(max_length=20)),
                ('address', models.CharField(max_length=50)),
                ('phone_number', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=254)),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('card_number', models.CharField(max_length=16)),
                ('card_expiry', models.CharField(max_length=5)),
                ('card_cvc', models.CharField(max_length=3)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('facility', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='carebridge.facility')),
            ],
        ),
        migrations.CreateModel(
            name='UserCounter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('value', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('user_id', models.CharField(blank=True, max_length=8, unique=True)),
                ('password_hash', models.CharField(max_length=255)),
                ('user_name', models.CharField(max_length=10)),
                ('user_name_kana', models.CharField(max_length=20)),
                ('user_birthday', models.DateField()),
                ('user_sex', models.CharField(max_length=10)),
                ('emergency_contact_name', models.CharField(max_length=50)),
                ('emergency_contact_relationship', models.CharField(max_length=20)),
                ('emergency_contact_phone', models.CharField(max_length=15)),
                ('allergies', models.CharField(max_length=100, null=True)),
                ('medications', models.CharField(max_length=255, null=True)),
                ('medical_history', models.CharField(max_length=255, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('facility', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='carebridge.facility')),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('status', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('facility', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='carebridge.facility')),
                ('payment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='carebridge.payment')),
            ],
        ),
        migrations.CreateModel(
            name='Staff',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('password_hash', models.CharField(max_length=255)),
                ('staff_name', models.CharField(max_length=10)),
                ('is_admin', models.BooleanField(default=False)),
                ('facility', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='staffs', to='carebridge.facility')),
            ],
        ),
        migrations.CreateModel(
            name='MedicalRecord',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('medical_facility_name', models.CharField(max_length=255)),
                ('type', models.CharField(max_length=50)),
                ('detail', models.TextField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='carebridge.user')),
            ],
        ),
        migrations.CreateModel(
            name='ContactNote',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('detail', models.TextField()),
                ('staff', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='carebridge.staff')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='carebridge.user')),
            ],
        ),
        migrations.CreateModel(
            name='CareRecord',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('meal', models.CharField(max_length=50)),
                ('excretion', models.CharField(max_length=50)),
                ('bath', models.CharField(max_length=50)),
                ('temperature', models.FloatField(null=True)),
                ('systolic_bp', models.IntegerField(null=True)),
                ('diastolic_bp', models.IntegerField(null=True)),
                ('comments', models.TextField(null=True)),
                ('staff', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='carebridge.staff')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='carebridge.user')),
            ],
        ),
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('password_hash', models.CharField(max_length=255)),
                ('facility', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='admins', to='carebridge.facility')),
            ],
        ),
    ]
