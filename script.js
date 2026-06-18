let game = {
  money: 1000,
  level: 1,
  day: 1,
  time: 360,
  baseIncome: 100,
  totalSales: 0,
  todaySales: 0,
  visitors: 0,
  staff: 0,
  oldAge: false,
  disease: false,
  memories: [],
  cats: []
};

const breeds = [
  "三毛", "黒猫", "白猫", "キジトラ", "茶トラ", "ハチワレ",
  "アメリカンショートヘア", "ロシアンブルー", "ラグドール",
  "メインクーン", "ノルウェージャン", "ベンガル",
  "ブリティッシュショートヘア", "ペルシャ", "シャム",
  "マンチカン", "サイベリアン", "アビシニアン"
];

const personalities = [
  "甘えん坊", "暴君", "神経質", "マイペース", "食いしん坊",
  "おしゃべり", "ビビり", "ツンデレ", "王様気質", "膝乗り名人"
];

const defaultNames = [
  "ミケ", "クロ", "シロ", "チャチャ", "モモ",
  "レオ", "ルナ", "ソラ", "ココ", "ムギ"
];

function randomItem(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function createCat(index){
  return {
    name: defaultNames[index] || `ねこ${index+1}`,
    breed: randomItem(breeds),
    personality: randomItem(personalities),
    happy: Math.floor(50 + Math.random() * 40),
    hunger: Math.floor(30 + Math.random() * 40),
    adopted: false,
    cafeReady: false,
    mealsToday: 0,
    age: 1,
    protectDays: Math.floor(7 + Math.random() * 24)
  };
}

function initCats(){
  game.cats = [];
  for(let i=0; i<10; i++){
    game.cats.push(createCat(i));
  }
}

function maxCats(){
  return 10 + (game.level - 1) * 5;
}

function getTimeLabel(){
  let t = game.time;
  let hour = Math.floor(t / 60);
  let minute = t % 60;

  let zone = "朝";
  if(hour >= 9 && hour < 18) zone = "昼";
  if(hour >= 18) zone = "夜";

  return `${game.day}日目 ${zone} ${hour}:${String(minute).padStart(2,"0")}`;
}

function isCafeOpen(){
  return game.time >= 540 && game.time < 1080;
}

function happyBonus(){
  let count = game.cats.filter(cat => cat.happy >= 80).length;
  return 1 + count * 0.01;
}

function staffBonus(){
  return 1 + game.staff * 0.05;
}

function currentIncome(){
  let income = game.baseIncome * happyBonus();

  if(isCafeOpen()){
    income *= 1.5;
  }

  income *= staffBonus();

  return Math.floor(income);
}

function changeTab(tabId){
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  render();
}

function render(){
  document.getElementById("moneyText").textContent = `${Math.floor(game.money).toLocaleString()} C$`;
  document.getElementById("levelText").textContent = game.level;
  document.getElementById("catCountText").textContent = `${game.cats.length}/${maxCats()}`;
  document.getElementById("visitorText").textContent = `${game.visitors.toLocaleString()}人`;
  document.getElementById("timeText").textContent = getTimeLabel();
  document.getElementById("incomeText").textContent = `毎秒収入：${currentIncome().toLocaleString()} C$`;

  document.getElementById("cafeStatusText").textContent = isCafeOpen() ? "営業中" : "閉店中";
  document.getElementById("todaySalesText").textContent = `本日売上：${Math.floor(game.todaySales).toLocaleString()} C$`;
  document.getElementById("totalSalesText").textContent = `総売上：${Math.floor(game.totalSales).toLocaleString()} C$`;
  document.getElementById("staffText").textContent = `従業員：${game.staff}人`;
  document.getElementById("oldAgeText").textContent = game.oldAge ? "ON" : "OFF";
  document.getElementById("diseaseText").textContent = game.disease ? "ON" : "OFF";

  renderCats();
  renderMemories();
}

function renderCats(){
  const area = document.getElementById("catArea");
  area.innerHTML = "";

  game.cats.forEach((cat, index) => {
    let sleepText = cat.happy <= 80 ? "💤 寝ている" : "☀️ 起きている";
    let readyText = cat.cafeReady ? "☕ カフェ採用可" : "🏠 預かり中";

    area.innerHTML += `
      <div class="cat-card">
        <div class="cat-head">
          <span>🐱 ${cat.name}</span>
          <span>${readyText}</span>
        </div>

        <div class="cat-info">
          種類：${cat.breed}<br>
          性格：${cat.personality}<br>
          幸福度：${cat.happy}/100<br>
          空腹度：${cat.hunger}/100<br>
          保護期間：あと${cat.protectDays}日<br>
          状態：${sleepText}<br>
          ご飯：${cat.mealsToday}/3回
        </div>

        <div class="cat-actions">
          <button onclick="feedCat(${index})">ご飯 +10</button>
          <button onclick="giveChuru(${index})">ちゅ〜る +30</button>
          <button onclick="playCat(${index})">遊ぶ +5</button>
          <button class="rename-btn" onclick="renameCat(${index})">名前変更</button>
          <button class="adopt-btn" onclick="adoptCat(${index})">引き取る</button>
        </div>
      </div>
    `;
  });
}

function renderMemories(){
  const area = document.getElementById("memoryArea");

  if(game.memories.length === 0){
    area.innerHTML = "<p>まだ思い出はありません。</p>";
    return;
  }

  area.innerHTML = "";
  game.memories.slice().reverse().forEach(memory => {
    area.innerHTML += `
      <div class="memory-card">
        ${memory}
      </div>
    `;
  });
}

function feedCat(index){
  let cat = game.cats[index];

  if(cat.mealsToday >= 3){
    alert("ご飯は1日3回まで！");
    return;
  }

  if(game.money < 100){
    alert("資金が足りない！");
    return;
  }

  game.money -= 100;
  cat.happy = Math.min(100, cat.happy + 10);
  cat.hunger = Math.max(0, cat.hunger - 25);
  cat.mealsToday++;

  checkCafeReady(cat);
  render();
}

function giveChuru(index){
  let cat = game.cats[index];

  if(game.money < 300){
    alert("ちゅ〜る代が足りない！");
    return;
  }

  game.money -= 300;
  cat.happy = Math.min(100, cat.happy + 30);
  cat.hunger = Math.max(0, cat.hunger - 10);

  addMemory(`${game.day}日目：${cat.name}にちゅ〜るをあげた。すごく嬉しそう。`);
  checkCafeReady(cat);
  render();
}

function playCat(index){
  let cat = game.cats[index];

  cat.happy = Math.min(100, cat.happy + 5);
  cat.hunger = Math.min(100, cat.hunger + 5);

  if(Math.random() < 0.08){
    game.money += 500;
    addMemory(`${game.day}日目：${cat.name}が膝に乗ってきた。来客が癒されて+500C$！`);
  }

  checkCafeReady(cat);
  render();
}

function renameCat(index){
  let cat = game.cats[index];
  let newName = prompt("猫の名前を入力", cat.name);

  if(newName && newName.trim() !== ""){
    cat.name = newName.trim();
    addMemory(`${game.day}日目：${cat.name}という名前になった。`);
    render();
  }
}

function adoptCat(index){
  let cat = game.cats[index];
  let price = 5000 + game.level * 500;

  if(cat.adopted){
    alert("すでに引き取り済みです");
    return;
  }

  if(game.money < price){
    alert(`引き取りには${price}C$必要です`);
    return;
  }

  if(confirm(`${cat.name}を${price}C$で引き取りますか？`)){
    game.money -= price;
    cat.adopted = true;
    addMemory(`${game.day}日目：${cat.name}を正式に家族として迎えた。`);
    render();
  }
}

function checkCafeReady(cat){
  if(cat.happy >= 100 && !cat.cafeReady){
    cat.cafeReady = true;
    addMemory(`${game.day}日目：${cat.name}が猫カフェで働けるようになった！`);
  }
}

function hireStaff(){
  let cost = 5000 + game.staff * 3000;

  if(game.money < cost){
    alert(`従業員を雇うには${cost}C$必要です`);
    return;
  }

  game.money -= cost;
  game.staff++;
  addMemory(`${game.day}日目：従業員を1人雇った。`);
  render();
}

function addMemory(text){
  game.memories.push(text);
  if(game.memories.length > 100){
    game.memories.shift();
  }
}

function toggleOldAge(){
  game.oldAge = !game.oldAge;
  render();
}

function toggleDisease(){
  game.disease = !game.disease;
  render();
}

function gameTick(){
  let income = currentIncome();

  game.money += income;
  game.totalSales += income;
  game.todaySales += income;

  if(isCafeOpen()){
    let visitors = Math.max(1, Math.floor(game.cats.filter(c => c.happy >= 80).length * happyBonus()));
    game.visitors += visitors;
  }

  game.cats.forEach(cat => {
    cat.hunger = Math.min(100, cat.hunger + 1);

    if(cat.hunger >= 70){
      cat.happy = Math.max(0, cat.happy - 1);
    }

    if(game.staff >= 10 && cat.happy < 80){
      cat.happy = 80;
    }
  });

  game.time += 3;

  if(game.time >= 1440){
    nextDay();
  }

  levelCheck();
  render();
}

function nextDay(){
  game.day++;
  game.time = 360;
  game.todaySales = 0;

  game.cats.forEach(cat => {
    cat.mealsToday = 0;
    cat.protectDays--;

    if(cat.protectDays <= 0 && !cat.adopted){
      addMemory(`${game.day}日目：${cat.name}は新しい家族のもとへ譲渡された。`);
      Object.assign(cat, createCat(Math.floor(Math.random() * 1000)));
    }
  });

  addMemory(`${game.day}日目が始まった。`);
}

function levelCheck(){
  let newLevel = Math.floor(game.totalSales / 10000) + 1;

  if(newLevel > game.level){
    game.level = Math.min(9999, newLevel);
    addMemory(`${game.day}日目：にゃんカフェLv${game.level}になった！`);
  }
}

function saveGame(){
  localStorage.setItem("nyanCafeSave", JSON.stringify(game));
  alert("セーブしました");
}

function loadGame(){
  const data = localStorage.getItem("nyanCafeSave");

  if(data){
    game = JSON.parse(data);
  }else{
    initCats();
  }

  render();
}

function resetGame(){
  if(confirm("本当にリセットしますか？")){
    localStorage.removeItem("nyanCafeSave");
    location.reload();
  }
}

setInterval(gameTick, 1000);
setInterval(saveGame, 15000);

loadGame();

setInterval(saveGame,15000);

