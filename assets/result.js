(function(){
  // Helper to build result HTML and text summary for sharing/copy
  function buildResultHTML(obj){
    const esc = s => s==null? '': String(s);
    let html = '<section class="result">';
    html += '<h2>' + esc(obj.title) + '</h2>';
    if(obj.summary) html += '<p class="summary">' + esc(obj.summary) + '</p>';
    if(obj.strengths && obj.strengths.length){
      html += '<h3>強み</h3><ul>' + obj.strengths.map(s=>'<li>'+esc(s)+'</li>').join('') + '</ul>';
    }
    if(obj.cautions && obj.cautions.length){
      html += '<h3>注意点</h3><ul>' + obj.cautions.map(s=>'<li>'+esc(s)+'</li>').join('') + '</ul>';
    }
    if(obj.advice && obj.advice.length){
      html += '<h3>具体的アドバイス</h3><ol>' + obj.advice.map(s=>'<li>'+esc(s)+'</li>').join('') + '</ol>';
    }
    if(obj.extra) html += '<p class="extra">' + esc(obj.extra) + '</p>';
    html += '</section>';
    return html;
  }

  function buildResultText(obj){
    const parts = [];
    parts.push(obj.title || '診断結果');
    if(obj.summary) parts.push('\n' + obj.summary + '\n');
    if(obj.strengths && obj.strengths.length) parts.push('強み: ' + obj.strengths.join(' / '));
    if(obj.cautions && obj.cautions.length) parts.push('注意点: ' + obj.cautions.join(' / '));
    if(obj.advice && obj.advice.length) parts.push('アドバイス: ' + obj.advice.join(' / '));
    if(obj.extra) parts.push(obj.extra);
    return parts.join('\n');
  }

  function createShareURL(obj){
    try{
      const json = JSON.stringify(obj);
      const encoded = btoa(encodeURIComponent(json));
      return location.origin + location.pathname + '?result=' + encoded;
    }catch(e){
      return '';
    }
  }

  function decodeShareParam(param){
    try{
      const decoded = decodeURIComponent(atob(param));
      return JSON.parse(decoded);
    }catch(e){
      return null;
    }
  }

  window.createShareURL = createShareURL;

  window.renderDetailedResult = function(containerSelector, obj){
    try{
      const container = typeof containerSelector === 'string' ? document.querySelector(containerSelector) : containerSelector;
      if(!container) return;
      const html = buildResultHTML(obj);
      container.innerHTML = html;
      const section = container.querySelector('.result');
      if(section){
        section.dataset.resultText = buildResultText(obj);
        try{ section.dataset.resultJson = JSON.stringify(obj); }catch(e){}
      }
    }catch(e){console.error(e)}
  };

  // On load, check for ?result= encoded payload and render it if present
  document.addEventListener('DOMContentLoaded', ()=>{
    const params = new URLSearchParams(location.search);
    const r = params.get('result');
    if(r){
      const obj = decodeShareParam(r);
      if(obj){
        // find #result or create one
        let container = document.querySelector('#result');
        if(!container){
          container = document.createElement('div');
          container.id = 'result';
          document.body.appendChild(container);
        }
        renderDetailedResult(container, obj);
        // scroll into view
        setTimeout(()=>{ container.scrollIntoView({behavior:'smooth'}); }, 200);
      }
    }
  });

})();
