"""Generate only the fixed, generic French lesson text; no child data is sent."""
import asyncio, json, pathlib
import edge_tts
ROOT=pathlib.Path(__file__).resolve().parent.parent
async def main():
    plan=json.loads((ROOT/'artifacts/school-audio-plan.json').read_text(encoding='utf-8'))
    directory=ROOT/'public/audio/school'
    directory.mkdir(parents=True,exist_ok=True)
    gate=asyncio.Semaphore(4)
    done=0
    async def clip(item):
        nonlocal done
        async with gate:
            path=directory/item['file']
            if not path.exists() or path.stat().st_size<1000:
                for attempt in range(3):
                    try:
                        await asyncio.wait_for(edge_tts.Communicate(item['spoken']+'.','fr-FR-DeniseNeural',rate='-12%',pitch='-2Hz').save(str(path)),timeout=45)
                        if path.stat().st_size<1000: raise ValueError('Empty audio')
                        break
                    except Exception:
                        if attempt==2: raise
                        await asyncio.sleep(2)
            done+=1
            if done%15==0: print(f'{done}/{len(plan)} school clips ready',flush=True)
    await asyncio.gather(*(clip(i) for i in plan))
    print(f'Complete: {done} new school clips',flush=True)
asyncio.run(main())
