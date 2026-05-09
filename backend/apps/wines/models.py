"""
파일: backend/apps/wines/models.py
역할: 와인 노트 데이터를 PostgreSQL에 저장하는 모델 정의
      프론트엔드(src/types/wine.ts)의 WineNote 인터페이스와 1:1 대응

Model = 데이터베이스 테이블 구조 정의
Django ORM이 이 클래스를 보고 SQL 테이블을 자동으로 생성함
"""
import logging
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# 이 모듈의 로거 (설정은 settings.py의 LOGGING에서)
logger = logging.getLogger(__name__)


class WineNote(models.Model):
    """
    역할: 와인 시음 노트 한 건을 저장하는 데이터베이스 테이블
    테이블명: wines_winenote (앱명_모델명 자동 생성)

    프론트엔드 wine.ts의 WineNote 인터페이스와 동일한 구조
    """

    # ========================================================
    # 와인 색상 선택지 (프론트엔드 WineColor 타입과 동일)
    # ========================================================
    COLOR_CHOICES = [
        ('red', '레드'),
        ('white', '화이트'),
        ('rosé', '로제'),
        ('sparkling', '스파클링'),
        ('dessert', '디저트'),
        ('fortified', '주정강화'),
        ('orange', '오렌지'),
    ]

    # ========================================================
    # 기본 정보 (Basic Info)
    # ========================================================

    # 생산자 (예: Chateau Margaux, 도멘 드 라 로마네 콩티)
    producer = models.CharField(
        max_length=200,
        verbose_name='생산자',
        db_index=True,   # 검색이 자주 되므로 인덱스 생성
    )

    # 와인 이름 (예: Margaux Premier Grand Cru Classé)
    name = models.CharField(
        max_length=200,
        verbose_name='와인명',
        db_index=True,
    )

    # 빈티지 연도 (예: "2018", "NV"(Non-Vintage))
    vintage = models.CharField(
        max_length=10,
        blank=True,      # 빈 값 허용 (NV 와인 등)
        verbose_name='빈티지',
    )

    # 와인 색상 (위의 COLOR_CHOICES에서 선택)
    color = models.CharField(
        max_length=20,
        choices=COLOR_CHOICES,
        verbose_name='색상',
        db_index=True,   # 색상별 필터링이 자주 발생
    )

    # 생산 지역 (예: Bordeaux, Burgundy, Barossa Valley)
    region = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='지역',
    )

    # 생산 국가 (예: France, Italy, Spain)
    country = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='국가',
    )

    # 포도 품종 (예: Cabernet Sauvignon, Pinot Noir, Chardonnay)
    grape = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='포도 품종',
    )

    # ========================================================
    # 테이스팅 노트 (Tasting Notes)
    # ========================================================

    # 외관 (색상, 투명도 등 - 텍스트)
    appearance = models.TextField(
        blank=True,
        verbose_name='외관',
    )

    # 향 (Nose) - 여러 개의 향 키워드 배열
    # 예: ["블랙베리", "체리", "바닐라", "오크"]
    # JSONField = Python 리스트/딕셔너리를 JSON으로 저장
    nose = models.JSONField(
        default=list,    # 빈 리스트를 기본값으로
        verbose_name='향 (Nose)',
    )

    # 맛 (Palate) - 여러 개의 맛 키워드 배열
    # 예: ["풀 바디", "높은 산도", "실키한 탄닌"]
    palate = models.JSONField(
        default=list,
        verbose_name='맛 (Palate)',
    )

    # 여운 (Finish) - 마신 후 남는 느낌
    finish = models.TextField(
        blank=True,
        verbose_name='여운 (Finish)',
    )

    # ========================================================
    # 평점 (Ratings)
    # ========================================================

    # 내 평점 (0.0 ~ 5.0, 0.5 단위)
    my_rating = models.FloatField(
        default=0,
        validators=[
            MinValueValidator(0.0),    # 최소 0점
            MaxValueValidator(5.0),    # 최대 5점
        ],
        verbose_name='내 평점',
    )

    # Vivino 평점 (외부 사이트 참고용 - 텍스트로 저장)
    # 예: "4.2", "3.8"
    vivino_rating = models.CharField(
        max_length=10,
        blank=True,
        verbose_name='Vivino 평점',
    )

    # ========================================================
    # 가격 & 구매 정보
    # ========================================================

    # 내가 구매한 가격
    price = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='구매 가격',
    )

    # 통화 (KRW, USD, EUR 등)
    currency = models.CharField(
        max_length=10,
        default='KRW',
        verbose_name='통화',
    )

    # 구매 장소 (예: 이마트, 와인앤모어, 해외직구)
    purchase_location = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='구매 장소',
    )

    # Wine-Searcher 기준 가격 (시장 가격 참고용)
    wine_searcher_price = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Wine-Searcher 가격',
    )

    # ========================================================
    # 기타 정보
    # ========================================================

    # 음식 페어링 - 여러 개의 음식 배열
    # 예: ["스테이크", "치즈", "파스타"]
    food_pairing = models.JSONField(
        default=list,
        verbose_name='음식 페어링',
    )

    # 사진 URLs 또는 base64 - 여러 장
    photos = models.JSONField(
        default=list,
        verbose_name='사진',
    )

    # 개인 메모 (자유로운 형식)
    notes = models.TextField(
        blank=True,
        verbose_name='메모',
    )

    # 시음 날짜
    date_tasted = models.DateField(
        null=True,
        blank=True,
        verbose_name='시음 날짜',
        db_index=True,   # 날짜별 정렬/필터링에 사용
    )

    # ========================================================
    # 자동 관리 필드
    # ========================================================

    # 레코드 생성 시간 (자동 입력, 수정 불가)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성일시')

    # 레코드 수정 시간 (저장할 때마다 자동 업데이트)
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정일시')

    class Meta:
        # 기본 정렬: 시음 날짜 최신순, 생성일시 최신순
        ordering = ['-date_tasted', '-created_at']
        verbose_name = '와인 노트'
        verbose_name_plural = '와인 노트 목록'

    def __str__(self):
        """관리자 페이지에서 보여지는 문자열 표현"""
        vintage_str = f" {self.vintage}" if self.vintage else ""
        return f"{self.producer} - {self.name}{vintage_str}"

    def save(self, *args, **kwargs):
        """저장 시 로그 기록"""
        is_new = self.pk is None   # pk가 없으면 새 레코드
        super().save(*args, **kwargs)
        if is_new:
            logger.info(f"새 와인 노트 생성: {self} (ID: {self.pk})")
        else:
            logger.info(f"와인 노트 수정: {self} (ID: {self.pk})")

    def delete(self, *args, **kwargs):
        """삭제 시 로그 기록"""
        logger.info(f"와인 노트 삭제: {self} (ID: {self.pk})")
        super().delete(*args, **kwargs)
