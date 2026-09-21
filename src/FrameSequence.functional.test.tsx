import {render,act,cleanup} from '@testing-library/react';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {FrameSequence,type FrameAtlas} from './FrameSequence';
let images:{onload:null|(()=>void);onerror:null|(()=>void);src:string}[];
beforeEach(()=>{
 vi.useFakeTimers();images=[];
 vi.stubGlobal('Image',class {onload=null;onerror=null;src='';constructor(){images.push(this);}});
 vi.stubGlobal('matchMedia',()=>({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()}));
});
afterEach(()=>{cleanup();vi.useRealTimers();vi.unstubAllGlobals();});
const atlas:FrameAtlas={src:'/test.webp',columns:4,rows:2,durations:Array(8).fill(100)};
it('advances discrete image cells and stops for the saved reduced-motion setting',async()=>{
 const {container,rerender,unmount}=render(<div data-motion="system"><FrameSequence atlas={atlas} label="Mage" fallback={<img src="/original.webp" alt="Original"/>}/></div>);
 expect(container.querySelector('img')).toHaveAttribute('src','/original.webp');
 act(()=>images[0].onload?.());
 act(()=>vi.advanceTimersByTime(400));
 expect(container.querySelector('.frame-sequence')).toHaveAttribute('data-frame','4');
 expect(container.querySelector('[role=img]')).toHaveStyle({backgroundPosition:'0% 100%'});
 rerender(<div data-motion="reduced"><FrameSequence atlas={atlas} label="Mage" fallback={null}/></div>);
 await act(async()=>{await Promise.resolve();});
 act(()=>vi.advanceTimersByTime(500));
 expect(container.querySelector('.frame-sequence')).toHaveAttribute('data-frame','0');
 unmount();expect(vi.getTimerCount()).toBe(0);
});
it('keeps original art if the sequence cannot load',()=>{
 const {container}=render(<FrameSequence atlas={atlas} label="Mage" fallback={<img src="/original.webp" alt="Original"/>}/>);
 act(()=>images[0].onerror?.());
 act(()=>vi.advanceTimersByTime(1000));
 expect(container.querySelector('img')).toHaveAttribute('src','/original.webp');
 expect(container.querySelector('.frame-sequence-cell')).toBeNull();
});
