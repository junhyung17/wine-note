import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wines', '0003_winenote_tasting_structure'),
    ]

    operations = [
        migrations.AlterField(
            model_name='winenote',
            name='my_rating',
            field=models.FloatField(
                default=0,
                validators=[
                    django.core.validators.MinValueValidator(0.0),
                    django.core.validators.MaxValueValidator(10.0),
                ],
                verbose_name='내 평점',
            ),
        ),
    ]
