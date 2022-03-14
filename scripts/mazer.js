Array.prototype.rndSubset = function (random = Math.random, threshold = 0.5) {
  const filtered = this.filter(() => random() > threshold);
  if (filtered.length) return filtered;
  return [this[Math.floor(random() * this.length)]];
};

const connectLastRow = (_maze) => {
  const maze = [..._maze];
  for (const [x, cell] of maze[maze.length - 1].entries()) {
    const next = maze[maze.length - 1][x + 1];
    if (next && next.set != cell.set) {
      cell.right = false;
    }
  }
  return maze;
};

const openBottom = (x, random, maze, currentSet, bottomTrs = 0.5) => {
  const selectedIndexes = maze[x].filter((cell) => cell.set == currentSet);
  if (x < maze.length - 1) {
    selectedIndexes.rndSubset(random, bottomTrs).forEach((cell) => {
      cell.bottom = false;
      if (maze[x + 1] != undefined) {
        maze[x + 1][cell.y].set = currentSet;
      }
    });
  }
};

const completeMaze = (_maze) => {
  const maze = [..._maze];
  for (const [x, row] of maze.entries()) {
    for (let [y, cell] of row.entries()) {
      const leftCell = maze[x][y - 1];
      const rightCell = maze[x][y + 1];
      const topCell = maze[x - 1] ? maze[x - 1][y] : undefined;
      const bottomCell = maze[x + 1] ? maze[x + 1][y] : undefined;
      if (cell.left == true && leftCell) leftCell.right = true;
      if (cell.top == true && topCell) topCell.bottom = true;
      if (cell.bottom == true && bottomCell) bottomCell.top = true;
      if (cell.right == true && rightCell) rightCell.left = true;
      if (y == row.length - 1) cell.right = true;
    }
  }
  return maze;
};

export const makeMaze = (
  size,
  { random, wallTrs, bottomTrs, loopTrs } = {
    random: Math.random,
    wallTrs: 0.5,
    bottomTrs: 0.5,
    loopTrs: 0,
  }
) => {
  // INIT
  const maze = Array.from({ length: size }).map((_, x) =>
    Array.from({ length: size }).map((_, y) => ({
      set: 0,
      x,
      y,
      top: false,
      right: false,
      bottom: true,
      left: false,
    }))
  );
  // MAX INDEX
  let maxSet = 1;
  // ITERATE ROWS
  let currentSet = 1;
  for (let x = 0; x < maze.length; x++) {
    const row = maze[x];
    // put walls between same-sets
    for (let [y, cell] of row.entries()) {
      const rightCell = row[y + 1];
      if (
        cell.set &&
        rightCell &&
        cell.set == rightCell.set &&
        random() > loopTrs
      ) {
        cell.right = true;
      }
    }
    // add empty to new set
    for (let [y, cell] of row.entries()) {
      if (!cell.set) {
        cell.set = currentSet;
        currentSet = ++maxSet;
      }
    }
    for (let y = 0; y < row.length; y++) {
      const cell = maze[x][y];
      const rightCell = maze[x][y + 1];
      // if no next cell, next cell has same set than current, or want to make wall
      if (
        !rightCell ||
        (rightCell.set === cell.set && random() > loopTrs) ||
        random() > wallTrs
      ) {
        // put wall
        cell.right = true;
      } else {
        // merge sets
        const replacingSet = rightCell.set;
        maze[x].forEach((_cell, y) => {
          if (_cell.set === replacingSet) {
            _cell.set = cell.set;
          }
        });
      }
    }
    let lastSet = row[0].set;
    for (let [y, cell] of row.entries()) {
      if (cell.set != lastSet) {
        openBottom(x, random, maze, lastSet, bottomTrs);
        lastSet = cell.set;
      }
    }
    openBottom(x, random, maze, lastSet, bottomTrs);
  }
  return completeMaze(connectLastRow(maze));
};
