"""Build-time only: pip install edge-tts; node scripts/prepare-assets.mjs; python scripts/generate-assets.py
No text, credentials or voice recordings are sent by the shipped app.
Only the fixed, generic French teaching vocabulary is synthesized here.
"""
import asyncio, json, pathlib, urllib.request, xml.etree.ElementTree as ET
import edge_tts

ROOT=pathlib.Path(__file__).resolve().parent.parent
PLAN=json.loads((ROOT/'artifacts/asset-plan.json').read_text(encoding='utf-8'))
VOICE='fr-FR-DeniseNeural'

async def main():
    audio_dir=ROOT/'public/audio'
    image_dir=ROOT/'public/illustrations'
    audio_dir.mkdir(parents=True,exist_ok=True)
    image_dir.mkdir(parents=True,exist_ok=True)
    gate=asyncio.Semaphore(4)
    done=0
    async def clip(item):
        nonlocal done
        path=audio_dir/item['file']
        async with gate:
            if not path.exists() or path.stat().st_size<1000:
                for attempt in range(3):
                    try:
                        await asyncio.wait_for(edge_tts.Communicate(item['spoken']+'.',VOICE,rate='-12%',pitch='-2Hz').save(str(path)),timeout=50)
                        if path.stat().st_size<1000: raise ValueError('Empty audio')
                        break
                    except Exception:
                        if attempt==2: raise
                        await asyncio.sleep(2*(attempt+1))
            done+=1
            if done%25==0: print(f'Audio: {done}/{len(PLAN["audio"])}',flush=True)
    async def illustration(code):
        async with gate:
            path=image_dir/(code+'.svg')
            if not path.exists():
                url=f'https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/svg/{code}.svg'
                def fetch():
                    with urllib.request.urlopen(url,timeout=30) as r: data=r.read()
                    ET.fromstring(data)
                    path.write_bytes(data)
                await asyncio.to_thread(fetch)
    await asyncio.gather(*(illustration(code) for code in PLAN['pictures']))
    print(f'Drawings: {len(PLAN["pictures"])}',flush=True)
    await asyncio.gather(*(clip(item) for item in PLAN['audio']))
    manifest={item['text']:'/audio/'+item['file'] for item in PLAN['audio']}
    (ROOT/'src/audio-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'Complete: {len(manifest)} clips ({VOICE}).',flush=True)

asyncio.run(main())
