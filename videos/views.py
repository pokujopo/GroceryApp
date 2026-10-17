import os
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
from django.core.paginator import Paginator
from .models import Video
from .tasks import catch_video_via_sitemap

def index(request):
    # Fetch only url from DB to bypass schema mismatches
    videos_from_db = Video.objects.only('url').order_by('-id')
    
    videos_safi = []
    for item in videos_from_db:
        if not item.url:
            continue
        url_safi = item.url.split('?')[0]
        jina_la_faili = os.path.basename(url_safi)
        jina_safi = jina_la_faili.replace('-', ' ').replace('_', ' ').replace('.mp4', '')
        
        videos_safi.append({
            'id': item.pk,
            'url': item.url,
            'title': jina_safi.title()
        })
        
    # Set up Pagination to match what your template expects
    paginator = Paginator(videos_safi, 12)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)
        
    return render(request, 'videos/index.html', {
        'page': page_obj,          # Provides page.object_list and page.has_other_pages
        'categories': [],          # Stops empty category loops from breaking
        'q': request.GET.get('q', '') 
    })

import os
from django.shortcuts import get_object_or_404, render
from .models import Video

def watch(request, slug):
    # Tafuta video inayotazamwa kwa kutumia ID (slug)
    video = get_object_or_404(Video, pk=slug)
    
    # Safisha jina/title ya video inayotazamwa
    url_safi = video.url.split('?')[0] if video.url else ""
    jina_la_faili = os.path.basename(url_safi)
    jina_safi = jina_la_faili.replace('-', ' ').replace('_', ' ').replace('.mp4', '')
    
    video_data = {
        'id': video.pk,
        'url': video.url,
        'title': jina_safi.title()
    }
    
    # Chukua video zingine (isipokuwa hii inayotazamwa sasa hivi) ili ziwe 'other videos' pembeni
    videos_from_db = Video.objects.exclude(pk=slug).only('url').order_by('-id')[:10]
    
    other_videos = []
    for item in videos_from_db:
        if not item.url:
            continue
        u_safi = item.url.split('?')[0]
        f_name = os.path.basename(u_safi)
        t_safi = f_name.replace('-', ' ').replace('_', ' ').replace('.mp4', '')
        
        other_videos.append({
            'id': item.pk,
            'url': item.url,
            'title': t_safi.title()
        })
    
    return render(request, 'videos/watch.html', {
        'video': video_data,
        'other_videos': other_videos  # Tunazituma hapa kwenye template
    })
def trigger_scraper(request):
    catch_video_via_sitemap.delay()
    return HttpResponse("""
        <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding-top: 50px; background: #121212; color: #fff;">
                <h2 style="color: #4CAF50;">🚀 Robot ya Selenium Imewashwa Background!</h2>
                <p>Muda huu Chrome Headless inapita Cloudflare kupata video...</p>
                <p><a href="/" style="color: #2196F3; text-decoration: none; font-weight: bold;">Bofya Hapa Kurudi Mwanzo</a></p>
            </body>
        </html>
    """)