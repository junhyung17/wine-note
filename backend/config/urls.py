"""
파일: backend/config/urls.py
역할: Django 전체 URL 라우팅 설정
      /api/ → wines 앱 API
      /admin/ → Django 관리자 페이지
      /api/health/ → 헬스체크 (K8S livenessProbe용)
"""
import logging
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# 이 모듈의 로거 생성
logger = logging.getLogger(__name__)


def health_check(request):
    """
    역할: K8S가 Pod 생존 여부를 확인하는 헬스체크 엔드포인트
    K8S deployment.yaml의 livenessProbe, readinessProbe가 이 URL을 호출함
    항상 200 OK를 반환해야 Pod가 정상으로 간주됨
    """
    logger.debug("헬스체크 요청 수신")
    return JsonResponse({"status": "ok", "service": "wine-note-api"})


urlpatterns = [
    # Django 관리자 페이지 (http://wine.homelab/admin/)
    path('admin/', admin.site.urls),

    # 헬스체크 (http://wine.homelab/api/health/)
    # K8S가 Pod 상태 확인에 사용
    path('api/health/', health_check, name='health-check'),

    # 와인 노트 API (http://wine.homelab/api/wines/)
    path('api/', include('apps.wines.urls')),
]
