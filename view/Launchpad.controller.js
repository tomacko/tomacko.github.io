sap.ui.controller("ui5bp.view.Launchpad", {

	onInit: function () {
		this.bus = sap.ui.getCore().getEventBus();
	},

	doNavOnSelect: function (event) {
		
		
		return;


		this.bus.publish("nav", "to", {
			id: event
		});
	}

});