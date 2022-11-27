
/*--------------------------------------------------------------------------
  
  If a weapon has the customParameter "blockMoveAndAttack" set to "true", a unit that has moved will be unable
  to equip it.
  
  Author:
  SapphireSoft
  http://srpgstudio.com/
  
  Modified by Purplemandown
  
  History:
  2018/08/19 Released
  2022/09/05 Made it actually functional in a game with units that have different move speeds...
  
--------------------------------------------------------------------------*/

(function() {

var alias1 = ItemControl.isWeaponAvailable;
ItemControl.isWeaponAvailable = function(unit, item) {
	var unitMov, weaponMov;
	
	if (!alias1.call(this, unit, item)) {
		return false;
	}
	
	if(item != null && item.custom != null && item.custom.blockMoveAndAttack != null && item.custom.blockMoveAndAttack){
		if(unit.getMostResentMov() > 0){
			return false;
		}
	}
	
	return true;
};

var alias2 = CombinationCollector.Weapon.collectCombination;
CombinationCollector.Weapon.collectCombination = function(misc) {
	this._defMov = ParamBonus.getBonusFromWeapon(misc.unit, ParamType.MOV, null);
	
	misc.simulatorArray = [];
	misc.simulatorArray[0] = misc.simulator;
	
	alias2.call(this, misc);
	
	misc.simulator = misc.simulatorArray[0];
};

var alias3 = CombinationCollector.Weapon._checkSimulator;
CombinationCollector.Weapon._checkSimulator = function(misc) {
	var i, simulator, mov, count;
	
	alias3.call(this, misc);
	
	if (typeof misc.isApproach === 'undefined' || !misc.isApproach) {
		return;
	}
	
	if(misc.item == null || misc.item.custom == null || misc.item.custom.blockMoveAndAttack == null || !misc.item.custom.blockMoveAndAttack){
		root.log("no blocking weapon");
		return;
	}
	
	root.log("blocking weapon");
	
	//mov = misc.item.getParameterBonus().getAssistValue(ParamType.MOV);
	
	count = misc.simulatorArray.length;
	for (i = 0; i < count; i++) {
		if (misc.simulator.getAreaValue() === 0) {
			misc.simulator = misc.simulatorArray[i];
			return;
		}
	}
	
	// simulator of the range of the purpose doesn't exist, so create a new one.
	simulator = root.getCurrentSession().createMapSimulator();
	simulator.startSimulation(misc.unit, 0);
	
	misc.simulatorArray.push(simulator);
	
	misc.simulator = simulator;
};

var alias4 = CombinationBuilder.createApproachCombinationArray;
CombinationBuilder.createApproachCombinationArray = function(misc) {
	misc.isApproach = true;
	return alias4.call(this, misc);
};

var alias5 = CombinationBuilder.createBlockCombinationArray;
CombinationBuilder.createBlockCombinationArray = function(misc) {
	misc.isApproach = true;
	return alias5.call(this, misc);
};

var alias6 = CombinationBuilder.createMoveCombinationArray;
CombinationBuilder.createMoveCombinationArray = function(misc) {
	misc.isApproach = false;
	return alias6.call(this, misc);
};

var alias7 = CombinationBuilder.createWaitCombinationArray;
CombinationBuilder.createWaitCombinationArray = function(misc) {
	misc.isApproach = false;
	return alias7.call(this, misc);
};

})();
