from rest_framework import serializers
from carebridge.models import CareRecord

class CareRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareRecord
        fields = '__all__'
