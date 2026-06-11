from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('wines', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='winenote',
            name='user',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='wine_notes',
                to=settings.AUTH_USER_MODEL,
                verbose_name='사용자',
            ),
        ),
    ]
