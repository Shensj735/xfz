# Generated by Django 2.2 on 2019-07-08 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0002_courseorder'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courseorder',
            name='amount',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='courseorder',
            name='istype',
            field=models.SmallIntegerField(default=0),
        ),
    ]