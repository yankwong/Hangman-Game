var YTK = YTK || {};

YTK.hangman = (function() {

  var prefix = 'YTK_',
      wordsArray = [
      "rhaegal",
      "saitama",
      "covfefe",
      "zzyzx road",
      "evangelion",
      "brendan eich",
      "trinity force",
      "mikasa ackerman",
      ],
      avatars = {
        "correct": [
          " happy-1",
          " happy-2",
          " happy-3"
        ],
        "incorrect": [
          " sad-1",
          " sad-2",
          " sad-3"
        ]
      },
      larSpeech = {
        "start": [
          "$ is power my friend",
          "Can always use more $",
          "$ is not jQuery here"
        ],
        "correct": [
          "Power of the VIP",
          "Good right? MY idea!",
          "My IQ is so high",
          "Now we talking~"
        ],
        "incorrect": [
          "Triggered",
          "Unfair! Calling my lawyer",
          "Worst deal EVER",
          "Impossibru!"
        ]
      },
      bethSpeech = {
        "start": [
          "Sweet, cat paws!",
          "Yay I <3 cats",
          "Ohh Meow-nificen"
        ],
        "correct": [
          "Ha! I'm too good",
          "GG Noobz! Too easy",
          "LOLz 1st grade level",
          "Purrrfection~"
        ],
        "incorrect": [
          "I literally can't even",
          "Could you flipping not?",
          "CATastrophic~~",
          "Weeeak"
        ]
      },
      alphabets,
      bkgMusic;

  function getAlphabetArr() {
    var str = 'abcdefghijklmnopqrstuvwxyz';
    return str.split('');
  }
  function ensureStorage() {
    return typeof(Storage) !== "undefined";
  }
  function ensureCharID(id) {
    return id == 0 || id == 1;
  }
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function getAnswer(){
    return wordsArray[getRandomInt(0, wordsArray.length-1)];
  }
  function getUniqueCharArray(answerStr){
    var answerArr = answerStr.split(''),
        uniqueArr = [];

    for (var i = 0; i < answerArr.length; i++) {
      if (answerArr[i] !== ' ' && uniqueArr.indexOf(answerArr[i]) === -1) {
        uniqueArr.push(answerArr[i]);
      }
    }

    return uniqueArr;
  }
  function showLoader() {
    var loader = document.getElementById('loader-overlay');

    loader.className += ' active';
  }
  function removeLoader() {
    var loader = document.getElementById('loader-overlay');

    loader.classList.remove('active');
  }

  // 0: Lar, 1: beth
  function initStorage(charID) {
    var answer = getAnswer();

    localStorage.setItem(prefix + 'charID', charID);
    localStorage.setItem(prefix + 'hearts', (charID ? 5 : 7));
    localStorage.setItem(prefix + 'skillOne', 1);
    localStorage.setItem(prefix + 'skillTwo', 1);
    localStorage.setItem(prefix + 'answer', answer);
    localStorage.setItem(prefix + 'correctNeeded', getUniqueCharArray(answer).length);
  }

  function getIntFromStorage(key) {
    return parseInt(localStorage.getItem(prefix + key));
  }

  function buildDashes(answerStr){
    var wordsArr = answerStr.split(' '),
        hangmanMain = document.getElementById('hangman-main'),
        charID = getIntFromStorage('charID'),
        charArr, rowDiv, dashDiv;

    for(var i = 0; i < wordsArr.length; i++) {
      rowDiv = document.createElement("div");
      rowDiv.className = 'dash-row';

      charArr = wordsArr[i].split('');

      for(var j = 0; j < charArr.length; j++) {
        dashDiv = document.createElement("div");
        dashDiv.className = 'dash char-' + alphabets.indexOf(charArr[j]);
        dashDiv.className += (charID ? '' : ' lar');
        rowDiv.appendChild(dashDiv);
      }

      hangmanMain.appendChild(rowDiv);
    }
  }

  function initEndGameModal(hasWon, callback) {
    var modalDiv = document.getElementById('endGameModal'),
        modalTitleDiv = document.getElementById('endGameTitle');

    if (hasWon) {
      modalTitleDiv.innerHTML = 'Congrats!! You WON!!';
      document.getElementById("end-speech-lar").innerHTML = 'Years of gambling prepared me for this moment';
      document.getElementById("end-speech-beth").innerHTML = 'Is this what ESport is? I think I\'m gifted';
      document.getElementById("lar-end-picture").className += ' won';
      document.getElementById("beth-end-picture").className += ' won';
    }
    else {

    }
    callback();
  }

  function guessCorrect(dashDivs) {
    return dashDivs.length > 0;
  }
  function getCharDivsByID(alphabetID) {
    return document.getElementsByClassName('char-' + alphabetID);
  }
  function revealDashs(alphabetDivs, alphabetID){
    for (var i = 0; i < alphabetDivs.length; i++) {
      alphabetDivs[i].className += ' reveal';
      alphabetDivs[i].innerHTML = alphabets[alphabetID].toUpperCase();
    }
  }
  function loseHeart(heartsTot) {
    document.getElementById('heart-' + heartsTot).style.color = 'transparent';
    localStorage.setItem(prefix + 'hearts', (heartsTot - 1));
  }
  function incorrectActions() {
    var heartsTotal = getIntFromStorage('hearts');

    loseHeart(heartsTotal);

    if (heartsTotal === 1) {
      $('#endGameModal').modal('show');
    }
  }

  function updateSpeech(charID, action) {
    var speechArr = (charID ? bethSpeech : larSpeech),
        rand = getRandomInt(0, speechArr[action].length -1);

    document.getElementById("main-speech").innerHTML = speechArr[action][rand];
  }

  function updateAvatar(charID, action){
    var avatarDiv = charID ? document.getElementById('beth-avatar') : document.getElementById('lar-avatar'),
        rand = getRandomInt(0, avatars[action].length -1);
        
    avatarDiv.className = 'avatar' + avatars[action][rand];
  }

  function hideCharContent(charID) {
    var hideChar = charID ? 'lar' : 'beth',
        hideDivs = document.getElementsByClassName(hideChar);

    for (var i = 0; i < hideDivs.length; i++) {
      hideDivs[i].className += ' hidden';
    }  
  }

  function correctActions(dashDivs, alphabetID) {
    var correctNeeded = getIntFromStorage('correctNeeded');

    revealDashs(dashDivs, alphabetID);

    correctNeeded = correctNeeded - 1;

    if (correctNeeded == 0) {
      initEndGameModal(true, function() {
        $('#endGameModal').modal('show');
      });
    }
    else {
      localStorage.setItem(prefix + 'correctNeeded', correctNeeded);
    }
  }

  function hideSection(divID) {
    document.getElementById(divID).className += ' hidden';
  }
  function showSection(divID) {
    var allClasses = document.getElementById(divID).className;

    document.getElementById(divID).classList.remove("hidden");
  }

  function pickChar(e, alphabetID) {
    var dashDivs = getCharDivsByID(alphabetID),
        charID = getIntFromStorage('charID');

    e.setAttribute('disabled', true);

    if (guessCorrect(dashDivs)) {
      updateSpeech(charID, 'correct');
      updateAvatar(charID, 'correct');
      correctActions(dashDivs, alphabetID);
    }

    else {
      updateSpeech(charID, 'incorrect');
      updateAvatar(charID, 'incorrect');
      incorrectActions();
    }
  }

  function switchSections() {

    showSection('gameSection');

    hideSection('header-intro');

    hideSection('footer');

    hideSection('landingSection');

    showSection('home-link');
  }

  function initGame(charID) {

    alphabets = getAlphabetArr();

    if (!ensureStorage() || !ensureCharID(charID)) {
      console.log('something went wrong on game start!');
      return false;
    }

    initStorage(charID);

    hideCharContent(charID ? 1 : 0);

    buildDashes(localStorage.getItem(prefix + 'answer'));

    updateSpeech(charID, 'start');

    switchSections();

    if (charID == 1) {
      setTimeout(function() {
        $('#tips-alert').addClass('show');  
      }, 1500);
    }
    console.log('localstorage: ', localStorage);
  }

  function playAgain() {
    window.location.href = "index.html";
  }

  function initBkgMusic() {
    bkgMusic = new Audio('assets/music/13-map-1-world.mp3');
    bkgMusic.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);

    stopMusic();
  }

  function playMusic() {
    hideSection("btn-play-music");
    showSection("btn-stop-music");
    bkgMusic.play();
  }
  function stopMusic() {
    hideSection("btn-stop-music");
    showSection("btn-play-music");
    bkgMusic.pause();
  }

  return {
    initGame: initGame,
    pickChar: pickChar,
    playAgain: playAgain,
    initBkgMusic: initBkgMusic,
    playMusic: playMusic,
    stopMusic: stopMusic
  }

})();

$(function() {
  YTK.hangman.initBkgMusic();
});


