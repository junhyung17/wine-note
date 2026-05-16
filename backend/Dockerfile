# ============================================================
# 파일: backend/Dockerfile
# 역할: Django 앱을 컨테이너 이미지로 패키징
#
# 빌드 흐름:
#   1. Python 설치 → 2. 패키지 설치 → 3. 코드 복사
#   → 4. 정적 파일 수집 → 5. Gunicorn으로 실행
#
# 빌드 명령: docker build -t ghcr.io/junhyung17/wine-note:latest .
# 실행 명령: docker run -p 8000:8000 ghcr.io/junhyung17/wine-note:latest
# ============================================================

# Python 3.12 슬림 버전 사용 (불필요한 패키지 제거로 이미지 크기 최소화)
FROM python:3.12-slim

# 환경변수 설정
ENV PYTHONDONTWRITEBYTECODE=1  \
    # .pyc 파일 생성 안 함 (컨테이너에서 불필요)
    PYTHONUNBUFFERED=1          \
    # Python 출력을 버퍼링 안 함 (로그가 즉시 출력됨)
    DJANGO_SETTINGS_MODULE=config.settings

# 작업 디렉토리 설정 (이후 명령들은 이 경로 기준)
WORKDIR /app

# 시스템 패키지 설치 (psycopg2 빌드에 필요)
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*   # 캐시 삭제로 이미지 크기 줄임

# requirements.txt 먼저 복사 후 설치
# (코드보다 requirements.txt가 변경 빈도가 낮으므로 캐시 활용)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY . .

# 정적 파일 수집 (CSS, JS, 관리자 페이지 리소스)
# Whitenoise가 서빙할 수 있도록 /app/staticfiles/에 모음
RUN python manage.py collectstatic --noinput

# 컨테이너가 외부에 노출할 포트
EXPOSE 8000

# Gunicorn으로 Django 실행
# -w 2: Worker 프로세스 2개 (병렬 요청 처리)
# -b 0.0.0.0:8000: 모든 인터페이스의 8000 포트에서 수신
# config.wsgi:application: Django WSGI 앱
# Railway는 $PORT를 동적으로 주입함. 로컬/K8S 기본값은 8000
CMD sh -c "gunicorn --workers 2 --bind 0.0.0.0:${PORT:-8000} --access-logfile - --error-logfile - config.wsgi:application"
