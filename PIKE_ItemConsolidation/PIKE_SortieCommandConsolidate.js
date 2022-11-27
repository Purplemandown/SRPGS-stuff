StockItemTradeScreen._consolidateAllItem = function() {
	var stockArray = root.getMetaSession().getStockItemArray();
	var newArray = [];
	for(i = 0; i < stockArray.length; i++) {
		var name = stockArray[i].getName();


		if(stockArray[i].getLimit() < stockArray[i].getLimitMax()) {

			//first optimized loop
			var merged = false;
			for(j = 0; j < stockArray.length; j++) {
				if(j != i && stockArray[j].getName() === name && stockArray[j].getLimit() < stockArray[j].getLimitMax() && stockArray[i].getLimit() + stockArray[j].getLimit() <= stockArray[i].getLimitMax()) {
					stockArray[i].setLimit(stockArray[i].getLimit() + stockArray[j].getLimit());
					StockItemControl.cutStockItem(j);
					this._updateListWindow();
					i--;
					merged = true;
					break;
				}
			}

			if(!merged) {
					//second unoptimized loop
				for(j = 0; j < stockArray.length; j++) {
					if(j != i && stockArray[j].getName() === name && stockArray[j].getLimit() < stockArray[j].getLimitMax()) {
						stockArray[i].setLimit(stockArray[i].getLimit() + stockArray[j].getLimit());
						if(stockArray[i].getLimit() > stockArray[i].getLimitMax()) {
							stockArray[i].setLimit(stockArray[i].getLimitMax())
						}
						StockItemControl.cutStockItem(j);
						this._updateListWindow();
						i--;
						merged = true;
						break;
					}
				}
			}
		}
	}
}