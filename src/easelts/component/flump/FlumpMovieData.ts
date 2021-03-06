import IFlumpLibrary = require('../../interface/IFlumpLibrary');

import Flump = require('../FlumpLibrary');
import FlumpLayerData = require('./FlumpLayerData');
import FlumpLabelData = require('./FlumpLabelData');

class FlumpMovieData {

	public id:string;
	public flumpLibrary;
	public flumpLayerDatas:Array<FlumpLayerData>;

	public frames:number = 0;

	constructor(flumpLibrary:Flump, json:IFlumpLibrary.IMovie)
	{
		this.flumpLibrary = flumpLibrary;
		this.id = json.id;

		var layers = json.layers;
		this.flumpLayerDatas = new Array(layers.length);
		for(var i = 0; i < layers.length; i++)
		{
			var layer = new FlumpLayerData(layers[i]);
			this.flumpLayerDatas[i] = layer;
			this.frames = Math.max(this.frames, layer.frames)
		}
	}
}

export = FlumpMovieData;