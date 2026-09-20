const wordBank = [
 { eng: 'phenomenon', ch: '現象(n.)' },
{ eng: 'recreation', ch: '娛樂、休閒(n.)' },
{ eng: 'witness', ch: '目賭、見證(v.); 目擊者(n.)' },
{ eng: 'component', ch: '組成部分、要素(n.)' },
{ eng: 'characterize', ch: '具有⋯⋯特徵(v.)' },
{ eng: 'barrier', ch: '障礙、屏障(n.)' },
{ eng: 'creativity', ch: '創意、創造力(n.)' },
{ eng: 'genre', ch: '類型、風格(n.)' },
{ eng: 'transform', ch: '徹底改變、轉換(v.)' },
{ eng: 'generation', ch: '世代、(能源的)產生(n.)' },
{ eng: 'baggy', ch: '寬鬆的(adj.)' },
{ eng: 'popularity', ch: '流行、受歡迎的程度(n.)' },
{ eng: 'worldwide', ch: '在世界各地、遍及全球(adv., adj.)' },
{ eng: 'legacy', ch: '影響、成就、歷史遺產(n.)' },
  { eng: 'academic', ch: '學業的、學術的(adj.)' },
{ eng: 'forum', ch: '論壇、討論會(n.)' },
{ eng: 'diverse', ch: '多元的(adj.)' },
{ eng: 'perspective', ch: '觀點、看法、思考角度(n.)' },
{ eng: 'financially', ch: '財務上地、經濟上地(adv.)' },
{ eng: 'concentration', ch: '專注、集中、濃度(n.)' },
{ eng: 'outcome', ch: '後果(n.)' },
{ eng: 'shortage', ch: '短缺、不足(n.)' },
{ eng: 'economic', ch: '經濟(上)的、經濟學的(adj.)' },
{ eng: 'household', ch: '家庭、一家人(n.)' },
{ eng: 'flexible', ch: '有彈性的、可變通的、可彎曲的(adj.)' },
{ eng: 'dedicated', ch: '專屬的、投入的、盡心盡力的(adj.)' },
{ eng: 'retired', ch: '退休的、退職的、退役的(adj.)' },
{ eng: 'sacrifice', ch: '犧牲、獻祭、祭祀(n.)' },
  { eng: 'access', ch: '取得、存取、使用、進入(v.)' },
{ eng: 'browse', ch: '瀏覽、隨意翻閱、隨意觀看(v.)' },
{ eng: 'multiple', ch: '多個的(adj.)' },
{ eng: 'critical', ch: '批判性的、批評的、至關重要的(adj.)' },
{ eng: 'despite', ch: '儘管、雖然 +N/Ving' },
{ eng: 'inaccurate', ch: '不準確的、有誤的(adj.)' },
  { eng: 'predict', ch: '預測、預言(v.)' },
{ eng: 'backyard', ch: '後院(n.)' },
{ eng: 'workout', ch: '（身體）鍛鍛鍊、運動訓練(n.)' },
{ eng: 'demand', ch: '需要、強烈要求(v.); 需求、要求(n.)' },
{ eng: 'sustain', ch: '維持、支撐、承受(v.)' },
{ eng: 'rally', ch: '（球類運動中）連續對打、集會、重新集結(n.)' },
{ eng: 'incredible', ch: '驚人的、令人難以置信的、極好的(adj.)' },
{ eng: 'percent', ch: '百分之⋯⋯(n.)' },
{ eng: 'accelerate', ch: '（使）加速、加快(v.)' },
{ eng: 'pace', ch: '速度、節奏、步速、步幅(n.)' },
{ eng: 'statistic', ch: '統計數據、統計學(n.)' },
{ eng: 'competitor', ch: '參賽者、競爭者(n.)' }
];

