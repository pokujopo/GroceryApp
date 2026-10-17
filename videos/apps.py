from django.apps import AppConfig

class VideosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'videos'

    def ready(self):
        # We only pass here because Celery Beat handles the timing,
        # or we trigger it manually via the URL without crashing the startup process.
        pass
