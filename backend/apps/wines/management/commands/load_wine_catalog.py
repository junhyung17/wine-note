"""
사용법:
  1. https://www.kaggle.com/datasets/zynicide/wine-reviews 에서
     winemag-data-130k-v2.csv 다운로드
  2. backend/ 디렉토리에 파일 복사
  3. python manage.py load_wine_catalog

Railway 환경:
  railway run python manage.py load_wine_catalog
"""
import csv
import os
import re
from django.core.management.base import BaseCommand
from apps.wines.models import WineCatalog


class Command(BaseCommand):
    help = '와인 카탈로그 데이터 로드 (winemag-data-130k-v2.csv)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            default='winemag-data-130k-v2.csv',
            help='CSV 파일 경로',
        )

    def handle(self, *args, **options):
        filepath = options['file']
        if not os.path.exists(filepath):
            self.stderr.write(f'파일 없음: {filepath}')
            return

        self.stdout.write('기존 카탈로그 삭제 중...')
        WineCatalog.objects.all().delete()

        seen = set()
        bulk = []
        count = 0

        with open(filepath, encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                producer = (row.get('winery') or '').strip()
                country = (row.get('country') or '').strip()
                region = (row.get('region_1') or row.get('province') or '').strip()
                variety = (row.get('variety') or '').strip()
                title = (row.get('title') or '').strip()

                if not producer or not title:
                    continue

                # 제목에서 생산자 + 빈티지 + 괄호 지역 제거 → 와인명 추출
                name = title
                if name.startswith(producer):
                    name = name[len(producer):].strip()
                name = re.sub(r'\b\d{4}\b', '', name).strip()
                name = re.sub(r'\s*\([^)]+\)\s*$', '', name).strip()
                if not name:
                    name = title

                key = (producer.lower(), name.lower())
                if key in seen:
                    continue
                seen.add(key)

                grapes = [variety] if variety else []
                bulk.append(WineCatalog(
                    producer=producer,
                    name=name,
                    country=country,
                    region=region,
                    grapes=grapes,
                ))
                count += 1

                if len(bulk) >= 500:
                    WineCatalog.objects.bulk_create(bulk)
                    bulk = []
                    self.stdout.write(f'  {count}개 처리 중...')

        if bulk:
            WineCatalog.objects.bulk_create(bulk)

        self.stdout.write(self.style.SUCCESS(f'완료: {count}개 와인 카탈로그 로드'))
