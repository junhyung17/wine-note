from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wines', '0002_winenote_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='winenote',
            name='appearance_intensity',
            field=models.CharField(blank=True, choices=[('pale', 'Pale'), ('medium', 'Medium'), ('deep', 'Deep')], max_length=20, verbose_name='외관 강도'),
        ),
        migrations.AddField(
            model_name='winenote',
            name='appearance_color',
            field=models.CharField(blank=True, max_length=50, verbose_name='외관 색상 표현'),
        ),
        migrations.AddField(
            model_name='winenote',
            name='nose_intensity',
            field=models.CharField(blank=True, choices=[('light', 'Light'), ('medium', 'Medium'), ('pronounced', 'Pronounced')], max_length=20, verbose_name='향 강도'),
        ),
        migrations.AddField(
            model_name='winenote',
            name='sweetness',
            field=models.CharField(blank=True, choices=[('dry', 'Dry'), ('off-dry', 'Off-dry'), ('medium-dry', 'Medium Dry'), ('medium-sweet', 'Medium Sweet'), ('sweet', 'Sweet'), ('luscious', 'Luscious')], max_length=20, verbose_name='당도'),
        ),
        migrations.AddField(
            model_name='winenote',
            name='acidity',
            field=models.CharField(blank=True, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], max_length=20, verbose_name='산도'),
        ),
        migrations.AddField(
            model_name='winenote',
            name='tannin',
            field=models.CharField(blank=True, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], max_length=20, verbose_name='타닌'),
        ),
        migrations.AddField(
            model_name='winenote',
            name='alcohol_level',
            field=models.CharField(blank=True, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], max_length=20, verbose_name='알코올'),
        ),
        migrations.AddField(
            model_name='winenote',
            name='body',
            field=models.CharField(blank=True, choices=[('light', 'Light'), ('medium', 'Medium'), ('full', 'Full')], max_length=20, verbose_name='바디'),
        ),
        migrations.AddField(
            model_name='winenote',
            name='flavour_intensity',
            field=models.CharField(blank=True, choices=[('light', 'Light'), ('medium', 'Medium'), ('pronounced', 'Pronounced')], max_length=20, verbose_name='풍미 강도'),
        ),
        migrations.AddField(
            model_name='winenote',
            name='finish_length',
            field=models.CharField(blank=True, choices=[('short', 'Short'), ('medium', 'Medium'), ('long', 'Long')], max_length=20, verbose_name='여운 길이'),
        ),
        migrations.AddField(
            model_name='winenote',
            name='quality',
            field=models.CharField(blank=True, choices=[('acceptable', 'Acceptable'), ('good', 'Good'), ('very-good', 'Very Good'), ('outstanding', 'Outstanding')], max_length=20, verbose_name='품질'),
        ),
        migrations.AddField(
            model_name='winenote',
            name='ageing',
            field=models.CharField(blank=True, max_length=100, verbose_name='숙성 가능성'),
        ),
        migrations.AddField(
            model_name='winenote',
            name='abv',
            field=models.FloatField(blank=True, null=True, verbose_name='알코올 도수 (%)'),
        ),
    ]
