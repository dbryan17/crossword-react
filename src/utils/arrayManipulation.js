function shuffle(array) {
  let i = array.length;
  while (i != 0) {
    let randIdx = Math.floor(Math.random() * i);
    i--;
    [array[i], array[randIdx]] = [array[randIdx], array[i]];
  }
}

export { shuffle };
