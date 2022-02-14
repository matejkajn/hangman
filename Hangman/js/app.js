var guessCount;
var guessWords = [];
var guessObj;
var guessWord;
var guessHint;
var previousGuessWord;
var guessButtons = [];
var guesses = [];
var alphabet = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "z",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "y",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  "ě",
  "š",
  "č",
  "ř",
  "ž",
  "ý",
  "á",
  "í",
  "é",
  "ú",
  "ů",
  "ó",
];
//const canvas = $("#canvas")[0].getContext("2d");
const canvas = $("#canvas").get(0).getContext("2d"); //Vrátí element
loadData();
play();

//Vygenerování nového slova
function newWord() {
  guessObj = getRandomWord();
  while (guessObj == previousGuessWord) {
    guessObj = getRandomWord();
  }
  previousGuessWord = guessObj;
  guessWord = guessObj[0].toLowerCase();
  guessHint = guessObj[1];

  $("#guessing-word").empty();
  $("#help").empty();

  list = document.createElement("ul");
  $("#guessing-word")[0].appendChild(list);
  for (i = 0; i < guessWord.length; i++) {
    letter = document.createElement("li");
    if (guessWord[i] == " ") {
      letter.innerHTML = " ";
      guesses.push(letter);
    } else {
      letter.innerHTML = "_";
      guesses.push(letter);
    }
    list.appendChild(letter);
  }
}

//Aktualizace panáčka a počtu pokusů
function updateGuessCount() {
  if (guessCount == 0) {
    guessCount = 7;
  } else guessCount--;

  switch (guessCount) {
    case 7:
    case 6:
    case 5:
      $("#guess-count").removeClass("bg-danger");
      $("#guess-count").addClass("bg-success");
      $(".progress-bar").removeClass("bg-danger");
      $(".progress-bar").addClass("bg-success");
      break;
    case 4:
    case 3:
      $("#guess-count").removeClass("bg-success");
      $("#guess-count").addClass("bg-warning text-dark");
      $(".progress-bar").removeClass("bg-success");
      $(".progress-bar").addClass("bg-warning");
      break;
    case 0:
      gameLost();
      break;
    default:
      $("#guess-count").removeClass("bg-warning text-dark");
      $("#guess-count").addClass("bg-danger");
      $(".progress-bar").removeClass("bg-warning");
      $(".progress-bar").addClass("bg-danger");
      break;
  }

  $("#guess-count").text(guessCount);
  $(".progress-bar").attr("aria-valuenow", guessCount);
  $(".progress-bar").attr("style", "width: " + (100 / 7) * guessCount + "%");
  draw();
}

//Vyčistí kreslící plátno
function clearCanvas() {
  canvas.clearRect(0, 0, $("#canvas").get(0).width, $("#canvas").get(0).height);
  canvas.strokeStyle = "#000";
  canvas.lineWidth = 8;
  canvas.beginPath();
  canvas.moveTo(220, 240);
  canvas.lineTo(20, 240);
  canvas.moveTo(65, 240);
  canvas.lineTo(40, 20);
  canvas.lineTo(160, 20);
  canvas.stroke();
}

//Metoda pro kreslení panáčka
function draw() {
  switch (guessCount) {
    case 7:
      clearCanvas();
    case 6:
      canvas.lineWidth = 3.5;
      canvas.beginPath();
      canvas.moveTo(150, 20);
      canvas.lineTo(150, 50);
      canvas.closePath();
      canvas.stroke();
      canvas.beginPath();
      canvas.arc(150, 75, 25, 0, Math.PI * 2, true);
      canvas.closePath();
      canvas.stroke();
      break;
    case 5:
      canvas.beginPath();
      canvas.moveTo(150, 100);
      canvas.lineTo(150, 165);
      canvas.stroke();
      break;
    case 4:
      canvas.beginPath();
      canvas.moveTo(150, 125);
      canvas.lineTo(190, 135);
      canvas.stroke();
      break;
    case 3:
      canvas.beginPath();
      canvas.moveTo(150, 125);
      canvas.lineTo(110, 135);
      canvas.stroke();
      break;
    case 2:
      canvas.beginPath();
      canvas.moveTo(150, 165);
      canvas.lineTo(180, 205);
      canvas.stroke();
      break;
    case 1:
      canvas.lineWidth = 3;
      canvas.beginPath();
      canvas.moveTo(150, 165);
      canvas.lineTo(120, 205);
      canvas.stroke();
      break;
    case 0:
      canvas.beginPath();
      canvas.moveTo(140, 87.5);
      canvas.lineTo(160, 87.5);
      //Pravé oko
      canvas.moveTo(160, 65);
      canvas.lineTo(155, 75);
      canvas.moveTo(155, 65);
      canvas.lineTo(160, 75);
      //Levé oko
      canvas.moveTo(140, 65);
      canvas.lineTo(145, 75);
      canvas.moveTo(145, 65);
      canvas.lineTo(140, 75);
      canvas.stroke();
      break;
  }
}

