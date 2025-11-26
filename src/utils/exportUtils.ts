import { GeneratedContent, GameType } from "../types";

export const generateStandaloneHTML = (data: GeneratedContent, type: GameType): string => {
  const jsonData = JSON.stringify(data).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  const commonStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap');
    body { font-family: 'Nunito', sans-serif; background: #f0f9ff; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
    .container { width: 100%; max-width: 900px; background: white; padding: 2rem; border-radius: 1.5rem; box-shadow: 0 10px 40px rgba(0,0,0,0.08); text-align: center; }
    h1 { color: #0284c7; margin: 0 0 0.5rem 0; font-size: 2rem; }
    p.desc { color: #64748b; margin-bottom: 2rem; font-size: 1.1rem; }
    .btn { background: #0ea5e9; color: white; border: none; padding: 12px 24px; font-size: 1.1rem; border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; margin: 5px; font-weight: bold; box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.2); }
    .btn:hover { background: #0284c7; transform: translateY(-2px); box-shadow: 0 6px 10px -1px rgba(14, 165, 233, 0.3); }
    .btn:active { transform: translateY(0); }
    .btn-secondary { background: #94a3b8; box-shadow: none; }
    .hidden { display: none !important; }
    .score-board { font-size: 1.25rem; font-weight: 800; color: #f59e0b; background: #fffbeb; padding: 0.5rem 1.5rem; border-radius: 2rem; display: inline-block; margin-bottom: 1.5rem; }
    .feedback { margin-top: 1.5rem; font-weight: bold; min-height: 2rem; font-size: 1.2rem; }
    .correct { color: #16a34a; }
    .wrong { color: #dc2626; }
    
    /* Animation classes */
    .fade-in { animation: fadeIn 0.5s ease-in; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .confetti { position: fixed; width: 10px; height: 10px; background-color: #f00; animation: confetti-fall linear forwards; }
    @keyframes confetti-fall { 0% { top: -10%; transform: rotate(0deg); } 100% { top: 110%; transform: rotate(720deg); } }

    /* Quiz Styles */
    .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
    @media (max-width: 600px) { .options-grid { grid-template-columns: 1fr; } }
    .option-btn { background: #e0f2fe; color: #0f172a; border: 2px solid #bae6fd; padding: 16px; border-radius: 1rem; cursor: pointer; font-size: 1.1rem; transition: all 0.2s; font-weight: 600; }
    .option-btn:hover { background: #bae6fd; transform: scale(1.01); }
    .option-btn.selected-correct { background: #dcfce7; border-color: #22c55e; color: #15803d; }
    .option-btn.selected-wrong { background: #fee2e2; border-color: #ef4444; color: #b91c1c; }

    /* Matching Styles */
    .match-container { display: flex; justify-content: space-between; gap: 2rem; margin-top: 20px; }
    .match-col { display: flex; flex-direction: column; gap: 1rem; flex: 1; }
    .match-card { background: #fff; border: 2px solid #e2e8f0; padding: 15px; border-radius: 12px; cursor: pointer; user-select: none; transition: all 0.2s; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .match-card:hover { border-color: #38bdf8; }
    .match-card.selected { border-color: #0ea5e9; background: #e0f2fe; transform: scale(1.02); }
    .match-card.matched { border-color: #22c55e; background: #f0fdf4; opacity: 0.6; cursor: default; transform: scale(0.98); }

    /* Wheel Styles */
    .wheel-container { position: relative; width: 320px; height: 320px; margin: 0 auto 2rem; }
    .wheel-wrapper { width: 100%; height: 100%; border-radius: 50%; border: 8px solid #fff; box-shadow: 0 0 0 8px #cbd5e1; overflow: hidden; transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99); }
    .wheel-pointer { position: absolute; top: -25px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-top: 40px solid #ef4444; z-index: 10; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2)); }
    .wheel-popup { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.8); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); }
    .popup-content { background: white; padding: 2.5rem; border-radius: 1.5rem; max-width: 500px; width: 90%; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    /* Sequencing Styles */
    .sequence-list { list-style: none; padding: 0; max-width: 600px; margin: 0 auto; }
    .sequence-item { background: white; border: 2px solid #e2e8f0; margin-bottom: 0.75rem; padding: 1rem; border-radius: 0.75rem; cursor: grab; display: flex; align-items: center; gap: 1rem; transition: transform 0.2s, box-shadow 0.2s; touch-action: none; }
    .sequence-item.dragging { opacity: 0.5; background: #f1f5f9; border-style: dashed; }
    .sequence-item:hover { border-color: #94a3b8; }
    .seq-index { background: #e0f2fe; color: #0284c7; width: 30px; height: 30px; display: flex; items-center; justify-content: center; border-radius: 50%; font-weight: bold; font-size: 0.9rem; }

    /* Simulation Styles (Warm-up) */
    .sim-area { display: flex; gap: 2rem; margin-top: 2rem; flex-direction: column; }
    .sim-items { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; min-height: 80px; padding: 1rem; background: #f8fafc; border-radius: 1rem; border: 2px dashed #cbd5e1; }
    .sim-item { background: white; padding: 0.75rem 1.5rem; border-radius: 2rem; border: 2px solid #38bdf8; color: #0284c7; font-weight: bold; cursor: grab; user-select: none; touch-action: none; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.1s; }
    .sim-item:active { cursor: grabbing; transform: scale(1.05); }
    .sim-zones { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .sim-zone { flex: 1; min-width: 200px; min-height: 200px; border-radius: 1rem; border: 2px solid transparent; display: flex; flex-direction: column; align-items: center; padding: 1rem; transition: background 0.3s; position: relative; }
    .zone-label { font-weight: bold; margin-bottom: 1rem; font-size: 1.2rem; padding: 0.5rem 1rem; background: rgba(255,255,255,0.8); border-radius: 0.5rem; }
    .sim-item-dropped { margin: 5px; display: inline-block; transform: scale(0.9); }
  `;

  const commonScripts = `
    const gameData = ${jsonData};
    let currentScore = 0;
    const clickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    const correctSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
    const wrongSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3');
    const completeSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');

    function playSound(type) {
      const audio = type === 'click' ? clickSound : type === 'correct' ? correctSound : type === 'wrong' ? wrongSound : completeSound;
      audio.currentTime = 0;
      audio.play().catch(()=>{});
    }

    function initGame() {
      document.getElementById('game-title').innerText = gameData.title;
      document.getElementById('game-desc').innerText = gameData.description;
      renderGame();
    }
    
    function showComplete() {
      playSound('complete');
      document.getElementById('game-area').innerHTML = \`
        <div class='fade-in' style='margin-top:3rem'>
          <h2 style='font-size:2rem; color:#f59e0b'>🎉 Xuất sắc!</h2>
          <p style='font-size:1.2rem'>Bạn đã hoàn thành bài học.</p>
          <button class='btn' onclick='location.reload()'>Chơi lại</button>
        </div>
      \`;
      createConfetti();
    }

    function createConfetti() {
      for(let i=0; i<50; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.animationDuration = (Math.random() * 3 + 2) + 's';
        conf.style.backgroundColor = ['#f00', '#0f0', '#00f', '#ff0', '#f0f'][Math.floor(Math.random()*5)];
        document.body.appendChild(conf);
      }
    }
  `;

  // --- QUIZ ENGINE ---
  // --- QUIZ ENGINE (Đã nâng cấp: Có nút Back & Lưu lịch sử) ---
  const quizScript = `
    let currentQIndex = 0;
    // Biến lưu lịch sử trả lời: { 0: 'A', 1: 'B'... }
    const userHistory = {}; 
    
    function renderGame() {
      const container = document.getElementById('game-area');
      
      if (currentQIndex >= gameData.questions.length) {
        showComplete();
        return;
      }
      
      const q = gameData.questions[currentQIndex];
      // Kiểm tra xem câu này đã làm chưa trong lịch sử
      const history = userHistory[currentQIndex];
      const isAnswered = history !== undefined;

      let html = \`
        <div class="fade-in">
          <h3 style="color:#64748b">Câu \${currentQIndex + 1}/\${gameData.questions.length}</h3>
          <p style="font-size: 1.4rem; font-weight: bold; margin: 1rem 0 2rem;">\${q.question}</p>
          <div class="options-grid">
      \`;
      
      q.options.forEach(opt => {
        // Xử lý logic để tô màu lại các câu đã trả lời khi bấm Back
        let extraClass = '';
        if (isAnswered) {
            if (opt === q.correctAnswer) extraClass = 'selected-correct';
            else if (opt === history.selectedOption) extraClass = 'selected-wrong';
        }

        // Nếu đã trả lời rồi thì không cho click nữa (bỏ onclick)
        const clickAction = isAnswered ? '' : \`onclick="checkAnswer(this, '\${opt.replace(/'/g, "\\'")}', '\${q.correctAnswer.replace(/'/g, "\\'")}')"\`;
        
        html += \`<div class="option-btn \${extraClass}" \${clickAction}>\${opt}</div>\`;
      });

      // Khu vực nút điều hướng (Back / Next)
      // Nút Back: Chỉ hiện khi không phải câu đầu tiên (index > 0)
      const backBtnStyle = currentQIndex > 0 ? '' : 'display:none';
      // Nút Next: Hiện khi đã trả lời xong
      const nextBtnClass = isAnswered ? '' : 'hidden';

      html += \`
          </div>
          <div id="feedback" class="feedback">
             \${isAnswered ? (history.isCorrect ? "<span class='correct'>Chính xác! 👏</span>" : "<span class='wrong'>Đáp án đúng: " + q.correctAnswer + "</span>") : ""}
          </div>
          
          <div style="margin-top: 25px; display: flex; justify-content: center; gap: 15px;">
            <button id="back-btn" class="btn btn-secondary" style="\${backBtnStyle}" onclick="prevQuestion()">&larr; Quay lại</button>
            <button id="next-btn" class="btn \${nextBtnClass}" onclick="nextQuestion()">Tiếp theo &rarr;</button>
          </div>
        </div>
      \`;
      
      container.innerHTML = html;
      document.getElementById('score').innerText = currentScore;
    }

    function checkAnswer(el, userAns, correctAns) {
      if (userHistory[currentQIndex]) return; // Chặn nếu đã trả lời

      const nextBtn = document.getElementById('next-btn');
      const isCorrect = userAns === correctAns;

      // Lưu vào lịch sử
      userHistory[currentQIndex] = {
          selectedOption: userAns,
          isCorrect: isCorrect
      };

      if (isCorrect) {
        el.classList.add('selected-correct');
        document.getElementById('feedback').innerHTML = "<span class='correct'>Chính xác! 👏</span>";
        currentScore += 10;
        playSound('correct');
      } else {
        el.classList.add('selected-wrong');
        document.getElementById('feedback').innerHTML = "<span class='wrong'>Sai rồi! Đáp án đúng: " + correctAns + "</span>";
        playSound('wrong');
        // Hiện đáp án đúng
        document.querySelectorAll('.option-btn').forEach(btn => {
            if(btn.innerText === correctAns) btn.classList.add('selected-correct');
        });
      }
      
      document.getElementById('score').innerText = currentScore;
      nextBtn.classList.remove('hidden'); 
    }

    function nextQuestion() {
       currentQIndex++;
       renderGame();
       playSound('click');
    }

    function prevQuestion() {
       if (currentQIndex > 0) {
           currentQIndex--;
           renderGame(); // Vẽ lại màn hình, logic ở trên sẽ tự tô màu lại đáp án cũ
           playSound('click');
       }
    }
  `;
  // --- MATCHING ENGINE ---
  const matchingScript = `
    let selectedLeft = null;
    let matchesFound = 0;
    
    function renderGame() {
      const container = document.getElementById('game-area');
      if (!window.shuffled) {
        window.leftItems = gameData.questions.map(q => ({id: q.id, val: q.matchPair.left}));
        window.rightItems = gameData.questions.map(q => ({id: q.id, val: q.matchPair.right})).sort(() => Math.random() - 0.5);
        window.shuffled = true;
      }

      if (matchesFound === gameData.questions.length) {
         showComplete();
         return;
      }

      let leftHtml = '';
      window.leftItems.forEach(item => {
        const isMatched = document.getElementById('left-'+item.id)?.classList.contains('matched');
        if (!isMatched) {
           leftHtml += \`<div id="left-\${item.id}" class="match-card fade-in" onclick="selectLeft('\${item.id}')">\${item.val}</div>\`;
        }
      });

      let rightHtml = '';
      window.rightItems.forEach(item => {
        const isMatched = document.getElementById('right-'+item.id)?.classList.contains('matched');
        if (!isMatched) {
           rightHtml += \`<div id="right-\${item.id}" class="match-card fade-in" onclick="selectRight('\${item.id}')">\${item.val}</div>\`;
        }
      });

      container.innerHTML = \`
        <div class="match-container">
          <div class="match-col">\${leftHtml}</div>
          <div class="match-col">\${rightHtml}</div>
        </div>
        <div id="feedback" class="feedback">Chọn thẻ bên trái trước nhé!</div>
      \`;
    }

    function selectLeft(id) {
      if (selectedLeft) {
         const prev = document.getElementById('left-'+selectedLeft);
         if(prev) prev.classList.remove('selected');
      }
      selectedLeft = id;
      document.getElementById('left-'+id).classList.add('selected');
      playSound('click');
      document.getElementById('feedback').innerText = "Giờ chọn thẻ tương ứng bên phải...";
    }

    function selectRight(id) {
      if (!selectedLeft) return;
      
      if (selectedLeft === id) {
        playSound('correct');
        document.getElementById('feedback').innerHTML = "<span class='correct'>Ghép đúng!</span>";
        matchesFound++;
        currentScore += 10;
        document.getElementById('score').innerText = currentScore;
        
        document.getElementById('left-'+id).classList.add('matched');
        document.getElementById('right-'+id).classList.add('matched');
        selectedLeft = null;
        
        if(matchesFound === gameData.questions.length) setTimeout(renderGame, 500);
      } else {
        playSound('wrong');
        document.getElementById('feedback').innerHTML = "<span class='wrong'>Chưa đúng, thử lại!</span>";
        document.getElementById('left-'+selectedLeft).classList.remove('selected');
        selectedLeft = null;
      }
    }
  `;

  // --- SEQUENCING ENGINE ---
  const sequencingScript = `
    function renderGame() {
      // Flatten questions to get sequence items
      if (!window.seqItems) {
        // Collect all sequencing items from questions
        window.seqItems = gameData.questions
           .map(q => ({ id: q.id, content: q.content, order: q.sequenceOrder }))
           .sort(() => Math.random() - 0.5); // Initial Shuffle
      }

      const container = document.getElementById('game-area');
      let html = \`
        <h3 style="margin-bottom:1.5rem">\${gameData.questions[0].question || "Sắp xếp theo đúng thứ tự:"}</h3>
        <ul class="sequence-list" id="seq-list">\`;
      
      window.seqItems.forEach(item => {
         html += \`<li class="sequence-item" draggable="true" data-id="\${item.id}" data-order="\${item.order}">
           <div class="seq-index">::</div>
           <div style="flex:1; text-align:left;">\${item.content}</div>
         </li>\`;
      });
      
      html += \`</ul>
        <button class="btn" style="margin-top:2rem" onclick="checkOrder()">Kiểm tra kết quả</button>
        <div id="feedback" class="feedback"></div>
      \`;
      container.innerHTML = html;
      setupDragDrop();
    }

    function setupDragDrop() {
      const list = document.getElementById('seq-list');
      let draggedItem = null;

      list.addEventListener('dragstart', e => {
        draggedItem = e.target;
        e.target.classList.add('dragging');
      });

      list.addEventListener('dragend', e => {
        e.target.classList.remove('dragging');
        playSound('click');
      });

      list.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
          list.appendChild(draggedItem);
        } else {
          list.insertBefore(draggedItem, afterElement);
        }
      });
    }

    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.sequence-item:not(.dragging)')];
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function checkOrder() {
      const items = document.querySelectorAll('.sequence-item');
      let isCorrect = true;
      let lastOrder = -9999;
      
      items.forEach(item => {
        const currentOrder = parseInt(item.getAttribute('data-order'));
        if (currentOrder < lastOrder) isCorrect = false;
        lastOrder = currentOrder;
      });

      if (isCorrect) {
         document.getElementById('feedback').innerHTML = "<span class='correct'>Tuyệt vời! Bạn đã sắp xếp đúng.</span>";
         currentScore = 100;
         document.getElementById('score').innerText = 100;
         playSound('complete');
         setTimeout(showComplete, 1500);
      } else {
         document.getElementById('feedback').innerHTML = "<span class='wrong'>Vẫn chưa đúng thứ tự. Hãy thử lại!</span>";
         playSound('wrong');
      }
    }
  `;

  // --- SIMULATION ENGINE (Drag & Drop Sorting) ---
  const simulationScript = `
    let itemsPlaced = 0;
    
    function renderGame() {
      const simData = gameData.questions[0].simulationConfig;
      if(!simData) return;

      const container = document.getElementById('game-area');
      
      let zonesHtml = '';
      simData.zones.forEach(z => {
         zonesHtml += \`
           <div class="sim-zone" id="\${z.id}" style="background-color: \${z.color || '#f1f5f9'}" ondrop="drop(event)" ondragover="allowDrop(event)">
             <div class="zone-label">\${z.label}</div>
           </div>
         \`;
      });

      let itemsHtml = '';
      if (!window.simItems) {
         window.simItems = [...simData.items].sort(() => Math.random() - 0.5);
      }
      
      // Render only items not yet placed correctly
      window.simItems.forEach(item => {
         if (!item.placed) {
            itemsHtml += \`<div class="sim-item" draggable="true" id="\${item.id}" data-zone="\${item.zoneId}" ondragstart="drag(event)">\${item.content}</div>\`;
         }
      });

      container.innerHTML = \`
        <h3 style="margin-bottom:1rem">\${gameData.questions[0].question}</h3>
        <div class="sim-area">
           <div class="sim-items" id="source-zone" ondrop="drop(event)" ondragover="allowDrop(event)">
             \${itemsHtml.length ? itemsHtml : '<span style="color:#cbd5e1">Đã hết vật phẩm</span>'}
           </div>
           <div class="sim-zones">\${zonesHtml}</div>
        </div>
        <div id="feedback" class="feedback">Kéo vật phẩm vào đúng khu vực</div>
      \`;
    }

    function allowDrop(ev) { ev.preventDefault(); }

    function drag(ev) {
      ev.dataTransfer.setData("text", ev.target.id);
      playSound('click');
    }

    function drop(ev) {
      ev.preventDefault();
      const data = ev.dataTransfer.getData("text");
      const draggedEl = document.getElementById(data);
      if(!draggedEl) return;

      // Find drop target (handle dropping on child elements)
      let targetZone = ev.target;
      while (targetZone && !targetZone.classList.contains('sim-zone') && !targetZone.classList.contains('sim-items')) {
        targetZone = targetZone.parentElement;
      }

      if (!targetZone) return;

      // Logic: If dropped in correct zone
      const requiredZone = draggedEl.getAttribute('data-zone');
      
      if (targetZone.id === requiredZone) {
         targetZone.appendChild(draggedEl);
         draggedEl.classList.add('sim-item-dropped');
         draggedEl.setAttribute('draggable', 'false'); // Lock it
         playSound('correct');
         
         // Mark as placed in state
         const itemData = window.simItems.find(i => i.id === data);
         if(itemData) itemData.placed = true;
         
         itemsPlaced++;
         currentScore += 10;
         document.getElementById('score').innerText = currentScore;
         
         if (itemsPlaced === window.simItems.length) {
            setTimeout(showComplete, 1000);
         }
      } else if (targetZone.id === 'source-zone') {
         // Dropping back to source - allow
         targetZone.appendChild(draggedEl);
      } else {
         playSound('wrong');
         document.getElementById('feedback').innerHTML = "<span class='wrong'>Sai rồi! Vật này không thuộc về nhóm đó.</span>";
         setTimeout(() => document.getElementById('feedback').innerText = "Thử lại nhé", 1500);
      }
    }
  `;

  // --- WHEEL ENGINE ---
  const wheelScript = `
    let isSpinning = false;
    
    function renderGame() {
      const container = document.getElementById('game-area');
      const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#22d3ee', '#818cf8', '#e879f9', '#f472b6'];
      
      const segmentSize = 360 / gameData.questions.length;
      let gradient = 'conic-gradient(';
      gameData.questions.forEach((q, idx) => {
         const color = colors[idx % colors.length];
         gradient += \`\${color} \${idx * segmentSize}deg \${(idx + 1) * segmentSize}deg, \`;
      });
      gradient = gradient.slice(0, -2) + ')';

      container.innerHTML = \`
        <div class="wheel-container">
            <div class="wheel-pointer"></div>
            <div id="wheel" class="wheel-wrapper" style="background: \${gradient}"></div>
        </div>
        <button id="spin-btn" class="btn" style="font-size: 1.5rem; padding: 15px 40px;" onclick="spinWheel()">QUAY NGAY</button>
        <div id="question-modal" class="hidden wheel-popup"></div>
      \`;
    }

    function spinWheel() {
      if (isSpinning) return;
      isSpinning = true;
      playSound('click');
      
      const wheel = document.getElementById('wheel');
      const randomDeg = Math.floor(Math.random() * 360) + 1800;
      
      wheel.style.transform = \`rotate(\${randomDeg}deg)\`;
      
      setTimeout(() => {
        isSpinning = false;
        // Logic to pick random question
        const qIndex = Math.floor(Math.random() * gameData.questions.length);
        showQuestion(gameData.questions[qIndex]);
      }, 4100);
    }

    function showQuestion(q) {
        const modal = document.getElementById('question-modal');
        modal.classList.remove('hidden');
        modal.innerHTML = \`
           <div class="popup-content">
             <h3 style="color:#0284c7; margin-bottom:1rem;">Câu hỏi may mắn</h3>
             <p style="font-size:1.4rem; margin-bottom:1.5rem; font-weight:bold">\${q.question}</p>
             <p class="hidden" id="wheel-answer" style="color:#16a34a; font-weight:bold; font-size:1.2rem; margin:1rem 0; border:2px dashed #22c55e; padding:10px; border-radius:8px;">Đáp án: \${q.correctAnswer}</p>
             <p style="font-size:1rem; color: #64748b;">\${q.explanation || ''}</p>
             <div style="margin-top:2rem;">
               <button class="btn" onclick="document.getElementById('wheel-answer').classList.remove('hidden'); playSound('correct')">Xem đáp án</button>
               <button class="btn btn-secondary" onclick="document.getElementById('question-modal').classList.add('hidden')">Đóng</button>
             </div>
           </div>
        \`;
    }
  `;

  let selectedScript = '';
  if (type === 'quiz') selectedScript = quizScript;
  else if (type === 'matching') selectedScript = matchingScript;
  else if (type === 'sequencing') selectedScript = sequencingScript;
  else if (type === 'simulation') selectedScript = simulationScript;
  else if (type === 'wheel') selectedScript = wheelScript;

  return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${data.title}</title>
    <style>${commonStyles}</style>
</head>
<body>
    <div class="container fade-in">
        <h1 id="game-title">Đang tải...</h1>
        <p id="game-desc" class="desc"></p>
        <div class="score-board">Điểm: <span id="score">0</span></div>
        <div id="game-area"></div>
    </div>
    <script>
      ${commonScripts}
      ${selectedScript}
      window.onload = initGame;
    </script>
</body>
</html>`;
};
