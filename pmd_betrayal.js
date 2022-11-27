/** 
* THIS SCRIPT REQUIRES GOINZA'S NEUTRAL FACTION PLUGIN TO WORK.
*
* Instructions:
* When a leader unit of a given group ID is killed, all of their followers will go neutral.  I wrote this with the idea of a falconer
* whose birds would attack friend or foe if not controlled, but I could imagine an enemy necromancer or a particularly cruel 
* commander or whatever as well.
*
* Set custom parameters on your units that you want to use this system as follows:
* {controllerGroup: 1, controllerLeader: true}
* controllerGroup is the group you want the unit to be a part of.  When the leader of group X is killed, all units in group X go neutral, but
* no others.
* controllerLeader indicates the leader of the group, which must be killed to make the group feral.  As currently written, when one leader
* is killed, all non-leaders go feral, so if you have more than one leader, the other leaders won't turn, but they also won't keep the 
* minions from turning.
**/

function ExecuteConversion(unit){
	if((unit.getHp() <= 0 || unit.getAliveState() == AliveType.DEATH) && (unit.getUnitType() == UnitType.ENEMY || unit.getUnitType() == UnitType.ALLY)){
		if(unit.custom != null && unit.custom.controllerLeader != null && unit.custom.controllerGroup != null && unit.custom.controllerLeader){
			var controllerGroup = unit.custom.controllerGroup;
			var unitList;
			
			if(unit.getUnitType() == UnitType.ENEMY){
				//load enemy units
				unitList = EnemyList.getAliveList();
				
			} else {
				// load allied units
				unitList = AllyList.getAliveList();
				
			}
			
			for(i = 0; i < unitList.getCount(); i++){
				var unit = unitList.getData(i);
				
				if(unit != null && unit.custom != null && unit.custom.controllerGroup != null && (unit.custom.controllerLeader == null || (unit.custom.controllerLeader != null && !unit.custom.controllerLeader)) && unit.custom.controllerGroup == controllerGroup){
					// the unit is in this group and is not a leader.  Trigger betrayal.
					NeutralControl.changeNeutralType(unit);
				}
			}
			
		}
	}
};

var DoEndAction = PreAttack._doEndAction;
PreAttack._doEndAction = function(){
	var passive = this.getPassiveUnit();
	var active = this.getActiveUnit();
	
	ExecuteConversion(active);
	ExecuteConversion(passive);	
	
	DoEndAction.call(this);
};