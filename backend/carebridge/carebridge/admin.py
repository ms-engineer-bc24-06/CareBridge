from django.contrib import admin
from .models import Facility, Payment, Admin, Transaction, User, UserCounter, Staff, ContactNote, CareRecord, MedicalRecord

admin.site.register(Facility)
admin.site.register(Payment)
admin.site.register(Admin)
admin.site.register(Transaction)
admin.site.register(User)
admin.site.register(UserCounter)
admin.site.register(Staff)
admin.site.register(ContactNote)
admin.site.register(CareRecord)
admin.site.register(MedicalRecord)