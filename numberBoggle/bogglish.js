var findSums = function(n){
	var n = Number(document.getElementById('gameWidth').value);
	// console.log(document.getElementById('gameWidth').value)
	// var newGame = boggleMe(document.getElementById('gameWidth').value);
	var newGame = boggleMe(n);
	return showGrid(newGame);
}

boggleMe = function(n){
	if (!n){
		var n = 3;
	}

	grid = [];
	for (var i = 0; i < n*n; i++){
		grid[i] = (Math.floor(Math.random() * 10));
	}

	var gameboard = {grid: grid, width: n}
	return gameboard;
}

var findMe = function(gridIndex, gridValue){
	return function(obj){
		return obj["gridIndex"] == gridIndex && obj["gridValue"]==gridValue;
	}
}

showGrid = function(gameboard){
	var grid =gameboard['grid']
	var width = gameboard['width']

	for (var i = 0; i < grid.length; i++){
		if (i%width==0){
			document.write("<br>");
		}
		document.write(grid[i]);
	}
	
	return solveMe(grid, width)
}

solveMe = function(grid, width){
	var targetValue = grid.length;
	var currentWork = [];
	var gridAnswers = [];
	var answerStrings = [];
	var uniqueNumber = 0;

	for (var i = 0; i < grid.length; i++){
		var value = grid[i];
		var gridResults = []
		gridResults.push(checkNum(grid, value, targetValue, i, width));
		for (var array of gridResults){
			for (var result of array){
				currentWork.push(result);
			}
		}
	}

	for (var work = 0; work < currentWork.length; work++){
		uniqueNumber = 0;
		if (gridAnswers.length == 0){
			gridAnswers.push(currentWork[0]);
		}
		for (var answer = 0; answer < gridAnswers.length; answer++){
			for (var workElement = 0; workElement<currentWork[work].length; workElement++){
				if(currentWork[work].length!=gridAnswers[answer].length){
					uniqueNumber++;
					if (uniqueNumber == gridAnswers.length){
						gridAnswers.push(currentWork[work]);
						answer=gridAnswers.length;
						workElement=currentWork[work].length
						uniqueNumber=0;
					} else if (uniqueNumber != gridAnswers.length){
						workElement = currentWork[work].length;
					}
					continue;					
				}
				if(gridAnswers[answer].find(findMe(currentWork[work][workElement]["gridIndex"], currentWork[work][workElement]["gridValue"]))){
				} else {
					uniqueNumber++;
					if (uniqueNumber == gridAnswers.length){
						gridAnswers.push(currentWork[work]);
						answer=gridAnswers.length;
						workElement=currentWork[work].length
						uniqueNumber=0;
					} else if (uniqueNumber != gridAnswers.length){
						workElement = currentWork[work].length;
					}
					continue;
				}
			}
		}
	}

	for (var answer of gridAnswers){
		var catAnswer = ""
		for(var element of answer){
			catAnswer = catAnswer.concat(element["gridValue"].toString(), " + ")
		}
		catAnswer = catAnswer.slice(0, catAnswer.length-2);
		catAnswer = catAnswer.concat("= ", targetValue.toString())
		answerStrings.push(catAnswer);
	}

	document.write("<br>")
	for (var i = 0; i < answerStrings.length; i++){
		document.write(answerStrings[i])
		document.write("<br>")
	}

	if (answerStrings.length>1){		
		return answerStrings;
	} else {
		console.log('no answers found')
	}
}

var checkRepeat = function(type, value, index, array1, array2, array3){
	if (type=='element'){
		if(array1.find(findMe(index, value)) == undefined){
			return false;
		} else {
			return true;
		}
	} else if (type=='array'){
		if(array2.length==0){
			return false;
		}
			for (var atAnswer = 0; atAnswer<array2.length; atAnswer++){
			for(var chainPlace = 0; chainPlace<array3.length; chainPlace++){
				if(array2[atAnswer].find(findMe(array3[chainPlace]["gridIndex"], array3[chainPlace]["gridValue"]))==undefined){
					return false;
				}
			}
		}
		return true;
	}
}


