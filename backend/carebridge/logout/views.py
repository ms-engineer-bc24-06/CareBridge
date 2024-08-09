from django.contrib.auth import logout
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def user_logout(request):
    logout(request)
    return Response({"message": "ログアウトしました"}, status=200)