// Set the default max inventory (to be used if the unit doesn't have a custom param.
var _defaultMaxInventory = 5;

// Set the default length of item scrollbars that don't have unit references (They'll still properly hold all the items, but you'll
// have to scroll if you go beyond this number
var _scrollDefaultMaxInventory = 5;

// Give the unit in question { maxInventory: 9 } (or whatever number you want) to set their inventory size.

//	This script is not compatable with changing a whole host of other methods that I can't be bothered to list off.  I can't alias
// anything for this, so basically if the method is overridden below, it's incompatable.

DataConfig.getMaxUnitItemCount = function(unit){
	return _scrollDefaultMaxInventory;
};

// Actual method to get the unit's individual max size
DataConfig.getMaxUnitItemCountByUnit = function(unit){
	if(unit != null && unit.custom != null && unit.custom.maxInventory != null){
		return unit.custom.maxInventory;
	} else{
		return _defaultMaxInventory;
	}
};

ItemSale._cutSellItem = function(item){
	var i, count;
	var unit = this._parentShopScreen.getStockVisitor();
	
	if (unit !== null) {
		count = DataConfig.getMaxUnitItemCountByUnit(unit);
		for (i = 0; i < count; i++) {
			if (UnitItemControl.getItem(unit, i) === item) {
				UnitItemControl.cutItem(unit, i);
				break;
			}
		}
	}
	else {
		count = StockItemControl.getStockItemCount();
		for (i = 0; i < count; i++) {
			if (StockItemControl.getStockItem(i) === item) {
				StockItemControl.cutStockItem(i);
				break;
			}
		}
	}
};

SellItemWindow.updateItemArea = function(){
	var i, item, count;
	var unit = this.getParentInstance().getStockVisitor();
	
	if (this._unit === unit) {
		this._scrollbar.saveScroll();
	}
	
	this._scrollbar.resetScrollData();
	
	if (unit !== null) {
		count = DataConfig.getMaxUnitItemCountByUnit(unit);
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			if (item !== null) {
				this._scrollbar.objectSet(item);
			}
		}
	}
	else {
		count = StockItemControl.getStockItemCount();
		for (i = 0; i < count; i++) {
			item = StockItemControl.getStockItem(i);
			if (item !== null) {
				this._scrollbar.objectSet(item);
			}
		}
	}
	
	this._scrollbar.objectSetEnd();
	this._scrollbar.resetAvailableData();
	
	// If the unit is not changed, retain the previous scroll position.
	if (this._unit === unit) {
		this._scrollbar.restoreScroll();
	}
	
	this._unit = unit;
};

StockItemTradeScreen._completeScreenMemberData = function(screenParam){
	var count = LayoutControl.getObjectVisibleCount(ItemRenderer.getItemHeight(), 15) - 2;
	
	if (count > DataConfig.getMaxUnitItemCountByUnit(this._unit)) {
		count = DataConfig.getMaxUnitItemCountByUnit(this._unit);
	}
	
	this._unitItemWindow.setItemFormation(count);
	this._unitItemWindow.enableWarningState(true);
	
	count = LayoutControl.getObjectVisibleCount(ItemRenderer.getItemHeight(), 15);
	this._stockItemWindow.setItemFormation(count);
	
	if (this._unitSimpleWindow !== null) {
		this._unitSimpleWindow.setFaceUnitData(this._unit);
	}
	
	this._updateListWindow();
	
	this._processMode(StockItemTradeMode.OPERATION);
};

UnitItemTradeScreen._maxItemCountSrc = 0;
UnitItemTradeScreen._maxItemCountDest = 0;

UnitItemTradeScreen._prepareScreenMemberData = function(screenParam){
	this._unitSrc = screenParam.unit;
	this._unitDest = screenParam.targetUnit;
	this._isSrcScrollbarActive = true;
	this._isSelect = false;
	this._selectIndex = 0;
	this._isSrcSelect = true;
	this._maxItemCountSrc = DataConfig.getMaxUnitItemCountByUnit(this._unitSrc);
	this._maxItemCountDest = DataConfig.getMaxUnitItemCountByUnit(this._unitDest);
	this._resultCode = UnitItemTradeResult.TRADENO;
	this._itemListSrc = createWindowObject(ItemListWindow, this);
	this._itemListDest = createWindowObject(ItemListWindow, this);
	this._unitWindowSrc = createWindowObject(UnitSimpleWindow, this);
	this._unitWindowDest = createWindowObject(UnitSimpleWindow, this);
	this._itemInfoWindow = createWindowObject(ItemInfoWindow, this);
	this._srcPrevItemArray = new Array(this._maxItemCountSrc);
	this._destPrevItemArray = new Array(this._maxItemCountDest);
};

UnitItemTradeScreen._arrangeItemArray = function(isSave, unit, arr){
	var i, result;
	
	root.log(unit.getName());
	
	if (isSave) {
		// Save the current item array.
		for (i = 0; i < DataConfig.getMaxUnitItemCountByUnit(unit); i++) {
			arr[i] = unit.getItem(i);
		}
		result = true;
	}
	else {
		// Compare between the saved item in the array and the current item.
		for (i = 0; i < DataConfig.getMaxUnitItemCountByUnit(unit); i++) {
			if (arr[i] !== unit.getItem(i)) {
				break;
			}
		}
		
		if (i === DataConfig.getMaxUnitItemCountByUnit(unit)) {
			result = true;
		}
		else {
			result = false;
		}
	}
	
	return result;
};

