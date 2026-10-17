from django.db import models

class Video(models.Model):
    # Inachukua tu URL kutoka nje na kuzuia link kujirudia
    url = models.URLField(unique=True, max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.url
