"""
파일: backend/apps/wines/views.py
역할: 와인 노트 REST API 엔드포인트 구현
      HTTP 요청을 받아 DB 조작 후 JSON 응답 반환

API 목록:
  GET    /api/wines/       → 전체 목록 조회
  POST   /api/wines/       → 새 와인 노트 생성
  GET    /api/wines/{id}/  → 특정 와인 노트 조회
  PUT    /api/wines/{id}/  → 전체 수정
  PATCH  /api/wines/{id}/  → 부분 수정
  DELETE /api/wines/{id}/  → 삭제
"""
import logging
from rest_framework import generics, status, filters
from rest_framework.response import Response
from django.db.models import Q
from .models import WineNote
from .serializers import WineNoteSerializer, WineNoteListSerializer

# 이 모듈의 로거
logger = logging.getLogger(__name__)


class WineNoteListCreateView(generics.ListCreateAPIView):
    """
    역할: 와인 노트 목록 조회 + 새 노트 생성
    GET  /api/wines/ → 전체 목록 반환 (간략 형식)
    POST /api/wines/ → 새 와인 노트 생성
    """
    queryset = WineNote.objects.all()

    # 검색 기능: /api/wines/?search=보르도
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['producer', 'name', 'region', 'country', 'grape', 'notes']
    ordering_fields = ['date_tasted', 'created_at', 'my_rating', 'name']
    ordering = ['-date_tasted', '-created_at']   # 기본 정렬: 최신 시음 순

    def get_serializer_class(self):
        """
        역할: HTTP 메서드에 따라 다른 직렬화기 사용
              GET  → WineNoteListSerializer (간략 버전, 빠른 응답)
              POST → WineNoteSerializer (전체 버전, 검증 포함)
        """
        if self.request.method == 'GET':
            return WineNoteListSerializer
        return WineNoteSerializer

    def get_queryset(self):
        """
        역할: 목록 조회 시 필터링 적용
              ?color=red    → 레드 와인만
              ?country=France → 프랑스 와인만
              ?search=보르도 → 보르도 검색
        """
        queryset = WineNote.objects.all()

        # 색상 필터 (?color=red)
        color = self.request.query_params.get('color')
        if color:
            queryset = queryset.filter(color=color)
            logger.debug(f"색상 필터 적용: {color}")

        # 국가 필터 (?country=France)
        country = self.request.query_params.get('country')
        if country:
            queryset = queryset.filter(country__icontains=country)

        # 최소 평점 필터 (?min_rating=4)
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            queryset = queryset.filter(my_rating__gte=float(min_rating))

        return queryset

    def list(self, request, *args, **kwargs):
        """
        역할: GET 요청 처리 (목록 조회)
              페이지네이션 결과에 전체 개수 추가
        """
        logger.info(f"와인 노트 목록 조회 요청 - 필터: {request.query_params}")
        response = super().list(request, *args, **kwargs)
        logger.info(f"와인 노트 목록 반환: {response.data.get('count', 0)}개")
        return response

    def create(self, request, *args, **kwargs):
        """
        역할: POST 요청 처리 (새 와인 노트 생성)
        """
        logger.info(f"새 와인 노트 생성 요청: {request.data.get('name', '이름 없음')}")
        response = super().create(request, *args, **kwargs)
        logger.info(f"와인 노트 생성 완료 ID: {response.data.get('id')}")
        return response


class WineNoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    역할: 특정 와인 노트의 조회, 수정, 삭제
    GET    /api/wines/{id}/ → 상세 조회
    PUT    /api/wines/{id}/ → 전체 수정
    PATCH  /api/wines/{id}/ → 부분 수정
    DELETE /api/wines/{id}/ → 삭제
    """
    queryset = WineNote.objects.all()
    serializer_class = WineNoteSerializer

    def retrieve(self, request, *args, **kwargs):
        """역할: 특정 와인 노트 상세 조회"""
        logger.info(f"와인 노트 상세 조회 ID: {kwargs.get('pk')}")
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """역할: 와인 노트 수정 (PUT=전체, PATCH=부분)"""
        partial = kwargs.pop('partial', False)
        method = "부분 수정" if partial else "전체 수정"
        logger.info(f"와인 노트 {method} 요청 ID: {kwargs.get('pk')}")
        response = super().update(request, *args, partial=partial, **kwargs)
        logger.info(f"와인 노트 수정 완료 ID: {response.data.get('id')}")
        return response

    def destroy(self, request, *args, **kwargs):
        """역할: 와인 노트 삭제"""
        pk = kwargs.get('pk')
        logger.info(f"와인 노트 삭제 요청 ID: {pk}")
        response = super().destroy(request, *args, **kwargs)
        logger.info(f"와인 노트 삭제 완료 ID: {pk}")
        return response
