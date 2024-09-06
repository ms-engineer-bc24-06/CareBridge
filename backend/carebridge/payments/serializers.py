from rest_framework import serializers
from carebridge.models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'  # 全てのフィールドをシリアライズ