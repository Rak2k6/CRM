from django.contrib import admin
from .models import Customer, Project, Lead, Communication, SurveyRecord

admin.site.register(Customer)
admin.site.register(Project)
admin.site.register(Lead)
admin.site.register(Communication)
admin.site.register(SurveyRecord)
