import IFlumpLibrary = require('../interface/IFlumpLibrary');
import ILoadable = require('../interface/ILoadable');

import Signal = require('../../createts/event/Signal');
import HttpRequest = require('../../createts/util/HttpRequest');
import Promise = require('../../createts/util/Promise');
import SignalConnection = require('../../createts/event/SignalConnection');
import FlumpMovieData = require('./flump/FlumpMovieData');
import FlumpTexture = require('./flump/FlumpTexture');
import FlumpTextureGroup = require('./flump/FlumpTextureGroup');
import FlumpMovie = require('./flump/FlumpMovie');

class FlumpLibrary implements ILoadable<FlumpLibrary>
{
	public static load(url:string, flumpLibrary?:FlumpLibrary, onProcess?:(process:number) => any ):Promise<FlumpLibrary>
	{
		var baseDir = url;

		if(url.indexOf('.json') > -1)
		{
			baseDir = url.substr(0, url.lastIndexOf('/'));
		} else {

			if(baseDir.substr(-1) == '/')
			{
				baseDir = baseDir.substr(0, baseDir.length - 1);
			}

			url += ( url.substr(url.length-1) != '/' ? '/' : '' ) +  'library.json';
		}

		if(flumpLibrary == void 0)
		{
			flumpLibrary = new FlumpLibrary(baseDir);
		} else {
			flumpLibrary.url = baseDir;
		}
		
		return HttpRequest.getJSON(url).then((json:IFlumpLibrary.ILibrary) =>
		{
			return flumpLibrary.processData(json, onProcess);
		});
	}

	public movieData:Array<FlumpMovieData> = [];
	public textureGroups:Array<FlumpTextureGroup> = [];

	public url:string;
	public md5:string;
	public frameRate:number;
	public referenceList:Array<string>;

	public fps:number = 0;

	public isOptimised:boolean = false;
	public isLoaded:boolean = false;

	constructor(basePath?:string)
	{
		if(basePath)
		{
			this.url = basePath;
		}
	}

	public load( onProgress?:(progress:number) => any):Promise<FlumpLibrary>
	{
		if( this.isLoaded)
		{
			onProgress(1);

			return new Promise<FlumpLibrary>((resolve:Function, reject:Function) => {
				resolve(this);
			});
		}

		if(!this.url)
		{
			throw new Error('url is not set and there for can not be loaded');
		}

		return FlumpLibrary.load(this.url, this, onProgress ).catch(() => {
			throw new Error('could not load library');
		});
	}

	public processData(json:IFlumpLibrary.ILibrary, onProcess?:(process:number) => any):Promise<FlumpLibrary>
	{

		this.md5 = json.md5;
		this.frameRate = json.frameRate;
		this.referenceList = json.referenceList || null;
		this.isOptimised = json.optimised || false;

		var textureGroupLoaders:Array<Promise<FlumpTextureGroup>> = [];
		for(var i = 0; i < json.movies.length; i++)
		{
			var flumpMovieData = new FlumpMovieData(this, json.movies[i]);
			this.movieData.push(flumpMovieData);
		}

		var textureGroups = json.textureGroups;
		for(var i = 0; i < textureGroups.length; i++)
		{
			var textureGroup = textureGroups[i];
			var promise = FlumpTextureGroup.load(this, textureGroup);
			textureGroupLoaders.push(promise);
		}

		return HttpRequest.wait(textureGroupLoaders, onProcess)
			.then((textureGroups:Array<FlumpTextureGroup>) => {

				for(var i = 0; i < textureGroups.length; i++)
				{
					var textureGroup = textureGroups[i];
					this.textureGroups.push(textureGroup);
				}


				this.isLoaded = true;
				return this;
			});
	}

	public getFlumpMovieData(name:string):FlumpMovieData
	{
		for(var i = 0; i < this.movieData.length; i++)
		{
			var movieData = this.movieData[i];
			if(movieData.id == name)
			{
				return movieData;
			}
		}

		throw new Error('movie not found');
	}

	public createSymbol(name:string, paused:boolean = false):FlumpMovie|FlumpTexture
	{
		for(var i = 0; i < this.textureGroups.length; i++)
		{
			var flumpTextures = this.textureGroups[i].flumpTextures;

			if(name in flumpTextures)
			{
				return flumpTextures[name];
			}
		}

		for(var i = 0; i < this.movieData.length; i++)
		{
			var movieData = this.movieData[i];


			if(movieData.id == name)
			{
				var movie = new FlumpMovie(this, name);
				movie.paused = paused;
				return movie;
			}

		}

		console.warn('no symbol found: (' + name + ')');

		throw new Error("no symbol found");
	}

	public createMovie(id:any):FlumpMovie
	{
		if(this.referenceList)
		{
			var name:any = this.referenceList.indexOf(id);
		}
		else
		{
			var name:any = id;
		}

		for(var i = 0; i < this.movieData.length; i++)
		{
			var movieData = this.movieData[i];
			if(movieData.id == <any> name)
			{
				var movie = new FlumpMovie(this, <any> name);
				movie.paused = true;
				return movie;
			}
		}

		console.warn('no symbol found: (' + name + ') ', this);

		throw new Error("no symbol found: " + this);
	}

	public getNameFromReferenceList(value:string|number):string
	{
		if(this.referenceList && typeof value == 'number')
		{
			return this.referenceList[<number> value];
		}

		return <string> value;
	}
}

export = FlumpLibrary;