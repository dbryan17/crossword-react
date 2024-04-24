/* 
take array of words and generate trie from it
*/
const generateTrie = (wordsArr) => {
  let trie = wordsArr.reduce((trie, currWord, idx) => {
    if (!trie[currWord.length]) {
      trie[currWord.length] = {};
    }
    // trie is being accumulated
    let currTrie = trie[currWord.length];
    currWord.split("").forEach((letter, idx) => {
      letter = letter.toLowerCase();
      if (!(letter in currTrie)) {
        currTrie[letter] = {};
      } else {
        // TODO could maybe here incremenent some commonness value
      }
      currTrie = currTrie[letter];
    });
    return trie;
  }, {});
  return trie;
};

/*
take a list of words and adds them to an existing trie
needs test
*/
const addToTrie = (trie, words) => {
  words.forEach((word, idx) => {
    word.split("").forEach((letter, idx) => {
      letter = letter.toLowerCase();
      if (!(letter in trie)) {
        currTrie[letter] = {};
      } else {
        // TODO could maybe here incremenent some commonness value
      }
      currTrie = currTrie[letter];
    });
    trie = currTrie;
  });
  return trie;
};

/*
combine two tries
needs test
should work fine with the numbers but test
*/

const combineTries = (trie1, trie2) => {
  for (let letter in trie2) {
    // add if not in trie 1, if this is top level, will add all the way down
    if (!trie1[letter]) {
      trie1[letter] = trie2[letter];
    } else {
      // if it is in it, we need to check further down
      combineTries(trie1[letter], trie2[letter]);
    }
  }
  return trie1;
};
