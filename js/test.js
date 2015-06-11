$(function () {
	function sortByHealth (a, b) {
		return a.health - b.health;
		// we can to sort it not only by health but by dps/heals
	}
	
	function sortByEffectiveness (a, b) {
		return b.maxHealth/a.dps - a.maxHealth/b.dps;
	}

	function Unit() {
		this.maxHealth = 80 + Math.round(Math.random()*40);
		this.health = this.maxHealth;
		this.dps = 5 + Math.round(Math.random()*15);
	}
	
	function Group() {
		this.dps = 0;
		this.units = [];
		
		this.createUnits();
		console.log(this.units);
		
		this.calculateGroupDps();
		console.log(this.dps);
	}
	
	Group.prototype = {
		createUnits : function() {
			var unitsNumber = 10 + Math.round(Math.random()*10);
			for (var i = 0; i < unitsNumber; i++) {
				this.units[i] = new Unit();
			}
			this.units.sort(sortByEffectiveness);
		},
	
		calculateGroupDps : function() {
			this.dps = 0
			for (var i = 0; i < this.units.length; i++) {
				this.dps += this.units[i].dps;
			}
		},
		
		getDamage : function (damage) {
			if (damage == 0) {return}
			
			var last = this.units.length - 1;
			
			if (last >= 0) {
				var health = this.units[last].health;
				health -= damage;
				if (health <= 0) {
					this.units.pop();
					this.calculateGroupDps();
					console.log('unit destroyed')
					console.log(this.dps);
					this.getDamage(Math.abs(health));
				}
			} else {
				console.log('group destroyed')
			}
		}
		
		
	}
	
	
	var group1 = new Group();
	group1.getDamage(5000)
	
})