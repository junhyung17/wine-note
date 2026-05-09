"""
파일: backend/config/settings.py
역할: Django 전체 설정 파일
      데이터베이스, 인증, 정적 파일, CORS 등 모든 설정이 여기에
      환경변수(K8S ConfigMap/Secret)에서 값을 읽어와 보안 유지
"""
import os
import logging

# ============================================================
# 기본 설정
# ============================================================

# Django 보안 키: 세션, 쿠키 암호화에 사용 (절대 외부 노출 금지)
# K8S Secret에서 주입됨 (wine-django-secret)
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-dev-key-change-in-production')

# 디버그 모드: True면 상세 에러 페이지 표시 (프로덕션에서 반드시 False)
# K8S ConfigMap에서 주입됨
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# 접속 허용 호스트 목록 (K8S ConfigMap에서 콤마로 구분된 문자열로 주입)
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# ============================================================
# 설치된 앱 목록
# ============================================================
INSTALLED_APPS = [
    'django.contrib.admin',          # Django 관리자 페이지 (/admin/)
    'django.contrib.auth',           # 사용자 인증 시스템
    'django.contrib.contenttypes',   # 콘텐츠 타입 프레임워크
    'django.contrib.sessions',       # 세션 관리
    'django.contrib.messages',       # 플래시 메시지
    'django.contrib.staticfiles',    # 정적 파일 관리

    # 서드파티 앱
    'rest_framework',                # Django REST Framework (API 구축)
    'corsheaders',                   # CORS 헤더 (React 프론트엔드 허용)

    # 우리가 만든 앱
    'apps.wines',                    # 와인 노트 앱
]

# ============================================================
# 미들웨어 (요청/응답을 처리하는 중간 레이어들)
# ============================================================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # 정적 파일 서빙 (Whitenoise)
    'corsheaders.middleware.CorsMiddleware',        # CORS 헤더 추가 (반드시 최상단 근처)
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'          # URL 설정 파일 위치

# ============================================================
# 템플릿 설정 (Django 관리자 페이지용)
# ============================================================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'  # Gunicorn이 호출하는 WSGI 앱

# ============================================================
# 데이터베이스 설정 (PostgreSQL)
# K8S ConfigMap/Secret에서 환경변수로 주입
# ============================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # PostgreSQL 드라이버 사용
        'NAME': os.environ.get('DB_NAME', 'winedb'),
        'USER': os.environ.get('DB_USER', 'wineuser'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),   # Secret에서 주입
        'HOST': os.environ.get('DB_HOST', 'localhost'),  # K8S: wine-db-svc
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# ============================================================
# 비밀번호 유효성 검사 (사용자 계정용)
# ============================================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ============================================================
# 국제화 설정
# ============================================================
LANGUAGE_CODE = 'ko-kr'    # 한국어
TIME_ZONE = 'Asia/Seoul'   # 서울 시간대
USE_I18N = True
USE_TZ = True              # 시간대 인식 datetime 사용

# ============================================================
# 정적 파일 설정 (CSS, JS, 이미지)
# ============================================================
STATIC_URL = '/static/'
# collectstatic 실행 시 정적 파일이 모이는 경로
STATIC_ROOT = os.environ.get('STATIC_ROOT', os.path.join(os.path.dirname(__file__), '..', 'staticfiles'))

# Whitenoise: 압축 및 캐싱으로 정적 파일 서빙 최적화
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ============================================================
# 미디어 파일 설정 (사용자 업로드 - 와인 사진)
# ============================================================
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(os.path.dirname(__file__), '..', 'media')

# ============================================================
# Django REST Framework 설정
# ============================================================
REST_FRAMEWORK = {
    # 기본 인증 방식 (나중에 JWT 토큰 인증으로 교체 가능)
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    # 기본 권한: 지금은 누구나 접근 가능 (나중에 IsAuthenticated로 변경)
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    # 응답 형식: JSON
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    # 페이지네이션: 한 번에 50개씩 반환
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
}

# ============================================================
# CORS 설정 (React 프론트엔드가 API 호출 허용)
# ============================================================
CORS_ALLOWED_ORIGINS = os.environ.get(
    'CORS_ALLOWED_ORIGINS', 'http://localhost:5173'
).split(',')

# 개발 환경에서는 모든 origin 허용 (프로덕션에서는 False)
CORS_ALLOW_ALL_ORIGINS = DEBUG

# ============================================================
# 로깅 설정 (인프라 에이전트 및 사용자 모니터링용)
# ============================================================
LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            # 로그 형식: [시간] [레벨] [모듈명] 메시지
            'format': '[{asctime}] [{levelname}] [{name}] {message}',
            'style': '{',
            'datefmt': '%Y-%m-%d %H:%M:%S',
        },
    },
    'handlers': {
        # 콘솔 출력 (K8S에서 kubectl logs로 확인 가능)
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': LOG_LEVEL,
    },
    'loggers': {
        # Django 내부 로그
        'django': {
            'handlers': ['console'],
            'level': LOG_LEVEL,
            'propagate': False,
        },
        # 우리 앱 로그
        'apps': {
            'handlers': ['console'],
            'level': 'DEBUG',   # 앱 로그는 항상 상세하게
            'propagate': False,
        },
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
