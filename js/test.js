$(function () {
    function sortByHealth (a, b) {
        return a.health - b.health;
        // we can to sort it not only by health but by dps/heals
    }
    
    function sortByEffectiveness (a, b) {
        return b.maxHealth/a.dps - a.maxHealth/b.dps;
    }

    function Unit(lvl) {
        var baseHealth = 100;
        var baseDps = 16;
        var baseMight = 100;
        var baseAbsoluteMight = baseHealth * baseDps;
        
        var healthDeviation = Math.round((Math.random()-0.5)*baseHealth/2);        
        var dpsDeviation = Math.round((Math.random()-0.5)*baseDps);
        
        this.maxHealth = (baseHealth + healthDeviation)*lvl;
        this.health = this.maxHealth;
        this.dps = (baseDps +dpsDeviation)*lvl;
        
        var mightCoefficient = Math.sqrt(this.maxHealth * this.dps / baseAbsoluteMight);        
        this.might = baseMight * mightCoefficient;
        
        
    }
    
    function Group(size, lvl) {
        this.groupLvl = lvl || 1;
        this.groupSize = Math.round((size || 10)*(0.8+Math.random()*0.4)); //group can have random size from 80% to 120% of init number
        this.dps = 0;
        this.bravery = 1.5;
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
            var lastUnit = this.units[lastIndex];
            
            var result = {
                status:'',
                deadUnits:[]
             };
            
            while (damage >= 0 && lastIndex >=0) {
                lastUnit.health -= damage;
                if (lastUnit.health <= 0) {
                    result.deadUnits.push(this._killUnit());//kill last unit and put it into the deadUnits result array
                    lastIndex = this.units.length - 1;
                    if (lastIndex < 0) { 
                        result.status = 'destroyed'
                        return result;
                    } else {
                        damage = Math.abs(lastUnit.health);
                        lastUnit = this.units[lastIndex];
                    }
                } else {
                    result.status = 'damaged'
                    return result;
                }
            }
        },
        
        _killUnit : function (unit) { //if unit not presented kill the last one            
            if ($.type(unit) != 'number') {
                unit = this.units.indexOf(unit);
            }
            var deadUnit = this.units.splice(unit,1)[0];            
            
            this.calculateGroupDps();
            var lostMoral = Math.floor(deadUnit.might * 100 / (this.might + this.initMight) / this.bravery); //100 is magic number which allow to get nice numbers
            this.might -= deadUnit.might;            
            this.moral -= lostMoral;
            console.log('-------------------');            
            //console.log(deadUnit);
            console.log(lostMoral);
            return deadUnit;
        },
        
        reactOnEnemyDeath : function (enemies) {
            var enemiesMight = 0;
            var enemiesNumber = enemies.length;
            
            for (var i = 0; i < enemiesNumber; i++ ) {
                enemiesMight += enemies[i].might;
            }
            
            var gainMoral = Math.floor(enemiesMight / this.initMight * 20); //need to be changed
            this.moral += gainMoral;
        }
    }
    
    
    var group1 = new Group(10,1);
    console.log(group1.might);
    var group2 = new Group(5,2);
    console.log(group2.might);
    
    function battleFunc (group1, group2) {
        var group1Dps = group1.dps;
        var group2Dps = group2.dps;
        var result1 = group1.getDamage(group2Dps);
        var result2 = group2.getDamage(group1Dps);
        
        group1.reactOnEnemyDeath (result2.deadUnits);
        group2.reactOnEnemyDeath (result1.deadUnits);
        
        //console.log('------------------------')
        //console.log(group1.moral);
        //console.log(group2.moral)
        //console.log(group2Dps)
        //console.log(result1)
        //console.log(result2)
        if (result1.status == 'destroyed' || result2.status == 'destroyed') {
            console.log(group1);
            console.log(group2);
            clearInterval(battle);
        }
    } 
    
    
    var battle = setInterval(battleFunc, 200, group1, group2)
})