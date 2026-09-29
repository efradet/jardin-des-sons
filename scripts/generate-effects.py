"""Original, non-verbal cartoon effects. Standard-library only; no voice service."""
import math, random, struct, wave
from pathlib import Path

RATE=22050
ROOT=Path(__file__).resolve().parent.parent/'public/audio'
ROOT.mkdir(parents=True,exist_ok=True)

def render(name,good):
    rng=random.Random(42)
    samples=[]
    duration=1.12 if good else .65
    phase=0
    for n in range(int(RATE*duration)):
        t=n/RATE
        value=0
        if good:
            # Three soft, dry crunches, each with a tiny mouth-like pop.
            for start in [0,.17,.35]:
                u=t-start
                if 0<=u<.13:
                    env=math.sin(math.pi*min(u/.012,1)/2)*math.exp(-u*34)
                    value+=env*(.17*rng.uniform(-1,1)+.12*math.sin(2*math.pi*(380*u-850*u*u)))
            u=t-.55
            if 0<=u<.5:
                freq=420+200*math.sin(math.pi*u/.5)+35*math.sin(2*math.pi*13*u)
                phase+=2*math.pi*freq/RATE
                value+=.22*math.sin(math.pi*u/.5)**2*(math.sin(phase)+.25*math.sin(2*phase))
        else:
            # A short descending, rubbery wobble: a cartoon grimace, no speech.
            freq=420-270*(t/duration)+55*math.sin(2*math.pi*15*t)*math.exp(-t*2)
            phase+=2*math.pi*freq/RATE
            env=math.sin(math.pi*t/duration)**1.4
            value=.22*env*(math.sin(phase)+.25*math.sin(3*phase))
        samples.append(int(max(-.7,min(.7,value))*32767))
    with wave.open(str(ROOT/name),'wb') as output:
        output.setnchannels(1);output.setsampwidth(2);output.setframerate(RATE)
        output.writeframes(struct.pack('<'+'h'*len(samples),*samples))

render('chenille-miam.wav',True)
render('chenille-beurk.wav',False)
