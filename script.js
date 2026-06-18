let money = 1000;

let cats = [
  { name: "ミケ", type: "三毛", personality: "甘えん坊", happy: 80, hungry: 50 },
  { name: "クロ", type: "黒猫", personality: "暴君", happy: 65, hungry: 60 },
  { name: "シロ", type: "白猫", personality: "マイペース", happy: 90, hungry: 40 }
];

const moneyText = document.getElementById("money");
const catCountText = document.getElementById("catCount");
const catArea = document.getElementById("catArea");
const work = document.getElementById("work");

function updateScreen(){
  moneyText.textContent = `資金：${money}円`;
  catCountText.textContent = `猫：${cats.length}匹`;

  catArea.innerHTML = "";

  cats.forEach((cat, index) => {
    catArea.innerHTML += `
      <div class="cat-card">
        <div class="cat-name">🐱 ${cat.name}</div>
        <div class="cat-info">
          種類：${cat.type}<br>
          性格：${cat.personality}<br>
          幸福度：${cat.happy}<br>
          空腹度：${cat.hungry}
        </div>
        <button onclick="playWithCat(${index})">遊ぶ</button>
        <button onclick="feedCat(${index})">ご飯</button>
      </div>
    `;
  });
}

function playWithCat(index){
  cats[index].happy += 5;
  if(cats[index].happy > 100) cats[index].happy = 100;

  money += 20;
  updateScreen();
}

function feedCat(index){
  cats[index].hungry -= 10;
  cats[index].happy += 3;

  if(cats[index].hungry < 0) cats[index].hungry = 0;
  if(cats[index].happy > 100) cats[index].happy = 100;

  money -= 50;
  updateScreen();
}

work.onclick = () => {
  money += 100;
  updateScreen();
};

updateScreen();