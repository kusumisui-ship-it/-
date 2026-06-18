let money = 1000;

const moneyText = document.getElementById("money");

const work = document.getElementById("work");


work.onclick = ()=>{

money += 100;


moneyText.textContent = `資金：${money}円`;

}