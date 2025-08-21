from django.db import models
from django.contrib.auth import get_user_model

AuthUser = get_user_model()


class Customer(models.Model):
	id = models.CharField(primary_key=True, max_length=36)
	first_name = models.TextField()
	last_name = models.TextField()
	email = models.TextField()
	phone = models.TextField(null=True, blank=True)
	company = models.TextField(null=True, blank=True)
	address = models.TextField(null=True, blank=True)
	status = models.TextField(default='prospect')
	priority = models.TextField(default='medium')
	lead_source = models.TextField(null=True, blank=True)
	notes = models.TextField(null=True, blank=True)
	survey_type = models.CharField(max_length=100, null=True, blank=True)
	location = models.TextField(null=True, blank=True)
	property_details = models.JSONField(null=True, blank=True)
	service_category = models.CharField(max_length=100, null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	last_contact = models.DateTimeField(null=True, blank=True)

	class Meta:
		db_table = 'customers'


class Project(models.Model):
	id = models.CharField(primary_key=True, max_length=36)
	name = models.TextField()
	description = models.TextField(null=True, blank=True)
	customer = models.ForeignKey(Customer, null=True, blank=True, on_delete=models.SET_NULL, related_name='projects')
	status = models.TextField(default='planning')
	budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
	start_date = models.DateTimeField(null=True, blank=True)
	end_date = models.DateTimeField(null=True, blank=True)
	survey_type = models.CharField(max_length=100, null=True, blank=True)
	location = models.TextField(null=True, blank=True)
	area = models.CharField(max_length=100, null=True, blank=True)
	plot_number = models.CharField(max_length=100, null=True, blank=True)
	survey_number = models.CharField(max_length=100, null=True, blank=True)
	village = models.CharField(max_length=255, null=True, blank=True)
	district = models.CharField(max_length=255, null=True, blank=True)
	state = models.CharField(max_length=100, null=True, blank=True)
	coordinates = models.JSONField(null=True, blank=True)
	equipment_used = models.TextField(null=True, blank=True)
	team_members = models.JSONField(null=True, blank=True)
	deliverables = models.JSONField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'projects'


class SurveyRecord(models.Model):
	id = models.CharField(primary_key=True, max_length=36)
	project = models.ForeignKey(Project, null=True, blank=True, on_delete=models.SET_NULL, related_name='survey_records')
	customer = models.ForeignKey(Customer, null=True, blank=True, on_delete=models.SET_NULL, related_name='survey_records')
	survey_type = models.CharField(max_length=100)
	survey_number = models.CharField(max_length=100, null=True, blank=True)
	plot_number = models.CharField(max_length=100, null=True, blank=True)
	area = models.CharField(max_length=100, null=True, blank=True)
	location = models.TextField(null=True, blank=True)
	village = models.CharField(max_length=255, null=True, blank=True)
	district = models.CharField(max_length=255, null=True, blank=True)
	state = models.CharField(max_length=100, default='Tamil Nadu')
	coordinates = models.JSONField(null=True, blank=True)
	boundaries = models.JSONField(null=True, blank=True)
	measurements = models.JSONField(null=True, blank=True)
	notes = models.TextField(null=True, blank=True)
	status = models.TextField(default='in_progress')
	survey_date = models.DateTimeField(null=True, blank=True)
	completed_date = models.DateTimeField(null=True, blank=True)
	surveyor_name = models.CharField(max_length=255, null=True, blank=True)
	equipment_used = models.TextField(null=True, blank=True)
	accuracy = models.CharField(max_length=50, null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'survey_records'


class Lead(models.Model):
	id = models.CharField(primary_key=True, max_length=36)
	customer = models.ForeignKey(Customer, null=True, blank=True, on_delete=models.SET_NULL, related_name='leads')
	stage = models.TextField(default='prospecting')
	value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
	probability = models.IntegerField(default=0)
	expected_close_date = models.DateTimeField(null=True, blank=True)
	notes = models.TextField(null=True, blank=True)
	service_type = models.CharField(max_length=100, null=True, blank=True)
	inquiry_source = models.CharField(max_length=100, null=True, blank=True)
	urgency = models.CharField(max_length=20, default='medium')
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'leads'


class Communication(models.Model):
	id = models.CharField(primary_key=True, max_length=36)
	customer = models.ForeignKey(Customer, null=True, blank=True, on_delete=models.SET_NULL, related_name='communications')
	type = models.TextField()
	subject = models.TextField(null=True, blank=True)
	content = models.TextField()
	direction = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'communications'


class AdminUser(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=100)
	email = models.CharField(max_length=100)
	password = models.CharField(max_length=100)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'admin'


class ClientRegister(models.Model):
	id = models.AutoField(primary_key=True)
	user_name = models.CharField(max_length=255)
	password = models.CharField(max_length=255)
	phone_number = models.CharField(max_length=15)
	email = models.CharField(max_length=255)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'client_register'


class LdrContact(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=255)
	email = models.CharField(max_length=255)
	phone_number = models.CharField(max_length=255)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'ldr_contact'


class LdrCareer(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=255)
	email = models.CharField(max_length=255)
	phone_number = models.CharField(max_length=255)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'ldr_career'


class OtpVerification(models.Model):
	id = models.AutoField(primary_key=True)
	email = models.CharField(max_length=255)
	otp = models.CharField(max_length=6)
	expires_at = models.DateTimeField()
	is_used = models.BooleanField(default=False)
	purpose = models.CharField(max_length=50, default='signup')
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'otp_verifications'


class PendingUser(models.Model):
	id = models.AutoField(primary_key=True)
	username = models.CharField(max_length=50)
	email = models.CharField(max_length=255)
	password_hash = models.CharField(max_length=255)
	role = models.CharField(max_length=20, default='user')
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'pending_users'


class UserCustomerData(models.Model):
	id = models.AutoField(primary_key=True)
	user = models.OneToOneField(AuthUser, on_delete=models.CASCADE, related_name='customer_data')
	name = models.CharField(max_length=255)
	email = models.CharField(max_length=255)
	phone = models.CharField(max_length=20, null=True, blank=True)
	company = models.CharField(max_length=255, null=True, blank=True)
	address = models.TextField(null=True, blank=True)
	notes = models.TextField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		db_table = 'user_customer_data'


class FeatureRequest(models.Model):
	id = models.AutoField(primary_key=True)
	title = models.TextField()
	description = models.TextField()
	category = models.TextField()
	priority = models.TextField(default='Medium')
	status = models.TextField(default='Submitted')
	submittedBy = models.TextField()
	assignedTo = models.TextField(null=True, blank=True)
	estimatedHours = models.IntegerField(null=True, blank=True)
	actualHours = models.IntegerField(null=True, blank=True)
	businessValue = models.TextField(null=True, blank=True)
	technicalNotes = models.TextField(null=True, blank=True)
	userRole = models.TextField()
	createdAt = models.DateTimeField(auto_now_add=True)
	updatedAt = models.DateTimeField(auto_now=True)
	completedAt = models.DateTimeField(null=True, blank=True)

	class Meta:
		db_table = 'feature_requests'


class AuditLog(models.Model):
	id = models.AutoField(primary_key=True)
	userId = models.TextField()
	userName = models.TextField()
	userRole = models.TextField()
	action = models.TextField()
	tableName = models.TextField()
	recordId = models.TextField(null=True, blank=True)
	oldValues = models.TextField(null=True, blank=True)
	newValues = models.TextField(null=True, blank=True)
	ipAddress = models.TextField(null=True, blank=True)
	userAgent = models.TextField(null=True, blank=True)
	sessionId = models.TextField(null=True, blank=True)
	timestamp = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'audit_logs'


class Notification(models.Model):
	id = models.AutoField(primary_key=True)
	userId = models.TextField()
	userRole = models.TextField()
	type = models.TextField()
	title = models.TextField()
	message = models.TextField()
	relatedTable = models.TextField(null=True, blank=True)
	relatedId = models.TextField(null=True, blank=True)
	isRead = models.BooleanField(default=False)
	priority = models.TextField(default='normal')
	createdAt = models.DateTimeField(auto_now_add=True)
	readAt = models.DateTimeField(null=True, blank=True)

	class Meta:
		db_table = 'notifications'


class UserLeave(models.Model):
	id = models.AutoField(primary_key=True)
	user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name='leaves')
	leaveType = models.CharField(max_length=50)
	startDate = models.DateTimeField()
	endDate = models.DateTimeField()
	totalDays = models.IntegerField()
	reason = models.TextField()
	status = models.CharField(max_length=20, default='pending')
	appliedAt = models.DateTimeField(auto_now_add=True)
	approvedBy = models.ForeignKey(AuthUser, null=True, blank=True, on_delete=models.SET_NULL, related_name='approved_leaves')
	approvedAt = models.DateTimeField(null=True, blank=True)
	rejectedReason = models.TextField(null=True, blank=True)
	createdAt = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'user_leaves'


class Holiday(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=255)
	date = models.DateTimeField()
	description = models.TextField(null=True, blank=True)
	type = models.CharField(max_length=50, default='public')
	isActive = models.BooleanField(default=True)
	createdAt = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'holidays'


class AppUser(models.Model):
	"""Direct mapping of the Drizzle `users` table for compatibility/imports.

	This is separate from Django's auth user. Use for data sync/migration as needed.
	"""
	id = models.AutoField(primary_key=True)
	username = models.CharField(max_length=50, unique=True)
	email = models.CharField(max_length=255, unique=True)
	password_hash = models.CharField(max_length=255)
	role = models.CharField(max_length=20, default='user')
	phone_number = models.CharField(max_length=20, null=True, blank=True)
	company = models.CharField(max_length=255, null=True, blank=True)
	first_name = models.CharField(max_length=100, null=True, blank=True)
	last_name = models.CharField(max_length=100, null=True, blank=True)
	is_active = models.BooleanField(default=True)
	is_verified = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	last_login = models.DateTimeField(null=True, blank=True)

	class Meta:
		db_table = 'users'
