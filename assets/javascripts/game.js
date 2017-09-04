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
          "Noice~"
        ],
        "incorrect": [
          "I literally can't even",
          "Could you flipping not?",
          "Nope",
          "Weeeak"
        ],
        "win" : [
          "Reminds me of my spelling bee years!"
        ],
        "lose" : [
          "This ain't over yet, not by a long shot!"
        ]
      },
      larSpeech = {
        "start": [
          "$ is power my friend.",
          "Can always use more $",
          "$ is no jQuery here"
        ],
        "correct": [
          "Power of the VIP",
          "Good right? My idea!",
          "My IQ is one of the highest",
          "Now we talking~"
        ],
        "incorrect": [
          "That's low",
          "Unfair! Calling my lawyer",
          "Worst deal EVER",
          "Impossibru!"
        ],
        "win" : [
          "Reminds me of my spelling bee years!"
        ],
        "lose" : [
          "This ain't over yet, not by a long shot!"
        ]
      },
      alphabets;

  function getAlphabetArr() {
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return str.toLowerCase().split('');
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
    localStorage.setItem(prefix + 'hearts', 5);
    localStorage.setItem(prefix + 'skillOne', 1);
    localStorage.setItem(prefix + 'skillTwo', 1);
    localStorage.setItem(prefix + 'answer', answer);
    localStorage.setItem(prefix + 'unique', JSON.stringify(getUniqueCharArray(answer)));
  }

  function buildDashes(answerStr){
    var wordsArr = answerStr.split(' '),
        hangmanMain = document.getElementById('hangman-main'),
        charID = parseInt(localStorage.getItem(prefix + 'charID')),
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
    var heartsTotal = parseInt(localStorage.getItem(prefix + 'hearts'));

    loseHeart(heartsTotal);

    if (heartsTotal === 1) {
      $('#endGameModal').modal('show')
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

  function pickChar(e, alphabetID) {
    var dashDivs = getCharDivsByID(alphabetID),
        charID = parseInt(localStorage.getItem(prefix + 'charID'));

    e.setAttribute('disabled', true);

    if (guessCorrect(dashDivs)) {
      updateSpeech(charID, 'correct');
      updateAvatar(charID, 'correct');
      revealDashs(dashDivs, alphabetID);
    }

    else {
      updateSpeech(charID, 'incorrect');
      updateAvatar(charID, 'incorrect');
      incorrectActions();
    }
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

    console.log('localstorage: ', localStorage);
  }

  return {
    initGame: initGame,
    pickChar: pickChar
  }

})();

jQuery(window).on('load', function() {
  YTK.hangman.initGame(0);
})


