// TODO: shinny (color-changing) badges
// start game animation
// FB share
// README

var YTK = YTK || {};

YTK.hangman = (function() {

  var prefix = 'YTK_',
      wordObj = {
        "words"  : [
            "iddqd",
            "moana",
            "thanos",
            "rhaegal",
            "saitama",
            "covfefe",
            "yosemite",
            "zzyzx road",
            "evangelion",
            "bruce wayne",
            "apollo creed",
            "brendan eich",
            "trinity force",
            "gordon freeman",
            "mikasa ackerman",
        ],
        "hints" : [
            "God mode in Doom",
            "Disney movie",
            "Marvel super villian",
            "Name of a dragon",
            "Anime, OP bald guy",
            "Trump's vocab",
            "US National park",
            "Weird road name",
            "Top anime from the 90s",
            "Batman",
            "Rocky Balboa's rival",
            "Inventor of JS",
            "AD item from League",
            "The guy from Half Life",
            "Titans slayer from an Anime"
        ]
      },
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
          "Unfair! Imma call the cops",
          "Worst deal EVER",
          "Impossibru!"
        ],
        "skill": [
          "Greed is very good",
          "YOLO~"
        ]
      },
      bethSpeech = {
        "start": [
          "Sweet, cat paws!",
          "These paws <3",
          "Ohh Meow-nificen"
        ],
        "correct": [
          "Ha! I'm too good",
          "LOLz 1st grade level",
          "Purrrfection~",
          "Am I right or am I right?"
        ],
        "incorrect": [
          "I literally can't even",
          "Could you flipping not?",
          "CATastrophic~~",
          "Weeeak"
        ],
        "skill": [
          "My super power saved the day",
          "Witness me~~~!!"
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
  function isLar(charID) {
    return charID == 0;
  }
  function ensureCharID(id) {
    return id == 0 || id == 1;
  }
  
  // from StackOverflow. usage: getURLParam('q', 'hxxp://example.com/?q=abc')
  function getURLParam( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
  }
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function getAnswer(){
    return wordObj["words"][getRandomInt(0, wordObj["words"].length-1)];
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

  function initStorage(charID) {
    var answer = getAnswer();

    localStorage.setItem(prefix + 'charID', charID);
    localStorage.setItem(prefix + 'hearts', (isLar(charID) ? 7 : 5));
    localStorage.setItem(prefix + 'skill0', 1);
    localStorage.setItem(prefix + 'skill1', 1);
    localStorage.setItem(prefix + 'answer', answer);
    localStorage.setItem(prefix + 'correctNeeded', getUniqueCharArray(answer).length);

    initStatStorage();
  }

  function initStatStorage() {
    if (localStorage.getItem(prefix + 'gameWon') === null) {
      localStorage.setItem(prefix + 'gameWon', 0);
    }
    if (localStorage.getItem(prefix + 'gameTotal') === null) {
      localStorage.setItem(prefix + 'gameTotal', 0);
    }
    if (localStorage.getItem(prefix + 'larWon') === null) {
      localStorage.setItem(prefix + 'larWon', 0);
    }
    if (localStorage.getItem(prefix + 'bethWon') === null) {
      localStorage.setItem(prefix + 'bethWon', 0);
    }
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
        modalTitleDiv = document.getElementById('endGameTitle'),
        charID = getIntFromStorage('charID');

    $('#endGameModal').on('hidden.bs.modal', function() {
      goHome();
    });

    if (hasWon) {
      modalTitleDiv.innerHTML = 'Congrats!! You WON!!';
      document.getElementById("end-speech-lar").innerHTML = 'Years of gambling prepared me for this moment';
      document.getElementById("end-speech-beth").innerHTML = 'Is this what ESport is? I think I\'m gifted';
      document.getElementById("lar-end-picture").className += ' won';
      document.getElementById("beth-end-picture").className += ' won';

      localStorage.setItem(prefix + 'gameWon', getIntFromStorage('gameWon') + 1);
      if (isLar(charID)) {
        localStorage.setItem(prefix + 'larWon', getIntFromStorage('larWon') + 1);
      }
      else {
        localStorage.setItem(prefix + 'bethWon', getIntFromStorage('bethWon') + 1);
      }
    }
    
    callback();
  }

  function setBadge(element, winTotal) {
    if (winTotal > 10) {
      element.classList.remove('five-win');
      element.classList.remove('three-win');
      element.classList.remove('hidden');
      element.innerHTML = '10+WIN';
      element.className += ' ten-win';
    }
    else if (winTotal > 5) {
      element.classList.remove('three-win');
      element.classList.remove('hidden');
      element.innerHTML = '5+WIN'; 
      element.className += ' five-win';
    }
    else if (winTotal > 3) {
      element.classList.remove('hidden');
      element.innerHTML = '3+WIN'; 
      element.className += ' three-win';
    }
  }

  function putWinBadge() {
    var larWon = getIntFromStorage('larWon'),
        bethWon = getIntFromStorage('bethWon'),
        larBadge = document.getElementById('lar-win-badge'),
        bethBadge = document.getElementById('beth-win-badge');

    setBadge(larBadge, larWon);
    setBadge(bethBadge, bethWon);
  }

  function putMVP() {
    var larWon = getIntFromStorage('larWon'),
        bethWon = getIntFromStorage('bethWon');

    if (larWon > 0 && larWon > bethWon) {
      document.getElementById('lar-mvp').classList.remove("hidden");
    }
    else if (bethWon > 0 && bethWon > larWon) {
      document.getElementById('beth-mvp').classList.remove("hidden");
    }
    else if (bethWon > 0 && larWon > 0 && bethWon == larWon) {
      // draw game
    }
  }

  function putBadges() {
    putWinBadge();
    putMVP();
  }

  function guessCorrect(dashDivs) {
    return dashDivs.length > 0;
  }
  function getCharDivsByID(alphabetID) {
    return document.getElementsByClassName('char-' + alphabetID);
  }

  function animateDashs(alphabetDiv, callback) {
    var $alphaDiv = $(alphabetDiv);

    $alphaDiv.addClass('animate fa-spin');
    $alphaDiv.animate({
      opacity: 0.25
    }, 300, function() {
      callback();
    });
  }

  function revealDashs(alphabetDivs, alphabetID){
    var $alphaDivs = $(alphabetDivs);

      animateDashs($alphaDivs, function() {
        $alphaDivs.removeClass('fa-spin animate');
        $alphaDivs.addClass('reveal');
        $alphaDivs.html(alphabets[alphabetID].toUpperCase());
        $alphaDivs.css('opacity', 1);
      });
  }

  function loseHeart(heartsTot) {
    document.getElementById('heart-' + heartsTot).style.color = 'transparent';
    localStorage.setItem(prefix + 'hearts', (heartsTot - 1));
  }
  function incorrectActions() {
    var heartsTotal = getIntFromStorage('hearts');

    loseHeart(heartsTotal);

    if (heartsTotal === 1) {
      initEndGameModal(false, function() {
        $('#endGameModal').modal('show');  
      });
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
      wonGame();
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

  function getOneCorrectAlphabet() {
    var $unknownAlphabet = $('.dash').not('.reveal').first(),
        classArr = $unknownAlphabet.attr('class').split(' '),
        alphaID = parseInt(classArr[1].replace('char-', '')),
        btnClass = '.btn-' + alphabets[alphaID];

    $(btnClass).attr('disabled', true);

    correctActions(getCharDivsByID(alphaID), alphaID);
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

  function isSkillAvailable(skillID) {
    var skillCount = getIntFromStorage('skill' + skillID);

    return skillCount === 1;
  }

  function wonGame() {
    initEndGameModal(true, function() {
      $('#endGameModal').modal('show');
    });
  }

  function hasSuperSkill(charID) {
    var charWonTotal = 0;

    if (isLar(charID)) {
      charWonTotal = getIntFromStorage('larWon');
    }
    else {
      charWonTotal = getIntFromStorage('bethWon'); 
    }

    return charWonTotal > 4;
  }

  function executeSkill(charID, skillID) {

    localStorage.setItem((prefix + 'skill'+skillID), 0)

    if (isLar(charID)) {
      if (skillID == 0) {
        if (hasSuperSkill(charID)) {
          if (getRandomInt(0, 9) < 3) {
            wonGame();
          }
        }
        else {
          if (getRandomInt(0, 3) === 0) {
            wonGame();
          }
        }
      }
      else {
        if (getRandomInt(0, 1) === 0) {
          updateSpeech(charID, 'skill');
          updateAvatar(charID, 'correct');

          getOneCorrectAlphabet();

          setTimeout(function() {
            getOneCorrectAlphabet()
          }, 100);
        }
        else {
          updateSpeech(charID, 'incorrect');
          updateAvatar(charID, 'incorrect');
          for (var i = 0; i < 3; i++) {
            incorrectActions();
          }
        }
      }
    }
    else {
      updateSpeech(charID, 'skill');
      updateAvatar(charID, 'correct');

      if (skillID == 0) {
        getOneCorrectAlphabet();
      }
      else {
        var alphaArr;

        if (hasSuperSkill(charID)) {
          alphaArr = getWrongAlphabets(3);
        }
        else {
          alphaArr = getWrongAlphabets(1);
        }
        
        for (var i = 0; i < alphaArr.length; i++) {
          $('.btn-'+alphaArr[i], '.keyboard').attr("disabled", true);  
        }
      }
    }
  }

  function getWrongAlphabets(total) {
    var answerArr = localStorage.getItem(prefix + 'answer').split(''),
        alphaArr = [];

    for (var i = 0; i < 26; i++) {

      var $btnDiv = $('.btn-'+alphabets[i], '.keyboard');

      if ($.inArray(alphabets[i], answerArr) === -1 && 
          $.inArray(alphabets[i], alphaArr) === -1 &&
          !$btnDiv.prop("disabled")) {

        alphaArr.push(alphabets[i]);

        if (alphaArr.length == total) {

          return alphaArr;
        }
      }
    }

    return alphaArr;
  }

  function usePassive(charID) {
    var answer, index, hintTxt;

    if (isLar(charID)) {
      return;
    }

    answer  = localStorage.getItem(prefix + 'answer');
    index   = wordObj["words"].indexOf(answer);
    hintTxt = wordObj["hints"][index];

    document.getElementById('tips-text').innerHTML = hintTxt;

    setTimeout(function() {
      $('#tips-alert').addClass('show');  
    }, 800);    
  }

  function useSkill(element, skillID) {
    var charID = getIntFromStorage('charID');

    element.setAttribute('disabled', true);

    if (isSkillAvailable(skillID)) {
       executeSkill(charID, skillID); 
    }
  }

  function initGame(charID) {

    alphabets = getAlphabetArr();

    if (!ensureStorage() || !ensureCharID(charID)) {
      console.log('something went wrong on game start!');
      return false;
    }

    initStorage(charID);

    localStorage.setItem(prefix + 'gameTotal', getIntFromStorage('gameTotal') + 1);

    hideCharContent(charID ? 1 : 0);

    buildDashes(localStorage.getItem(prefix + 'answer'));

    updateSpeech(charID, 'start');

    switchSections();

    usePassive(charID); //beth's passive

    playMusic();
  }


  function goHome(charID) {
    
    if (typeof(charID) !== "undefined" && ensureCharID(charID)) {
      window.location.href = "index.html?cid=" + charID;
    }
    else {
      window.location.href = "index.html";
    }
  }

  function initSuperSkills() {

    if (hasSuperSkill(0)) {
      document.getElementById('lar-skill-up').classList.remove('hidden');
      document.getElementById('lar-super-skill').innerHTML = '30% chance to instant win';
      document.getElementById('lar-super-skill-info').innerHTML = '30% chance to instant win';
    }

    if (hasSuperSkill(1)) {
      document.getElementById('beth-skill-up').classList.remove('hidden');
      document.getElementById('beth-super-skill').innerHTML = 'Remove 3 unused alphabet';
      document.getElementById('beth-super-skill-info').innerHTML = 'Remove 3 unused alphabet'; 
    }
  }

  function initBkgMusic() {
    bkgMusic = new Audio('assets/music/13-map-1-world.mp3');
    bkgMusic.volume = 0.1;
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

  function setWonTotal() {
    var wonTotal = getIntFromStorage('gameWon') || 0;

    document.getElementById('won-total').innerHTML = wonTotal;
  }

  function setGameTotal() {
    var gamesTotal = getIntFromStorage('gameTotal') || 0;

    document.getElementById('games-total').innerHTML = gamesTotal; 
  }

  function clearStats() {
    localStorage.setItem(prefix + 'gameWon', 0);
    localStorage.setItem(prefix + 'gameTotal', 0);
    localStorage.setItem(prefix + 'larWon', 0);
    localStorage.setItem(prefix + 'bethWon', 0);
    goHome();
  }

  function initPage() {
    var charID = getURLParam('cid', window.location.href);

    initBkgMusic();
    initSuperSkills();

    if (charID != null && ensureCharID(charID)) {
      initGame(parseInt(charID));
    }
    else {
      setWonTotal();
      setGameTotal();  
      putBadges();
    }
  }

  function getChar() {
    return getIntFromStorage('charID');
  }

  return {
    initPage: initPage,
    initGame: initGame,
    pickChar: pickChar,
    goHome: goHome,
    playMusic: playMusic,
    stopMusic: stopMusic,
    useSkill: useSkill,
    clearStats: clearStats
  }

})();

$(function() {
  YTK.hangman.initPage();
});