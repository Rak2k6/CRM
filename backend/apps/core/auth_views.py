from django.contrib.auth import get_user_model, authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()


def _serialize_user(user: User):
	return {
		"id": user.id,
		"username": user.username,
		"email": user.email,
		"role": "admin" if user.is_staff else "user",
		"isActive": user.is_active,
		"createdAt": user.date_joined.isoformat() if hasattr(user, 'date_joined') else None,
		"lastLogin": user.last_login.isoformat() if user.last_login else None,
	}


@csrf_exempt
@api_view(["POST"])
def signup(request):
	data = request.data or {}
	username = data.get("username")
	email = data.get("email")
	password = data.get("password")
	confirm_password = data.get("confirmPassword")
	role = data.get("role", "user")

	if not all([username, email, password, confirm_password]):
		return Response({"message": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)
	if password != confirm_password:
		return Response({"message": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
	if User.objects.filter(email=email).exists():
		return Response({"message": "User with this email already exists"}, status=status.HTTP_409_CONFLICT)
	if User.objects.filter(username=username).exists():
		return Response({"message": "Username already taken"}, status=status.HTTP_409_CONFLICT)

	user = User.objects.create_user(
		username=username,
		email=email,
		password=password,
	)
	# Map role to is_staff
	if role == "admin":
		user.is_staff = True
	user.is_active = True
	user.save()

	token = str(AccessToken.for_user(user))
	return Response({
		"message": "User created successfully",
		"user": _serialize_user(user),
		"token": token,
	}, status=status.HTTP_201_CREATED)


@csrf_exempt
@api_view(["POST"])
def login(request):
	data = request.data or {}
	email_or_username = data.get("emailOrUsername")
	password = data.get("password")
	if not all([email_or_username, password]):
		return Response({"message": "Email/username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

	# Resolve username
	try:
		user_obj = User.objects.filter(email=email_or_username).first()
	except Exception:
		user_obj = None
	username = user_obj.username if user_obj else email_or_username

	user = authenticate(username=username, password=password)
	if not user:
		return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
	if not user.is_active:
		return Response({"message": "Account is inactive. Please contact administrator."}, status=status.HTTP_401_UNAUTHORIZED)

	user.last_login = timezone.now()
	user.save(update_fields=["last_login"])

	token = str(AccessToken.for_user(user))
	return Response({
		"message": "Login successful",
		"user": _serialize_user(user),
		"token": token,
	})
