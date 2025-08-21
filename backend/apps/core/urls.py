from django.urls import path
from rest_framework.routers import SimpleRouter
from .views import (
	CustomerViewSet,
	ProjectViewSet,
	LeadViewSet,
	CommunicationViewSet,
	SurveyRecordViewSet,
	list_admin,
	list_ldr_contacts,
	list_ldr_careers,
	list_client_registers,
)
from .auth_views import signup, login

router = SimpleRouter(trailing_slash=False)
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'communications', CommunicationViewSet, basename='communication')
router.register(r'survey-records', SurveyRecordViewSet, basename='survey-record')

urlpatterns = [
	path('signup', signup),
	path('login', login),
	path('admin', list_admin),
	path('ldr-contacts', list_ldr_contacts),
	path('ldr-careers', list_ldr_careers),
	path('client-registers', list_client_registers),
]

urlpatterns += router.urls
