from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path(__file__).parents[1]
html=root.joinpath('index.html').read_text()
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+root.joinpath('styles.css').read_text()+'</style>')
import re,base64
logo='data:image/png;base64,'+base64.b64encode(root.joinpath('scwork-logo.png').read_bytes()).decode()
html=html.replace('src="scwork-logo.png"',f'src="{logo}"')
html=re.sub(r'<script[^>]*>.*?</script>','',html,flags=re.S)
out=Path('/mnt/data')
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for name,w,h in [('Desktop',1440,950),('Mobile',390,844)]:
        page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
        page.set_content(html,wait_until='domcontentloaded',timeout=30000)
        page.evaluate("""() => {document.querySelector('#setup').hidden = true;document.querySelector('#workspace').hidden = false;document.querySelector('#signOut').hidden = false;document.querySelector('#identity').textContent = 'Admin Preview';document.querySelector('#roleName').textContent = 'Owner / ตัวอย่างหน้าจอ';}""")
        page.screenshot(path=str(out/f'SCWORK_V2.1.32_Admin_{name}_Preview.png'),full_page=True,animations='disabled')
        x=page.evaluate('document.documentElement.scrollWidth - innerWidth')
        print(name,'overflow px',x)
        assert x<=1, f'Horizontal overflow in {name}'
        page.close()
    browser.close()
