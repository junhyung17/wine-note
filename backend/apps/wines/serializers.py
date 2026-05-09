"""
파일: backend/apps/wines/serializers.py
역할: WineNote 모델(Python 객체) ↔ JSON 변환 담당
      API 요청(JSON) → Python 객체 → DB 저장
      DB 데이터 → Python 객체 → JSON 응답
사용처: views.py의 모든 API 뷰에서 사용
"""
import logging
from rest_framework import serializers
from .models import WineNote

logger = logging.getLogger(__name__)


class WineNoteSerializer(serializers.ModelSerializer):
    """
    역할: WineNote 모델을 JSON으로 변환하고 유효성 검사
          ModelSerializer = 모델 필드를 자동으로 직렬화
    """

    class Meta:
        model = WineNote        # 변환할 모델
        fields = '__all__'      # 모든 필드 포함
        read_only_fields = ['id', 'created_at', 'updated_at']
        # id, created_at, updated_at은 자동 생성이므로 API 입력에서 제외

    def validate_my_rating(self, value):
        """
        역할: my_rating 값의 유효성 검사
              0~5 사이의 0.5 단위 값만 허용
        입력: value (float) - API에서 받은 평점 값
        출력: 유효한 값 반환 또는 ValidationError 발생
        """
        if value < 0 or value > 5:
            raise serializers.ValidationError("평점은 0에서 5 사이여야 합니다.")
        # 0.5 단위로 반올림 (예: 3.7 → 3.5)
        value = round(value * 2) / 2
        return value

    def validate_nose(self, value):
        """
        역할: nose 배열 유효성 검사 (리스트 타입 확인)
        """
        if not isinstance(value, list):
            raise serializers.ValidationError("nose는 배열이어야 합니다.")
        return value

    def validate_palate(self, value):
        """
        역할: palate 배열 유효성 검사
        """
        if not isinstance(value, list):
            raise serializers.ValidationError("palate는 배열이어야 합니다.")
        return value

    def create(self, validated_data):
        """
        역할: 유효성 검사된 데이터로 DB에 새 와인 노트 생성
        """
        logger.info(f"WineNote 직렬화기 - 새 와인 노트 생성 시도: {validated_data.get('name')}")
        instance = super().create(validated_data)
        logger.info(f"WineNote 직렬화기 - 생성 완료 ID: {instance.pk}")
        return instance

    def update(self, instance, validated_data):
        """
        역할: 기존 와인 노트 정보 수정
        """
        logger.info(f"WineNote 직렬화기 - 와인 노트 수정 ID: {instance.pk}")
        instance = super().update(instance, validated_data)
        logger.info(f"WineNote 직렬화기 - 수정 완료 ID: {instance.pk}")
        return instance


class WineNoteListSerializer(serializers.ModelSerializer):
    """
    역할: 목록 조회 시 사용하는 간략 버전 직렬화기
          전체 필드가 아닌 목록 표시에 필요한 핵심 필드만 반환
          (네트워크 트래픽 절감)
    사용처: views.py의 WineNoteListCreateView (GET 요청)
    """

    class Meta:
        model = WineNote
        fields = [
            'id',
            'producer',
            'name',
            'vintage',
            'color',
            'region',
            'country',
            'my_rating',
            'date_tasted',
            'created_at',
        ]
