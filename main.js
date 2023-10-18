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
    //各山の石の数に応じて石を表示
    for (let j = 0; j < quiz[i]; j++) {
      const stone = document.createElement("div");
      stone.className = "stone";
      stone.addEventListener("click", clickStone);
      stones[i].appendChild(stone);
    }
  }
  // 残りの石の数を表示
  remainingNum.forEach((value, index) => {
    value.textContent = quiz[index];
  });
}

// 手番選択画面
function showTurnSelection() {
  game.classList.toggle("nonSelect");
  h2.textContent = "手番を選択してください";
  take.textContent = "先手";
  take.addEventListener("click", handleTurnSelection);
  cancel.textContent = "後手";
  cancel.addEventListener("click", handleTurnSelection);
}
// 手番が選択された時の処理
function handleTurnSelection(e) {
  if (e.target.textContent === "後手") {
    turn = !turn;
  }
  game.classList.toggle("nonSelect");
  showTurn();
  take.removeEventListener("click", handleTurnSelection );
  cancel.removeEventListener("click", handleTurnSelection);
  take.textContent = "とる";
  cancel.textContent = "とりけし";
  take.addEventListener("click", takeStone);
  cancel.addEventListener("click", cancelAction);
}

// 初期化およびゲーム開始
function initializeGame() {
update();
selectTuan();
}

// 初期化およびゲーム開始を呼び出し
initializeGame();

// 勝敗判定
function iswin() {
  // 各山の石の数を合計して判定する
  const totalStones = quiz.reduce((sum, stones) => sum + stones, 0);
  return totalStones === 0;
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
function think(difficulty) {
  // Define thinking times (in milliseconds) for different difficulty levels
  const thinkingTimes = {
    easy: 3000,
    medium: 2000,
    hard: 1000
  };

  const thinkingTime = thinkingTimes[difficulty] || thinkingTimes.medium; // Default to medium difficulty

  game.classList.toggle("nonSelect");
  let nimSum = 0;
  for (let i = 0; i < quiz.length; i++) {
    nimSum ^= quiz[i];
  }
  if (nimSum === 0) {
    let max = quiz.indexOf(Math.max(...quiz));
    quiz[max]--;
    stones[max].childNodes[0].classList.add("clicked");
  } else {
    for (let j = 0; j < quiz.length; j++) { 
      if (quiz[j] > (quiz[j] ^ nimSum)) {
        for (let k = 0; k < quiz[j] - (quiz[j] ^ nimSum); k++) {
          stones[j].childNodes[k].classList.add("clicked");
        }
        quiz[j] = quiz[j] ^ nimSum;
        break;
      }
    }
  }
  setTimeout(() => {
    turn = !turn;
    update();
    showTurn();
    game.classList.toggle("nonSelect");
  }, thinkingTime);
}
