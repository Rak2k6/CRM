from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Customer, Project, Lead, Communication, SurveyRecord, AdminUser, LdrCareer, LdrContact, ClientRegister
from .serializers import (
	CustomerSerializer,
	ProjectSerializer,
	LeadSerializer,
	CommunicationSerializer,
	SurveyRecordSerializer,
	AdminUserSerializer,
	LdrContactSerializer,
	LdrCareerSerializer,
	ClientRegisterSerializer,
)


class CustomerViewSet(viewsets.ModelViewSet):
	queryset = Customer.objects.all().order_by('-created_at')
	serializer_class = CustomerSerializer
	lookup_field = 'pk'


class ProjectViewSet(viewsets.ModelViewSet):
	queryset = Project.objects.all().order_by('-created_at')
	serializer_class = ProjectSerializer
	lookup_field = 'pk'


class LeadViewSet(viewsets.ModelViewSet):
	queryset = Lead.objects.all().order_by('-created_at')
	serializer_class = LeadSerializer
	lookup_field = 'pk'


class CommunicationViewSet(viewsets.ModelViewSet):
	queryset = Communication.objects.all().order_by('-created_at')
	serializer_class = CommunicationSerializer
	lookup_field = 'pk'


class SurveyRecordViewSet(viewsets.ModelViewSet):
	queryset = SurveyRecord.objects.all().order_by('-created_at')
	serializer_class = SurveyRecordSerializer
	lookup_field = 'pk'


@api_view(['GET'])
def list_admin(request):
	qs = AdminUser.objects.all().order_by('-created_at')
	return Response(AdminUserSerializer(qs, many=True).data)


@api_view(['GET'])
def list_ldr_contacts(request):
	qs = LdrContact.objects.all().order_by('-created_at')
	return Response(LdrContactSerializer(qs, many=True).data)


@api_view(['GET'])
def list_ldr_careers(request):
	qs = LdrCareer.objects.all().order_by('-created_at')
	return Response(LdrCareerSerializer(qs, many=True).data)


@api_view(['GET'])
def list_client_registers(request):
	qs = ClientRegister.objects.all().order_by('-created_at')
	return Response(ClientRegisterSerializer(qs, many=True).data)