let currentQueue = [];
let activeEng = [null, null, null, null, null];
let activeCh = [null, null, null, null, null];
let selectedEngSlot = null;
let selectedChSlot = null;
let startTime = 0;
let timerInterval = null;
let completedCount = 0;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initGame() {
  clearInterval(timerInterval);
  completedCount = 0;
  selectedEngSlot = null;
  selectedChSlot = null;

  document.getElementById('progress').textContent = `0 / ${wordBank.length}`;
  document.getElementById('timer').textContent = '00:00';
  document.getElementById('result-modal').classList.add('hidden');

  const indexedWords = wordBank.map((item, index) => ({ ...item, id: index }));
  currentQueue = shuffle(indexedWords);

  // 初始化前 5 個單字
  const initialItems = [];
  for (let i = 0; i < 5 && currentQueue.length > 0; i++) {
    initialItems.push(currentQueue.pop());
  }

  activeEng = [...initialItems];
  activeCh = shuffle([...initialItems]);

  // 開局初始化不執行 fade out 動畫，直接渲染
  updateSlotContentsSmoothly(-1, false);

  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateSlotContentsSmoothly(replacedEngIndex = -1, animate = true) {
  const engSlots = document.querySelectorAll('#english-column .slot');
  const chSlots = document.querySelectorAll('#chinese-column .slot');

  // 定義要觸發 fade 動畫的文字元素 (Span)
  let fadingSpans = [];

  if (animate) {
    // 右側全部中文均套用淡入淡出
    chSlots.forEach(slot => {
      const span = slot.querySelector('.slot-text');
      if (span) fadingSpans.push(span);
    });

    // 左側英文只針對「新替補位置」的文字套用淡入淡出
    if (replacedEngIndex !== -1 && engSlots[replacedEngIndex]) {
      const span = engSlots[replacedEngIndex].querySelector('.slot-text');
      if (span) fadingSpans.push(span);
    }
  }

  const updateTexts = () => {
    // 1. 更新左側英文 (維持原位，僅替換指定 Index)
    engSlots.forEach((slot, i) => {
      const span = slot.querySelector('.slot-text');
      if (activeEng[i]) {
        span.textContent = activeEng[i].eng;
        slot.dataset.id = activeEng[i].id;
        slot.style.visibility = 'visible';
      } else {
        slot.style.visibility = 'hidden';
        slot.dataset.id = '';
      }
      slot.classList.remove('selected', 'wrong');
    });

    // 2. 更新右側中文 (全新打亂後的順序)
    chSlots.forEach((slot, i) => {
      const span = slot.querySelector('.slot-text');
      if (activeCh[i]) {
        span.textContent = activeCh[i].ch;
        slot.dataset.id = activeCh[i].id;
        slot.style.visibility = 'visible';
      } else {
        slot.style.visibility = 'hidden';
        slot.dataset.id = '';
      }
      slot.classList.remove('selected', 'wrong');
    });

    // 文字替換後，移除透明度遮罩觸發 Fade In
    fadingSpans.forEach(span => span.classList.remove('text-fade-out'));
  };

  if (animate && fadingSpans.length > 0) {
    // 觸發 Fade Out
    fadingSpans.forEach(span => span.classList.add('text-fade-out'));
    // 等待 Fade Out 完成後更換文字，再 Fade In
    setTimeout(updateTexts, 600);
  } else {
    updateTexts();
  }
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function handleEngClick(e) {
  const slot = e.currentTarget;
  if (!slot.dataset.id) return;

  document.querySelectorAll('#english-column .slot').forEach(s => s.classList.remove('selected', 'wrong'));
  slot.classList.add('selected');
  selectedEngSlot = slot;

  checkMatch();
}

function handleChClick(e) {
  const slot = e.currentTarget;
  if (!slot.dataset.id) return;

  document.querySelectorAll('#chinese-column .slot').forEach(s => s.classList.remove('selected', 'wrong'));
  slot.classList.add('selected');
  selectedChSlot = slot;

  checkMatch();
}

function checkMatch() {
  if (!selectedEngSlot || !selectedChSlot) return;

  const engId = selectedEngSlot.dataset.id;
  const chId = selectedChSlot.dataset.id;

  if (engId === chId) {
    completedCount++;
    document.getElementById('progress').textContent = `${completedCount} / ${wordBank.length}`;

    // 取得配對成功的英文索引
    const engIndex = activeEng.findIndex(item => item && String(item.id) === engId);

    // 抽出一組新單字
    const newItem = currentQueue.length > 0 ? currentQueue.pop() : null;

    // 1. 左側英文：只更新被消除的那格，其他 4 格不變
    activeEng[engIndex] = newItem;

    // 2. 右側中文：扣除舊單字、加入新單字並洗牌
    activeCh = activeCh.filter(item => item && String(item.id) !== chId);
    if (newItem) {
      activeCh.push(newItem);
    }
    activeCh = shuffle(activeCh);

    selectedEngSlot = null;
    selectedChSlot = null;

    // 若英文全數清空，宣告通關
    if (activeEng.every(item => item === null)) {
      setTimeout(showResult, 600);
    } else {
      // 傳入 engIndex，讓系統知道「只有該格英文需要 fade 效果」
      updateSlotContentsSmoothly(engIndex, true);
    }
  } else {
    selectedEngSlot.classList.add('wrong');
    selectedChSlot.classList.add('wrong');
    
    const eSlot = selectedEngSlot;
    const cSlot = selectedChSlot;
    
    setTimeout(() => {
      eSlot.classList.remove('selected', 'wrong');
      cSlot.classList.remove('selected', 'wrong');
    }, 500);

    selectedEngSlot = null;
    selectedChSlot = null;
  }
}

function showResult() {
  clearInterval(timerInterval);
  const finalTime = document.getElementById('timer').textContent;
  document.getElementById('final-time').textContent = finalTime;
  document.getElementById('result-modal').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#english-column .slot').forEach(slot => {
    slot.addEventListener('click', handleEngClick);
  });

  document.querySelectorAll('#chinese-column .slot').forEach(slot => {
    slot.addEventListener('click', handleChClick);
  });

  document.getElementById('restart-btn').addEventListener('click', initGame);
  document.getElementById('modal-restart-btn').addEventListener('click', initGame);

  initGame();
});
