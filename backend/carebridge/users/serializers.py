from rest_framework import serializers
from carebridge.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'firebase_uid', 'user_name', 'user_name_kana', 'user_sex', 'user_birthday', 
                  'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship', 
                  'allergies', 'medications', 'medical_history', 'facility']
        read_only_fields = ['user_id']  # user_id は読み取り専用に