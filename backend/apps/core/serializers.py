from rest_framework import serializers
from .models import Customer, Project, Lead, Communication, SurveyRecord, AdminUser, LdrCareer, LdrContact, ClientRegister


class CustomerSerializer(serializers.ModelSerializer):
	class Meta:
		model = Customer
		fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
	class Meta:
		model = Project
		fields = '__all__'


class LeadSerializer(serializers.ModelSerializer):
	class Meta:
		model = Lead
		fields = '__all__'


class CommunicationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Communication
		fields = '__all__'


class SurveyRecordSerializer(serializers.ModelSerializer):
	class Meta:
		model = SurveyRecord
		fields = '__all__'


class AdminUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = AdminUser
		fields = ['id', 'name', 'email', 'created_at']


class LdrContactSerializer(serializers.ModelSerializer):
	class Meta:
		model = LdrContact
		fields = ['id', 'name', 'email', 'phone_number', 'created_at']


class LdrCareerSerializer(serializers.ModelSerializer):
	class Meta:
		model = LdrCareer
		fields = ['id', 'name', 'email', 'phone_number', 'created_at']


class ClientRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = ClientRegister
		fields = ['id', 'user_name', 'email', 'phone_number', 'created_at']
