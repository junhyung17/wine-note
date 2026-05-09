"""
파일: backend/apps/wines/admin.py
역할: Django 관리자 페이지(/admin/)에 WineNote 모델 등록
      브라우저로 데이터 직접 확인/수정 가능
"""
import logging
from django.contrib import admin
from .models import WineNote

logger = logging.getLogger(__name__)


@admin.register(WineNote)
class WineNoteAdmin(admin.ModelAdmin):
    """
    역할: 관리자 페이지에서 WineNote를 표시하는 방식 설정
    접속: http://wine.homelab/admin/ (superuser 계정 필요)
    superuser 생성: kubectl exec -n wine <pod명> -- python manage.py createsuperuser
    """

    # 목록 페이지에 표시할 컬럼
    list_display = ['producer', 'name', 'vintage', 'color', 'country', 'my_rating', 'date_tasted']

    # 오른쪽 사이드바 필터
    list_filter = ['color', 'country', 'date_tasted']

    # 상단 검색창 (검색 대상 필드)
    search_fields = ['producer', 'name', 'region', 'country', 'grape']

    # 기본 정렬
    ordering = ['-date_tasted', '-created_at']

    # 읽기 전용 필드 (자동 생성되므로 편집 불가)
    readonly_fields = ['created_at', 'updated_at']