UnitItemTradeScreen._completeScreenMemberData = function(screenParam){
	var count = LayoutControl.getObjectVisibleCount(ItemRenderer.getItemHeight(), 15) - 3;
	var srcCount = count;
	var destCount = count;
	
	if (srcCount > DataConfig.getMaxUnitItemCountByUnit(this._unitSrc)) {
		srcCount = DataConfig.getMaxUnitItemCountByUnit(this._unitSrc);
	}
	
	if (destCount > DataConfig.getMaxUnitItemCountByUnit(this._unitDest)) {
		destCount = DataConfig.getMaxUnitItemCountByUnit(this._unitDest);
	}
	
	this._itemListSrc.setItemFormation(srcCount);
	this._itemListSrc.setItemIndex(0);
	this._itemListSrc.enableWarningState(true);
	
	this._itemListDest.setItemFormation(destCount);
	this._itemListDest.setItemIndex(0);
	this._itemListDest.enableWarningState(true);
	
	this._arrangeItemArray(true, this._unitSrc, this._srcPrevItemArray);
	this._arrangeItemArray(true, this._unitDest, this._destPrevItemArray);
	
	this._itemListSrc.setActive(true);
	
	this._updateListWindow();
};

UnitItemControl.arrangeItem = function(unit){
	var i, j, item;
	var count = this.getPossessionItemCount(unit);
	var maxCount = DataConfig.getMaxUnitItemCountByUnit(unit);
	
	// Stuff the item in order not to have a blank between items.
	for (i = 0; i < count; i++) {
		if (unit.getItem(i) === null) {
			for (j = i + 1; j < maxCount; j++) {
				item = unit.getItem(j);
				if (item !== null) {
					unit.setItem(i, item);
					unit.clearItem(j);
					break;
				}
			}
		}
	}
};

UnitItemControl.pushItem = function(unit, item){
	var count = this.getPossessionItemCount(unit);
	
	if (count < DataConfig.getMaxUnitItemCountByUnit(unit)) {	
		this.arrangeItem(unit);
		unit.setItem(count, item);
		return true;
	}
	
	return false;
};

UnitItemControl.getPossessionItemCount = function(unit){
	var i;
	var count = DataConfig.getMaxUnitItemCountByUnit(unit);
	var bringCount = 0;
	
	for (i = 0; i < count; i++) {
		if (unit.getItem(i) !== null) {
			bringCount++;
		}
	}
	
	return bringCount;
};

UnitItemControl.isUnitItemSpace = function(unit){
	return this.getPossessionItemCount(unit) !== DataConfig.getMaxUnitItemCountByUnit(unit);
};

ItemChangeControl._decreaseUnitItem = function(unit, targetItem, isStockSend){
	var i, item, curItem;
	var count = DataConfig.getMaxUnitItemCountByUnit(unit);
	var arr = [];
	
	for (i = 0; i < count; i++) {
		item = UnitItemControl.getItem(unit, i);
		if (ItemControl.compareItem(item, targetItem)) {
			// Delete because same item was found.
			curItem = UnitItemControl.cutItem(unit, i);
			if (curItem !== null && isStockSend) {
				if (StockItemControl.isStockItemSpace()) {
					StockItemControl.pushStockItem(curItem);
				}
				else {
					arr.push(curItem);
				}
			}
			break;
			
		}
	}
	
	return arr;
};

ItemChangeControl._releaseAllUnitItem = function(unit, isStockSend){
	var i, curItem;
	var count = DataConfig.getMaxUnitItemCountByUnit(unit);
	var arr = [];
	
	for (i = 0; i < count; i++) {
		curItem = UnitItemControl.cutItem(unit, 0);
		if (curItem !== null && isStockSend) {
			if (StockItemControl.isStockItemSpace()) {
				StockItemControl.pushStockItem(curItem);
			}
			else {
				arr.push(curItem);
			}
		}
	}
	
	return arr;
};

DefineControl.getVisibleUnitItemCount = function(){
	// How the shit am I going to make this one work?  It doesn't take a unit.	
	var count = Math.floor(root.getGameAreaHeight() / ItemRenderer.getItemHeight()) - 11;
	
	if (count > DataConfig.getMaxUnitItemCount()) {
		count = DataConfig.getMaxUnitItemCount();
	}
	
	return count;
};

ItemListWindow.setDefaultItemFormation = function(){
	//this one also has no unit	
	var max = 7;
	var count = DataConfig.getMaxUnitItemCount();
	
	if (count > max) {
		count = max;
	}
	
	this.setItemFormation(count);
};

ItemListScrollbar.setUnitMaxItemFormation = function(unit){
	var i;
	var maxCount = DataConfig.getMaxUnitItemCountByUnit(unit);
	
	this._unit = unit;
	
	this.resetScrollData();
	
	for (i = 0; i < maxCount; i++) {
		this.objectSet(UnitItemControl.getItem(unit, i));
	}
	
	this.objectSetEnd();
	
	this.resetAvailableData();
};

ItemListScrollbar.setUnitItemFormation = function(unit){
	var i, item;
	var maxCount = DataConfig.getMaxUnitItemCountByUnit(unit);
	
	this._unit = unit;
	
	this.resetScrollData();
	
	for (i = 0; i < maxCount; i++) {
		item = UnitItemControl.getItem(unit, i);
		if (item !== null) {
			this.objectSet(item);
		}
	}
	
	this.objectSetEnd();
	
	this.resetAvailableData();
};