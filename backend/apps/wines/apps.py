"""
파일: backend/apps/wines/apps.py
역할: Django가 wines 앱을 인식하기 위한 앱 설정
      settings.py의 INSTALLED_APPS에 'apps.wines'로 등록됨
"""
from django.apps import AppConfig


class WinesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.wines'         # INSTALLED_APPS의 경로와 일치해야 함
    verbose_name = '와인 노트'   # 관리자 페이지에서 보이는 이름
