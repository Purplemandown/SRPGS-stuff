// Instructions:
// Set the generic effective multiplier back to x1 in database.
// Set the default effective multiplier you want in the variable below. (for weapons that don't have a specific one set)
// { effectiveMultiplier: 1.5 } or whatever in the weapon you want to have a custom effective multi.

var defaultEffMulti = 2;

(function(){
	var calcAttackPowerAlias = DamageCalculator.calculateAttackPower;
	DamageCalculator.calculateAttackPower = function(active, passive, weapon, isCritical, totalStatus, trueHitValue){
		var baseAttackPower = calcAttackPowerAlias.call(this, active, passive, weapon, isCritical, totalStatus, trueHitValue);
		
		var multi = 1;
		
		if(this.isEffective(active, passive, weapon, isCritical, trueHitValue)){
			multi = defaultEffMulti;
			
			if(weapon != null && weapon.custom != null && weapon.custom.effectiveMultiplier != null){
				multi = weapon.custom.effectiveMultiplier;
			}
		}
		
		return Math.floor(baseAttackPower * multi);
	};
})();