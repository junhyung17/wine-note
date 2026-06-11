import logging
from django.conf import settings
from django.contrib.auth.models import User
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

logger = logging.getLogger(__name__)


def _cookie_kwargs():
    """환경별 쿠키 옵션 반환 (Railway=SameSite=None;Secure, K8S/로컬=Lax)."""
    secure = getattr(settings, 'COOKIE_SECURE', False)
    samesite = getattr(settings, 'COOKIE_SAMESITE', 'None' if secure else 'Lax')
    return {'httponly': True, 'secure': secure, 'samesite': samesite, 'path': '/'}


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        credential = request.data.get('credential')
        if not credential:
            return Response({'error': 'credential 필드가 필요합니다'}, status=400)

        try:
            idinfo = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )
        except ValueError as e:
            logger.warning(f"Google 토큰 검증 실패: {e}")
            return Response({'error': '유효하지 않은 토큰입니다'}, status=401)

        email = idinfo['email']
        name = idinfo.get('name', '')
        picture = idinfo.get('picture', '')

        user, created = User.objects.get_or_create(
            username=idinfo['sub'],
            defaults={'email': email, 'first_name': name},
        )
        if not created:
            user.email = email
            user.first_name = name
            user.save(update_fields=['email', 'first_name'])
        else:
            # 첫 로그인 시 기존 익명 와인 노트를 이 계정에 귀속
            from apps.wines.models import WineNote
            assigned = WineNote.objects.filter(user__isnull=True).update(user=user)
            if assigned:
                logger.info(f"기존 와인 노트 {assigned}개를 {email}에 귀속")

        refresh = RefreshToken.for_user(user)
        jwt_settings = settings.SIMPLE_JWT
        ck = _cookie_kwargs()

        response = Response({'email': email, 'name': name, 'picture': picture})
        response.set_cookie(
            'access_token',
            str(refresh.access_token),
            max_age=int(jwt_settings['ACCESS_TOKEN_LIFETIME'].total_seconds()),
            **ck,
        )
        response.set_cookie(
            'refresh_token',
            str(refresh),
            max_age=int(jwt_settings['REFRESH_TOKEN_LIFETIME'].total_seconds()),
            **ck,
        )
        logger.info(f"로그인 성공: {email} (신규: {created})")
        return response


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ck = _cookie_kwargs()
        response = Response({'ok': True})
        response.delete_cookie('access_token', path='/', samesite=ck['samesite'])
        response.delete_cookie('refresh_token', path='/', samesite=ck['samesite'])
        return response


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'email': request.user.email,
            'name': request.user.first_name,
        })
