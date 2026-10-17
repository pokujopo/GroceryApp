import time
import requests
from celery import shared_task
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from .models import Video 

URL_KUU = "https://naijared.com"
KURASA_ZA_KUPITA = 20

def nasa_video_ndani_ya_makala(url_ya_makala):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        # Fetch the article page directly over clean HTTP requests
        response = requests.get(url_ya_makala, headers=headers, timeout=10)
        if response.status_code != 200:
            return None
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look into standard video structures
        for tag in soup.find_all(['video', 'source']):
            src = tag.get('src')
            if src and ".mp4" in src:
                return urljoin(url_ya_makala, src)
                
        # Scrape inline hyper-links pointing directly to standard mp4 storage buckets
        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']
            if ".mp4" in href or "wp-content/uploads" in href:
                return urljoin(url_ya_makala, href)
    except Exception as e:
        pass
    return None

@shared_task
def catch_video_via_sitemap():
    print("[*] Celery Background Worker is active! Processing structural pagination streams...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    link_za_makala = set()
    
    try:
        print(f"[*] Step 1: Gathering links across {KURASA_ZA_KUPITA} archive pages...")
        for page in range(1, KURASA_ZA_KUPITA + 1):
            url = URL_KUU if page == 1 else f"{URL_KUU}/page/{page}/"
            print(f"    -> Scraping target archive page {page}: {url}")
            try:
                response = requests.get(url, headers=headers, timeout=10)
                if response.status_code != 200:
                    continue
                    
                soup = BeautifulSoup(response.text, 'html.parser')
                for a_tag in soup.find_all('a', href=True):
                    href = a_tag['href']
                    if URL_KUU in href and href != URL_KUU and not any(x in href for x in ['/page/', '/wp-content/', '/category/', '/tag/', '?s=']):
                        link_za_makala.add(href)
            except Exception as e:
                print(f"    [-] Read failure on index archive {page}: {e}")
                
        makala_zote = list(link_za_makala)
        print(f"\n[+] Step 1 Done: Found {len(makala_zote)} distinct posts to map.\n")
        
        if not makala_zote:
            print("[-] No valid articles discovered on front archive indexes.")
            return

        print("[*] Step 2: Deep scanning content payloads and saving stream objects...")
        for i, link in enumerate(makala_zote, 1):
            print(f"    [{i}/{len(makala_zote)}] Scanning post element container: {link}")
            video_url = nasa_video_ndani_ya_makala(link)
            
            if video_url:
                # Store the extracted video link directly into the database
                obj, created = Video.objects.get_or_create(url=video_url)
                if created:
                    print(f"    [V SUCCESS] Saved to Django DB -> {video_url}")
                else:
                    print(f"    [*] Element already exist inside storage context.")
            else:
                print(f"    [X] No valid direct stream source found.")
                
    except Exception as e:
        print(f"[-] Execution structure broken: {e}")
    print("\n[=== BACKGROUND SCRAPER WORKER SESSION COMPLETE ===]")
