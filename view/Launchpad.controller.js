sap.ui.controller("ui5bp.view.Launchpad", {

	onInit: function () {
		this.bus = sap.ui.getCore().getEventBus();
	},

	doNavOnSelect: function (event) {
		var oFileUploader = document.createElement('input');
		oFileUploader.setAttribute('type', 'file');
		oFileUploader.setAttribute('accept', 'image/*');
		oFileUploader.setAttribute('capture', 'camera');
		oFileUploader.style.display = "none";
		oFileUploader.addEventListener("change", function (oEvt) {
			var oFile = oEvt.srcElement.files[0];
			var sFileFormat = oFile.type;
			var oReader = new FileReader();
			oReader.readAsBinaryString(oFile);
			oReader.onload = function (oEvt, oFileUpload) {
				var sFileContent = btoa(oEvt.target.result);
				if (sFileFormat === "image/png" || sFileFormat === "image/jpg" || sFileFormat === "image/jpeg" || sFileFormat === "image/tif" || sFileFormat === "image/tiff") {
					var img = new Image();
					img.onload = function (oFileUpload) {
						var canvas = document.createElement('canvas');
						var ctx = canvas.getContext("2d");
						var maxSize = 1000000;
						var sizeRatio = oFile.size / maxSize;
						var compression = 0.8;
						//Used in Solution2
						//var percentage = 0.3;


						//Solution1:
						canvas.width = (sizeRatio > 1) ? (img.width / sizeRatio) : img.width;
						canvas.height = (sizeRatio > 1) ? (img.height / sizeRatio) : img.height;

						//Solution2:
						//canvas.width = img.width - (img.width * percentage);
						//canvas.height = img.height - (img.height * percentage);

						// draw image
						ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
						// export base64
						if (sizeRatio > 1) {
							sFileContent = canvas.toDataURL("image/jpeg", compression).split("data:image/jpeg;base64,")[1];
						}
						fSuccessFunction(sFileContent, oFileUploader);
						oFileUploader.remove();
						oFileUploader = null;
					};
					var sImageSource = "data:image/jpeg;base64," + sFileContent;
					img.src = sImageSource;
				} else {
					fSuccessFunction(sFileContent, oFileUploader);
					oFileUploader.remove();
					oFileUploader = null;

				}

			};
			oReader.onerror = function () {
				jQuery.sap.log.info("Error reading file");
				oFileUploader.remove();
				oFileUploader = null;
			};
		});
		// Seems Safari (iOS) doesn't like firing a change event if the input is not in the body
		document.body.appendChild(oFileUploader);
		oFileUploader.click();
		return;


		this.bus.publish("nav", "to", {
			id: event
		});
	}

});