//Načtení dat z json souboru
function loadData() {
  $.ajax({
    async: false,
    type: "GET",
    global: false,
    dataType: "json",
    url: "data.json",
    data: {},
    success: function (data) {
      $.each(data, function (key, value) {
        $.each(value, function (guessKey, guessValue) {
          guessWords.push([guessValue.word, guessValue.hint]);
        });
      });
    },
  });
}

//Generace náhodného slova
function getRandomWord() {
  return guessWords[Math.floor(Math.random() * guessWords.length)];
}

//Funkce pro zobrazení stavu prohry
function gameLost() {
  $("#guess-text").html("Ale NE! Človíček se ti oběsil a ty jsi prohrál!");
  $("#guess-text").addClass("text-danger fs-4 text-uppercase fw-bold");
  $("#guess-text").removeClass("lead");

  //Vypnutí tlačítek
  for (let i = 0; i < guessButtons.length; i++) {
    guessButtons[i].setAttribute("disabled", true);
  }
}

//Funkce pro nastavení hry při spuštění
function startGameSetup() {
  $("#guess-text").html(
    '<b>Pokusy:</b><span class="badge bg-success p-1 ms-2" id="guess-count">7</span>'
  );
  $("#guess-text").removeClass(
    "text-danger text-success fs-4 text-uppercase fw-bold"
  );
  $("#guess-text").addClass("lead");

  $(".progress").html(
    '<div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" aria-valuenow="7" aria-valuemin="0" aria-valuemax="7" style="width: 100%"></div>'
  );
}

//Funkce pro zobrazení stavu výhry
function gameWin() {
  $("#guess-text").html(
    "Vyhrál jsi! Nové slovo si vygeneruješ dole modrým tlačítkem!"
  );
  $("#guess-text").addClass("text-success fs-4 text-uppercase fw-bold");
  $("#guess-text").removeClass("lead");

  //Vypneme tlačítka
  for (let i = 0; i < guessButtons.length; i++) {
    guessButtons[i].setAttribute("disabled", true);
  }
}

//Funkce pro generace abecedy
function generateButtons() {
  $("#letters").empty();
  letterList = document.createElement("ul");
  letterList.id = "letter-list";
  $("#letters")[0].appendChild(letterList);
  for (var i = 0; i < alphabet.length; i++) {
    btnLetter = document.createElement("li");
    btnLetter.className = "li-letter";
    button = document.createElement("button");
    button.className = "btn btn-secondary";
    button.type = "button";
    button.innerHTML = alphabet[i];
    guessButtons.push(button);
    checkGuess();
    btnLetter.appendChild(button);
    letterList.appendChild(btnLetter);
  }
}

//Funkce pro kontrolu zadaného písmenka
function checkGuess() {
  button.onclick = function () {
    var letterGuess = this.innerHTML;
    var wrongGuess = true;
    for (let i = 0; i < guessWord.length; i++) {
      if (guessWord[i] === letterGuess) {
        guesses[i].innerHTML = letterGuess;
        wrongGuess = false;
      }
    }
    if (wrongGuess) {
      updateGuessCount();
    }

    if (winCheck()) {
      gameWin();
    }

    this.setAttribute("disabled", true);
  };
}

//Funkce pro kontrolu výhry
function winCheck() {
  ret = true;
  for (let i = 0; i < guessWord.length; i++) {
    if (guessWord[i] !== guesses[i].innerHTML) {
      ret = false;
    }
  }
  return ret;
}

//Funkce pro spuštění hry
function play() {
  guessCount = 7;
  guesses = [];
  clearCanvas();
  startGameSetup();
  generateButtons();
  newWord();
}

//Zobrazení nápovědy
$("#btn-help").click(function () {
  $("#help").html('<p class="lead bold"><b>' + guessHint + "</b></p>");
  $("#help").show();
});

//Načtení dat z json podle vybraných tématických okruhů
$("#thema-select").change(function () {
  if ($(this).val().length === 0 || $(this).val().length === 3) {
    guessWords = [];
    loadData();
  } else {
    guessWords = [];
    $.ajax({
      async: false,
      type: "GET",
      global: false,
      dataType: "json",
      url: "data.json",
      data: {},
      success: function (data) {
        $.each(data, function (key, value) {
          for (let i = 0; i < $("#thema-select").val().length; i++) {
            if ($("#thema-select").val()[i] == key) {
              $.each(value, function (guessKey, guessValue) {
                guessWords.push([guessValue.word, guessValue.hint]);
              });
            }
          }
        });
      },
    });
  }
  play();
});
