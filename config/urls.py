from django.contrib import admin
from django.urls import path, include
import videos.views 

urlpatterns = [
    path('admin/', admin.site.urls),
    # Add namespace='videos' here
    path('', include(('videos.urls', 'videos'), namespace='videos')), 

    
    # URL ya kuwasha robot kwa nguvu (Unaweza kubadilisha jina hili kuwa la siri zaidi)
    path('secure-trigger-scraper/', videos.views.trigger_scraper, name='trigger_scraper'), 
]
