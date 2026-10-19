// site-wide helper script for uranai (enhanced)
// - preload background image
// - add share/copy buttons to .result sections
// - support share link generation when result JSON is available
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

  // expose a helper to create a simple UI root for toggles if needed
  function ensureUIRoot(){
    let root = document.getElementById('site-ui-root');
    if(!root){
      root = document.createElement('div');
      root.id = 'site-ui-root';
      root.style.position = 'fixed';
      root.style.right = '12px';
      root.style.top = '12px';
      root.style.zIndex = '9999';
      document.body.appendChild(root);
    }
    return root;
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
      copy.setAttribute('aria-label','結果をコピー');
      copy.onclick = ()=>{
        const text = section.dataset.resultText || (section.innerText || section.textContent);
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
      share.setAttribute('aria-label','共有');
      share.onclick = ()=>{
        const text = section.dataset.resultText || (section.innerText || section.textContent);
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

      // If result JSON is available, add a "共有リンク" button that copies a URL
      const addShareLink = ()=>{
        const json = section.dataset.resultJson;
        if(!json) return;
        const linkBtn = document.createElement('button');
        linkBtn.type = 'button';
        linkBtn.textContent = '共有リンク';
        linkBtn.setAttribute('aria-label','結果をURLで共有');
        linkBtn.onclick = ()=>{
          // prefer using window.createShareURL if provided by result script
          let url = '';
          try{
            if(window.createShareURL) url = window.createShareURL(JSON.parse(json));
          }catch(e){ url = ''; }
          if(!url){
            // fallback: encode the text summary
            const encoded = encodeURIComponent(section.dataset.resultText || section.innerText || section.textContent);
            url = location.origin + location.pathname + '?text=' + encoded;
          }
          navigator.clipboard?.writeText(url).then(()=>{
            linkBtn.textContent = 'リンクをコピーしました';
            setTimeout(()=>linkBtn.textContent='共有リンク',2000);
          }).catch(()=>{
            linkBtn.textContent = 'コピー失敗';
            setTimeout(()=>linkBtn.textContent='共有リンク',2000);
          });
        };
        toolbar.appendChild(linkBtn);
      };

      // If result JSON already present, add link button now
      addShareLink();

      // Also observe dataset changes (in case renderDetailedResult sets dataset after creation)
      const obs = new MutationObserver(()=>{ addShareLink(); });
      obs.observe(section, { attributes: true, attributeFilter: ['data-result-json'] });

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

  // expose ensureUIRoot for future use
  window._uranai_ensureUIRoot = ensureUIRoot;
})();
