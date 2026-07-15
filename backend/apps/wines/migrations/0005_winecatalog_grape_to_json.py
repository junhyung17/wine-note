from django.db import migrations, models


def grape_str_to_json(apps, schema_editor):
    WineNote = apps.get_model('wines', 'WineNote')
    for note in WineNote.objects.all():
        old = note.grape_old or ''
        varieties = [v.strip() for v in old.split(',') if v.strip()]
        note.grape = [{'name': v, 'percentage': None} for v in varieties]
        note.save(update_fields=['grape'])


def grape_json_to_str(apps, schema_editor):
    WineNote = apps.get_model('wines', 'WineNote')
    for note in WineNote.objects.all():
        note.grape_old = ', '.join(g['name'] for g in (note.grape or []))
        note.save(update_fields=['grape_old'])


class Migration(migrations.Migration):

    dependencies = [
        ('wines', '0004_winenote_my_rating_max10'),
    ]

    operations = [
        # 1. WineCatalog 모델 생성
        migrations.CreateModel(
            name='WineCatalog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('producer', models.CharField(db_index=True, max_length=200)),
                ('name', models.CharField(db_index=True, max_length=300)),
                ('country', models.CharField(blank=True, max_length=100)),
                ('region', models.CharField(blank=True, max_length=200)),
                ('grapes', models.JSONField(default=list)),
            ],
            options={'verbose_name': '와인 카탈로그', 'indexes': [models.Index(fields=['producer', 'name'], name='wines_winec_produce_idx')]},
        ),
        # 2. 기존 grape (CharField) → grape_old 로 이름 변경
        migrations.RenameField(
            model_name='winenote',
            old_name='grape',
            new_name='grape_old',
        ),
        # 3. 새 grape JSONField 추가
        migrations.AddField(
            model_name='winenote',
            name='grape',
            field=models.JSONField(default=list, verbose_name='포도 품종'),
        ),
        # 4. 데이터 마이그레이션
        migrations.RunPython(grape_str_to_json, grape_json_to_str),
        # 5. 임시 grape_old 필드 제거
        migrations.RemoveField(
            model_name='winenote',
            name='grape_old',
        ),
    ]
