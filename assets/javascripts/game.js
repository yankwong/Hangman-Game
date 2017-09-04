var YTK = YTK || {};

YTK.hangman = (function() {

  var prefix = 'YTK_',
      wordsArray = [
      "rhaegal",
      "covfefe",
      "evangelion",
      "brendan eich",
      "trinity force",
      "mikasa ackerman",
      ];

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
    localStorage.setItem(prefix + 'tries', 5);
    localStorage.setItem(prefix + 'skillOne', 1);
    localStorage.setItem(prefix + 'skillTwo', 1);
    localStorage.setItem(prefix + 'answer', answer);
    localStorage.setItem(prefix + 'unique', JSON.stringify(getUniqueCharArray(answer)));
  }

  function initGame(charID) {

    if (!ensureStorage() || !ensureCharID(charID)) {
      console.log('something went wrong on game start!');
      return false;
    }

    initStorage(charID);

    console.log('localstorage: ', localStorage);
  }


  return {
    initGame: initGame
  }
})();

