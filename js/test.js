$(function () {
    function sortByHealth (a, b) {
        return a.health - b.health;
        // we can to sort it not only by health but by dps/heals
    }
    
    function sortByEffectiveness (a, b) {
        return b.maxHealth/a.dps - a.maxHealth/b.dps;
    }

    function Unit(lvl) {
        var baseHealth = 80;
        var baseDps = 10;
        
        this.maxHealth = baseHealth*lvl + Math.round(Math.random()*baseHealth/2);
        this.health = this.maxHealth;
        this.dps = baseDps*lvl + Math.round(Math.random()*baseDps);
        this.might = this.maxHealth * this.dps;
    }
    
    function Group(size, lvl) {
        this.groupLvl = lvl || 1;
        this.groupSize = Math.round((size || 10)*(0.8+Math.random()*0.4)); //group can have random size from 80% to 120% of init number
        this.dps = 0;
        this.moral = 25 + Math.round(Math.random()*25);
        this.units = [];
        
        this.createUnits(this.groupSize, this.groupLvl);
        this.calculateGroupDps();
        this.might = this.initMight = this.calculateGroupMight();
        console.log(this);
    }
    
    Group.prototype = {
        createUnits : function(unitsNumber) {
            for (var i = 0; i < unitsNumber; i++) {
                this.units[i] = new Unit(this.groupLvl);
            }
            this.units.sort(sortByEffectiveness);
        },
    
        calculateGroupDps : function() {
            this.dps = 0
            for (var i = 0; i < this.units.length; i++) {
                this.dps += this.units[i].dps;
            }
        },
        
        calculateGroupMight : function() {
            var might = 0
            for (var i = 0; i < this.units.length; i++) {
                might += this.units[i].might;
            }
            return might;
        },
        
        getDamage : function (damage) {
            
            var lastIndex = this.units.length - 1;
        
            while (damage > 0 && lastIndex >=0) {
                var lastUnit = this.units[lastIndex];
                lastUnit.health -= damage;
                if (lastUnit.health <= 0) {
                    damage = Math.abs(lastUnit.health);
                    this._unitDead();
                    lastIndex = this.units.length - 1;
                    if (lastIndex < 0) { 
                        return 'destroyed';
                    } 
                } else {
                    return;
                }
            }
        },
        
        _unitDead : function () {
            var deadUnit = this.units.pop();
            this.calculateGroupDps();
            var lostMaral = Math.floor(Math.pow(deadUnit.might,2)/ ((this.might + this.initMight) * 15)); //15 is magic number which allow to get nice numbers
            this.might -= deadUnit.might;            
            this.moral -= lostMaral;
        }
    }
    
    
    var group1 = new Group();
    var group2 = new Group();
    
    function battleFunc (group1, group2) {
        var group1Dps = group1.dps;
        var group2Dps = group2.dps;
        var result1 = group1.getDamage(group2Dps);
        var result2 = group2.getDamage(group1Dps);
        console.log('------------------------')
        console.log(group1Dps)
        console.log(group2Dps)
        console.log(result1)
        console.log(result2)
        if (result1 == 'destroyed' || result2 == 'destroyed') {
            console.log(group1);
            console.log(group2);
            clearInterval(battle);
        }
    } 
    
    
    var battle = setInterval(battleFunc, 200, group1, group2)
})