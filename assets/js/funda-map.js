/*
	Source: Funda API-example (refactored)
*/

function FundaTest(oOptions) {
	this.opt = oOptions;
	this.TILE_WIDTH = 256;
	this.TILE_HEIGHT = 256;
	this.MARKER_WIDTH = 18;
	this.MARKER_HEIGHT = 18;
	this.MARKER_ICON = 'http://www.fundainbusiness.nl/img/kaart/marker/marker-small.png';
	this.init()
}

FundaTest.prototype = {
	init: function() {
		this.oDataTiles = {};
	},

	initMap: function () {
		var mapDiv = document.getElementById(this.opt.sMapId);
		this.oMap = new google.maps.Map(mapDiv, {
		  center: {lat: 52.2312771, lng: 4.9863},
		  zoom: 8
		});

		sSearchQuery = 'koop/heel-nederland';

		this.GenerateMapFromImageTiles(this.oMap, sSearchQuery);
	},

	// Create an overlay of image map tiles.
	GenerateMapFromImageTiles: function(oMap, sSearchQuery) {
		var oMapType = new google.maps.ImageMapType({
			getTileUrl: function (coord, zoom) {
				return 'http://mt1.funda.nl/maptileimage.ashx?z=' + zoom + '&x=' + coord.x + '&y=' + coord.y + '&mode=png&zo=' + sSearchQuery;
			},
			tileSize: new google.maps.Size(this.TILE_WIDTH, this.TILE_HEIGHT),
			isPng: true
		});
		oMap.overlayMapTypes.insertAt(0, oMapType);
	}
};

/*
	FundaMapType
	Customized map type that can be used as overlay of a regular Google map.
*/
function FundaMapType(tileSize, sSearchQuery, funcCallback) {
	this.tileSize = tileSize;
	this.funcCallback = funcCallback;
}

FundaMapType.prototype = {
	maxZoom: 19,
	name: 'Tile #s',
	alt: 'Tile Coordinate Map Type',

	getTile: function(coord, zoom, ownerDocument) {
		var div = ownerDocument.createElement('div');
		div.id = 'funda_tile_' + zoom + '_' + coord.x + '-' + coord.y;
		div.innerHTML = coord;
		div.style.width = this.tileSize.width + 'px';
		div.style.height = this.tileSize.height + 'px';
		div.style.fontSize = '10';
		div.style.borderStyle = 'solid';
		div.style.borderWidth = '1px';
		div.style.borderColor = '#AAAAAA';
		div.style.backgroundColor = 'transparent';

		var funcCallback = this.funcCallback;
		this.getJsonpDoc('http://mt2.funda.nl/maptiledata.ashx?z=' + zoom + '&x=' + coord.x + '&y=' + coord.y + '&zo=' + sSearchQuery, function (oJson) {
			funcCallback(oJson, div.id);
		})

		return div;
	},

	loadJsonpWrapper: function(sUrl, sCallbackMethod) {
	    this.tmpMethod = window[this.opt.sInstanceName].getJsonpDoc;
	    this.tmpMethod(sUrl, this[sCallbackMethod]);
	    delete this.tmpMethod;
	},

	getJsonpDoc: function(sUrl, funcCallback) {
	    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
	    window[callbackName] = function(data) {
	        delete window[callbackName];
	        document.body.removeChild(script);
	        funcCallback(data);
	    };

	    var script = document.createElement('script');
	    script.src = sUrl + (sUrl.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
	    document.body.appendChild(script);
	}
};

var myFundaTest = new FundaTest({
	sInstanceName: 'myFundaTest',
	sMapId: 'mapPlaceholder',
	sAanbodApiBasePath: 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json',
	sApiKey: '271175433a7c4fe2a45750d385dd9bfd'
});