from django.contrib import admin
from .models import Plan, Facility, Payment, Transaction, User, UserCounter, Staff, StaffCounter, ContactNote, CareRecord, MedicalRecord
from django.db import models
from django.forms import widgets

class ContactNoteAdmin(admin.ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "staff":
            kwargs["queryset"] = Staff.objects.all()
            kwargs["to_field_name"] = "staff_id"
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

class CareRecordAdmin(admin.ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "staff":
            kwargs["queryset"] = Staff.objects.all()
            kwargs["to_field_name"] = "staff_id"
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(Plan)
admin.site.register(Facility)
admin.site.register(Payment)
admin.site.register(Transaction)
admin.site.register(User)
admin.site.register(UserCounter)
admin.site.register(Staff)
admin.site.register(StaffCounter)

# ContactNote と CareRecord の登録を新しいAdmin クラスで置き換え
admin.site.register(ContactNote, ContactNoteAdmin)
admin.site.register(CareRecord, CareRecordAdmin)

admin.site.register(MedicalRecord)