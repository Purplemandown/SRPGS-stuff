StringTable.StockItem_Merge = "Merge"
StringTable.StockItem_ConsolidateAll = "Consolidate all"
StockItemTradeMode.MERGE = 6
StockItemTradeMode.LIMITWARNING = 7


ItemOperationWindow.setItemOperationData = function() {
		var arr = [StringTable.StockItem_Extract, StringTable.StockItem_Store, StringTable.StockItem_AllStore, StringTable.StockItem_Merge, StringTable.StockItem_ConsolidateAll];
		
		this._scrollbar = createScrollbarObject(ItemOperationScrollbar, this);
		this._scrollbar.setScrollFormation(3, 2);
		this._scrollbar.setObjectArray(arr);
	}

StockItemTradeScreen.moveScreenCycle = function() {
		var mode = this.getCycleMode();
		var result = MoveResult.CONTINUE;
		
		if (mode === StockItemTradeMode.OPERATION) {
			result = this._moveOperation();
		}
		else if (mode === StockItemTradeMode.STORE) {
			result = this._moveStore();
		}
		else if (mode === StockItemTradeMode.EXTRACT) {
			result = this._moveExtract();
		}
		else if (mode === StockItemTradeMode.STOREWARNING) {
			result = this._moveStoreWarning();
		}
		else if (mode === StockItemTradeMode.EXTRACTWARNING) {
			result = this._moveExtractWarning();
		}
		else if (mode === StockItemTradeMode.MENU) {
			result = this._moveMenu();
		}
		else if (mode === StockItemTradeMode.MERGE) {
			result = this._moveMerge();
		}
		else if (mode === StockItemTradeMode.LIMITWARNING) {
			result = this._moveLimitWarning();
		}
		
		return result;
	}

StockItemTradeScreen._moveOperation = function() {
		var index;
		var input = this._itemOperationWindow.moveWindow();
		var result = MoveResult.CONTINUE;
		
		if (input === ScrollbarInput.SELECT) {
			index = this._itemOperationWindow.getOperationIndex();
			if (index === 0 && this.isExtractAllowed()) {
				this._processMode(StockItemTradeMode.EXTRACT);
			}
			else if (index === 1 && this.isStoreAllowed()) {
				this._processMode(StockItemTradeMode.STORE);
			}
			else if (index === 2 && this.isStoreAllowed()) {
				this._storeAllItem();
			}
			if (index === 3) {
				this._processMode(StockItemTradeMode.MERGE);
			}
			if (index === 4) {
				this._consolidateAllItem();
			}
		}
		else if (input === ScrollbarInput.CANCEL) {
			if (this._isAction) {
				// Process after the item update ended.
				this._resultCode = StockItemTradeResult.TRADEEND;
			}
			else {
				this._resultCode = StockItemTradeResult.TRADENO;
			}
			
			// Process after the item update ended.
			ItemControl.updatePossessionItem(this._unit);
			
			result = MoveResult.END;
		}
		else if (input === ScrollbarInput.OPTION) {
			this._openMenu();
		}
		else if (this.getCycleMode() === StockItemTradeMode.OPERATION) {
			if (this._unitSimpleWindow === null || this._unitList === null) {
				return result;
			}
			
			var menuIndex = this._itemOperationWindow.getOperationIndex();
			if((menuIndex <= 2 && !InputControl.isInputAction(InputType.UP)) || (menuIndex >= 3 && !InputControl.isInputAction(InputType.DOWN))){
				
				// only change index if the index is 0-2 and the last input was down (cycle down)
				// or if the index is 3-4 and the last input was up (cycle up)
				
				index = this._dataChanger.checkDataIndex(this._unitList, this._unit); 
				
				if (index !== -1) {
					this._unit = this._unitList.getData(index);
					this._unitItemWindow.setUnitItemFormation(this._unit);
					this._unitSimpleWindow.setFaceUnitData(this._unit);
				}
			}
		}
		
		return result;
	}

StockItemTradeScreen._processMode = function(mode) {
		if (mode === StockItemTradeMode.OPERATION) {
			this._itemOperationWindow.setItemOperationData();
			this._itemOperationWindow.enableSelectCursor(true);
			
			this._unitItemWindow.setActive(false);
			this._unitItemWindow.setForceSelect(-1);
			this._stockItemWindow.setActive(false);
			this._stockItemWindow.setForceSelect(-1);
		}
		else if (mode === StockItemTradeMode.STORE) {
			this._unitItemWindow.enableSelectCursor(true);
			this._itemOperationWindow.enableSelectCursor(false);
			this._itemInfoWindow.setInfoItem(this._unitItemWindow.getCurrentItem());
		}
		else if (mode === StockItemTradeMode.EXTRACT) {
			this._stockItemWindow.enableSelectCursor(true);
			this._itemOperationWindow.enableSelectCursor(false);
			this._itemInfoWindow.setInfoItem(this._stockItemWindow.getCurrentItem());
		}
		else if (mode === StockItemTradeMode.STOREWARNING) {
			this._infoWindow.setInfoMessage(StringTable.ItemChange_StockItemFull);
		}
		else if (mode === StockItemTradeMode.EXTRACTWARNING) {
			this._infoWindow.setInfoMessage(StringTable.ItemChange_StockItemFull);
		}
		else if(mode === StockItemTradeMode.MERGE) {
			this._unitItemWindow.enableSelectCursor(true);
			this._stockItemWindow.enableSelectCursor(true);
			this._itemOperationWindow.enableSelectCursor(false);
			this._itemInfoWindow.setInfoItem(this._unitItemWindow.getCurrentItem());
		}
		
		this.changeCycleMode(mode);
	}


StockItemTradeScreen._drawSubWindow = function() {
		var x, y;
		var mode = this.getCycleMode();
		
		if (mode === StockItemTradeMode.STOREWARNING || mode === StockItemTradeMode.LIMITWARNING) {
			x = LayoutControl.getCenterX(-1, this._infoWindow.getWindowWidth());
			y = LayoutControl.getCenterY(-1, this._infoWindow.getWindowHeight());
			this._infoWindow.drawWindow(x, y);
		}
	}