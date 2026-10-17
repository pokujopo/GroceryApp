import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('videohub')
app.config_from_object('django.conf:settings', namespace='CELERY')

# Inatafuta 'tasks.py' kiotomatiki ndani ya app ya videos
app.autodiscover_tasks()
