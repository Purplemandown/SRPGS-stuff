var MergeCommandMode = {
	DEFAULT: 0,
	UNIT: 1,
	STOCK: 2
};

var mode = MergeCommandMode.DEFAULT;
var picked = false;
var firstItem, secondItem;

StockItemTradeScreen._moveMerge = function() {
	var item;
	var input = this._unitItemWindow.moveWindow();
	var input2 = this._stockItemWindow.moveWindow();
	
		
	if (input === ScrollbarInput.SELECT) {

		if(mode == MergeCommandMode.STOCK) {
			this._stockItemWindow.setForceSelect(-1);
			firstItem = null;
			secondItem = null;
			picked = false;
		}

		root.log("Picked?" + picked)

		mode = MergeCommandMode.UNIT;

		var index = this._unitItemWindow.getItemIndex();
		var item = UnitItemControl.getItem(this._unit, index);

		if(item.getLimit() == item.getLimitMax()) {
			this._infoWindow.setInfoMessage("Item is at maximum limit.");
			this.changeCycleMode(StockItemTradeMode.LIMITWARNING);
		}
		else {
			if(!picked) {
				this._unitItemWindow.setForceSelect(index);
				firstItem = UnitItemControl.getItem(this._unit, index);
				picked = true;
			}
			else {
				secondItem = UnitItemControl.getItem(this._unit, index);
				

				if(firstItem.getName() != secondItem.getName()) {
					this._infoWindow.setInfoMessage("Incompatible items.");
					this.changeCycleMode(StockItemTradeMode.LIMITWARNING);
					picked = false;
				}
				else {
					firstItem.setLimit(firstItem.getLimit() + secondItem.getLimit())
					if(firstItem.getLimit() > firstItem.getLimitMax()) {
						firstItem.setLimit(firstItem.getLimitMax());
					}
					this._cutUnitItem(index);
					this._updateListWindow();
					this._unitItemWindow.setForceSelect(-1);
					picked = false;
					this._itemInfoWindow.setInfoItem(null);
					firstItem = null;
					secondItem = null;
					this._processMode(StockItemTradeMode.OPERATION);
					mode = MergeCommandMode.DEFAULT;
				}
			}
		}
	}
	else if (input === ScrollbarInput.CANCEL) {
		this._unitItemWindow.setForceSelect(-1);
		picked = false;
		this._itemInfoWindow.setInfoItem(null);
		this._processMode(StockItemTradeMode.OPERATION);
		mode = MergeCommandMode.DEFAULT;
	}
	else if (input === ScrollbarInput.NONE) {
		if (this._unitItemWindow.isIndexChanged()) {
			item = this._unitItemWindow.getCurrentItem();
			this._itemInfoWindow.setInfoItem(item);
		}
	}

	if (input2 === ScrollbarInput.SELECT) {
		if(mode == MergeCommandMode.UNIT) {
			this._unitItemWindow.setForceSelect(-1);
			firstItem = null;
			secondItem = null;
			picked = false;
		}
		mode = MergeCommandMode.STOCK;

		var index = this._stockItemWindow.getItemIndex();
		var item = StockItemControl.getStockItem(index);

		if(item.getLimit() == item.getLimitMax()) {
			this._infoWindow.setInfoMessage("Item is at maximum limit.");
			this.changeCycleMode(StockItemTradeMode.LIMITWARNING);
		}
		else {
			if(!picked) {
				this._stockItemWindow.setForceSelect(index);
				firstItem = StockItemControl.getStockItem(index);
				picked = true;
			}
			else {

				secondItem = StockItemControl.getStockItem(index);
				if(firstItem.getName() != secondItem.getName()) {
					this._infoWindow.setInfoMessage("Incompatible items.");
					this.changeCycleMode(StockItemTradeMode.LIMITWARNING);
					picked = false;
				}
				else {
					firstItem.setLimit(firstItem.getLimit() + secondItem.getLimit())
					if(firstItem.getLimit() > firstItem.getLimitMax()) {
						firstItem.setLimit(firstItem.getLimitMax());
					}
					this._cutStockItem(index);
					this._updateListWindow();
					this._stockItemWindow.setForceSelect(-1);
					picked = false;
					this._itemInfoWindow.setInfoItem(null);
					firstItem = null;
					secondItem = null;
					this._processMode(StockItemTradeMode.OPERATION);
					mode = MergeCommandMode.DEFAULT;
				}
			}
		}
	}

	else if (input2 === ScrollbarInput.CANCEL) {
		this._stockItemWindow.setForceSelect(-1);
		picked = false;
		this._itemInfoWindow.setInfoItem(null);
		this._processMode(StockItemTradeMode.OPERATION);
		mode = MergeCommandMode.DEFAULT;
	}
	else if (input2 === ScrollbarInput.NONE) {
		if (this._unitItemWindow.isIndexChanged()) {
			item = this._unitItemWindow.getCurrentItem();
			this._itemInfoWindow.setInfoItem(item);
		}
	}
		
	return MoveResult.CONTINUE;
}

StockItemTradeScreen._moveLimitWarning = function() {
		if (this._infoWindow.moveWindow() !== MoveResult.CONTINUE) {
			this._processMode(StockItemTradeMode.OPERATION);
		}
		
		return MoveResult.CONTINUE;
	}