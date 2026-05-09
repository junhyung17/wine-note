"""
파일: backend/apps/wines/urls.py
역할: wines 앱의 URL 패턴 정의
      config/urls.py에서 /api/ 아래에 마운트됨

최종 URL:
  /api/wines/      → WineNoteListCreateView (목록 조회, 생성)
  /api/wines/{id}/ → WineNoteDetailView (상세 조회, 수정, 삭제)
"""
from django.urls import path
from . import views

app_name = 'wines'   # URL 네임스페이스 (다른 앱과 URL 이름 충돌 방지)

urlpatterns = [
    # 목록 조회 & 생성
    # GET  /api/wines/     → 전체 목록 (검색, 필터링 지원)
    # POST /api/wines/     → 새 와인 노트 생성
    path('wines/', views.WineNoteListCreateView.as_view(), name='wine-list'),

    # 개별 조회 & 수정 & 삭제
    # GET    /api/wines/{id}/ → 상세 조회
    # PUT    /api/wines/{id}/ → 전체 수정
    # PATCH  /api/wines/{id}/ → 부분 수정
    # DELETE /api/wines/{id}/ → 삭제
    path('wines/<int:pk>/', views.WineNoteDetailView.as_view(), name='wine-detail'),
]
