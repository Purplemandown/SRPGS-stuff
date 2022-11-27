// Purplemandown, 2021-11-08
// If this plugin is present, items obtained from chests will be discarded rather than sent to convoy.
// Distributed under the "Do What the Fuck You Want to Public License"
// http://www.wtfpl.net/about/
//
// Note that this doesn't change the stringtable.  You'll have to do that on your own.

UnitItemFull._moveTradeQuestion = function(){
		var index, item;
		
		if (this._questionWindow.moveWindow() !== MoveResult.CONTINUE) {
			if (this._questionWindow.getQuestionAnswer() === QuestionAnswer.YES) {
				// Possessed item is stored in the stock, and set the obtained item at the empty place.
				index = this._itemListWindow.getItemIndex();
				item = UnitItemControl.getItem(this._unit, index);
				UnitItemControl.setItem(this._unit, index, this._targetItem);
				this._throwItem(item);
				return MoveResult.END;
			}
			else {
				this._itemListWindow.enableSelectCursor(true);
				this.changeCycleMode(UnitItemFullMode.TOP);
			}
		}
		
		return MoveResult.CONTINUE;
};

UnitItemFull._moveStockQuestion = function(){
		if (this._questionWindow.moveWindow() !== MoveResult.CONTINUE) {
			if (this._questionWindow.getQuestionAnswer() === QuestionAnswer.YES) {
				// Send the obtained item to the stock.
				this._throwItem(this._targetItem);
				return MoveResult.END;
			}
			else {
				this._itemListWindow.enableSelectCursor(true);
				this.changeCycleMode(UnitItemFullMode.TOP);
			}
		}
		
		return MoveResult.CONTINUE;
};

UnitItemFull._throwItem = function(item) {
	
	};