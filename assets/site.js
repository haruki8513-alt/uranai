// site-wide helper script for uranai
// - preload background image
// - add share/copy buttons to .result sections
// - respect prefers-reduced-motion

(function(){
  const BG = './BCO.755a2eff-b3fc-4a1d-aa77-5dcb6907f237.png';

  function preloadImage(src){
    return new Promise((res)=>{
      const img = new Image();
      img.onload = ()=>res(true);
      img.onerror = ()=>res(false);
      img.src = src;
    });
  }

  // add loaded class when bg ready
  preloadImage(BG).then(ok=>{
    if(ok) document.documentElement.classList.add('bg-image-ready');
  });

  // Add share/copy buttons to generated results
  function enhanceResults(){
    document.querySelectorAll('.result').forEach(section=>{
      if(section.dataset.enhanced) return; // once
      section.dataset.enhanced = '1';

      const toolbar = document.createElement('div');
      toolbar.style.display = 'flex';
      toolbar.style.gap = '8px';
      toolbar.style.marginTop = '12px';

      const copy = document.createElement('button');
      copy.type = 'button';
      copy.textContent = '結果をコピー';
      copy.onclick = ()=>{
        const text = section.innerText || section.textContent;
        navigator.clipboard?.writeText(text).then(()=>{
          copy.textContent = 'コピーしました';
          setTimeout(()=>copy.textContent='結果をコピー',1500);
        }).catch(()=>{
          copy.textContent = 'コピー失敗';
          setTimeout(()=>copy.textContent='結果をコピー',1500);
        });
      };

      const share = document.createElement('button');
      share.type = 'button';
      share.textContent = '共有';
      share.onclick = ()=>{
        const text = section.innerText || section.textContent;
        if(navigator.share){
          navigator.share({text}).catch(()=>{});
        } else {
          navigator.clipboard?.writeText(text).then(()=>{
            share.textContent = 'クリップボードにコピー済み';
            setTimeout(()=>share.textContent='共有',1500);
          });
        }
      };

      toolbar.appendChild(copy);
      toolbar.appendChild(share);
      section.appendChild(toolbar);
    });
  }

  // Observe DOM for new result nodes (for pages that generate results dynamically)
  const obs = new MutationObserver(muts=>{
    muts.forEach(m=>{
      if(m.addedNodes.length) enhanceResults();
    });
  });
  obs.observe(document.body, {childList:true, subtree:true});

  // initial run
  document.addEventListener('DOMContentLoaded', ()=>{
    enhanceResults();
    // small tweak: reduce motion
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      document.documentElement.classList.add('reduce-motion');
    }
  });
})();
