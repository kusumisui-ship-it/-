let lastSave = "--";

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
  cats: [],
  totalProtected: 10,
  totalAdopted: 0,
  buildingIndex: 0,
  foods: {},
  toys: {}
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

const buildings = [
  { name:"リビング", cost:0, capacity:10, bonus:1 },
  { name:"広い家", cost:100000, capacity:25, bonus:1.15 },
  { name:"かなり広い家", cost:250000, capacity:50, bonus:1.35 },
  { name:"庭付き", cost:500000, capacity:100, bonus:1.7 },
  { name:"豪邸", cost:1000000, capacity:250, bonus:2.2 },
  { name:"超豪邸", cost:10000000, capacity:1000, bonus:4 },
  { name:"猫御殿", cost:100000000, capacity:9999, bonus:10 }
];

const foods = [
  { id:"kariya", name:"カリカリ", cost:30, happy:5, hunger:-12 },
  { id:"premiumKariya", name:"高級カリカリ", cost:120, happy:12, hunger:-20 },
  { id:"can", name:"猫缶", cost:80, happy:10, hunger:-18 },
  { id:"goodCan", name:"ちょっと良い猫缶", cost:250, happy:20, hunger:-25 },
  { id:"greatCan", name:"かなり良い猫缶", cost:800, happy:30, hunger:-35 },
  { id:"bestCan", name:"最高級猫缶", cost:2500, happy:45, hunger:-50 },
  { id:"churu", name:"ちゅ〜る", cost:150, happy:30, hunger:-10 },
  { id:"goodChuru", name:"ちょっと良いちゅ〜る", cost:350, happy:45, hunger:-15 },
  { id:"greatChuru", name:"かなり良いちゅ〜る", cost:800, happy:60, hunger:-20 },
  { id:"bestChuru", name:"最高級ちゅ〜る", cost:3000, happy:100, hunger:-40 }
];

const toys = [
  { id:"jarashi", name:"猫じゃらし", cost:500, happy:2, bonus:1.02 },
  { id:"ball", name:"ボール", cost:1200, happy:3, bonus:1.03 },
  { id:"tunnel", name:"トンネル", cost:3000, happy:5, bonus:1.05 },
  { id:"box", name:"ダンボール", cost:5000, happy:6, bonus:1.06 },
  { id:"tower", name:"キャットタワー", cost:15000, happy:10, bonus:1.12 },
  { id:"wheel", name:"キャットホイール", cost:50000, happy:15, bonus:1.25 }
];

