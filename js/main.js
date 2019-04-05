var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',.!? ";
var defaultSize = 100;
var input = "";

class Individual {
	constructor(gene) {
		this.gene = gene;
		this.fitness = 0;
	}
}

class Population {
	constructor(size) {
		this.size = size;
		this.generation = 0;

		this.generatePopulation = size => {
			var population = [];
			for (let i = 0; i < size; i++) {
				var gene = "";
				for (let j = 0; j < input.length; j++) gene += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
				population.push(new Individual(gene));
			}
			return population;
		}
		this.people = this.generatePopulation(this.size);

		this.chooseParent = () => {
			var possibleParents = [];
			this.people.forEach(individual => {
				for (let i = 0; i < individual.fitness; i++) possibleParents.push(individual.gene);
			});
			if (possibleParents.length < this.size) {
				for (let i = possibleParents.length; i < this.size; i++) possibleParents.push(this.people[i].gene);
			}
			return possibleParents[Math.floor(Math.random() * possibleParents.length)];
		}

		this.crossover = () => {
			var newPopulation = [];
			for (let i = 0; i < this.size; i++) {
				var parent1 = this.chooseParent();
				var parent2 = this.chooseParent();
				newPopulation.push(new Individual(parent1.substr(0, input.length / 2).concat(parent2.substr(input.length / 2, input.length / 2 + 1))));
			}
			newPopulation.forEach(newIndividual => this.people.push(newIndividual));
		}

		this.mutation = () => {
			if (Math.floor(Math.random() * 10 + 1) < 5) {
				this.people.forEach(individual => {
					individual.gene = individual.gene.replace(individual.gene.charAt(Math.floor(Math.random() * individual.gene.length)), possibleChars.charAt(Math.floor(Math.random() * possibleChars.length)));
				});
			}
		}

		this.calculFitness = () => {
			this.people.forEach(individual => {
				individual.fitness = 0;
				for (let i = 0; i < individual.gene.length; i++)
					if (individual.gene.charAt(i) === input.charAt(i)) individual.fitness++;
			});
		}

		this.sort = () => {
			this.people.sort((a, b) => {
				if (a.fitness < b.fitness) return 1;
				if (a.fitness > b.fitness) return -1;
				return 0;
			});
		}

		this.select = () => this.people.splice(this.people.length / 2, this.people.length / 2);

		this.display = () => {
			var progress = "";
			for (let i = 0; i < 20; i++) {
				if (i < Math.round((this.people[0].fitness * 20) / input.length)) progress += "|";
				else progress += "·";
			}
			document.getElementById("text").innerHTML = progress + "<br><br>Generation : " + this.generation + "<br>Population : " + this.size;

			this.people.forEach((individual, i) => {
				if (i < 5) {
					document.getElementById("gene" + i).innerHTML = individual.gene;
					document.getElementById("fitness" + i).innerHTML = individual.fitness;
				}
			});
		}

		this.evolve = () => {
			this.generation++;
			this.crossover();
			this.mutation();
			this.calculFitness();
			this.sort();
			this.select();

			this.display();
		}
	}
}

var isValid = input => {
	var buffer = 0;
	[...input].forEach(inputChar => [...possibleChars].forEach(possibleChar => buffer = inputChar === possibleChar ? buffer += 1 : buffer));
	return buffer === input.length;
}

var start = () => {
	input = document.getElementById('input').value;
	document.getElementById("input").style.background = "#fff";
	document.getElementById("table").style.display = 'flex';
	if (input.length > 0 && isValid(input)) {
		population = new Population(defaultSize);
		var step = () => {
			population.evolve();
			if (!(population.people[0].gene === input)) requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	} else document.getElementById("input").style.background = "#f00";
}