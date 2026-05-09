#!/usr/bin/env python
# ============================================================
# 파일: backend/manage.py
# 역할: Django 관리 명령어 실행 진입점
#       python manage.py runserver  → 개발 서버 시작
#       python manage.py migrate    → DB 마이그레이션 실행
#       python manage.py createsuperuser → 관리자 계정 생성
# ============================================================
import os
import sys


def main():
    # Django 설정 파일 위치 지정
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Django를 가져올 수 없습니다. "
            "가상환경이 활성화되어 있고 requirements.txt가 설치되어 있는지 확인하세요."
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