checkNum = function(grid, value, target, index, width){

	//constants
	var newIndex = index;
	var sum = value;
	var newValue = value;
	var answers = [];
	var currentChain = [{fromDirection: -1, gridIndex: newIndex, gridValue: value}];
	var tail = currentChain[currentChain.length-1]

	var moveBack = function(){
		if (currentChain.length==1){
			return false;
		}
		tail = currentChain[currentChain.length-1]
		sum-=tail['gridValue'];
		direction=tail['fromDirection'];
		newValue = currentChain[currentChain.length-2]["gridValue"];
		newIndex = currentChain[currentChain.length-2]["gridIndex"];
		currentChain.pop();		
	}

	var moveForward = function(value, index, direction){
		sum+=value;
		newValue = value;
		newIndex = index;		
		currentChain.push({fromDirection: direction, gridIndex: index, gridValue: value})
	}



	var checkDirection = function(index, grid, width, direction){
		var directions = [index-width, index-width+1, index+1, index+width+1, index+width, index+width-1, index-1, index-width-1];
		if (grid[directions[direction]]==undefined){
			return false;
			//left side
		} else if (index%width==0){
			if (direction == 5 || direction == 6 || direction == 7){
				return false;
			}
			//right side
		} else if ((index+1)%width==0){
			if(direction == 1 || direction == 2 || direction == 3){
				return false;
			}
		}

		var goodNumber = {value: grid[directions[direction]], index: directions[direction]}
		return goodNumber;
		

	}

	for (var direction = 0; direction <8; direction++){
		// if (value==5&&index==3){
		// }
		var nextMove = checkDirection(newIndex, grid, width, direction)
		// if (value==5&&index==3){
		// 	for (var link of currentChain){
		// 		// console.log(link);
		// 	}
		// }

		if (nextMove!=false){

		} else if (nextMove==false){
			if (direction==7){
				while(direction==7){
					if(moveBack()==false){
						return answers;
					} else {
					// moveBack();
					}
				}				
			} else {
				continue;
			}
		}

		if (sum+nextMove["value"]>target){
			if (direction==7){
				while(direction==7){
					if(moveBack()==false){
						return answers;
					} else {
					// moveBack();
					}
				}
			}
		} else if (sum+nextMove["value"]==target){
			if (direction == 7){
				if (checkRepeat('element', nextMove["value"], nextMove["index"], currentChain) == false){
					moveForward(nextMove["value"], nextMove["index"], direction)
				}
			} else {
				if (checkRepeat('element', nextMove["value"], nextMove["index"], currentChain) == false){
					moveForward(nextMove["value"], nextMove["index"], direction);
				}
			}		
		} else if (sum+nextMove["value"]<target){
			// console.log('less than target')
			if (checkRepeat('element', nextMove["value"], nextMove["index"], currentChain) == false){
				moveForward(nextMove["value"], nextMove["index"], direction)
				direction=(-1);
			}
		}

		if (sum==target){
			if (currentChain.length>1){
				var pushAnswers = []
				for (var cc = 0; cc<currentChain.length; cc++){
					pushAnswers.push(currentChain[cc])
				}
				if (checkRepeat('array', null, null, null, answers, pushAnswers)==false){
					answers.push(pushAnswers);
				} else {
					pushAnswers=[];
					moveBack();
					for (var cc = 0; cc<currentChain.length; cc++){
						pushAnswers.push(currentChain[cc])
					}
					if (checkRepeat('array', null, null, null, answers, pushAnswers)==false){
					answers.push(pushAnswers);
					}
				}
				moveBack();			
			}	
		}
	}
	return answers;
}

window.onload = function(){
	document.getElementById("goButton").addEventListener("submit", function(event){
		event.preventDefault();
	});
}
