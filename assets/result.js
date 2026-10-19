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

  window.renderDetailedResult = function(containerSelector, obj){
    try{
      const container = typeof containerSelector === 'string' ? document.querySelector(containerSelector) : containerSelector;
      if(!container) return;
      const html = buildResultHTML(obj);
      container.innerHTML = html;
      const section = container.querySelector('.result');
      if(section){
        section.dataset.resultText = buildResultText(obj);
      }
    }catch(e){console.error(e)}
  };

})();