function randomItem(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function createCat(index){
  return {
    name: defaultNames[index] || `ねこ${index + 1}`,
    breed: randomItem(breeds),
    personality: randomItem(personalities),
    happy: Math.floor(55 + Math.random() * 35),
    hunger: Math.floor(20 + Math.random() * 45),
    adopted: false,
    cafeReady: false,
    mealsToday: 0,
    age: 1,
    protectDays: Math.floor(7 + Math.random() * 24),
    earned: 0,
    visitors: 0
  };
}

function initCats(){
  game.cats = [];
  for(let i = 0; i < 10; i++){
    game.cats.push(createCat(i));
  }
}

function maxCats(){
  return Math.max(buildings[game.buildingIndex].capacity, 10 + (game.level - 1) * 5);
}

function getTimeLabel(){
  const hour = Math.floor(game.time / 60);
  const minute = game.time % 60;

  let zone = "朝";
  if(hour >= 9 && hour < 18) zone = "昼";
  if(hour >= 18) zone = "夜";

  return `${game.day}日目 ${zone} ${hour}:${String(minute).padStart(2,"0")}`;
}

function isCafeOpen(){
  return game.time >= 540 && game.time < 1080;
}

function happyCount(){
  return game.cats.filter(cat => cat.happy >= 80).length;
}

function happyBonus(){
  return 1 + happyCount() * 0.01;
}

function toyBonus(){
  let bonus = 1;
  toys.forEach(toy => {
    if(game.toys[toy.id]){
      bonus *= toy.bonus;
    }
  });
  return bonus;
}

function staffBonus(){
  return 1 + game.staff * 0.05;
}

function currentIncome(){
  let income = game.baseIncome;
  income *= happyBonus();
  income *= staffBonus();
  income *= buildings[game.buildingIndex].bonus;
  income *= toyBonus();

  if(isCafeOpen()){
    income *= 1.5;
  }

  return Math.floor(income);
}

function changeTab(tabId){
  saveGame();

  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");

  render();
}

function percentBar(value, type = ""){
  return `
    <div class="bar ${type}">
      <div class="bar-inner" style="width:${Math.max(0, Math.min(100, value))}%"></div>
    </div>
  `;
}

function render(){
  document.getElementById("moneyText").textContent = `${Math.floor(game.money).toLocaleString()} C$`;
  document.getElementById("levelText").textContent = game.level;
  document.getElementById("catCountText").textContent = `${game.cats.length}/${maxCats()}`;
  document.getElementById("visitorText").textContent = `${game.visitors.toLocaleString()}人`;
  document.getElementById("timeText").textContent = getTimeLabel();
  document.getElementById("incomeText").textContent = `毎秒収入：${currentIncome().toLocaleString()} C$`;
  document.getElementById("buildingText").textContent = `建物：${buildings[game.buildingIndex].name}`;
  document.getElementById("statsText").textContent = `総保護数：${game.totalProtected} / 総引取数：${game.totalAdopted}`;

  document.getElementById("cafeStatusText").textContent = isCafeOpen() ? "営業中 ☕" : "閉店中 💤";
  document.getElementById("todaySalesText").textContent = `本日売上：${Math.floor(game.todaySales).toLocaleString()} C$`;
  document.getElementById("totalSalesText").textContent = `総売上：${Math.floor(game.totalSales).toLocaleString()} C$`;
  document.getElementById("staffText").textContent = `従業員：${game.staff}人 / 次の雇用費：${staffCost().toLocaleString()} C$`;
  document.getElementById("oldAgeText").textContent = game.oldAge ? "ON" : "OFF";
  document.getElementById("diseaseText").textContent = game.disease ? "ON" : "OFF";
  document.getElementById("lastSaveText").textContent = `最終保存：${lastSave}`;

  renderCats();
  renderMemories();
  renderBuildings();
  renderShop();
}

function renderCats(){
  const area = document.getElementById("catArea");
  area.innerHTML = "";

  game.cats.forEach((cat, index) => {
    const sleepText = cat.happy <= 80 ? "💤 寝ている" : "☀️ 起きている";
    const readyText = cat.happy >= 100 ? "☕ 採用可" : "🏠 預かり中";
    const adoptPrice = adoptionCost();

    area.innerHTML += `
      <div class="cat-card">
        <div class="cat-head">
          <span>🐱 ${cat.name}</span>
          <span>${readyText}</span>
        </div>

        <div class="cat-info">
          種類：${cat.breed}<br>
          性格：${cat.personality}<br>

          幸福度：${cat.happy}/100
          ${percentBar(cat.happy)}

          空腹度：${cat.hunger}/100
          ${percentBar(cat.hunger, "hunger")}

          保護期間：あと${cat.protectDays}日<br>
          状態：${sleepText}<br>
          ご飯：${"●".repeat(cat.mealsToday)}${"○".repeat(3 - cat.mealsToday)}<br>
          売上貢献：${Math.floor(cat.earned).toLocaleString()} C$<br>
          来客貢献：${cat.visitors.toLocaleString()}人
        </div>

        <div class="cat-actions">
          <button onclick="quickFeed(${index})">ご飯</button>
          <button onclick="quickChuru(${index})">ちゅ〜る</button>
          <button onclick="playCat(${index})">遊ぶ</button>
          <button class="blue" onclick="renameCat(${index})">名前変更</button>
          <button class="pink" onclick="adoptCat(${index})">引き取る ${adoptPrice.toLocaleString()}C$</button>
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
    area.innerHTML += `<div class="memory-card">${memory}</div>`;
  });
}

function renderBuildings(){
  const area = document.getElementById("buildingArea");
  area.innerHTML = "";

  buildings.forEach((building, index) => {
    const owned = index <= game.buildingIndex;
    const current = index === game.buildingIndex;

    area.innerHTML += `
      <div class="item-card">
        <b>${building.name}</b><br>
        収容：${building.capacity}匹 / 売上倍率：×${building.bonus}<br>
        価格：${building.cost.toLocaleString()} C$<br>
        ${
          current
          ? "<button class='gray'>現在の建物</button>"
          : owned
            ? "<button class='gray'>購入済み</button>"
            : `<button onclick="buyBuilding(${index})">購入</button>`
        }
      </div>
    `;
  });
}

function renderShop(){
  const foodArea = document.getElementById("foodArea");
  foodArea.innerHTML = "";

  foods.forEach(food => {
    foodArea.innerHTML += `
      <div class="item-card">
        <b>${food.name}</b><br>
        価格：${food.cost} C$ / 幸福+${food.happy}<br>
        <button onclick="buyFood('${food.id}')">1個買う</button>
        所持：${game.foods[food.id] || 0}
      </div>
    `;
  });

  const toyArea = document.getElementById("toyArea");
  toyArea.innerHTML = "";

  toys.forEach(toy => {
    const owned = game.toys[toy.id];

    toyArea.innerHTML += `
      <div class="item-card">
        <b>${toy.name}</b><br>
        価格：${toy.cost.toLocaleString()} C$ / 売上倍率：×${toy.bonus}<br>
        ${
          owned
          ? "<button class='gray'>購入済み</button>"
          : `<button onclick="buyToy('${toy.id}')">購入</button>`
        }
      </div>
    `;
  });
}

function quickFeed(index){
  useFood(index, "can");
}

function quickChuru(index){
  useFood(index, "churu");
}

function useFood(index, foodId){
  const cat = game.cats[index];
  const food = foods.find(f => f.id === foodId);

  if(cat.mealsToday >= 3){
    alert("ご飯は1日3回まで！");
    return;
  }

  if((game.foods[foodId] || 0) <= 0){
    if(game.money < food.cost){
      alert("資金が足りない！");
      return;
    }
    game.money -= food.cost;
  }else{
    game.foods[foodId]--;
  }

  cat.happy = Math.min(100, cat.happy + food.happy);
  cat.hunger = Math.max(0, cat.hunger + food.hunger);
  cat.mealsToday++;

  if(foodId.includes("churu")){
    addMemory(`${game.day}日目：${cat.name}に${food.name}をあげた。`);
  }

  saveGame();
  render();
}

function playCat(index){
  const cat = game.cats[index];

  cat.happy = Math.min(100, cat.happy + 5);
  cat.hunger = Math.min(100, cat.hunger + 5);

  if(Math.random() < 0.08){
    game.money += 500;
    addMemory(`${game.day}日目：${cat.name}が膝に乗ってきた。来客が癒されて+500C$！`);
  }

  saveGame();
  render();
}

function renameCat(index){
  const cat = game.cats[index];
  const newName = prompt("猫の名前を入力", cat.name);

  if(newName && newName.trim() !== ""){
    cat.name = newName.trim();
    addMemory(`${game.day}日目：${cat.name}という名前になった。`);
    saveGame();
    render();
  }
}

function adoptionCost(){
  return 5000 + game.level * 500;
}

function adoptCat(index){
  const cat = game.cats[index];
  const price = adoptionCost();

  if(cat.adopted){
    alert("すでに引き取り済みです");
    return;
  }

  if(game.money < price){
    alert(`引き取りには${price.toLocaleString()}C$必要です`);
    return;
  }

  if(confirm(`${cat.name}を${price.toLocaleString()}C$で引き取りますか？`)){
    game.money -= price;
    cat.adopted = true;
    game.totalAdopted++;
    addMemory(`${game.day}日目：${cat.name}を正式に家族として迎えた。`);
    saveGame();
    render();
  }
}

function buyFood(foodId){
  const food = foods.find(f => f.id === foodId);

  if(game.money < food.cost){
    alert("資金が足りない！");
    return;
  }

  game.money -= food.cost;
  game.foods[foodId] = (game.foods[foodId] || 0) + 1;

  saveGame();
  render();
}

function buyToy(toyId){
  const toy = toys.find(t => t.id === toyId);

  if(game.toys[toyId]){
    return;
  }

  if(game.money < toy.cost){
    alert("資金が足りない！");
    return;
  }

  game.money -= toy.cost;
  game.toys[toyId] = true;

  addMemory(`${game.day}日目：${toy.name}を購入した。`);
  saveGame();
  render();
}

function buyBuilding(index){
  const building = buildings[index];

  if(index <= game.buildingIndex){
    return;
  }

  if(game.money < building.cost){
    alert("資金が足りない！");
    return;
  }

  game.money -= building.cost;
  game.buildingIndex = index;

  addMemory(`${game.day}日目：${building.name}に引っ越した。`);
  saveGame();
  render();
}

function staffCost(){
  return 5000 + game.staff * 3000;
}

function hireStaff(){
  const cost = staffCost();

  if(game.money < cost){
    alert(`従業員を雇うには${cost.toLocaleString()}C$必要です`);
    return;
  }

  game.money -= cost;
  game.staff++;

  addMemory(`${game.day}日目：従業員を1人雇った。`);
  saveGame();
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
  saveGame();
  render();
}

function toggleDisease(){
  game.disease = !game.disease;
  saveGame();
  render();
}

function gameTick(){
  const income = currentIncome();

  game.money += income;
  game.totalSales += income;
  game.todaySales += income;

  const open = isCafeOpen();
  const activeCats = game.cats.filter(c => c.happy >= 80);

  if(open){
    const visitors = Math.max(1, Math.floor(activeCats.length * happyBonus()));
    game.visitors += visitors;

    activeCats.forEach(cat => {
      cat.visitors += visitors;
      cat.earned += income / Math.max(1, activeCats.length);
    });
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
      game.totalProtected++;
    }
  });

  addMemory(`${game.day}日目が始まった。`);
  saveGame();
}

function levelCheck(){
  const newLevel = Math.floor(game.totalSales / 10000) + 1;

  if(newLevel > game.level){
    game.level = Math.min(9999, newLevel);
    addMemory(`${game.day}日目：にゃんカフェLv${game.level}になった！`);
    saveGame();
  }
}

function saveGame(){
  localStorage.setItem("nyanCafeSave", JSON.stringify(game));
  lastSave = new Date().toLocaleTimeString();
}

function loadGame(){
  const data = localStorage.getItem("nyanCafeSave");

  if(data){
    game = JSON.parse(data);

    if(game.totalProtected === undefined) game.totalProtected = game.cats.length;
    if(game.totalAdopted === undefined) game.totalAdopted = 0;
    if(game.buildingIndex === undefined) game.buildingIndex = 0;
    if(game.foods === undefined) game.foods = {};
    if(game.toys === undefined) game.toys = {};
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