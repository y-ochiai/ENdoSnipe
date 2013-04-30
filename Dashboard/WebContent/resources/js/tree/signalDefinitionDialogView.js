ENS.SignalDefinitionDialogView = ENS.SignalDialogView.extend({
	initialize : function(option) {
		var ins = this;
		this.op_ = option;
		this.id = option.dialogId;
		this.signalType = option.signalType;
		var treeId = option.treeId;
		this.signalDefinitionList = [];
		var okName = "okFunctionName";
		var okObj = "okObject";
		var cName = "cancelFunctionName";
		var cObj = "cancelObject";
		
		$("#" + option.dialogId).dialog({
			buttons : [ {
				text : "OK",
				click : function(event) {
					
					// シグナル名が空の時はアラートを表示し、再入力を求める。
					var signalName = $("#signalName").val();
					if (signalName === "") {
						alert("Please input 'Signal Name'.");
						return;
					} else if (signalName.match(/[\\\/]/)) {
						alert("Don't use '/'or'\\' in 'Signal Name'.");
						return;
					}
					
					// マッチングパターンが空の時はアラーとを表示し、再入力を求める。
					var matchingPattern = $("#matchingPattern").val();
					if (matchingPattern === "") {
						alert("Please input 'Matching Pattern'.");
						return;
					}
					
					var level = $("#signalPatternValue select").val() - 0;
					// レベルを入力するテキストボックスに数値が入力されているか確認し、
					// 数値以外のものが入力されている場合はアラートを表示し、再入力を求める。
					// また全ての閾値レベルの入力欄が空であった場合も同様にアラートを表示し、再入力を求める。
					var emptyNum = 0;
					for ( var num = 1; num <= level; num++) {
						var inputValue = $("input#patternValue_" + num).val();
						if (!inputValue.match(/^([1-9]\d*|0|^$)(\.\d+)?$/)) {
							alert("Don't use non-number in 'Signal Levels'.");
							return;
						}
						
						if (inputValue === "") {
							emptyNum++;
						}
					}
					if (emptyNum == level) {
						alert("Please input 'Signal Levels'.");
						return;
					}
					
					// エスカレーションピリオドに数値が入力されていない場合にアラートを表示し、再入力を求める。
					var inputedPeriod = $("#escalationPeriod").val();
					if (!inputedPeriod.match(/^([1-9]\d*|0|^$)(\.\d+)?$/)) {
						alert("Don't use non-number in 'Escalation Period'.");
						return;
					} else if (inputedPeriod === "") {
						alert("Please input 'Escalation Period'.");
						return;
					}
					
					$("#" + option.dialogId).dialog("close");
					if (!ins.op_[okObj]) {
						return;
					}
					if (!ins.op_[okObj][ins.op_[okName]]) {
						return;
					}
					ins.op_[okObj][ins.op_[okName]](event, ins.op_);
				}
			}, {
				text : "Cancel",
				click : function(event) {
					$("#" + option.dialogId).dialog("close");
					if (!ins.op_[cObj]) {
						return;
					}
					if (!ins.op_[cObj][ins.op_[cName]]) {
						return;
					}
					ins.op_[cObj][ins.op_[cName]](event, ins.op_);
				}
			} ],
			modal : true,
			width : 350
		});

		var instance = this;
		$("#signalPatternValue select").change(function() {
			instance.judgeSignalPattern();
		});

		instance.judgeSignalPattern();
	},
	/**
	 * Signal Patternで選択されているLevelによって、 入力項目の個数を変更する。
	 */
	judgeSignalPattern : function() {
		var selectValue = $("#signalPatternValue select").val();

		if (selectValue == 3) {
			$("#signalPatternValue_4").css("display", "none");
			$("#signalPatternValue_5").css("display", "none");
		} else if (selectValue == 5) {
			$("#signalPatternValue_4").css("display", "block");
			$("#signalPatternValue_5").css("display", "block");
		}
	}
});