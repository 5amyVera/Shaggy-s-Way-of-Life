class Result {
	constructor (string, fitness) {
		this.string = string;
		this.fitness = fitness;
	}
}

var firstGeneration = (amount, length, possible) => {
	var generation = [];
	for (let i = 0; i < amount; i++) {
		var result = new Result("", 0);
		for (let j = 0; j < length; j++) {
    		result.string += possible.charAt(Math.floor(Math.random() * possible.length));
  		}
  		generation.push(result);
	}
	return generation;
}

var fitness = (input, generation) => {
	generation.forEach(result => {
		result.fitness = 0;
		for (let i = 0; i < result.string.length; i++) {
			if (result.string.charAt(i) === input.charAt(i)) {
				result.fitness++;
			}
		}
	});
}

var sortGeneration = generation => {
	var totalFitness = 0;
	generation.forEach(result => {
		totalFitness += result.fitness;
	})
	generation.sort((a,b) => {
		if (a.fitness < b.fitness) {
			return 1;
		}
		if (a.fitness > b.fitness) {
			return -1;
		}
		return 0;
	});
}

var parent = (generation, length) => {
	var possibleParents = [];
	generation.forEach( result => {
		for (let i = 0; i < result.fitness; i++) {
			possibleParents.push(result.string);
		}
	});
	if (possibleParents.length < generation.length) {
		for (let i = possibleParents.length; i < generation.length; i++) {
			possibleParents.push(generation[i].string);
		}
	}
	return possibleParents[Math.floor(Math.random()*possibleParents.length)];
}

var selection = generation => {
	generation.splice(generation.length/2, generation.length/2);
}

var crossover = (generation, length) => {
	var newGeneration = [];
	for (let i = 0; i < generation.length; i++) {
		var parent1 = parent(generation, length);
		var parent2 = parent(generation, length);
		newGeneration.push(new Result(parent1.substr(0, length/2).concat(parent2.substr(length/2, length/2 + 1)), 0));
	}
	newGeneration.forEach(result => { generation.push(result); });
}

var mutation = (generation, possible) => {
	var randomNum = Math.floor(Math.random()*10 + 1);
	if (randomNum < 3) {
		var randomChar = possible.charAt(Math.floor(Math.random() * possible.length));
		generation.forEach(result => {
			var random = Math.floor(Math.random()*result.string.length);
			result.string = result.string.replace(result.string.charAt(random), randomChar);
		});
	}
}

var display = (input, generation) => {
	var progress = "· ";
	for (let i = 0; i < 20; i++) {
		if (i < Math.round((generation[0].fitness*20)/input.length)) {
			progress += "█";
		}
		else {
			progress += "&nbsp";
		}
	}
	progress += " ·";
	var DOMdisplay = generation[0].string + "<br><br>" + progress + " " + Math.round((generation[0].fitness*100)/input.length) + "%";
	document.getElementById("text").innerHTML = DOMdisplay;
}

var runGeneration = frameFunc => {
 	var lastTime = null;
 	var frame = time => {
	   	var stop = false;
	   	if (lastTime != null) {
	   		var timeStep = Math.min(time - lastTime, 100) / 1000;
	   		stop = frameFunc(timeStep) === false;
	   	}
	   	lastTime = time;
	   	if (!stop) {
	   		requestAnimationFrame(frame);
	   	}
	}
	requestAnimationFrame(frame);
}

var run = (input, generation, possible, check) => {
	runGeneration ( step => {
		fitness(input, generation);
		sortGeneration(generation);
		selection(generation);
		crossover(generation, input.length);
		mutation(generation, possible);
		fitness(input, generation);
		display(input, generation);
		if(check) {
			check(input === generation[0].string);
		}
		return false;
	});
}

var main = (input, possible) => {
	var generation = firstGeneration(1000, input.length, possible);
	var start = () => {
		run(input, generation, possible, result => {
			if (result === false) {
				start();
			}
		})
	}
	start();
}

var checkInput = (input, possible) => {
	var buffer = 0;
	for (var i = 0; i < input.length; i++) {
		for (let j = 0; j < possible.length; j++) {
			if (input.charAt(i) === possible.charAt(j)) {
				buffer++;
			}
		}
	}
	if (buffer === input.length) {
		main(input, possible);
	}
	else {
		var DOMdisplay = "Error : Some characters are not recognized";
		document.getElementById("text").innerHTML = DOMdisplay;
	}
}