from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
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


class UserViewSet(viewsets.ViewSet):
	"""Basic users API to support admin User Management page.
	Uses Django auth User for demonstration purposes.
	"""

	def list(self, request):
		users = User.objects.all().order_by('-date_joined')
		data = [
			{
				'id': user.id,
				'username': user.username,
				'email': user.email,
				'role': 'admin' if user.is_staff else 'user',
				'isActive': user.is_active,
				'createdAt': user.date_joined,
				'lastLogin': user.last_login,
			}
			for user in users
		]
		return Response(data)

	def retrieve(self, request, pk=None):
		try:
			user = User.objects.get(pk=pk)
		except User.DoesNotExist:
			return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
		data = {
			'id': user.id,
			'username': user.username,
			'email': user.email,
			'role': 'admin' if user.is_staff else 'user',
			'isActive': user.is_active,
			'createdAt': user.date_joined,
			'lastLogin': user.last_login,
		}
		return Response(data)

	def update(self, request, pk=None):
		try:
			user = User.objects.get(pk=pk)
		except User.DoesNotExist:
			return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

		payload = request.data or {}
		username = payload.get('username')
		email = payload.get('email')
		role = payload.get('role')  # 'admin' | 'user'
		is_active = payload.get('isActive')

		if username is not None:
			user.username = username
		if email is not None:
			user.email = email
		if role is not None:
			user.is_staff = (role == 'admin')
		if is_active is not None:
			user.is_active = bool(is_active)
		user.save()

		return self.retrieve(request, pk)

	def destroy(self, request, pk=None):
		try:
			user = User.objects.get(pk=pk)
		except User.DoesNotExist:
			return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
		user.delete()
		return Response({'status': 'deleted'})

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
