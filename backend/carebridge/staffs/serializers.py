from rest_framework import serializers
from carebridge.models import Staff

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = ['uuid', 'staff_id','firebase_uid', 'facility', 'staff_name', 'staff_name_kana', 'is_admin'] 