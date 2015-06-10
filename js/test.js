$(function () {
	function sortByHealth (a, b) {
		return a.health - b.health;
		// we can to sort it not only by health but by dps/heals to sort by usefulness
	}

	function Unit() {
		this.health = 80 + Math.round(Math.random()*40);
		this.dps = 5 + Math.round(Math.random()*15);
	}
	
	function Group() {
		var unitsNumber = 10 + Math.round(Math.random()*10);
		this.units = [];
		for (var i = 0; i < unitsNumber; i++) {
			this.units[i] = new Unit();
		}
		
		this.units.sort(sortByHealth);
		console.log(this.units);
	}
	
	new Group();
})