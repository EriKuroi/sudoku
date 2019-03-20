//import { it } from "mocha";

module.exports = function solveSudoku(matrix) {
  // your solution

  //let i, j;
  const matrixOrigin = JSON.parse(JSON.stringify(matrix));  
  let matrixCurrent = [...matrix];

  const first = [0, 1, 2];
  const second = [3, 4, 5];
  const third = [6, 7, 8]
  let unsolved = [];

  //console.log(matrixOrigin);


  function createUnsolved(i, j) {
    if (matrixCurrent[i][j] == 0) {
      let obj = {}
      obj.x = i;
      obj.y = j;
      obj.possibles = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      obj.sector = generateSector(i, j);
      unsolved.push(obj)
    }
  }
//console.log(unsolved);
  function findCurrent(x, y) {
    return unsolved.find(el => el.x == x && el.y == y)
  }

  function setColumn(y) {
    let column = []
    for (let i = 0; i < 9; i++) {
      column.push(matrixCurrent[i][y])
    }
    return column
  }

  function generateSector(rowIndex, colIndex) {
    let sector = {};
    const switchSectors = (index, place) => {
      switch (index) {
        case 0:
        case 1:
        case 2:
          sector[place] = first
          break;

        case 3:
        case 4:
        case 5:
          sector[place] = second
          break;

        case 6:
        case 7:
        case 8:
          sector[place] = third
          break;

        default:
          break;
      }
    }
    switchSectors(rowIndex, 'row');
    switchSectors(colIndex, 'col');
    return sector
  }

  function iterateMatrix(func) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        func(i, j);
      }
    };
  }

  function iterateSector(obj, func) {
    for (i = obj.row[0]; i < obj.row[2]; i++) {
      for (j = obj.col[0]; j < obj.col[2]; j++) {
        func();
      }
    }
  }

  function getUniquesFromArrays(array){
    if(array.length){
      return array.reduce((accumulator, element)=>{
      accumulator = accumulator.concat(element.filter(number => !accumulator.includes(number)));
      return accumulator
    })};
  };

  function checkIfSolved (array, x, y){
    if (array.length === 1) {
      //console.log(`Solved ${x} ${y}! answer is ${array[0]}`)
      matrixCurrent[x][y] = array[0];
      return false
    } else return true
  }

  function compareArrays (array) {
    if (!array) {
      return false;
    }
    if (this.length !== array.length) {
      return false;
    }
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] instanceof Array && array[i] instanceof Array) {
        if (!this[i].compare(array[i])) {
          return false;
        }
      }
      else if (this[i] !== array[i]) {
        return false;
      }
    }
    return true;
  }

  function isEffective (params) {
    
  }

  function singles(current) {
    let x = current.x;
    let y = current.y;
    let row = matrixCurrent[x];
    let col = setColumn(y);
    let sectorValues = [];
    let pushValues = () => {
      if (matrix[i][j] != 0) {
        sectorValues.push(matrixCurrent[i][j])
      }
    }
    iterateSector(current.sector, pushValues);    
    current.possibles = current.possibles.filter(number => !row.includes(number) && !col.includes(number) && !sectorValues.includes(number));
    //console.log(`result`)
    //console.log(current.possibles);
    return checkIfSolved(current.possibles, x, y)
    
  }

  function hiddenSingles(current) {
    let x = current.x;
    let y = current.y;
    let rowUnsolved = unsolved.filter(element => element.x === x && element.y != y);
    let rowPossibles = rowUnsolved.map(element => element.possibles);
    let colUnsolved = unsolved.filter(element => element.y === y && element.x != x);
    let colPossibles = colUnsolved.map(element => element.possibles);
    let sectorUnsolved = [];
    let pushUnsolved = () => {
      if (i != x || j != y) {
        let match = unsolved.find(element => element.x === i && element.y === j)
        if (match) {
          sectorUnsolved.push(match)
        }
      }
    }
    iterateSector(current.sector, pushUnsolved);
    let sectorPossibles = sectorUnsolved.map(element => element.possibles);
    //console.log(`rowPos`, rowPossibles );
    //console.log(`colPos`, colPossibles );
    //console.log(`secPos`, sectorPossibles );
    rowHidden = getUniquesFromArrays(rowPossibles);
    colHidden = getUniquesFromArrays(colPossibles);
    sectorHidden = getUniquesFromArrays(sectorPossibles);

    hidden = current.possibles.filter(number => !rowHidden.includes(number) && !colHidden.includes(number) && !sectorHidden.includes(number));
    //console.log(`hidden`, hidden);
    return checkIfSolved(hidden, x, y);
  }


  /* -----------main section-------------- */


  iterateMatrix(createUnsolved);
  let tried = 0;
  let f = 0;

  while (unsolved.length) {
    //console.log(`new iteration!`)
    let unsolvedStart = JSON.stringify(unsolved);
    //console.log (unsolvedStart.length);
    
    tried++;
    //console.log(`iteration ${tried}`);
    unsolved = unsolved.filter(element => singles(element));
    if (unsolved.length) {
     // console.log(`start hiddensingles at i ${tried}`);
      unsolved = unsolved.filter(element => hiddenSingles(element));
      let test = JSON.stringify(unsolved)
      //console.log(test.length);
      }else return matrixCurrent;
    
    if (unsolved.length){
      //console.log(`ended both and not solved at ${tried}`);
      let unsolvedEnd = JSON.stringify(unsolved);
        if(unsolvedStart==unsolvedEnd){
          f++
          if(f>5){
          return console.log (`Nothing changed. Algorythms are insufficient or sudoku has no solvation `);
          }
        }
    } else return matrixCurrent;   

  }
  /*
  let test = {
    x: 0,
    y: 8,
    possibles: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    sector: generateSector(0, 8)
  }
  unsolved = unsolved.filter(element => singles(element));
  unsolved = unsolved.filter(element => hiddenSingles(element));
  unsolved = unsolved.filter(element => singles(element));
  unsolved = unsolved.filter(element => hiddenSingles(element));
  //hiddenSingles(test);
*/
  //console.log(matrixCurrent);
}
/*
solveSudoku([
  [6, 5, 0, 7, 3, 0, 0, 8, 0],
  [0, 0, 0, 4, 8, 0, 5, 3, 0],
  [8, 4, 0, 9, 2, 5, 0, 0, 0],
  [0, 9, 0, 8, 0, 0, 0, 0, 0],
  [5, 3, 0, 2, 0, 9, 6, 0, 0],
  [0, 0, 6, 0, 0, 0, 8, 0, 0],
  [0, 0, 9, 0, 0, 0, 0, 0, 6],
  [0, 0, 7, 0, 0, 0, 0, 5, 0],
  [1, 6, 5, 3, 9, 0, 4, 7, 0]
]);
*/