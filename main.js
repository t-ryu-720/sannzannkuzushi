"use strict";

const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let level = 3;
let quiz = makeNumber(array);
let turn = true;

const h1 = document.querySelector("h1");
const h2 = document.querySelector("h2");
const remainingNum = document.querySelectorAll(".remainingNum");
const stones = document.querySelectorAll(".stones");
const cancel = document.getElementById("cancel");
const take = document.getElementById("take");
const game = document.getElementById("game");

// 表示更新
function update() {
  // 残りの個数表示
  for (let i = 0; i < level; i++) {
    stones[i].innerHTML = "";
    stones[i].className = "stones";
    for (let j = 0; j < quiz[i]; j++) {
      const stone = document.createElement("div");
      stone.className = "stone";
      stone.addEventListener("click", clickStone);
      stones[i].appendChild(stone);
    }
  }
  remainingNum.forEach((value, index) => {
    value.textContent = quiz[index];
  });
}

// 手番選択画面
function selectTurn() {
  game.classList.toggle("nonSelect");
  h2.textContent = "手番を選択してください";
  take.textContent = "先手";
  take.addEventListener("click", select);
  cancel.textContent = "後手";
  cancel.addEventListener("click", select);
}

// 手番が選択された時の処理
function select(e) {
  if (e.target.textContent === "後手") {
    turn = !turn;
  }
  game.classList.toggle("nonSelect");
  showTurn();
  take.removeEventListener("click", select);
  cancel.removeEventListener("click", select);
  take.textContent = "とる";
  cancel.textContent = "とりけし";
  take.addEventListener("click", takeStone);
  cancel.addEventListener("click", cancelBtn);
}

update();
selectTurn();

// 勝敗判定
function win() {
  let winArr = Array(level);
  winArr.fill(0);
  if (winArr.toString() === quiz.toString()) {
    return true;
  } else {
    return false;
  }
}

// 問題作成
function makeNumber(array) {
  // Fisher–Yates shuffleアルゴリズムでシャッフル
  let a = array.length;
  while (a) {
    let j = Math.floor(Math.random() * a);
    let t = array[--a];
    array[a] = array[j];
    array[j] = t;
  }
  return array.slice(0, level);
}

// 手番・勝敗表示
function showTurn() {
  let judge = win();
  if (judge) {
    if (!turn) {
      h1.textContent = "あなたの勝ちです!!";
      end();
    } else {
      h1.textContent = "あなたの負けです...";
      end();
    }
    return;
  }
  if (turn) {
    h1.textContent = "あなたの番です";
    h2.textContent = "取りたい石をクリックしてとるボタンを押してください";
  } else {
    h1.textContent = "コンピュータの番です";
    h2.textContent = "コンピュータ考え中....";
    think();
  }
}

// ゲーム終了画面
function end() {
  h2.textContent = "スタート画面に戻る";
  h2.classList.add("back");
  cancel.style.display = "none";
  take.style.display = "none";
  h2.addEventListener("click", () => {
    location.reload();
  });
}

// 石がクリックされた時の処理
function clickStone(e) {
  let num = e.target.parentNode.previousElementSibling;
  e.target.parentNode.classList.add("select");
  stones.forEach((value) => {
    if (!(value.className === "stones select")) {
      value.classList.add("nonSelect");
    }
  });

  num.textContent = String(Number(num.textContent) - 1);
  e.target.classList.add("clicked");
}

// 取るボタンが押された時の処理
function takeStone() {
  stones.forEach((value) => {
    if (value.className === "stones select") {
      remainingNum.forEach((value, index) => {
        quiz[index] = Number(value.textContent);
      });
      turn = !turn;
      update();
      showTurn();
      return;
    }
  });
}

// 取り消しボタンが押された時の処理
function cancelBtn() {
  update();
}

// コンピュータ思考
function think() {
  game.classList.toggle("nonSelect");
  // Simulate "thinking" with a delay
  simulateThinking()
    .then(() => {
      turn = !turn;
      update();
      showTurn();
      game.classList.toggle("nonSelect");
    });
}

function simulateThinking() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Implement your computer's strategy for selecting stones here
      // For example, select a random pile and a random number of stones to take
      let selectedPile = Math.floor(Math.random() * level);
      let stonesToTake = Math.floor(Math.random() * quiz[selectedPile]) + 1;

      // Update the game state and display
      for (let i = 0; i < stonesToTake; i++) {
        stones[selectedPile].childNodes[i].classList.add("clicked");
      }
      quiz[selectedPile] -= stonesToTake;

      resolve(); // Resolve the promise to continue the game
    }, 1000); // Adjust the delay time here (in milliseconds)
  });
}

const bgm = document.getElementById("bgm");

function playBGM() {
  bgm.play();
}

function pauseBGM() {
  bgm.pause();
}

function muteBGM() {
  bgm.muted = true;
}

function unmuteBGM() {
  bgm.muted = false;
}

// Start playing the BGM when the game loads
playBGM();




  
  
  
  
  