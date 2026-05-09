"""
파일: backend/config/wsgi.py
역할: Gunicorn(프로덕션 서버)과 Django를 연결하는 인터페이스
      WSGI = Web Server Gateway Interface
      Gunicorn → wsgi.py → Django 앱 순서로 요청이 전달됨
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Gunicorn이 이 application 객체를 통해 Django와 통신
application = get_wsgi_application()
