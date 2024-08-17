from rest_framework import serializers
from carebridge.models import ContactNote

class ContactNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactNote
        fields = '__all__'