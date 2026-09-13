(() => {
var __webpack_modules__ = ({
"./node_modules/jszip/dist/jszip.min.js"(module, __unused_rspack_exports, __webpack_require__) {
/*!

JSZip v3.10.2 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/

!function(e){if(true)module.exports=e();else {}}(function(){return function s(a,o,h){function u(r,e){if(!o[r]){if(!a[r]){var t=undefined;if(!e&&t)return require(r,!0);if(l)return l(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[r]={exports:{}};a[r][0].call(i.exports,function(e){var t=a[r][1][e];return u(t||e)},i,i.exports,s,a,o,h)}return o[r].exports}for(var l=undefined,e=0;e<h.length;e++)u(h[e]);return u}({1:[function(e,t,r){"use strict";var d=e("./utils"),c=e("./support"),p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(e){for(var t,r,n,i,s,a,o,h=[],u=0,l=e.length,f=l,c="string"!==d.getTypeOf(e);u<e.length;)f=l-u,n=c?(t=e[u++],r=u<l?e[u++]:0,u<l?e[u++]:0):(t=e.charCodeAt(u++),r=u<l?e.charCodeAt(u++):0,u<l?e.charCodeAt(u++):0),i=t>>2,s=(3&t)<<4|r>>4,a=1<f?(15&r)<<2|n>>6:64,o=2<f?63&n:64,h.push(p.charAt(i)+p.charAt(s)+p.charAt(a)+p.charAt(o));return h.join("")},r.decode=function(e){var t,r,n,i,s,a,o=0,h=0,u="data:";if(e.substr(0,u.length)===u)throw new Error("Invalid base64 input, it looks like a data url.");var l,f=3*(e=e.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(e.charAt(e.length-1)===p.charAt(64)&&f--,e.charAt(e.length-2)===p.charAt(64)&&f--,f%1!=0)throw new Error("Invalid base64 input, bad content length.");for(l=c.uint8array?new Uint8Array(0|f):new Array(0|f);o<e.length;)t=p.indexOf(e.charAt(o++))<<2|(i=p.indexOf(e.charAt(o++)))>>4,r=(15&i)<<4|(s=p.indexOf(e.charAt(o++)))>>2,n=(3&s)<<6|(a=p.indexOf(e.charAt(o++))),l[h++]=t,64!==s&&(l[h++]=r),64!==a&&(l[h++]=n);return l}},{"./support":30,"./utils":32}],2:[function(e,t,r){"use strict";var n=e("./external"),i=e("./stream/DataWorker"),s=e("./stream/Crc32Probe"),a=e("./stream/DataLengthProbe");function o(e,t,r,n,i){this.compressedSize=e,this.uncompressedSize=t,this.crc32=r,this.compression=n,this.compressedContent=i}o.prototype={getContentWorker:function(){var e=new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")),t=this;return e.on("end",function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),e},getCompressedWorker:function(){return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(e,t,r){return e.pipe(new s).pipe(new a("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new a("compressedSize")).withStreamInfo("compression",t)},t.exports=o},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,r){"use strict";var n=e("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(){return new n("STORE compression")},uncompressWorker:function(){return new n("STORE decompression")}},r.DEFLATE=e("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,r){"use strict";var n=e("./utils");var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();t.exports=function(e,t){return void 0!==e&&e.length?"string"!==n.getTypeOf(e)?function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return-1^e}(0|t,e,e.length,0):function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t.charCodeAt(a))];return-1^e}(0|t,e,e.length,0):0}},{"./utils":32}],5:[function(e,t,r){"use strict";r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null},{}],6:[function(e,t,r){"use strict";var n=null;n="undefined"!=typeof Promise?Promise:e("lie"),t.exports={Promise:n}},{lie:37}],7:[function(e,t,r){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,i=e("pako"),s=e("./utils"),a=e("./stream/GenericWorker"),o=n?"uint8array":"array";function h(e,t){a.call(this,"FlateWorker/"+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={}}r.magic="\b\0",s.inherits(h,a),h.prototype.processChunk=function(e){this.meta=e.meta,null===this._pako&&this._createPako(),this._pako.push(s.transformTo(o,e.data),!1)},h.prototype.flush=function(){a.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0)},h.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null},h.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var t=this;this._pako.onData=function(e){t.push({data:e,meta:t.meta})}},r.compressWorker=function(e){return new h("Deflate",e)},r.uncompressWorker=function(){return new h("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,r){"use strict";function A(e,t){var r,n="";for(r=0;r<t;r++)n+=String.fromCharCode(255&e),e>>>=8;return n}function n(e,t,r,n,i,s){var a,o,h=e.file,u=e.compression,l=s!==O.utf8encode,f=I.transformTo("string",s(h.name)),c=I.transformTo("string",O.utf8encode(h.name)),d=h.comment,p=I.transformTo("string",s(d)),m=I.transformTo("string",O.utf8encode(d)),_=c.length!==h.name.length,g=m.length!==d.length,b="",v="",y="",w=h.dir,k=h.date,x={crc32:0,compressedSize:0,uncompressedSize:0};t&&!r||(x.crc32=e.crc32,x.compressedSize=e.compressedSize,x.uncompressedSize=e.uncompressedSize);var S=0;t&&(S|=8),l||!_&&!g||(S|=2048);var z=0,C=0;w&&(z|=16),"UNIX"===i?(C=798,z|=function(e,t){var r=e;return e||(r=t?16893:33204),(65535&r)<<16}(h.unixPermissions,w)):(C=20,z|=function(e){return 63&(e||0)}(h.dosPermissions)),a=k.getUTCHours(),a<<=6,a|=k.getUTCMinutes(),a<<=5,a|=k.getUTCSeconds()/2,o=k.getUTCFullYear()-1980,o<<=4,o|=k.getUTCMonth()+1,o<<=5,o|=k.getUTCDate(),_&&(v=A(1,1)+A(B(f),4)+c,b+="up"+A(v.length,2)+v),g&&(y=A(1,1)+A(B(p),4)+m,b+="uc"+A(y.length,2)+y);var E="";return E+="\n\0",E+=A(S,2),E+=u.magic,E+=A(a,2),E+=A(o,2),E+=A(x.crc32,4),E+=A(x.compressedSize,4),E+=A(x.uncompressedSize,4),E+=A(f.length,2),E+=A(b.length,2),{fileRecord:R.LOCAL_FILE_HEADER+E+f+b,dirRecord:R.CENTRAL_FILE_HEADER+A(C,2)+E+A(p.length,2)+"\0\0\0\0"+A(z,4)+A(n,4)+f+b+p}}var I=e("../utils"),i=e("../stream/GenericWorker"),O=e("../utf8"),B=e("../crc32"),R=e("../signature");function s(e,t,r,n){i.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=r,this.encodeFileName=n,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}I.inherits(s,i),s.prototype.push=function(e){var t=e.meta.percent||0,r=this.entriesCount,n=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,i.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:r?(t+100*(r-n-1))/r:100}}))},s.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var r=n(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}})}else this.accumulate=!0},s.prototype.closedSource=function(e){this.accumulate=!1;var t=this.streamFiles&&!e.file.dir,r=n(e,t,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(r.dirRecord),t)this.push({data:function(e){return R.DATA_DESCRIPTOR+A(e.crc32,4)+A(e.compressedSize,4)+A(e.uncompressedSize,4)}(e),meta:{percent:100}});else for(this.push({data:r.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},s.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var r=this.bytesWritten-e,n=function(e,t,r,n,i){var s=I.transformTo("string",i(n));return R.CENTRAL_DIRECTORY_END+"\0\0\0\0"+A(e,2)+A(e,2)+A(t,4)+A(r,4)+A(s.length,2)+s}(this.dirRecords.length,r,e,this.zipComment,this.encodeFileName);this.push({data:n,meta:{percent:100}})},s.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},s.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on("data",function(e){t.processChunk(e)}),e.on("end",function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end()}),e.on("error",function(e){t.error(e)}),this},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},s.prototype.error=function(e){var t=this._sources;if(!i.prototype.error.call(this,e))return!1;for(var r=0;r<t.length;r++)try{t[r].error(e)}catch(e){}return!0},s.prototype.lock=function(){i.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock()},t.exports=s},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,r){"use strict";var u=e("../compressions"),n=e("./ZipFileWorker");r.generateWorker=function(e,a,t){var o=new n(a.streamFiles,t,a.platform,a.encodeFileName),h=0;try{e.forEach(function(e,t){h++;var r=function(e,t){var r=e||t,n=u[r];if(!n)throw new Error(r+" is not a valid compression method !");return n}(t.options.compression,a.compression),n=t.options.compressionOptions||a.compressionOptions||{},i=t.dir,s=t.date;t._compressWorker(r,n).withStreamInfo("file",{name:e,dir:i,date:s,comment:t.comment||"",unixPermissions:t.unixPermissions,dosPermissions:t.dosPermissions}).pipe(o)}),o.entriesCount=h}catch(e){o.error(e)}return o}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,r){"use strict";function n(){if(!(this instanceof n))return new n;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var e=new n;for(var t in this)"function"!=typeof this[t]&&(e[t]=this[t]);return e}}(n.prototype=e("./object")).loadAsync=e("./load"),n.support=e("./support"),n.defaults=e("./defaults"),n.version="3.10.2",n.loadAsync=function(e,t){return(new n).loadAsync(e,t)},n.external=e("./external"),t.exports=n},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,r){"use strict";var u=e("./utils"),i=e("./external"),n=e("./utf8"),s=e("./zipEntries"),a=e("./stream/Crc32Probe"),l=e("./nodejsUtils");function f(n){return new i.Promise(function(e,t){var r=n.decompressed.getContentWorker().pipe(new a);r.on("error",function(e){t(e)}).on("end",function(){r.streamInfo.crc32!==n.decompressed.crc32?t(new Error("Corrupted zip : CRC32 mismatch")):e()}).resume()})}t.exports=function(e,o){var h=this;return o=u.extend(o||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:n.utf8decode}),l.isNode&&l.isStream(e)?i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):u.prepareContent("the loaded zip file",e,!0,o.optimizedBinaryString,o.base64).then(function(e){var t=new s(o);return t.load(e),t}).then(function(e){var t=[i.Promise.resolve(e)],r=e.files;if(o.checkCRC32)for(var n=0;n<r.length;n++)t.push(f(r[n]));return i.Promise.all(t)}).then(function(e){for(var t=e.shift(),r=t.files,n=0;n<r.length;n++){var i=r[n],s=i.fileNameStr,a=u.resolve(i.fileNameStr);h.file(a,i.decompressed,{binary:!0,optimizedBinaryString:!0,date:i.date,dir:i.dir,comment:i.fileCommentStr.length?i.fileCommentStr:null,unixPermissions:i.unixPermissions,dosPermissions:i.dosPermissions,createFolders:o.createFolders}),i.dir||(h.file(a).unsafeOriginalName=s)}return t.zipComment.length&&(h.comment=t.zipComment),h})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,r){"use strict";var n=e("../utils"),i=e("../stream/GenericWorker");function s(e,t){i.call(this,"Nodejs stream input adapter for "+e),this._upstreamEnded=!1,this._bindStream(t)}n.inherits(s,i),s.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on("data",function(e){t.push({data:e,meta:{percent:0}})}).on("error",function(e){t.isPaused?this.generatedError=e:t.error(e)}).on("end",function(){t.isPaused?t._upstreamEnded=!0:t.end()})},s.prototype.pause=function(){return!!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=s},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,r){"use strict";var i=e("readable-stream").Readable;function n(e,t,r){i.call(this,t),this._helper=e;var n=this;e.on("data",function(e,t){n.push(e)||n._helper.pause(),r&&r(t)}).on("error",function(e){n.emit("error",e)}).on("end",function(){n.push(null)})}e("../utils").inherits(n,i),n.prototype._read=function(){this._helper.resume()},t.exports=n},{"../utils":32,"readable-stream":16}],14:[function(e,t,r){"use strict";t.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if("number"==typeof e)throw new Error('The "data" argument must not be a number');return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&"function"==typeof e.on&&"function"==typeof e.pause&&"function"==typeof e.resume}}},{}],15:[function(e,t,r){"use strict";function s(e,t,r){var n,i=u.getTypeOf(t),s=u.extend(r||{},f);s.date=s.date||new Date,null!==s.compression&&(s.compression=s.compression.toUpperCase()),"string"==typeof s.unixPermissions&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(e=g(e)),s.createFolders&&(n=_(e))&&b.call(this,n,!0);var a="string"===i&&!1===s.binary&&!1===s.base64;r&&void 0!==r.binary||(s.binary=!a),(t instanceof c&&0===t.uncompressedSize||s.dir||!t||0===t.length)&&(s.base64=!1,s.binary=!0,t="",s.compression="STORE",i="string");var o=null;o=t instanceof c||t instanceof l?t:p.isNode&&p.isStream(t)?new m(e,t):u.prepareContent(e,t,s.binary,s.optimizedBinaryString,s.base64);var h=new d(e,o,s);this.files[e]=h}var i=e("./utf8"),u=e("./utils"),l=e("./stream/GenericWorker"),a=e("./stream/StreamHelper"),f=e("./defaults"),c=e("./compressedObject"),d=e("./zipObject"),o=e("./generate"),p=e("./nodejsUtils"),m=e("./nodejs/NodejsStreamInputAdapter"),_=function(e){"/"===e.slice(-1)&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf("/");return 0<t?e.substring(0,t):""},g=function(e){return"/"!==e.slice(-1)&&(e+="/"),e},b=function(e,t){return t=void 0!==t?t:f.createFolders,e=g(e),this.files[e]||s.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function h(e){return"[object RegExp]"===Object.prototype.toString.call(e)}var n={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(e){var t,r,n;for(t in this.files)n=this.files[t],(r=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(r,n)},filter:function(r){var n=[];return this.forEach(function(e,t){r(e,t)&&n.push(t)}),n},file:function(e,t,r){if(1!==arguments.length)return e=this.root+e,s.call(this,e,t,r),this;if(h(e)){var n=e;return this.filter(function(e,t){return!t.dir&&n.test(e)})}var i=this.files[this.root+e];return i&&!i.dir?i:null},folder:function(r){if(!r)return this;if(h(r))return this.filter(function(e,t){return t.dir&&r.test(e)});var e=this.root+r,t=b.call(this,e),n=this.clone();return n.root=t.name,n},remove:function(r){r=this.root+r;var e=this.files[r];if(e||("/"!==r.slice(-1)&&(r+="/"),e=this.files[r]),e&&!e.dir)delete this.files[r];else for(var t=this.filter(function(e,t){return t.name.slice(0,r.length)===r}),n=0;n<t.length;n++)delete this.files[t[n].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(e){var t,r={};try{if((r=u.extend(e||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:i.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");u.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var n=r.comment||this.comment||"";t=o.generateWorker(this,r,n)}catch(e){(t=new l("error")).error(e)}return new a(t,r.type||"string",r.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return(e=e||{}).type||(e.type="nodebuffer"),this.generateInternalStream(e).toNodejsStream(t)}};t.exports=n},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,r){"use strict";t.exports=e("stream")},{stream:void 0}],17:[function(e,t,r){"use strict";var n=e("./DataReader");function i(e){n.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t]}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data[this.zero+e]},i.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.length-4;0<=s;--s)if(this.data[s]===t&&this.data[s+1]===r&&this.data[s+2]===n&&this.data[s+3]===i)return s-this.zero;return-1},i.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.readData(4);return t===s[0]&&r===s[1]&&n===s[2]&&i===s[3]},i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return[];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],18:[function(e,t,r){"use strict";var n=e("../utils");function i(e){this.data=e,this.length=e.length,this.index=0,this.zero=0}i.prototype={checkOffset:function(e){this.checkIndex(this.index+e)},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+e+"). Corrupted zip ?")},setIndex:function(e){this.checkIndex(e),this.index=e},skip:function(e){this.setIndex(this.index+e)},byteAt:function(){},readInt:function(e){var t,r=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)r=(r<<8)+this.byteAt(t);return this.index+=e,r},readString:function(e){return n.transformTo("string",this.readData(e))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=i},{"../utils":32}],19:[function(e,t,r){"use strict";var n=e("./Uint8ArrayReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,r){"use strict";var n=e("./DataReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},i.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},i.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],21:[function(e,t,r){"use strict";var n=e("./ArrayReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return new Uint8Array(0);var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,r){"use strict";var n=e("../utils"),i=e("../support"),s=e("./ArrayReader"),a=e("./StringReader"),o=e("./NodeBufferReader"),h=e("./Uint8ArrayReader");t.exports=function(e){var t=n.getTypeOf(e);return n.checkSupport(t),"string"!==t||i.uint8array?"nodebuffer"===t?new o(e):i.uint8array?new h(n.transformTo("uint8array",e)):new s(n.transformTo("array",e)):new a(e)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,r){"use strict";r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\b"},{}],24:[function(e,t,r){"use strict";var n=e("./GenericWorker"),i=e("../utils");function s(e){n.call(this,"ConvertWorker to "+e),this.destType=e}i.inherits(s,n),s.prototype.processChunk=function(e){this.push({data:i.transformTo(this.destType,e.data),meta:e.meta})},t.exports=s},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,r){"use strict";var n=e("./GenericWorker"),i=e("../crc32");function s(){n.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}e("../utils").inherits(s,n),s.prototype.processChunk=function(e){this.streamInfo.crc32=i(e.data,this.streamInfo.crc32||0),this.push(e)},t.exports=s},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,r){"use strict";var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataLengthProbe for "+e),this.propName=e,this.withStreamInfo(e,0)}n.inherits(s,i),s.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length}i.prototype.processChunk.call(this,e)},t.exports=s},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,r){"use strict";var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataWorker");var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=n.getTypeOf(e),t.isPaused||t._tickAndRepeat()},function(e){t.error(e)})}n.inherits(s,i),s.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,n.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(n.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":e=this.data.substring(this.index,t);break;case"uint8array":e=this.data.subarray(this.index,t);break;case"array":case"nodebuffer":e=this.data.slice(this.index,t)}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=s},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,r){"use strict";function n(e){this.name=e||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}n.prototype={push:function(e){this.emit("data",e)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(e){this.emit("error",e)}return!0},error:function(e){return!this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit("error",e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(e,t){if(this._listeners[e])for(var r=0;r<this._listeners[e].length;r++)this._listeners[e][r].call(this,t)},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on("data",function(e){t.processChunk(e)}),e.on("end",function(){t.end()}),e.on("error",function(e){t.error(e)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e)},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,e)&&(this.streamInfo[e]=this.extraStreamInfo[e])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var e="Worker "+this.name;return this.previous?this.previous+" -> "+e:e}},t.exports=n},{}],29:[function(e,t,r){"use strict";var h=e("../utils"),i=e("./ConvertWorker"),s=e("./GenericWorker"),u=e("../base64"),n=e("../support"),a=e("../external"),o=null;if(n.nodestream)try{o=e("../nodejs/NodejsStreamOutputAdapter")}catch(e){}function l(e,o){return new a.Promise(function(t,r){var n=[],i=e._internalType,s=e._outputType,a=e._mimeType;e.on("data",function(e,t){n.push(e),o&&o(t)}).on("error",function(e){n=[],r(e)}).on("end",function(){try{var e=function(e,t,r){switch(e){case"blob":return h.newBlob(h.transformTo("arraybuffer",t),r);case"base64":return u.encode(t);default:return h.transformTo(e,t)}}(s,function(e,t){var r,n=0,i=null,s=0;for(r=0;r<t.length;r++)s+=t[r].length;switch(e){case"string":return t.join("");case"array":return Array.prototype.concat.apply([],t);case"uint8array":for(i=new Uint8Array(s),r=0;r<t.length;r++)i.set(t[r],n),n+=t[r].length;return i;case"nodebuffer":return Buffer.concat(t);default:throw new Error("concat : unsupported type '"+e+"'")}}(i,n),a);t(e)}catch(e){r(e)}n=[]}).resume()})}function f(e,t,r){var n=t;switch(t){case"blob":case"arraybuffer":n="uint8array";break;case"base64":n="string"}try{this._internalType=n,this._outputType=t,this._mimeType=r,h.checkSupport(n),this._worker=e.pipe(new i(n)),e.lock()}catch(e){this._worker=new s("error"),this._worker.error(e)}}f.prototype={accumulate:function(e){return l(this,e)},on:function(e,t){var r=this;return"data"===e?this._worker.on(e,function(e){t.call(r,e.data,e.meta)}):this._worker.on(e,function(){h.delay(t,arguments,r)}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new o(this,{objectMode:"nodebuffer"!==this._outputType},e)}},t.exports=f},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,r){"use strict";if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else{var n=new ArrayBuffer(0);try{r.blob=0===new Blob([n],{type:"application/zip"}).size}catch(e){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(n),r.blob=0===i.getBlob("application/zip").size}catch(e){r.blob=!1}}}try{r.nodestream=!!e("readable-stream").Readable}catch(e){r.nodestream=!1}},{"readable-stream":16}],31:[function(e,t,s){"use strict";for(var o=e("./utils"),h=e("./support"),r=e("./nodejsUtils"),n=e("./stream/GenericWorker"),u=new Array(256),i=0;i<256;i++)u[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;u[254]=u[254]=1;function a(){n.call(this,"utf-8 decode"),this.leftOver=null}function l(){n.call(this,"utf-8 encode")}s.utf8encode=function(e){return h.nodebuffer?r.newBufferFrom(e,"utf-8"):function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=h.uint8array?new Uint8Array(o):new Array(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t}(e)},s.utf8decode=function(e){return h.nodebuffer?o.transformTo("nodebuffer",e).toString("utf-8"):function(e){var t,r,n,i,s=e.length,a=new Array(2*s);for(t=r=0;t<s;)if((n=e[t++])<128)a[r++]=n;else if(4<(i=u[n]))a[r++]=65533,t+=i-1;else{for(n&=2===i?31:3===i?15:7;1<i&&t<s;)n=n<<6|63&e[t++],i--;1<i?a[r++]=65533:n<65536?a[r++]=n:(n-=65536,a[r++]=55296|n>>10&1023,a[r++]=56320|1023&n)}return a.length!==r&&(a.subarray?a=a.subarray(0,r):a.length=r),o.applyFromCharCode(a)}(e=o.transformTo(h.uint8array?"uint8array":"array",e))},o.inherits(a,n),a.prototype.processChunk=function(e){var t=o.transformTo(h.uint8array?"uint8array":"array",e.data);if(this.leftOver&&this.leftOver.length){if(h.uint8array){var r=t;(t=new Uint8Array(r.length+this.leftOver.length)).set(this.leftOver,0),t.set(r,this.leftOver.length)}else t=this.leftOver.concat(t);this.leftOver=null}var n=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+u[e[r]]>t?r:t}(t),i=t;n!==t.length&&(h.uint8array?(i=t.subarray(0,n),this.leftOver=t.subarray(n,t.length)):(i=t.slice(0,n),this.leftOver=t.slice(n,t.length))),this.push({data:s.utf8decode(i),meta:e.meta})},a.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},s.Utf8DecodeWorker=a,o.inherits(l,n),l.prototype.processChunk=function(e){this.push({data:s.utf8encode(e.data),meta:e.meta})},s.Utf8EncodeWorker=l},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,a){"use strict";var o=e("./support"),h=e("./base64"),r=e("./nodejsUtils"),u=e("./external");function n(e){return e}function l(e,t){for(var r=0;r<e.length;++r)t[r]=255&e.charCodeAt(r);return t}e("setimmediate"),a.newBlob=function(t,r){a.checkSupport("blob");try{return new Blob([t],{type:r})}catch(e){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return n.append(t),n.getBlob(r)}catch(e){throw new Error("Bug : can't construct the Blob.")}}};var i={stringifyByChunk:function(e,t,r){var n=[],i=0,s=e.length;if(s<=r)return String.fromCharCode.apply(null,e);for(;i<s;)"array"===t||"nodebuffer"===t?n.push(String.fromCharCode.apply(null,e.slice(i,Math.min(i+r,s)))):n.push(String.fromCharCode.apply(null,e.subarray(i,Math.min(i+r,s)))),i+=r;return n.join("")},stringifyByChar:function(e){for(var t="",r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},applyCanBeUsed:{uint8array:function(){try{return o.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(e){return!1}}(),nodebuffer:function(){try{return o.nodebuffer&&1===String.fromCharCode.apply(null,r.allocBuffer(1)).length}catch(e){return!1}}()}};function s(e){var t=65536,r=a.getTypeOf(e),n=!0;if("uint8array"===r?n=i.applyCanBeUsed.uint8array:"nodebuffer"===r&&(n=i.applyCanBeUsed.nodebuffer),n)for(;1<t;)try{return i.stringifyByChunk(e,r,t)}catch(e){t=Math.floor(t/2)}return i.stringifyByChar(e)}function f(e,t){for(var r=0;r<e.length;r++)t[r]=e[r];return t}a.applyFromCharCode=s;var c={};c.string={string:n,array:function(e){return l(e,new Array(e.length))},arraybuffer:function(e){return c.string.uint8array(e).buffer},uint8array:function(e){return l(e,new Uint8Array(e.length))},nodebuffer:function(e){return l(e,r.allocBuffer(e.length))}},c.array={string:s,array:n,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(e)}},c.arraybuffer={string:function(e){return s(new Uint8Array(e))},array:function(e){return f(new Uint8Array(e),new Array(e.byteLength))},arraybuffer:n,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(new Uint8Array(e))}},c.uint8array={string:s,array:function(e){return f(e,new Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:n,nodebuffer:function(e){return r.newBufferFrom(e)}},c.nodebuffer={string:s,array:function(e){return f(e,new Array(e.length))},arraybuffer:function(e){return c.nodebuffer.uint8array(e).buffer},uint8array:function(e){return f(e,new Uint8Array(e.length))},nodebuffer:n},a.transformTo=function(e,t){if(t=t||"",!e)return t;a.checkSupport(e);var r=a.getTypeOf(t);return c[r][e](t)},a.resolve=function(e){for(var t=e.split("/"),r=[],n=0;n<t.length;n++){var i=t[n];"."===i||""===i&&0!==n&&n!==t.length-1||(".."===i?r.pop():r.push(i))}return r.join("/")},a.getTypeOf=function(e){if("string"==typeof e)return"string";var t=Object.prototype.toString.call(e);return"[object Array]"===t?"array":o.nodebuffer&&r.isBuffer(e)?"nodebuffer":o.uint8array&&"[object Uint8Array]"===t?"uint8array":o.arraybuffer&&"[object ArrayBuffer]"===t?"arraybuffer":void 0},a.checkSupport=function(e){if(!o[e.toLowerCase()])throw new Error(e+" is not supported by this platform")},a.MAX_VALUE_16BITS=65535,a.MAX_VALUE_32BITS=-1,a.pretty=function(e){var t,r,n="";for(r=0;r<(e||"").length;r++)n+="\\x"+((t=e.charCodeAt(r))<16?"0":"")+t.toString(16).toUpperCase();return n},a.delay=function(e,t,r){setImmediate(function(){e.apply(r||null,t||[])})},a.inherits=function(e,t){function r(){}r.prototype=t.prototype,e.prototype=new r},a.extend=function(){var e,t,r={};for(e=0;e<arguments.length;e++)for(t in arguments[e])Object.prototype.hasOwnProperty.call(arguments[e],t)&&void 0===r[t]&&(r[t]=arguments[e][t]);return r},a.prepareContent=function(r,e,n,i,s){return u.Promise.resolve(e).then(function(n){return o.blob&&(n instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(n)))?void 0!==Blob.prototype.arrayBuffer?n.arrayBuffer():"undefined"!=typeof FileReader?new u.Promise(function(t,r){var e=new FileReader;e.onload=function(e){t(e.target.result)},e.onerror=function(e){r(e.target.error)},e.readAsArrayBuffer(n)}):u.Promise.reject(new Error(r+" is a Blob, but we have no way of reading it.")):n}).then(function(e){var t=a.getTypeOf(e);return t?("arraybuffer"===t?e=a.transformTo("uint8array",e):"string"===t&&(s?e=h.decode(e):n&&!0!==i&&(e=function(e){return l(e,o.uint8array?new Uint8Array(e.length):new Array(e.length))}(e))),e):u.Promise.reject(new Error("Can't read the data of '"+r+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,t,r){"use strict";var n=e("./reader/readerFor"),i=e("./utils"),s=e("./signature"),a=e("./zipEntry"),o=e("./support");function h(e){this.files=[],this.loadOptions=e}h.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+i.pretty(t)+", expected "+i.pretty(e)+")")}},isSignature:function(e,t){var r=this.reader.index;this.reader.setIndex(e);var n=this.reader.readString(4)===t;return this.reader.setIndex(r),n},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=o.uint8array?"uint8array":"array",r=i.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(r)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,r,n=this.zip64EndOfCentralSize-44;0<n;)e=this.reader.readInt(2),t=this.reader.readInt(4),r=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:r}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var e,t;for(e=0;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes()},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(e=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(e<0)throw!this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"):new Error("Corrupted zip: can't find end of central directory");this.reader.setIndex(e);var t=e;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(e),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var n=t-r;if(0<n)this.isSignature(t,s.CENTRAL_FILE_HEADER)||(this.reader.zero=n);else if(n<0)throw new Error("Corrupted zip: missing "+Math.abs(n)+" bytes.")},prepareReader:function(e){this.reader=n(e)},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},t.exports=h},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,t,r){"use strict";var n=e("./reader/readerFor"),s=e("./utils"),i=e("./compressedObject"),a=e("./crc32"),o=e("./utf8"),h=e("./compressions"),u=e("./support");function l(e,t){this.options=e,this.loadOptions=t}l.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(e){var t,r;if(e.skip(22),this.fileNameLength=e.readInt(2),r=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(t=function(e){for(var t in h)if(Object.prototype.hasOwnProperty.call(h,t)&&h[t].magic===e)return h[t];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new i(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize))},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==e&&(this.dosPermissions=63&this.externalFileAttributes),3==e&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var e=n(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4))}},readExtraFields:function(e){var t,r,n,i=e.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});e.index+4<i;)t=e.readInt(2),r=e.readInt(2),n=e.readData(r),this.extraFields[t]={id:t,length:r,value:n};e.setIndex(i)},handleUTF8:function(){var e=u.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else{var t=this.findExtraFieldUnicodePath();if(null!==t)this.fileNameStr=t;else{var r=s.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r)}var n=this.findExtraFieldUnicodeComment();if(null!==n)this.fileCommentStr=n;else{var i=s.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(i)}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileName)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileComment)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null}},t.exports=l},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,r){"use strict";function n(e,t,r){this.name=e,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=t,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions}}var s=e("./stream/StreamHelper"),i=e("./stream/DataWorker"),a=e("./utf8"),o=e("./compressedObject"),h=e("./stream/GenericWorker");n.prototype={internalStream:function(e){var t=null,r="string";try{if(!e)throw new Error("No output type specified.");var n="string"===(r=e.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),t=this._decompressWorker();var i=!this._dataBinary;i&&!n&&(t=t.pipe(new a.Utf8EncodeWorker)),!i&&n&&(t=t.pipe(new a.Utf8DecodeWorker))}catch(e){(t=new h("error")).error(e)}return new s(t,r,"")},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||"nodebuffer").toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof o&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new a.Utf8EncodeWorker)),o.createWorkerFrom(r,e,t)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof h?this._data:new i(this._data)}};for(var u=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],l=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},f=0;f<u.length;f++)n.prototype[u[f]]=l;t.exports=n},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,l,t){(function(t){"use strict";var r,n,e=t.MutationObserver||t.WebKitMutationObserver;if(e){var i=0,s=new e(u),a=t.document.createTextNode("");s.observe(a,{characterData:!0}),r=function(){a.data=i=++i%2}}else if(t.setImmediate||void 0===t.MessageChannel)r="document"in t&&"onreadystatechange"in t.document.createElement("script")?function(){var e=t.document.createElement("script");e.onreadystatechange=function(){u(),e.onreadystatechange=null,e.parentNode.removeChild(e),e=null},t.document.documentElement.appendChild(e)}:function(){setTimeout(u,0)};else{var o=new t.MessageChannel;o.port1.onmessage=u,r=function(){o.port2.postMessage(0)}}var h=[];function u(){var e,t;n=!0;for(var r=h.length;r;){for(t=h,h=[],e=-1;++e<r;)t[e]();r=h.length}n=!1}l.exports=function(e){1!==h.push(e)||n||r()}}).call(this,"undefined"!=typeof __webpack_require__.g?__webpack_require__.g:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],37:[function(e,t,r){"use strict";var i=e("immediate");function u(){}var l={},s=["REJECTED"],a=["FULFILLED"],n=["PENDING"];function o(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=n,this.queue=[],this.outcome=void 0,e!==u&&d(this,e)}function h(e,t,r){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected)}function f(t,r,n){i(function(){var e;try{e=r(n)}catch(e){return l.reject(t,e)}e===t?l.reject(t,new TypeError("Cannot resolve promise with itself")):l.resolve(t,e)})}function c(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments)}}function d(t,e){var r=!1;function n(e){r||(r=!0,l.reject(t,e))}function i(e){r||(r=!0,l.resolve(t,e))}var s=p(function(){e(i,n)});"error"===s.status&&n(s.value)}function p(e,t){var r={};try{r.value=e(t),r.status="success"}catch(e){r.status="error",r.value=e}return r}(t.exports=o).prototype.finally=function(t){if("function"!=typeof t)return this;var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})})},o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){if("function"!=typeof e&&this.state===a||"function"!=typeof t&&this.state===s)return this;var r=new this.constructor(u);this.state!==n?f(r,this.state===a?e:t,this.outcome):this.queue.push(new h(r,e,t));return r},h.prototype.callFulfilled=function(e){l.resolve(this.promise,e)},h.prototype.otherCallFulfilled=function(e){f(this.promise,this.onFulfilled,e)},h.prototype.callRejected=function(e){l.reject(this.promise,e)},h.prototype.otherCallRejected=function(e){f(this.promise,this.onRejected,e)},l.resolve=function(e,t){var r=p(c,t);if("error"===r.status)return l.reject(e,r.value);var n=r.value;if(n)d(e,n);else{e.state=a,e.outcome=t;for(var i=-1,s=e.queue.length;++i<s;)e.queue[i].callFulfilled(t)}return e},l.reject=function(e,t){e.state=s,e.outcome=t;for(var r=-1,n=e.queue.length;++r<n;)e.queue[r].callRejected(t);return e},o.resolve=function(e){if(e instanceof this)return e;return l.resolve(new this(u),e)},o.reject=function(e){var t=new this(u);return l.reject(t,e)},o.all=function(e){var r=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,i=!1;if(!n)return this.resolve([]);var s=new Array(n),a=0,t=-1,o=new this(u);for(;++t<n;)h(e[t],t);return o;function h(e,t){r.resolve(e).then(function(e){s[t]=e,++a!==n||i||(i=!0,l.resolve(o,s))},function(e){i||(i=!0,l.reject(o,e))})}},o.race=function(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var r=e.length,n=!1;if(!r)return this.resolve([]);var i=-1,s=new this(u);for(;++i<r;)a=e[i],t.resolve(a).then(function(e){n||(n=!0,l.resolve(s,e))},function(e){n||(n=!0,l.reject(s,e))});var a;return s}},{immediate:36}],38:[function(e,t,r){"use strict";var n={};(0,e("./lib/utils/common").assign)(n,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),t.exports=n},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,r){"use strict";var a=e("./zlib/deflate"),o=e("./utils/common"),h=e("./utils/strings"),i=e("./zlib/messages"),s=e("./zlib/zstream"),u=Object.prototype.toString,l=0,f=-1,c=0,d=8;function p(e){if(!(this instanceof p))return new p(e);this.options=o.assign({level:f,method:d,chunkSize:16384,windowBits:15,memLevel:8,strategy:c,to:""},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var r=a.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(r!==l)throw new Error(i[r]);if(t.header&&a.deflateSetHeader(this.strm,t.header),t.dictionary){var n;if(n="string"==typeof t.dictionary?h.string2buf(t.dictionary):"[object ArrayBuffer]"===u.call(t.dictionary)?new Uint8Array(t.dictionary):t.dictionary,(r=a.deflateSetDictionary(this.strm,n))!==l)throw new Error(i[r]);this._dict_set=!0}}function n(e,t){var r=new p(t);if(r.push(e,!0),r.err)throw r.msg||i[r.err];return r.result}p.prototype.push=function(e,t){var r,n,i=this.strm,s=this.options.chunkSize;if(this.ended)return!1;n=t===~~t?t:!0===t?4:0,"string"==typeof e?i.input=h.string2buf(e):"[object ArrayBuffer]"===u.call(e)?i.input=new Uint8Array(e):i.input=e,i.next_in=0,i.avail_in=i.input.length;do{if(0===i.avail_out&&(i.output=new o.Buf8(s),i.next_out=0,i.avail_out=s),1!==(r=a.deflate(i,n))&&r!==l)return this.onEnd(r),!(this.ended=!0);0!==i.avail_out&&(0!==i.avail_in||4!==n&&2!==n)||("string"===this.options.to?this.onData(h.buf2binstring(o.shrinkBuf(i.output,i.next_out))):this.onData(o.shrinkBuf(i.output,i.next_out)))}while((0<i.avail_in||0===i.avail_out)&&1!==r);return 4===n?(r=a.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===l):2!==n||(this.onEnd(l),!(i.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e)},p.prototype.onEnd=function(e){e===l&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Deflate=p,r.deflate=n,r.deflateRaw=function(e,t){return(t=t||{}).raw=!0,n(e,t)},r.gzip=function(e,t){return(t=t||{}).gzip=!0,n(e,t)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,r){"use strict";var c=e("./zlib/inflate"),d=e("./utils/common"),p=e("./utils/strings"),m=e("./zlib/constants"),n=e("./zlib/messages"),i=e("./zlib/zstream"),s=e("./zlib/gzheader"),_=Object.prototype.toString;function a(e){if(!(this instanceof a))return new a(e);this.options=d.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new i,this.strm.avail_out=0;var r=c.inflateInit2(this.strm,t.windowBits);if(r!==m.Z_OK)throw new Error(n[r]);this.header=new s,c.inflateGetHeader(this.strm,this.header)}function o(e,t){var r=new a(t);if(r.push(e,!0),r.err)throw r.msg||n[r.err];return r.result}a.prototype.push=function(e,t){var r,n,i,s,a,o,h=this.strm,u=this.options.chunkSize,l=this.options.dictionary,f=!1;if(this.ended)return!1;n=t===~~t?t:!0===t?m.Z_FINISH:m.Z_NO_FLUSH,"string"==typeof e?h.input=p.binstring2buf(e):"[object ArrayBuffer]"===_.call(e)?h.input=new Uint8Array(e):h.input=e,h.next_in=0,h.avail_in=h.input.length;do{if(0===h.avail_out&&(h.output=new d.Buf8(u),h.next_out=0,h.avail_out=u),(r=c.inflate(h,m.Z_NO_FLUSH))===m.Z_NEED_DICT&&l&&(o="string"==typeof l?p.string2buf(l):"[object ArrayBuffer]"===_.call(l)?new Uint8Array(l):l,r=c.inflateSetDictionary(this.strm,o)),r===m.Z_BUF_ERROR&&!0===f&&(r=m.Z_OK,f=!1),r!==m.Z_STREAM_END&&r!==m.Z_OK)return this.onEnd(r),!(this.ended=!0);h.next_out&&(0!==h.avail_out&&r!==m.Z_STREAM_END&&(0!==h.avail_in||n!==m.Z_FINISH&&n!==m.Z_SYNC_FLUSH)||("string"===this.options.to?(i=p.utf8border(h.output,h.next_out),s=h.next_out-i,a=p.buf2string(h.output,i),h.next_out=s,h.avail_out=u-s,s&&d.arraySet(h.output,h.output,i,s,0),this.onData(a)):this.onData(d.shrinkBuf(h.output,h.next_out)))),0===h.avail_in&&0===h.avail_out&&(f=!0)}while((0<h.avail_in||0===h.avail_out)&&r!==m.Z_STREAM_END);return r===m.Z_STREAM_END&&(n=m.Z_FINISH),n===m.Z_FINISH?(r=c.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===m.Z_OK):n!==m.Z_SYNC_FLUSH||(this.onEnd(m.Z_OK),!(h.avail_out=0))},a.prototype.onData=function(e){this.chunks.push(e)},a.prototype.onEnd=function(e){e===m.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=d.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Inflate=a,r.inflate=o,r.inflateRaw=function(e,t){return(t=t||{}).raw=!0,o(e,t)},r.ungzip=o},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,r){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var r=t.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])}}return e},r.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,r,n,i){if(t.subarray&&e.subarray)e.set(t.subarray(r,r+n),i);else for(var s=0;s<n;s++)e[i+s]=t[r+s]},flattenChunks:function(e){var t,r,n,i,s,a;for(t=n=0,r=e.length;t<r;t++)n+=e[t].length;for(a=new Uint8Array(n),t=i=0,r=e.length;t<r;t++)s=e[t],a.set(s,i),i+=s.length;return a}},s={arraySet:function(e,t,r,n,i){for(var s=0;s<n;s++)e[i+s]=t[r+s]},flattenChunks:function(e){return[].concat.apply([],e)}};r.setTyped=function(e){e?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,i)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,s))},r.setTyped(n)},{}],42:[function(e,t,r){"use strict";var h=e("./common"),i=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch(e){i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(e){s=!1}for(var u=new h.Buf8(256),n=0;n<256;n++)u[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;function l(e,t){if(t<65537&&(e.subarray&&s||!e.subarray&&i))return String.fromCharCode.apply(null,h.shrinkBuf(e,t));for(var r="",n=0;n<t;n++)r+=String.fromCharCode(e[n]);return r}u[254]=u[254]=1,r.string2buf=function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=new h.Buf8(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t},r.buf2binstring=function(e){return l(e,e.length)},r.binstring2buf=function(e){for(var t=new h.Buf8(e.length),r=0,n=t.length;r<n;r++)t[r]=e.charCodeAt(r);return t},r.buf2string=function(e,t){var r,n,i,s,a=t||e.length,o=new Array(2*a);for(r=n=0;r<a;)if((i=e[r++])<128)o[n++]=i;else if(4<(s=u[i]))o[n++]=65533,r+=s-1;else{for(i&=2===s?31:3===s?15:7;1<s&&r<a;)i=i<<6|63&e[r++],s--;1<s?o[n++]=65533:i<65536?o[n++]=i:(i-=65536,o[n++]=55296|i>>10&1023,o[n++]=56320|1023&i)}return l(o,n)},r.utf8border=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+u[e[r]]>t?r:t}},{"./common":41}],43:[function(e,t,r){"use strict";t.exports=function(e,t,r,n){for(var i=65535&e|0,s=e>>>16&65535|0,a=0;0!==r;){for(r-=a=2e3<r?2e3:r;s=s+(i=i+t[n++]|0)|0,--a;);i%=65521,s%=65521}return i|s<<16|0}},{}],44:[function(e,t,r){"use strict";t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,t,r){"use strict";var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();t.exports=function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return-1^e}},{}],46:[function(e,t,r){"use strict";var h,c=e("../utils/common"),u=e("./trees"),d=e("./adler32"),p=e("./crc32"),n=e("./messages"),l=0,f=4,m=0,_=-2,g=-1,b=4,i=2,v=8,y=9,s=286,a=30,o=19,w=2*s+1,k=15,x=3,S=258,z=S+x+1,C=42,E=113,A=1,I=2,O=3,B=4;function R(e,t){return e.msg=n[t],t}function T(e){return(e<<1)-(4<e?9:0)}function D(e){for(var t=e.length;0<=--t;)e[t]=0}function F(e){var t=e.state,r=t.pending;r>e.avail_out&&(r=e.avail_out),0!==r&&(c.arraySet(e.output,t.pending_buf,t.pending_out,r,e.next_out),e.next_out+=r,t.pending_out+=r,e.total_out+=r,e.avail_out-=r,t.pending-=r,0===t.pending&&(t.pending_out=0))}function N(e,t){u._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,F(e.strm)}function U(e,t){e.pending_buf[e.pending++]=t}function P(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t}function L(e,t){var r,n,i=e.max_chain_length,s=e.strstart,a=e.prev_length,o=e.nice_match,h=e.strstart>e.w_size-z?e.strstart-(e.w_size-z):0,u=e.window,l=e.w_mask,f=e.prev,c=e.strstart+S,d=u[s+a-1],p=u[s+a];e.prev_length>=e.good_match&&(i>>=2),o>e.lookahead&&(o=e.lookahead);do{if(u[(r=t)+a]===p&&u[r+a-1]===d&&u[r]===u[s]&&u[++r]===u[s+1]){s+=2,r++;do{}while(u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&s<c);if(n=S-(c-s),s=c-S,a<n){if(e.match_start=t,o<=(a=n))break;d=u[s+a-1],p=u[s+a]}}}while((t=f[t&l])>h&&0!=--i);return a<=e.lookahead?a:e.lookahead}function j(e){var t,r,n,i,s,a,o,h,u,l,f=e.w_size;do{if(i=e.window_size-e.lookahead-e.strstart,e.strstart>=f+(f-z)){for(c.arraySet(e.window,e.window,f,f,0),e.match_start-=f,e.strstart-=f,e.block_start-=f,t=r=e.hash_size;n=e.head[--t],e.head[t]=f<=n?n-f:0,--r;);for(t=r=f;n=e.prev[--t],e.prev[t]=f<=n?n-f:0,--r;);i+=f}if(0===e.strm.avail_in)break;if(a=e.strm,o=e.window,h=e.strstart+e.lookahead,u=i,l=void 0,l=a.avail_in,u<l&&(l=u),r=0===l?0:(a.avail_in-=l,c.arraySet(o,a.input,a.next_in,l,h),1===a.state.wrap?a.adler=d(a.adler,o,l,h):2===a.state.wrap&&(a.adler=p(a.adler,o,l,h)),a.next_in+=l,a.total_in+=l,l),e.lookahead+=r,e.lookahead+e.insert>=x)for(s=e.strstart-e.insert,e.ins_h=e.window[s],e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+x-1])&e.hash_mask,e.prev[s&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=s,s++,e.insert--,!(e.lookahead+e.insert<x)););}while(e.lookahead<z&&0!==e.strm.avail_in)}function Z(e,t){for(var r,n;;){if(e.lookahead<z){if(j(e),e.lookahead<z&&t===l)return A;if(0===e.lookahead)break}if(r=0,e.lookahead>=x&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!==r&&e.strstart-r<=e.w_size-z&&(e.match_length=L(e,r)),e.match_length>=x)if(n=u._tr_tally(e,e.strstart-e.match_start,e.match_length-x),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=x){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,0!=--e.match_length;);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else n=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(n&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=e.strstart<x-1?e.strstart:x-1,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}function W(e,t){for(var r,n,i;;){if(e.lookahead<z){if(j(e),e.lookahead<z&&t===l)return A;if(0===e.lookahead)break}if(r=0,e.lookahead>=x&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=x-1,0!==r&&e.prev_length<e.max_lazy_match&&e.strstart-r<=e.w_size-z&&(e.match_length=L(e,r),e.match_length<=5&&(1===e.strategy||e.match_length===x&&4096<e.strstart-e.match_start)&&(e.match_length=x-1)),e.prev_length>=x&&e.match_length<=e.prev_length){for(i=e.strstart+e.lookahead-x,n=u._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-x),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!=--e.prev_length;);if(e.match_available=0,e.match_length=x-1,e.strstart++,n&&(N(e,!1),0===e.strm.avail_out))return A}else if(e.match_available){if((n=u._tr_tally(e,0,e.window[e.strstart-1]))&&N(e,!1),e.strstart++,e.lookahead--,0===e.strm.avail_out)return A}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&(n=u._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<x-1?e.strstart:x-1,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}function M(e,t,r,n,i){this.good_length=e,this.max_lazy=t,this.nice_length=r,this.max_chain=n,this.func=i}function H(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=v,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new c.Buf16(2*w),this.dyn_dtree=new c.Buf16(2*(2*a+1)),this.bl_tree=new c.Buf16(2*(2*o+1)),D(this.dyn_ltree),D(this.dyn_dtree),D(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new c.Buf16(k+1),this.heap=new c.Buf16(2*s+1),D(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new c.Buf16(2*s+1),D(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function G(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=i,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?C:E,e.adler=2===t.wrap?0:1,t.last_flush=l,u._tr_init(t),m):R(e,_)}function K(e){var t=G(e);return t===m&&function(e){e.window_size=2*e.w_size,D(e.head),e.max_lazy_match=h[e.level].max_lazy,e.good_match=h[e.level].good_length,e.nice_match=h[e.level].nice_length,e.max_chain_length=h[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=x-1,e.match_available=0,e.ins_h=0}(e.state),t}function Y(e,t,r,n,i,s){if(!e)return _;var a=1;if(t===g&&(t=6),n<0?(a=0,n=-n):15<n&&(a=2,n-=16),i<1||y<i||r!==v||n<8||15<n||t<0||9<t||s<0||b<s)return R(e,_);8===n&&(n=9);var o=new H;return(e.state=o).strm=e,o.wrap=a,o.gzhead=null,o.w_bits=n,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=i+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+x-1)/x),o.window=new c.Buf8(2*o.w_size),o.head=new c.Buf16(o.hash_size),o.prev=new c.Buf16(o.w_size),o.lit_bufsize=1<<i+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new c.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=t,o.strategy=s,o.method=r,K(e)}h=[new M(0,0,0,0,function(e,t){var r=65535;for(r>e.pending_buf_size-5&&(r=e.pending_buf_size-5);;){if(e.lookahead<=1){if(j(e),0===e.lookahead&&t===l)return A;if(0===e.lookahead)break}e.strstart+=e.lookahead,e.lookahead=0;var n=e.block_start+r;if((0===e.strstart||e.strstart>=n)&&(e.lookahead=e.strstart-n,e.strstart=n,N(e,!1),0===e.strm.avail_out))return A;if(e.strstart-e.block_start>=e.w_size-z&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):(e.strstart>e.block_start&&(N(e,!1),e.strm.avail_out),A)}),new M(4,4,8,4,Z),new M(4,5,16,8,Z),new M(4,6,32,32,Z),new M(4,4,16,16,W),new M(8,16,32,32,W),new M(8,16,128,128,W),new M(8,32,128,256,W),new M(32,128,258,1024,W),new M(32,258,258,4096,W)],r.deflateInit=function(e,t){return Y(e,t,v,15,8,0)},r.deflateInit2=Y,r.deflateReset=K,r.deflateResetKeep=G,r.deflateSetHeader=function(e,t){return e&&e.state?2!==e.state.wrap?_:(e.state.gzhead=t,m):_},r.deflate=function(e,t){var r,n,i,s;if(!e||!e.state||5<t||t<0)return e?R(e,_):_;if(n=e.state,!e.output||!e.input&&0!==e.avail_in||666===n.status&&t!==f)return R(e,0===e.avail_out?-5:_);if(n.strm=e,r=n.last_flush,n.last_flush=t,n.status===C)if(2===n.wrap)e.adler=0,U(n,31),U(n,139),U(n,8),n.gzhead?(U(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),U(n,255&n.gzhead.time),U(n,n.gzhead.time>>8&255),U(n,n.gzhead.time>>16&255),U(n,n.gzhead.time>>24&255),U(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),U(n,255&n.gzhead.os),n.gzhead.extra&&n.gzhead.extra.length&&(U(n,255&n.gzhead.extra.length),U(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(e.adler=p(e.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=69):(U(n,0),U(n,0),U(n,0),U(n,0),U(n,0),U(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),U(n,3),n.status=E);else{var a=v+(n.w_bits-8<<4)<<8;a|=(2<=n.strategy||n.level<2?0:n.level<6?1:6===n.level?2:3)<<6,0!==n.strstart&&(a|=32),a+=31-a%31,n.status=E,P(n,a),0!==n.strstart&&(P(n,e.adler>>>16),P(n,65535&e.adler)),e.adler=1}if(69===n.status)if(n.gzhead.extra){for(i=n.pending;n.gzindex<(65535&n.gzhead.extra.length)&&(n.pending!==n.pending_buf_size||(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending!==n.pending_buf_size));)U(n,255&n.gzhead.extra[n.gzindex]),n.gzindex++;n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),n.gzindex===n.gzhead.extra.length&&(n.gzindex=0,n.status=73)}else n.status=73;if(73===n.status)if(n.gzhead.name){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.name.length?255&n.gzhead.name.charCodeAt(n.gzindex++):0,U(n,s)}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.gzindex=0,n.status=91)}else n.status=91;if(91===n.status)if(n.gzhead.comment){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.comment.length?255&n.gzhead.comment.charCodeAt(n.gzindex++):0,U(n,s)}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.status=103)}else n.status=103;if(103===n.status&&(n.gzhead.hcrc?(n.pending+2>n.pending_buf_size&&F(e),n.pending+2<=n.pending_buf_size&&(U(n,255&e.adler),U(n,e.adler>>8&255),e.adler=0,n.status=E)):n.status=E),0!==n.pending){if(F(e),0===e.avail_out)return n.last_flush=-1,m}else if(0===e.avail_in&&T(t)<=T(r)&&t!==f)return R(e,-5);if(666===n.status&&0!==e.avail_in)return R(e,-5);if(0!==e.avail_in||0!==n.lookahead||t!==l&&666!==n.status){var o=2===n.strategy?function(e,t){for(var r;;){if(0===e.lookahead&&(j(e),0===e.lookahead)){if(t===l)return A;break}if(e.match_length=0,r=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,r&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}(n,t):3===n.strategy?function(e,t){for(var r,n,i,s,a=e.window;;){if(e.lookahead<=S){if(j(e),e.lookahead<=S&&t===l)return A;if(0===e.lookahead)break}if(e.match_length=0,e.lookahead>=x&&0<e.strstart&&(n=a[i=e.strstart-1])===a[++i]&&n===a[++i]&&n===a[++i]){s=e.strstart+S;do{}while(n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&i<s);e.match_length=S-(s-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=x?(r=u._tr_tally(e,1,e.match_length-x),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(r=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),r&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}(n,t):h[n.level].func(n,t);if(o!==O&&o!==B||(n.status=666),o===A||o===O)return 0===e.avail_out&&(n.last_flush=-1),m;if(o===I&&(1===t?u._tr_align(n):5!==t&&(u._tr_stored_block(n,0,0,!1),3===t&&(D(n.head),0===n.lookahead&&(n.strstart=0,n.block_start=0,n.insert=0))),F(e),0===e.avail_out))return n.last_flush=-1,m}return t!==f?m:n.wrap<=0?1:(2===n.wrap?(U(n,255&e.adler),U(n,e.adler>>8&255),U(n,e.adler>>16&255),U(n,e.adler>>24&255),U(n,255&e.total_in),U(n,e.total_in>>8&255),U(n,e.total_in>>16&255),U(n,e.total_in>>24&255)):(P(n,e.adler>>>16),P(n,65535&e.adler)),F(e),0<n.wrap&&(n.wrap=-n.wrap),0!==n.pending?m:1)},r.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==C&&69!==t&&73!==t&&91!==t&&103!==t&&t!==E&&666!==t?R(e,_):(e.state=null,t===E?R(e,-3):m):_},r.deflateSetDictionary=function(e,t){var r,n,i,s,a,o,h,u,l=t.length;if(!e||!e.state)return _;if(2===(s=(r=e.state).wrap)||1===s&&r.status!==C||r.lookahead)return _;for(1===s&&(e.adler=d(e.adler,t,l,0)),r.wrap=0,l>=r.w_size&&(0===s&&(D(r.head),r.strstart=0,r.block_start=0,r.insert=0),u=new c.Buf8(r.w_size),c.arraySet(u,t,l-r.w_size,r.w_size,0),t=u,l=r.w_size),a=e.avail_in,o=e.next_in,h=e.input,e.avail_in=l,e.next_in=0,e.input=t,j(r);r.lookahead>=x;){for(n=r.strstart,i=r.lookahead-(x-1);r.ins_h=(r.ins_h<<r.hash_shift^r.window[n+x-1])&r.hash_mask,r.prev[n&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=n,n++,--i;);r.strstart=n,r.lookahead=x-1,j(r)}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=x-1,r.match_available=0,e.next_in=o,e.input=h,e.avail_in=a,r.wrap=s,m},r.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,r){"use strict";t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(e,t,r){"use strict";t.exports=function(e,t){var r,n,i,s,a,o,h,u,l,f,c,d,p,m,_,g,b,v,y,w,k,x,S,z,C;r=e.state,n=e.next_in,z=e.input,i=n+(e.avail_in-5),s=e.next_out,C=e.output,a=s-(t-e.avail_out),o=s+(e.avail_out-257),h=r.dmax,u=r.wsize,l=r.whave,f=r.wnext,c=r.window,d=r.hold,p=r.bits,m=r.lencode,_=r.distcode,g=(1<<r.lenbits)-1,b=(1<<r.distbits)-1;e:do{p<15&&(d+=z[n++]<<p,p+=8,d+=z[n++]<<p,p+=8),v=m[d&g];t:for(;;){if(d>>>=y=v>>>24,p-=y,0===(y=v>>>16&255))C[s++]=65535&v;else{if(!(16&y)){if(0==(64&y)){v=m[(65535&v)+(d&(1<<y)-1)];continue t}if(32&y){r.mode=12;break e}e.msg="invalid literal/length code",r.mode=30;break e}w=65535&v,(y&=15)&&(p<y&&(d+=z[n++]<<p,p+=8),w+=d&(1<<y)-1,d>>>=y,p-=y),p<15&&(d+=z[n++]<<p,p+=8,d+=z[n++]<<p,p+=8),v=_[d&b];r:for(;;){if(d>>>=y=v>>>24,p-=y,!(16&(y=v>>>16&255))){if(0==(64&y)){v=_[(65535&v)+(d&(1<<y)-1)];continue r}e.msg="invalid distance code",r.mode=30;break e}if(k=65535&v,p<(y&=15)&&(d+=z[n++]<<p,(p+=8)<y&&(d+=z[n++]<<p,p+=8)),h<(k+=d&(1<<y)-1)){e.msg="invalid distance too far back",r.mode=30;break e}if(d>>>=y,p-=y,(y=s-a)<k){if(l<(y=k-y)&&r.sane){e.msg="invalid distance too far back",r.mode=30;break e}if(S=c,(x=0)===f){if(x+=u-y,y<w){for(w-=y;C[s++]=c[x++],--y;);x=s-k,S=C}}else if(f<y){if(x+=u+f-y,(y-=f)<w){for(w-=y;C[s++]=c[x++],--y;);if(x=0,f<w){for(w-=y=f;C[s++]=c[x++],--y;);x=s-k,S=C}}}else if(x+=f-y,y<w){for(w-=y;C[s++]=c[x++],--y;);x=s-k,S=C}for(;2<w;)C[s++]=S[x++],C[s++]=S[x++],C[s++]=S[x++],w-=3;w&&(C[s++]=S[x++],1<w&&(C[s++]=S[x++]))}else{for(x=s-k;C[s++]=C[x++],C[s++]=C[x++],C[s++]=C[x++],2<(w-=3););w&&(C[s++]=C[x++],1<w&&(C[s++]=C[x++]))}break}}break}}while(n<i&&s<o);n-=w=p>>3,d&=(1<<(p-=w<<3))-1,e.next_in=n,e.next_out=s,e.avail_in=n<i?i-n+5:5-(n-i),e.avail_out=s<o?o-s+257:257-(s-o),r.hold=d,r.bits=p}},{}],49:[function(e,t,r){"use strict";var I=e("../utils/common"),O=e("./adler32"),B=e("./crc32"),R=e("./inffast"),T=e("./inftrees"),D=1,F=2,N=0,U=-2,P=1,n=852,i=592;function L(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function s(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new I.Buf16(320),this.work=new I.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function a(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=P,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new I.Buf32(n),t.distcode=t.distdyn=new I.Buf32(i),t.sane=1,t.back=-1,N):U}function o(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,a(e)):U}function h(e,t){var r,n;return e&&e.state?(n=e.state,t<0?(r=0,t=-t):(r=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?U:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=r,n.wbits=t,o(e))):U}function u(e,t){var r,n;return e?(n=new s,(e.state=n).window=null,(r=h(e,t))!==N&&(e.state=null),r):U}var l,f,c=!0;function j(e){if(c){var t;for(l=new I.Buf32(512),f=new I.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(T(D,e.lens,0,288,l,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;T(F,e.lens,0,32,f,0,e.work,{bits:5}),c=!1}e.lencode=l,e.lenbits=9,e.distcode=f,e.distbits=5}function Z(e,t,r,n){var i,s=e.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new I.Buf8(s.wsize)),n>=s.wsize?(I.arraySet(s.window,t,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(n<(i=s.wsize-s.wnext)&&(i=n),I.arraySet(s.window,t,r-n,i,s.wnext),(n-=i)?(I.arraySet(s.window,t,r-n,n,0),s.wnext=n,s.whave=s.wsize):(s.wnext+=i,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=i))),0}r.inflateReset=o,r.inflateReset2=h,r.inflateResetKeep=a,r.inflateInit=function(e){return u(e,15)},r.inflateInit2=u,r.inflate=function(e,t){var r,n,i,s,a,o,h,u,l,f,c,d,p,m,_,g,b,v,y,w,k,x,S,z,C=0,E=new I.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;12===(r=e.state).mode&&(r.mode=13),a=e.next_out,i=e.output,h=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,u=r.hold,l=r.bits,f=o,c=h,x=N;e:for(;;)switch(r.mode){case P:if(0===r.wrap){r.mode=13;break}for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(2&r.wrap&&35615===u){E[r.check=0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0),l=u=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&u)<<8)+(u>>8))%31){e.msg="incorrect header check",r.mode=30;break}if(8!=(15&u)){e.msg="unknown compression method",r.mode=30;break}if(l-=4,k=8+(15&(u>>>=4)),0===r.wbits)r.wbits=k;else if(k>r.wbits){e.msg="invalid window size",r.mode=30;break}r.dmax=1<<k,e.adler=r.check=1,r.mode=512&u?10:12,l=u=0;break;case 2:for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(r.flags=u,8!=(255&r.flags)){e.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){e.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=u>>8&1),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=3;case 3:for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.head&&(r.head.time=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,E[2]=u>>>16&255,E[3]=u>>>24&255,r.check=B(r.check,E,4,0)),l=u=0,r.mode=4;case 4:for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.head&&(r.head.xflags=255&u,r.head.os=u>>8),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=5;case 5:if(1024&r.flags){for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.length=u,r.head&&(r.head.extra_len=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(o<(d=r.length)&&(d=o),d&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),I.arraySet(r.head.extra,n,s,d,k)),512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,r.length-=d),r.length))break e;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break e;for(d=0;k=n[s+d++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k)),k&&d<o;);if(512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,k)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break e;for(d=0;k=n[s+d++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k)),k&&d<o;);if(512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,k)break e}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(u!==(65535&r.check)){e.msg="header crc mismatch",r.mode=30;break}l=u=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),e.adler=r.check=0,r.mode=12;break;case 10:for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}e.adler=r.check=L(u),l=u=0,r.mode=11;case 11:if(0===r.havedict)return e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,2;e.adler=r.check=1,r.mode=12;case 12:if(5===t||6===t)break e;case 13:if(r.last){u>>>=7&l,l-=7&l,r.mode=27;break}for(;l<3;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}switch(r.last=1&u,l-=1,3&(u>>>=1)){case 0:r.mode=14;break;case 1:if(j(r),r.mode=20,6!==t)break;u>>>=2,l-=2;break e;case 2:r.mode=17;break;case 3:e.msg="invalid block type",r.mode=30}u>>>=2,l-=2;break;case 14:for(u>>>=7&l,l-=7&l;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if((65535&u)!=(u>>>16^65535)){e.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&u,l=u=0,r.mode=15,6===t)break e;case 15:r.mode=16;case 16:if(d=r.length){if(o<d&&(d=o),h<d&&(d=h),0===d)break e;I.arraySet(i,n,s,d,a),o-=d,s+=d,h-=d,a+=d,r.length-=d;break}r.mode=12;break;case 17:for(;l<14;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(r.nlen=257+(31&u),u>>>=5,l-=5,r.ndist=1+(31&u),u>>>=5,l-=5,r.ncode=4+(15&u),u>>>=4,l-=4,286<r.nlen||30<r.ndist){e.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;l<3;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.lens[A[r.have++]]=7&u,u>>>=3,l-=3}for(;r.have<19;)r.lens[A[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},x=T(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(b<16)u>>>=_,l-=_,r.lens[r.have++]=b;else{if(16===b){for(z=_+2;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(u>>>=_,l-=_,0===r.have){e.msg="invalid bit length repeat",r.mode=30;break}k=r.lens[r.have-1],d=3+(3&u),u>>>=2,l-=2}else if(17===b){for(z=_+3;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}l-=_,k=0,d=3+(7&(u>>>=_)),u>>>=3,l-=3}else{for(z=_+7;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}l-=_,k=0,d=11+(127&(u>>>=_)),u>>>=7,l-=7}if(r.have+d>r.nlen+r.ndist){e.msg="invalid bit length repeat",r.mode=30;break}for(;d--;)r.lens[r.have++]=k}}if(30===r.mode)break;if(0===r.lens[256]){e.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,S={bits:r.lenbits},x=T(D,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},x=T(F,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,x){e.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===t)break e;case 20:r.mode=21;case 21:if(6<=o&&258<=h){e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,R(e,c),a=e.next_out,i=e.output,h=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,u=r.hold,l=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(g&&0==(240&g)){for(v=_,y=g,w=b;g=(C=r.lencode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,r.length=b,0===g){r.mode=26;break}if(32&g){r.back=-1,r.mode=12;break}if(64&g){e.msg="invalid literal/length code",r.mode=30;break}r.extra=15&g,r.mode=22;case 22:if(r.extra){for(z=r.extra;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.length+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=23;case 23:for(;g=(C=r.distcode[u&(1<<r.distbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(0==(240&g)){for(v=_,y=g,w=b;g=(C=r.distcode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,64&g){e.msg="invalid distance code",r.mode=30;break}r.offset=b,r.extra=15&g,r.mode=24;case 24:if(r.extra){for(z=r.extra;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.offset+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){e.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===h)break e;if(d=c-h,r.offset>d){if((d=r.offset-d)>r.whave&&r.sane){e.msg="invalid distance too far back",r.mode=30;break}p=d>r.wnext?(d-=r.wnext,r.wsize-d):r.wnext-d,d>r.length&&(d=r.length),m=r.window}else m=i,p=a-r.offset,d=r.length;for(h<d&&(d=h),h-=d,r.length-=d;i[a++]=m[p++],--d;);0===r.length&&(r.mode=21);break;case 26:if(0===h)break e;i[a++]=r.length,h--,r.mode=21;break;case 27:if(r.wrap){for(;l<32;){if(0===o)break e;o--,u|=n[s++]<<l,l+=8}if(c-=h,e.total_out+=c,r.total+=c,c&&(e.adler=r.check=r.flags?B(r.check,i,c,a-c):O(r.check,i,c,a-c)),c=h,(r.flags?u:L(u))!==r.check){e.msg="incorrect data check",r.mode=30;break}l=u=0}r.mode=28;case 28:if(r.wrap&&r.flags){for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(u!==(4294967295&r.total)){e.msg="incorrect length check",r.mode=30;break}l=u=0}r.mode=29;case 29:x=1;break e;case 30:x=-3;break e;case 31:return-4;case 32:default:return U}return e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,(r.wsize||c!==e.avail_out&&r.mode<30&&(r.mode<27||4!==t))&&Z(e,e.output,e.next_out,c-e.avail_out)?(r.mode=31,-4):(f-=e.avail_in,c-=e.avail_out,e.total_in+=f,e.total_out+=c,r.total+=c,r.wrap&&c&&(e.adler=r.check=r.flags?B(r.check,i,c,e.next_out-c):O(r.check,i,c,e.next_out-c)),e.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==f&&0===c||4===t)&&x===N&&(x=-5),x)},r.inflateEnd=function(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,N},r.inflateGetHeader=function(e,t){var r;return e&&e.state?0==(2&(r=e.state).wrap)?U:((r.head=t).done=!1,N):U},r.inflateSetDictionary=function(e,t){var r,n=t.length;return e&&e.state?0!==(r=e.state).wrap&&11!==r.mode?U:11===r.mode&&O(1,t,n,0)!==r.check?-3:Z(e,t,n,n)?(r.mode=31,-4):(r.havedict=1,N):U},r.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,r){"use strict";var D=e("../utils/common"),F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],N=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],P=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,r,n,i,s,a,o){var h,u,l,f,c,d,p,m,_,g=o.bits,b=0,v=0,y=0,w=0,k=0,x=0,S=0,z=0,C=0,E=0,A=null,I=0,O=new D.Buf16(16),B=new D.Buf16(16),R=null,T=0;for(b=0;b<=15;b++)O[b]=0;for(v=0;v<n;v++)O[t[r+v]]++;for(k=g,w=15;1<=w&&0===O[w];w--);if(w<k&&(k=w),0===w)return i[s++]=20971520,i[s++]=20971520,o.bits=1,0;for(y=1;y<w&&0===O[y];y++);for(k<y&&(k=y),b=z=1;b<=15;b++)if(z<<=1,(z-=O[b])<0)return-1;if(0<z&&(0===e||1!==w))return-1;for(B[1]=0,b=1;b<15;b++)B[b+1]=B[b]+O[b];for(v=0;v<n;v++)0!==t[r+v]&&(a[B[t[r+v]]++]=v);if(d=0===e?(A=R=a,19):1===e?(A=F,I-=257,R=N,T-=257,256):(A=U,R=P,-1),b=y,c=s,S=v=E=0,l=-1,f=(C=1<<(x=k))-1,1===e&&852<C||2===e&&592<C)return 1;for(;;){for(p=b-S,_=a[v]<d?(m=0,a[v]):a[v]>d?(m=R[T+a[v]],A[I+a[v]]):(m=96,0),h=1<<b-S,y=u=1<<x;i[c+(E>>S)+(u-=h)]=p<<24|m<<16|_|0,0!==u;);for(h=1<<b-1;E&h;)h>>=1;if(0!==h?(E&=h-1,E+=h):E=0,v++,0==--O[b]){if(b===w)break;b=t[r+a[v]]}if(k<b&&(E&f)!==l){for(0===S&&(S=k),c+=y,z=1<<(x=b-S);x+S<w&&!((z-=O[x+S])<=0);)x++,z<<=1;if(C+=1<<x,1===e&&852<C||2===e&&592<C)return 1;i[l=E&f]=k<<24|x<<16|c-s|0}}return 0!==E&&(i[c+E]=b-S<<24|64<<16|0),o.bits=k,0}},{"../utils/common":41}],51:[function(e,t,r){"use strict";t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(e,t,r){"use strict";var i=e("../utils/common"),o=0,h=1;function n(e){for(var t=e.length;0<=--t;)e[t]=0}var s=0,a=29,u=256,l=u+1+a,f=30,c=19,_=2*l+1,g=15,d=16,p=7,m=256,b=16,v=17,y=18,w=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],k=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],x=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],S=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],z=new Array(2*(l+2));n(z);var C=new Array(2*f);n(C);var E=new Array(512);n(E);var A=new Array(256);n(A);var I=new Array(a);n(I);var O,B,R,T=new Array(f);function D(e,t,r,n,i){this.static_tree=e,this.extra_bits=t,this.extra_base=r,this.elems=n,this.max_length=i,this.has_stree=e&&e.length}function F(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t}function N(e){return e<256?E[e]:E[256+(e>>>7)]}function U(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255}function P(e,t,r){e.bi_valid>d-r?(e.bi_buf|=t<<e.bi_valid&65535,U(e,e.bi_buf),e.bi_buf=t>>d-e.bi_valid,e.bi_valid+=r-d):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=r)}function L(e,t,r){P(e,r[2*t],r[2*t+1])}function j(e,t){for(var r=0;r|=1&e,e>>>=1,r<<=1,0<--t;);return r>>>1}function Z(e,t,r){var n,i,s=new Array(g+1),a=0;for(n=1;n<=g;n++)s[n]=a=a+r[n-1]<<1;for(i=0;i<=t;i++){var o=e[2*i+1];0!==o&&(e[2*i]=j(s[o]++,o))}}function W(e){var t;for(t=0;t<l;t++)e.dyn_ltree[2*t]=0;for(t=0;t<f;t++)e.dyn_dtree[2*t]=0;for(t=0;t<c;t++)e.bl_tree[2*t]=0;e.dyn_ltree[2*m]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0}function M(e){8<e.bi_valid?U(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0}function H(e,t,r,n){var i=2*t,s=2*r;return e[i]<e[s]||e[i]===e[s]&&n[t]<=n[r]}function G(e,t,r){for(var n=e.heap[r],i=r<<1;i<=e.heap_len&&(i<e.heap_len&&H(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!H(t,n,e.heap[i],e.depth));)e.heap[r]=e.heap[i],r=i,i<<=1;e.heap[r]=n}function K(e,t,r){var n,i,s,a,o=0;if(0!==e.last_lit)for(;n=e.pending_buf[e.d_buf+2*o]<<8|e.pending_buf[e.d_buf+2*o+1],i=e.pending_buf[e.l_buf+o],o++,0===n?L(e,i,t):(L(e,(s=A[i])+u+1,t),0!==(a=w[s])&&P(e,i-=I[s],a),L(e,s=N(--n),r),0!==(a=k[s])&&P(e,n-=T[s],a)),o<e.last_lit;);L(e,m,t)}function Y(e,t){var r,n,i,s=t.dyn_tree,a=t.stat_desc.static_tree,o=t.stat_desc.has_stree,h=t.stat_desc.elems,u=-1;for(e.heap_len=0,e.heap_max=_,r=0;r<h;r++)0!==s[2*r]?(e.heap[++e.heap_len]=u=r,e.depth[r]=0):s[2*r+1]=0;for(;e.heap_len<2;)s[2*(i=e.heap[++e.heap_len]=u<2?++u:0)]=1,e.depth[i]=0,e.opt_len--,o&&(e.static_len-=a[2*i+1]);for(t.max_code=u,r=e.heap_len>>1;1<=r;r--)G(e,s,r);for(i=h;r=e.heap[1],e.heap[1]=e.heap[e.heap_len--],G(e,s,1),n=e.heap[1],e.heap[--e.heap_max]=r,e.heap[--e.heap_max]=n,s[2*i]=s[2*r]+s[2*n],e.depth[i]=(e.depth[r]>=e.depth[n]?e.depth[r]:e.depth[n])+1,s[2*r+1]=s[2*n+1]=i,e.heap[1]=i++,G(e,s,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var r,n,i,s,a,o,h=t.dyn_tree,u=t.max_code,l=t.stat_desc.static_tree,f=t.stat_desc.has_stree,c=t.stat_desc.extra_bits,d=t.stat_desc.extra_base,p=t.stat_desc.max_length,m=0;for(s=0;s<=g;s++)e.bl_count[s]=0;for(h[2*e.heap[e.heap_max]+1]=0,r=e.heap_max+1;r<_;r++)p<(s=h[2*h[2*(n=e.heap[r])+1]+1]+1)&&(s=p,m++),h[2*n+1]=s,u<n||(e.bl_count[s]++,a=0,d<=n&&(a=c[n-d]),o=h[2*n],e.opt_len+=o*(s+a),f&&(e.static_len+=o*(l[2*n+1]+a)));if(0!==m){do{for(s=p-1;0===e.bl_count[s];)s--;e.bl_count[s]--,e.bl_count[s+1]+=2,e.bl_count[p]--,m-=2}while(0<m);for(s=p;0!==s;s--)for(n=e.bl_count[s];0!==n;)u<(i=e.heap[--r])||(h[2*i+1]!==s&&(e.opt_len+=(s-h[2*i+1])*h[2*i],h[2*i+1]=s),n--)}}(e,t),Z(s,u,e.bl_count)}function X(e,t,r){var n,i,s=-1,a=t[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),t[2*(r+1)+1]=65535,n=0;n<=r;n++)i=a,a=t[2*(n+1)+1],++o<h&&i===a||(o<u?e.bl_tree[2*i]+=o:0!==i?(i!==s&&e.bl_tree[2*i]++,e.bl_tree[2*b]++):o<=10?e.bl_tree[2*v]++:e.bl_tree[2*y]++,s=i,u=(o=0)===a?(h=138,3):i===a?(h=6,3):(h=7,4))}function V(e,t,r){var n,i,s=-1,a=t[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),n=0;n<=r;n++)if(i=a,a=t[2*(n+1)+1],!(++o<h&&i===a)){if(o<u)for(;L(e,i,e.bl_tree),0!=--o;);else 0!==i?(i!==s&&(L(e,i,e.bl_tree),o--),L(e,b,e.bl_tree),P(e,o-3,2)):o<=10?(L(e,v,e.bl_tree),P(e,o-3,3)):(L(e,y,e.bl_tree),P(e,o-11,7));s=i,u=(o=0)===a?(h=138,3):i===a?(h=6,3):(h=7,4)}}n(T);var q=!1;function J(e,t,r,n){P(e,(s<<1)+(n?1:0),3),function(e,t,r,n){M(e),n&&(U(e,r),U(e,~r)),i.arraySet(e.pending_buf,e.window,t,r,e.pending),e.pending+=r}(e,t,r,!0)}r._tr_init=function(e){q||(function(){var e,t,r,n,i,s=new Array(g+1);for(n=r=0;n<a-1;n++)for(I[n]=r,e=0;e<1<<w[n];e++)A[r++]=n;for(A[r-1]=n,n=i=0;n<16;n++)for(T[n]=i,e=0;e<1<<k[n];e++)E[i++]=n;for(i>>=7;n<f;n++)for(T[n]=i<<7,e=0;e<1<<k[n]-7;e++)E[256+i++]=n;for(t=0;t<=g;t++)s[t]=0;for(e=0;e<=143;)z[2*e+1]=8,e++,s[8]++;for(;e<=255;)z[2*e+1]=9,e++,s[9]++;for(;e<=279;)z[2*e+1]=7,e++,s[7]++;for(;e<=287;)z[2*e+1]=8,e++,s[8]++;for(Z(z,l+1,s),e=0;e<f;e++)C[2*e+1]=5,C[2*e]=j(e,5);O=new D(z,w,u+1,l,g),B=new D(C,k,0,f,g),R=new D(new Array(0),x,0,c,p)}(),q=!0),e.l_desc=new F(e.dyn_ltree,O),e.d_desc=new F(e.dyn_dtree,B),e.bl_desc=new F(e.bl_tree,R),e.bi_buf=0,e.bi_valid=0,W(e)},r._tr_stored_block=J,r._tr_flush_block=function(e,t,r,n){var i,s,a=0;0<e.level?(2===e.strm.data_type&&(e.strm.data_type=function(e){var t,r=4093624447;for(t=0;t<=31;t++,r>>>=1)if(1&r&&0!==e.dyn_ltree[2*t])return o;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return h;for(t=32;t<u;t++)if(0!==e.dyn_ltree[2*t])return h;return o}(e)),Y(e,e.l_desc),Y(e,e.d_desc),a=function(e){var t;for(X(e,e.dyn_ltree,e.l_desc.max_code),X(e,e.dyn_dtree,e.d_desc.max_code),Y(e,e.bl_desc),t=c-1;3<=t&&0===e.bl_tree[2*S[t]+1];t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),i=e.opt_len+3+7>>>3,(s=e.static_len+3+7>>>3)<=i&&(i=s)):i=s=r+5,r+4<=i&&-1!==t?J(e,t,r,n):4===e.strategy||s===i?(P(e,2+(n?1:0),3),K(e,z,C)):(P(e,4+(n?1:0),3),function(e,t,r,n){var i;for(P(e,t-257,5),P(e,r-1,5),P(e,n-4,4),i=0;i<n;i++)P(e,e.bl_tree[2*S[i]+1],3);V(e,e.dyn_ltree,t-1),V(e,e.dyn_dtree,r-1)}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,a+1),K(e,e.dyn_ltree,e.dyn_dtree)),W(e),n&&M(e)},r._tr_tally=function(e,t,r){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&r,e.last_lit++,0===t?e.dyn_ltree[2*r]++:(e.matches++,t--,e.dyn_ltree[2*(A[r]+u+1)]++,e.dyn_dtree[2*N(t)]++),e.last_lit===e.lit_bufsize-1},r._tr_align=function(e){P(e,2,3),L(e,m,z),function(e){16===e.bi_valid?(U(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):8<=e.bi_valid&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)}(e)}},{"../utils/common":41}],53:[function(e,t,r){"use strict";t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,t,r){(function(e){!function(r,n){"use strict";if(!r.setImmediate){var i,s,t,a,o=1,h={},u=!1,l=r.document,e=Object.getPrototypeOf&&Object.getPrototypeOf(r);e=e&&e.setTimeout?e:r,i="[object process]"==={}.toString.call(r.process)?function(e){process.nextTick(function(){c(e)})}:function(){if(r.postMessage&&!r.importScripts){var e=!0,t=r.onmessage;return r.onmessage=function(){e=!1},r.postMessage("","*"),r.onmessage=t,e}}()?(a="setImmediate$"+Math.random()+"$",r.addEventListener?r.addEventListener("message",d,!1):r.attachEvent("onmessage",d),function(e){r.postMessage(a+e,"*")}):r.MessageChannel?((t=new MessageChannel).port1.onmessage=function(e){c(e.data)},function(e){t.port2.postMessage(e)}):l&&"onreadystatechange"in l.createElement("script")?(s=l.documentElement,function(e){var t=l.createElement("script");t.onreadystatechange=function(){c(e),t.onreadystatechange=null,s.removeChild(t),t=null},s.appendChild(t)}):function(e){setTimeout(c,0,e)},e.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),r=0;r<t.length;r++)t[r]=arguments[r+1];var n={callback:e,args:t};return h[o]=n,i(o),o++},e.clearImmediate=f}function f(e){delete h[e]}function c(e){if(u)setTimeout(c,0,e);else{var t=h[e];if(t){u=!0;try{!function(e){var t=e.callback,r=e.args;switch(r.length){case 0:t();break;case 1:t(r[0]);break;case 2:t(r[0],r[1]);break;case 3:t(r[0],r[1],r[2]);break;default:t.apply(n,r)}}(t)}finally{f(e),u=!1}}}}function d(e){e.source===r&&"string"==typeof e.data&&0===e.data.indexOf(a)&&c(+e.data.slice(a.length))}}("undefined"==typeof self?void 0===e?this:e:self)}).call(this,"undefined"!=typeof __webpack_require__.g?__webpack_require__.g:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[10])(10)});

},
"./node_modules/@x8r/sapphire/src/SapphirePlugin.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  SapphireContentScriptPlugin: () => (SapphireContentScriptPlugin)
});
/* import */ var _mercuryworkshop_scramjet_controller__rspack_import_0 = __webpack_require__("./node_modules/@mercuryworkshop/scramjet-controller/dist/controller-external.mjs");
/* import */ var _contentScripts__rspack_import_1 = __webpack_require__("./node_modules/@x8r/sapphire/src/contentScripts.ts");


class SapphireContentScriptPlugin extends _mercuryworkshop_scramjet_controller__rspack_import_0.ManagedPlugin {
    sapphire;
    tabId;
    constructor(sapphire, tabId){
        super("sapphire-content-scripts", []);
        this.sapphire = sapphire;
        this.tabId = tabId;
    }
    install(frame) {
        this.tap(frame.hooks.init.pre, (ctx)=>{
            if (!ctx?.window) return;
            const url = ctx.window.location.href;
            void (0,_contentScripts__rspack_import_1.injectContentScripts)(ctx.window, this.tabId, url, ctx.isTopLevel, this.sapphire.registry, this.sapphire.host);
        });
    }
}


},
"./node_modules/@x8r/sapphire/src/autoStub.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  withMissingMemberFallback: () => (withMissingMemberFallback)
});
const wrapCache = new WeakMap();
function withMissingMemberFallback(real) {
    const cached = wrapCache.get(real);
    if (cached) return cached;
    const proxy = new Proxy(real, {
        get (target, prop, receiver) {
            if (prop in target) {
                const value = Reflect.get(target, prop, receiver);
                if (value !== null && typeof value === "object" && !Array.isArray(value)) {
                    return withMissingMemberFallback(value);
                }
                return value;
            }
            if (typeof prop !== "string") return undefined;
            return createAutoStub();
        }
    });
    wrapCache.set(real, proxy);
    return proxy;
}
function createAutoStub() {
    const cache = new Map();
    const target = ()=>{};
    return new Proxy(target, {
        get (_t, prop) {
            if (prop === Symbol.toPrimitive) {
                return (hint)=>hint === "number" ? 0 : "";
            }
            if (typeof prop !== "string") return undefined;
            if (prop === "toJSON") return undefined;
            if (prop === "valueOf") return ()=>0;
            if (prop === "toString") return ()=>"";
            if (prop === "then") {
                return (resolve)=>resolve?.(undefined);
            }
            const cached = cache.get(prop);
            if (cached !== undefined) return cached;
            let value;
            if (prop === "addListener" || prop === "removeListener") value = ()=>{};
            else if (prop === "hasListener") value = ()=>false;
            else value = createAutoStub();
            cache.set(prop, value);
            return value;
        },
        apply (_t, _thisArg, args) {
            const cb = args[args.length - 1];
            if (typeof cb === "function") {
                try {
                    cb(undefined);
                } catch  {}
            }
            return createAutoStub();
        }
    });
}


},
"./node_modules/@x8r/sapphire/src/background.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  startBackground: () => (startBackground),
  stopBackground: () => (stopBackground)
});
/* import */ var _chromeApi__rspack_import_0 = __webpack_require__("./node_modules/@x8r/sapphire/src/chromeApi.ts");
/* import */ var _fileStore__rspack_import_1 = __webpack_require__("./node_modules/@x8r/sapphire/src/fileStore.ts");
/* import */ var _htmlInject__rspack_import_2 = __webpack_require__("./node_modules/@x8r/sapphire/src/htmlInject.ts");
/* import */ var _manifest__rspack_import_3 = __webpack_require__("./node_modules/@x8r/sapphire/src/manifest.ts");
/* import */ var _urlScheme__rspack_import_4 = __webpack_require__("./node_modules/@x8r/sapphire/src/urlScheme.ts");





function stopBackground(ext) {
    if (ext.background?.kind === "frame") ext.background.frame?.remove();
    if (ext.background?.kind === "worker") ext.background.worker?.terminate();
    ext.background = null;
}
async function startBackground(ext, registry, host, rootEl) {
    const bgInfo = (0,_manifest__rspack_import_3.getBackgroundInfo)(ext.manifest);
    if (!bgInfo) return;
    stopBackground(ext);
    const frame = document.createElement("iframe");
    frame.style.cssText = "position:fixed;width:0;height:0;border:none;opacity:0;pointer-events:none;z-index:-1;";
    frame.setAttribute("sandbox", "allow-scripts allow-same-origin");
    frame.setAttribute("aria-hidden", "true");
    rootEl.appendChild(frame);
    let win;
    try {
        win = await (0,_htmlInject__rspack_import_2.bootstrapExtensionFrame)(frame, ext.id);
    } catch (e) {
        console.error(`[sapphire] failed to bootstrap background frame for ${ext.manifest.name}`, e);
        frame.remove();
        return;
    }
    const backgroundPath = bgInfo.type === "page" ? bgInfo.page : bgInfo.type === "worker" ? bgInfo.script : bgInfo.scripts[0];
    const events = (0,_chromeApi__rspack_import_0.installChromeApi)(win, {
        extId: ext.id,
        tabId: null,
        isBackground: true,
        registry,
        host,
        senderUrl: backgroundPath ? (0,_urlScheme__rspack_import_4.chromeExtensionUrl)(ext.id, backgroundPath) : undefined
    });
    ext.background = {
        kind: "frame",
        frame,
        events
    };
    if (bgInfo.type === "page") {
        const raw = await (0,_fileStore__rspack_import_1.readExtFileText)(ext.id, bgInfo.page);
        const html = raw !== null ? await (0,_htmlInject__rspack_import_2.rewriteExtHtml)(ext.id, raw, bgInfo.page) : "<!DOCTYPE html><html><head></head><body></body></html>";
        (0,_htmlInject__rspack_import_2.writeDocument)(win, html);
    } else {
        (0,_htmlInject__rspack_import_2.writeDocument)(win, "<!DOCTYPE html><html><head></head><body></body></html>");
        const scriptPaths = bgInfo.type === "worker" ? [
            bgInfo.script
        ] : bgInfo.scripts;
        const isModule = bgInfo.type === "worker" && bgInfo.isModule;
        for (const path of scriptPaths){
            await (0,_htmlInject__rspack_import_2.injectScriptFromUrl)(win, (0,_urlScheme__rspack_import_4.buildExtensionUrl)(ext.id, path), isModule);
        }
    }
    events.runtimeOnInstalled.fire({
        reason: "install"
    });
    events.runtimeOnStartup.fire();
}


},
"./node_modules/@x8r/sapphire/src/chromeApi.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  buildTabObject: () => (buildTabObject),
  installChromeApi: () => (installChromeApi)
});
/* import */ var _autoStub__rspack_import_0 = __webpack_require__("./node_modules/@x8r/sapphire/src/autoStub.ts");
/* import */ var _db__rspack_import_1 = __webpack_require__("./node_modules/@x8r/sapphire/src/db.ts");
/* import */ var _fileStore__rspack_import_2 = __webpack_require__("./node_modules/@x8r/sapphire/src/fileStore.ts");
/* import */ var _registry__rspack_import_3 = __webpack_require__("./node_modules/@x8r/sapphire/src/registry.ts");
/* import */ var _dnr__rspack_import_4 = __webpack_require__("./node_modules/@x8r/sapphire/src/dnr.ts");
/* import */ var _eventHub__rspack_import_5 = __webpack_require__("./node_modules/@x8r/sapphire/src/eventHub.ts");
/* import */ var _htmlInject__rspack_import_6 = __webpack_require__("./node_modules/@x8r/sapphire/src/htmlInject.ts");
/* import */ var _urlScheme__rspack_import_7 = __webpack_require__("./node_modules/@x8r/sapphire/src/urlScheme.ts");








let sapphireTraceCallCounter = 0;
function sapphireTraceLog(...args) {
    if (globalThis.SAPPHIRE_TRACE) console.debug("[sapphire-trace]", ...args);
}
function traceCalls(obj, path = "") {
    return new Proxy(obj, {
        get (target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);
            if (typeof prop !== "string") return value;
            const fullPath = path ? `${path}.${prop}` : prop;
            if (typeof value === "function") {
                return new Proxy(value, {
                    apply (fnTarget, thisArg, args) {
                        const callId = ++sapphireTraceCallCounter;
                        sapphireTraceLog(`#${callId} call ${fullPath}(`, args, `)`);
                        const result = Reflect.apply(fnTarget, thisArg, args);
                        if (result && typeof result.then === "function") {
                            result.then((r)=>sapphireTraceLog(`#${callId} resolved ${fullPath} =>`, r), (e)=>sapphireTraceLog(`#${callId} REJECTED ${fullPath} =>`, e));
                        }
                        return result;
                    },
                    get (fnTarget, fnProp, fnReceiver) {
                        const fnValue = Reflect.get(fnTarget, fnProp, fnReceiver);
                        if (typeof fnProp !== "string") return fnValue;
                        if (typeof fnValue === "object" && fnValue !== null) return traceCalls(fnValue, `${fullPath}.${fnProp}`);
                        return fnValue;
                    }
                });
            }
            if (value && typeof value === "object") return traceCalls(value, fullPath);
            return value;
        }
    });
}
function cloneForRealm(realm, value) {
    if (!realm) return value;
    try {
        return realm.structuredClone(value);
    } catch  {
        return value;
    }
}
function buildTabObject(host, tabId, realm) {
    if (tabId === null) return null;
    const tab = host.getTab(tabId);
    if (!tab) return null;
    const activeId = host.getActiveTabId?.() ?? null;
    const obj = {
        id: tab.id,
        index: Math.max(0, tab.id - 1),
        windowId: tab.windowId,
        highlighted: tab.active,
        active: tab.active || tab.id === activeId,
        pinned: false,
        audible: false,
        discarded: false,
        autoDiscardable: false,
        mutedInfo: {
            muted: false
        },
        url: tab.url,
        title: tab.title,
        favIconUrl: "",
        status: "complete",
        incognito: false,
        width: 800,
        height: 600
    };
    return cloneForRealm(realm, obj);
}
function openUrlInTab(host, tabId, url) {
    const decoded = (0,_urlScheme__rspack_import_7.decodeSapphireUrl)(url);
    if (decoded) {
        host.openExtensionTab?.(decoded.extId, decoded.path, tabId);
    } else {
        host.navigateTab?.(tabId, url);
    }
}
async function captureVisibleTabViaDisplayMedia(targetWin) {
    if (!navigator.mediaDevices?.getDisplayMedia) return null;
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                displaySurface: "browser"
            },
            preferCurrentTab: true
        });
        const track = stream.getVideoTracks()[0];
        if (!track) return null;
        const video = document.createElement("video");
        video.srcObject = stream;
        video.muted = true;
        await video.play();
        await new Promise((resolve)=>{
            if (video.readyState >= 2) resolve();
            else video.addEventListener("loadeddata", ()=>resolve(), {
                once: true
            });
        });
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.drawImage(video, 0, 0);
        const frameElement = targetWin?.frameElement;
        if (frameElement) {
            const rect = frameElement.getBoundingClientRect();
            const scaleX = video.videoWidth / window.innerWidth;
            const scaleY = video.videoHeight / window.innerHeight;
            const cropCanvas = document.createElement("canvas");
            cropCanvas.width = Math.max(1, Math.round(rect.width * scaleX));
            cropCanvas.height = Math.max(1, Math.round(rect.height * scaleY));
            const cropCtx = cropCanvas.getContext("2d");
            if (cropCtx) {
                cropCtx.drawImage(canvas, rect.left * scaleX, rect.top * scaleY, rect.width * scaleX, rect.height * scaleY, 0, 0, cropCanvas.width, cropCanvas.height);
                return cropCanvas.toDataURL("image/png");
            }
        }
        return canvas.toDataURL("image/png");
    } catch (e) {
        console.warn("[sapphire] captureVisibleTab: getDisplayMedia failed or was cancelled", e);
        return null;
    } finally{
        stream?.getTracks().forEach((t)=>t.stop());
    }
}
function generateDocumentId() {
    return typeof crypto?.randomUUID === "function" ? crypto.randomUUID().replace(/-/g, "") : Math.random().toString(36).slice(2).padEnd(32, "0");
}
function originOf(url) {
    if (!url) return undefined;
    try {
        const parsed = new URL(url);
        return parsed.protocol === "chrome-extension:" ? `chrome-extension://${parsed.hostname}` : parsed.origin;
    } catch  {
        return undefined;
    }
}
function dispatchMessage(hubs, message, sender) {
    return new Promise((resolve)=>{
        queueMicrotask(()=>dispatchMessageNow(hubs, message, sender, resolve));
    });
}
function dispatchMessageNow(hubs, message, sender, resolve) {
    let responded = false;
    const sendResponse = (resp)=>{
        sapphireTraceLog("sendResponse called with", resp, "already responded:", responded, "for", message);
        if (responded) return;
        responded = true;
        resolve(resp);
    };
    const listeners = hubs.flatMap((hub)=>hub.snapshot());
    if (listeners.length === 0) {
        console.warn("[sapphire] runtime.sendMessage: no onMessage listeners registered yet for this extension", message);
    }
    let anyAsync = false;
    for (const [i, fn] of listeners.entries()){
        sapphireTraceLog(`dispatchMessage listener #${i} invoked for`, message);
        const result = fn(message, sender, sendResponse);
        sapphireTraceLog(`dispatchMessage listener #${i} returned`, result, "responded so far:", responded);
        if (result === true) {
            anyAsync = true;
        } else if (result && typeof result.then === "function") {
            anyAsync = true;
            result.then((r)=>{
                sapphireTraceLog(`dispatchMessage listener #${i} thenable resolved`, r);
                sendResponse(r);
            }, (e)=>{
                sapphireTraceLog(`dispatchMessage listener #${i} thenable REJECTED`, e);
                sendResponse(undefined);
            });
        } else if (!responded) {
            console.debug("[sapphire] runtime.sendMessage: a listener ran but didn't signal it would respond (returned", result, ") — treating as not handled", message);
        }
    }
    if (!anyAsync && !responded) sendResponse(undefined);
}
async function storageGet(extId, area, keys) {
    const result = {};
    const allKeys = await (0,_db__rspack_import_1.dbGetAllKeys)(_db__rspack_import_1.EXT_STORAGE_STORE);
    const prefix = `${extId}/${area}/`;
    const relevant = allKeys.filter((k)=>typeof k === "string" && k.startsWith(prefix));
    for (const k of relevant){
        const shortKey = k.slice(prefix.length);
        let include = false;
        if (keys === null || keys === undefined) include = true;
        else if (typeof keys === "string") include = shortKey === keys;
        else if (Array.isArray(keys)) include = keys.includes(shortKey);
        else if (typeof keys === "object") include = shortKey in keys;
        if (include) result[shortKey] = await (0,_db__rspack_import_1.dbGet)(_db__rspack_import_1.EXT_STORAGE_STORE, k);
    }
    if (typeof keys === "object" && keys !== null && !Array.isArray(keys)) {
        for (const [k, v] of Object.entries(keys)){
            if (!(k in result)) result[k] = v;
        }
    }
    return result;
}
async function storageSet(extId, area, items) {
    for (const [key, value] of Object.entries(items)){
        await (0,_db__rspack_import_1.dbPut)(_db__rspack_import_1.EXT_STORAGE_STORE, `${extId}/${area}/${key}`, value);
    }
}
async function storageRemove(extId, area, keys) {
    const arr = Array.isArray(keys) ? keys : [
        keys
    ];
    for (const key of arr){
        await (0,_db__rspack_import_1.dbDelete)(_db__rspack_import_1.EXT_STORAGE_STORE, `${extId}/${area}/${key}`);
    }
}
async function storageClear(extId, area) {
    const allKeys = await (0,_db__rspack_import_1.dbGetAllKeys)(_db__rspack_import_1.EXT_STORAGE_STORE);
    const prefix = `${extId}/${area}/`;
    for (const k of allKeys.filter((key)=>typeof key === "string" && key.startsWith(prefix))){
        await (0,_db__rspack_import_1.dbDelete)(_db__rspack_import_1.EXT_STORAGE_STORE, k);
    }
}
async function storageGetKeys(extId, area) {
    const allKeys = await (0,_db__rspack_import_1.dbGetAllKeys)(_db__rspack_import_1.EXT_STORAGE_STORE);
    const prefix = `${extId}/${area}/`;
    return allKeys.filter((k)=>typeof k === "string" && k.startsWith(prefix)).map((k)=>k.slice(prefix.length));
}
function makeStorageArea(extId, area, realm) {
    return {
        get: (keys, cb)=>{
            const p = storageGet(extId, area, keys).then((result)=>cloneForRealm(realm, result));
            if (cb) p.then(cb);
            return p;
        },
        set: (items, cb)=>{
            const p = storageSet(extId, area, items);
            if (cb) p.then(cb);
            return p;
        },
        remove: (keys, cb)=>{
            const p = storageRemove(extId, area, keys);
            if (cb) p.then(cb);
            return p;
        },
        clear: (cb)=>{
            const p = storageClear(extId, area);
            if (cb) p.then(cb);
            return p;
        },
        getBytesInUse: (_keys, cb)=>{
            const result = 0;
            cb?.(result);
            return Promise.resolve(result);
        },
        getKeys: (cb)=>{
            const p = storageGetKeys(extId, area);
            if (cb) p.then(cb);
            return p;
        }
    };
}
function installChromeApi(realm, opts) {
    const { extId, tabId, isBackground, registry, host, skipTabRegistration, senderUrl, senderFrameId, senderDocumentId } = opts;
    const ext = registry.get(extId);
    if (!ext) throw new Error(`sapphire: installChromeApi called for unknown extension ${extId}`);
    const events = (0,_registry__rspack_import_3.createRealmEvents)();
    if (isBackground) {} else if (tabId !== null && !skipTabRegistration) {
        ext.tabEvents.set(tabId, events);
    }
    let portIdCounter = 0;
    const runtime = {
        id: extId,
        getManifest: ()=>ext.manifest,
        getURL: (path)=>(0,_urlScheme__rspack_import_7.chromeExtensionUrl)(extId, path == null ? "" : String(path)),
        sendMessage: (extIdOrMsg, msgOrOpts, optsOrCb, maybeCb)=>{
            let targetExt;
            let message;
            let callback;
            if (typeof extIdOrMsg === "object") {
                message = extIdOrMsg;
                callback = msgOrOpts;
                targetExt = extId;
            } else if (typeof extIdOrMsg === "string" && typeof msgOrOpts === "object") {
                targetExt = extIdOrMsg;
                message = msgOrOpts;
                callback = typeof optsOrCb === "function" ? optsOrCb : maybeCb;
            } else {
                message = extIdOrMsg;
                callback = msgOrOpts;
                targetExt = extId;
            }
            const target = registry.get(targetExt);
            const hubs = [
                target?.background?.events.runtimeOnMessage,
                target?.popupEvents?.runtimeOnMessage
            ].filter((h)=>h !== undefined);
            if (hubs.length === 0) {
                if (callback) {
                    callback(undefined);
                    return undefined;
                }
                return Promise.resolve(undefined);
            }
            const sender = {
                id: extId,
                url: senderUrl,
                origin: originOf(senderUrl),
                frameId: senderFrameId,
                documentId: senderDocumentId,
                tab: tabId !== null ? buildTabObject(host, tabId, realm) : undefined
            };
            const responsePromise = dispatchMessage(hubs, message, sender).then((resp)=>cloneForRealm(realm, resp));
            if (callback) {
                void responsePromise.then(callback);
                return undefined;
            }
            return responsePromise;
        },
        onMessage: events.runtimeOnMessage.toApi(),
        onInstalled: events.runtimeOnInstalled.toApi(),
        onStartup: events.runtimeOnStartup.toApi(),
        onConnect: events.runtimeOnConnect.toApi(),
        connect: (extIdOrInfo, maybeInfo)=>{
            const targetExt = typeof extIdOrInfo === "string" ? extIdOrInfo : extId;
            const connectInfo = typeof extIdOrInfo === "string" ? maybeInfo : extIdOrInfo;
            const name = connectInfo?.name ?? "";
            const portId = `port_${++portIdCounter}`;
            const callerSide = {
                onMessage: new _eventHub__rspack_import_5.EventHub(),
                onDisconnect: new _eventHub__rspack_import_5.EventHub()
            };
            const remoteSide = {
                onMessage: new _eventHub__rspack_import_5.EventHub(),
                onDisconnect: new _eventHub__rspack_import_5.EventHub()
            };
            const disconnectBoth = ()=>{
                callerSide.onDisconnect.fire();
                remoteSide.onDisconnect.fire();
                ext.ports.delete(portId);
            };
            const sender = {
                id: extId,
                url: senderUrl,
                origin: originOf(senderUrl),
                frameId: senderFrameId,
                documentId: senderDocumentId,
                tab: tabId !== null ? buildTabObject(host, tabId, realm) : undefined
            };
            let callerPort;
            let remotePort;
            callerPort = {
                name,
                sender,
                postMessage: (msg)=>remoteSide.onMessage.fire(msg, remotePort),
                disconnect: disconnectBoth,
                onMessage: callerSide.onMessage.toApi(),
                onDisconnect: callerSide.onDisconnect.toApi()
            };
            remotePort = {
                name,
                sender,
                postMessage: (msg)=>callerSide.onMessage.fire(msg, callerPort),
                disconnect: disconnectBoth,
                onMessage: remoteSide.onMessage.toApi(),
                onDisconnect: remoteSide.onDisconnect.toApi()
            };
            const record = {
                id: portId,
                name,
                extId: targetExt,
                remote: remoteSide
            };
            ext.ports.set(portId, record);
            const target = registry.get(targetExt);
            target?.background?.events.runtimeOnConnect.fire(remotePort);
            return callerPort;
        },
        lastError: null,
        getPlatformInfo: (cb)=>{
            const result = {
                os: "linux",
                arch: "x86-64",
                nacl_arch: "x86_64"
            };
            cb?.(result);
            return Promise.resolve(result);
        },
        openOptionsPage: (cb)=>{
            const page = ext.manifest.options_page ?? ext.manifest.options_ui?.page;
            if (page) host.openExtensionTab?.(extId, page, tabId);
            cb?.();
        },
        setUninstallURL: (_url, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        requestUpdateCheck: (cb)=>{
            cb?.("no_update", {});
            return Promise.resolve({
                status: "no_update",
                details: {}
            });
        }
    };
    const storage = {
        local: makeStorageArea(extId, "local", realm),
        sync: makeStorageArea(extId, "sync", realm),
        session: makeStorageArea(extId, "session", realm),
        managed: makeStorageArea(extId, "managed", realm),
        onChanged: new _eventHub__rspack_import_5.EventHub().toApi()
    };
    const tabs = {
        query: (queryInfo = {}, cb)=>{
            const active = host.getActiveTabId?.();
            const result = host.getAllTabs().filter((t)=>{
                if (queryInfo.active !== undefined && queryInfo.active !== (t.id === active)) return false;
                if (queryInfo.url && !t.url.includes(queryInfo.url)) return false;
                return true;
            }).map((t)=>buildTabObject(host, t.id, realm));
            cb?.(result);
            return Promise.resolve(result);
        },
        get: (id, cb)=>{
            const tab = buildTabObject(host, id, realm);
            cb?.(tab);
            return Promise.resolve(tab);
        },
        getCurrent: (cb)=>{
            const tab = buildTabObject(host, tabId, realm);
            cb?.(tab);
            return Promise.resolve(tab);
        },
        create: (createProps = {}, cb)=>{
            if (createProps.url) openUrlInTab(host, null, createProps.url);
            const tab = buildTabObject(host, tabId, realm);
            cb?.(tab);
            return Promise.resolve(tab);
        },
        update: (tabIdOrProps, updatePropsOrCb, maybeCb)=>{
            const targetTabId = typeof tabIdOrProps === "number" ? tabIdOrProps : tabId;
            const updateProps = typeof tabIdOrProps === "number" ? updatePropsOrCb : tabIdOrProps;
            const cb = typeof updatePropsOrCb === "function" ? updatePropsOrCb : maybeCb;
            if (updateProps?.url) openUrlInTab(host, targetTabId, updateProps.url);
            const tab = buildTabObject(host, targetTabId, realm);
            cb?.(tab);
            return Promise.resolve(tab);
        },
        remove: (_tabIds, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        sendMessage: (targetTabId, message, optsOrCb, maybeCb)=>{
            const callback = typeof optsOrCb === "function" ? optsOrCb : typeof maybeCb === "function" ? maybeCb : undefined;
            const targetEvents = ext.tabEvents.get(targetTabId);
            if (!targetEvents) {
                if (callback) {
                    callback(undefined);
                    return undefined;
                }
                return Promise.resolve(undefined);
            }
            const sender = {
                id: extId,
                url: senderUrl,
                frameId: senderFrameId,
                documentId: senderDocumentId,
                tab: buildTabObject(host, tabId, realm)
            };
            const responsePromise = dispatchMessage([
                targetEvents.runtimeOnMessage
            ], message, sender).then((resp)=>cloneForRealm(realm, resp));
            if (callback) {
                void responsePromise.then(callback);
                return undefined;
            }
            return responsePromise;
        },
        onCreated: events.tabsOnCreated.toApi(),
        onUpdated: events.tabsOnUpdated.toApi(),
        onRemoved: events.tabsOnRemoved.toApi(),
        onActivated: events.tabsOnActivated.toApi(),
        executeScript: (tabIdOrDetails, detailsOrCb, maybeCb)=>{
            const actualTabId = typeof tabIdOrDetails === "number" ? tabIdOrDetails : tabId;
            const details = typeof tabIdOrDetails === "object" ? tabIdOrDetails : detailsOrCb;
            const cb = typeof detailsOrCb === "function" ? detailsOrCb : maybeCb;
            const win = actualTabId !== null ? host.getTabWindow?.(actualTabId) : null;
            let result = [];
            if (win && details?.code) {
                try {
                    result = [
                        win.eval(details.code)
                    ];
                } catch  {
                    result = [];
                }
            }
            cb?.(result);
            return Promise.resolve(result);
        },
        insertCSS: (tabIdOrDetails, detailsOrCb, maybeCb)=>{
            const actualTabId = typeof tabIdOrDetails === "number" ? tabIdOrDetails : tabId;
            const details = typeof tabIdOrDetails === "object" ? tabIdOrDetails : detailsOrCb;
            const cb = typeof detailsOrCb === "function" ? detailsOrCb : maybeCb;
            const win = actualTabId !== null ? host.getTabWindow?.(actualTabId) : null;
            if (win && details?.code) injectCss(win, details.code);
            cb?.();
            return Promise.resolve(undefined);
        },
        captureVisibleTab: (windowIdOrOpts, optsOrCb, maybeCb)=>{
            const cb = typeof windowIdOrOpts === "function" ? windowIdOrOpts : typeof optsOrCb === "function" ? optsOrCb : maybeCb;
            const targetWin = tabId !== null ? host.getTabWindow?.(tabId) ?? null : null;
            const p = captureVisibleTabViaDisplayMedia(targetWin);
            p.then(cb);
            return p;
        },
        TAB_ID_NONE: -1
    };
    const windows = {
        getCurrent: (cb)=>{
            const w = {
                id: 1,
                focused: true,
                type: "normal",
                state: "normal"
            };
            cb?.(w);
            return Promise.resolve(w);
        },
        getAll: (cb)=>{
            const all = [
                {
                    id: 1,
                    focused: true,
                    type: "normal",
                    state: "normal"
                }
            ];
            cb?.(all);
            return Promise.resolve(all);
        },
        create: (createData = {}, cb)=>{
            if (createData.url) host.navigateTab?.(null, createData.url);
            const w = {
                id: 1,
                focused: true,
                type: "normal",
                state: "normal"
            };
            cb?.(w);
            return Promise.resolve(w);
        },
        onFocusChanged: new _eventHub__rspack_import_5.EventHub().toApi(),
        WINDOW_ID_NONE: -1,
        WINDOW_ID_CURRENT: -2
    };
    const i18n = {
        getMessage: (messageName, substitutions)=>{
            const msg = ext.messages[messageName];
            if (!msg) return "";
            let text = msg.message ?? "";
            if (substitutions) {
                const subs = Array.isArray(substitutions) ? substitutions : [
                    substitutions
                ];
                subs.forEach((s, i)=>{
                    text = text.replace(new RegExp(`\\$${i + 1}`, "g"), s);
                });
            }
            return text;
        },
        getUILanguage: ()=>realm.navigator.language || "en",
        detectLanguage: (_text, cb)=>{
            const result = {
                isReliable: false,
                languages: []
            };
            cb?.(result);
            return Promise.resolve(result);
        },
        getAcceptLanguage: (cb)=>{
            const result = [
                realm.navigator.language || "en"
            ];
            cb?.(result);
            return Promise.resolve(result);
        }
    };
    const contextMenus = {
        create: (props, cb)=>{
            const id = props.id ?? Math.random().toString(36).slice(2);
            ext.contextMenuItems.push({
                id,
                title: props.title,
                contexts: props.contexts ?? [
                    "all"
                ]
            });
            cb?.();
            return id;
        },
        update: (id, props, cb)=>{
            const item = ext.contextMenuItems.find((i)=>i.id === id);
            if (item) Object.assign(item, props);
            cb?.();
        },
        remove: (id, cb)=>{
            const idx = ext.contextMenuItems.findIndex((i)=>i.id === id);
            if (idx > -1) ext.contextMenuItems.splice(idx, 1);
            cb?.();
        },
        removeAll: (cb)=>{
            ext.contextMenuItems.length = 0;
            cb?.();
        },
        onClicked: events.contextMenusOnClicked.toApi()
    };
    const notifications = {
        create: (idOrOptions, optionsOrCb, maybeCb)=>{
            const notifId = typeof idOrOptions === "string" ? idOrOptions : `notif_${Date.now()}`;
            const options = typeof idOrOptions === "string" ? optionsOrCb : idOrOptions;
            const cb = typeof optionsOrCb === "function" ? optionsOrCb : maybeCb;
            host.showNotification?.(options?.title ?? ext.manifest.name, options?.message ?? "");
            cb?.(notifId);
            return notifId;
        },
        update: (_id, _options, cb)=>{
            const result = true;
            cb?.(result);
            return Promise.resolve(result);
        },
        clear: (_id, cb)=>{
            const result = true;
            cb?.(result);
            return Promise.resolve(result);
        },
        getAll: (cb)=>{
            const result = {};
            cb?.(result);
            return Promise.resolve(result);
        },
        onClicked: events.notificationsOnClicked.toApi(),
        onClosed: events.notificationsOnClosed.toApi(),
        onButtonClicked: events.notificationsOnButtonClicked.toApi()
    };
    const cookies = {
        get: (details, cb)=>{
            const win = tabId !== null ? host.getTabWindow?.(tabId) : realm;
            let val = null;
            try {
                const all = win?.document?.cookie?.split(";") ?? [];
                const found = all.find((c)=>c.trim().startsWith(`${details.name}=`));
                if (found) {
                    const value = found.split("=").slice(1).join("=").trim();
                    val = {
                        name: details.name,
                        value,
                        domain: details.domain ?? "",
                        path: "/"
                    };
                }
            } catch  {}
            cb?.(val);
            return val;
        },
        set: (details, cb)=>{
            const win = tabId !== null ? host.getTabWindow?.(tabId) : realm;
            try {
                let c = `${details.name}=${details.value}`;
                if (details.path) c += `;path=${details.path}`;
                if (details.domain) c += `;domain=${details.domain}`;
                if (win) win.document.cookie = c;
            } catch  {}
            cb?.();
        },
        getAll: (_details, cb)=>{
            const result = [];
            cb?.(result);
            return Promise.resolve(result);
        },
        remove: (_details, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        onChanged: events.cookiesOnChanged.toApi()
    };
    function mkWebRequestEvent() {
        const hub = new _eventHub__rspack_import_5.EventHub();
        return {
            addListener: (fn, _filter, _extraInfoSpec)=>hub.addListener(fn),
            removeListener: hub.removeListener,
            hasListener: hub.hasListener
        };
    }
    const webRequest = {
        onBeforeRequest: mkWebRequestEvent(),
        onBeforeSendHeaders: mkWebRequestEvent(),
        onSendHeaders: mkWebRequestEvent(),
        onHeadersReceived: mkWebRequestEvent(),
        onCompleted: mkWebRequestEvent(),
        onErrorOccurred: mkWebRequestEvent(),
        onBeforeRedirect: mkWebRequestEvent(),
        handlerBehaviorChanged: (cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        }
    };
    const declarativeNetRequest = {
        updateDynamicRules: (options, cb)=>{
            if (options?.removeRuleIds && ext.dynamicRules) {
                ext.dynamicRules = ext.dynamicRules.filter((r)=>!options.removeRuleIds.includes(r.id));
            }
            if (options?.addRules) {
                if (!ext.dynamicRules) ext.dynamicRules = [];
                ext.dynamicRules.push(...options.addRules);
            }
            cb?.();
            return Promise.resolve(undefined);
        },
        getDynamicRules: (filterOrCb, maybeCb)=>{
            const filter = typeof filterOrCb === "function" ? undefined : filterOrCb;
            const cb = typeof filterOrCb === "function" ? filterOrCb : maybeCb;
            const allRules = Array.isArray(ext.dynamicRules) ? ext.dynamicRules : [];
            const rules = filter?.ruleIds ? allRules.filter((r)=>filter.ruleIds.includes(r.id)) : allRules;
            cb?.(rules);
            return Promise.resolve(rules);
        },
        updateSessionRules: (_options, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        getSessionRules: (filterOrCb, maybeCb)=>{
            const cb = typeof filterOrCb === "function" ? filterOrCb : maybeCb;
            cb?.([]);
            return Promise.resolve([]);
        },
        isRegexSupported: (_opts, cb)=>{
            const result = {
                isSupported: true
            };
            cb?.(result);
            return Promise.resolve(result);
        },
        testMatchOutcome: (_req, cb)=>{
            const result = {
                matchedRules: []
            };
            cb?.(result);
            return Promise.resolve(result);
        },
        getAvailableRulesets: (cb)=>{
            const fromManifest = (ext.manifest?.declarative_net_request?.rule_resources ?? []).map((r)=>r.id).filter(Boolean);
            const fromRules = ext.rulesetRules ? Array.from(ext.rulesetRules.keys()) : [];
            const all = Array.from(new Set([
                ...fromManifest,
                ...fromRules
            ]));
            cb?.(all);
            return Promise.resolve(all);
        },
        getRulesets: (cb)=>{
            const manifestResources = ext.manifest?.declarative_net_request?.rule_resources ?? [];
            const rulesets = manifestResources.map((r)=>({
                id: r.id,
                enabled: ext.enabledRulesetIds ? ext.enabledRulesetIds.has(r.id) : false,
                path: r.path
            }));
            cb?.(rulesets);
            return Promise.resolve(rulesets);
        },
        getEnabledRulesets: (cb)=>{
            const ids = ext.enabledRulesetIds ? Array.from(ext.enabledRulesetIds) : [];
            cb?.(ids);
            return Promise.resolve(ids);
        },
        updateEnabledRulesets: (options, cb)=>{
            if (!ext.enabledRulesetIds) ext.enabledRulesetIds = new Set();
            for (const id of options?.disableRulesetIds ?? []) ext.enabledRulesetIds.delete(id);
            for (const id of options?.enableRulesetIds ?? []){
                if (ext.rulesetRules?.has(id) || ext.manifest?.declarative_net_request?.rule_resources?.some((r)=>r.id === id)) {
                    ext.enabledRulesetIds.add(id);
                }
            }
            (0,_dnr__rspack_import_4.recomputeStaticRules)(ext);
            cb?.();
            return Promise.resolve(undefined);
        },
        getDisabledRuleIds: (optionsOrId, cb)=>{
            const actualCb = typeof optionsOrId === "function" ? optionsOrId : cb;
            let rulesetId;
            if (typeof optionsOrId === "string") {
                rulesetId = optionsOrId;
            } else if (optionsOrId && typeof optionsOrId === "object") {
                const opt = optionsOrId;
                if (opt.rulesetId) {
                    rulesetId = opt.rulesetId;
                } else if (Array.isArray(opt.rulesetIds)) {
                    const all = new Set();
                    if (ext.disabledRulesetRuleIds) {
                        for (const rid of opt.rulesetIds){
                            const set = ext.disabledRulesetRuleIds.get(rid);
                            if (set) for (const id of set) all.add(id);
                        }
                    }
                    const ids = Array.from(all);
                    actualCb?.(ids);
                    return Promise.resolve(ids);
                }
            }
            const set = rulesetId && ext.disabledRulesetRuleIds ? ext.disabledRulesetRuleIds.get(rulesetId) : undefined;
            const ids = set ? Array.from(set) : [];
            actualCb?.(ids);
            return Promise.resolve(ids);
        },
        updateStaticRules: (options, cb)=>{
            if (options?.rulesetId) {
                if (!ext.disabledRulesetRuleIds) ext.disabledRulesetRuleIds = new Map();
                let set = ext.disabledRulesetRuleIds.get(options.rulesetId);
                if (!set) {
                    set = new Set();
                    ext.disabledRulesetRuleIds.set(options.rulesetId, set);
                }
                for (const id of options.disableRuleIds ?? []) set.add(id);
                for (const id of options.enableRuleIds ?? []) set.delete(id);
                (0,_dnr__rspack_import_4.recomputeStaticRules)(ext);
            }
            cb?.();
            return Promise.resolve(undefined);
        },
        getMatchedRules: (_options, cb)=>{
            const result = {
                rulesMatchedInfo: []
            };
            cb?.(result);
            return Promise.resolve(result);
        },
        getAvailableStaticRuleCount: (cb)=>{
            const count = 30000;
            cb?.(count);
            return Promise.resolve(count);
        },
        getExtensionIdPrefixes: (cb)=>{
            const prefixes = [];
            cb?.(prefixes);
            return Promise.resolve(prefixes);
        },
        getExtensionActionOptions: (cb)=>{
            const opts = {
                displayActionCountAsBadgeText: true
            };
            cb?.(opts);
            return Promise.resolve(opts);
        },
        setExtensionActionOptions: (_options, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        RuleActionType: {
            BLOCK: "block",
            REDIRECT: "redirect",
            ALLOW: "allow",
            UPGRADE_SCHEME: "upgradeScheme",
            MODIFY_HEADERS: "modifyHeaders",
            ALLOW_ALL_REQUESTS: "allowAllRequests"
        },
        HeaderOperation: {
            APPEND: "append",
            SET: "set",
            REMOVE: "remove"
        },
        ResourceType: {
            MAIN_FRAME: "main_frame",
            SUB_FRAME: "sub_frame",
            STYLESHEET: "stylesheet",
            SCRIPT: "script",
            IMAGE: "image",
            FONT: "font",
            OBJECT: "object",
            XMLHTTPREQUEST: "xmlhttprequest",
            PING: "ping",
            CSP_REPORT: "csp_report",
            MEDIA: "media",
            WEBSOCKET: "websocket",
            OTHER: "other"
        },
        DomainType: {
            FIRST_PARTY: "firstParty",
            THIRD_PARTY: "thirdParty"
        },
        MAX_NUMBER_OF_RULES: 30000,
        MAX_NUMBER_OF_DYNAMIC_RULES: 5000,
        GUARANTEED_MINIMUM_STATIC_RULES: 30000
    };
    function injectCss(win, css) {
        try {
            const doc = win.document;
            const style = doc.createElement("style");
            style.textContent = css;
            (doc.head || doc.documentElement).appendChild(style);
        } catch  {}
    }
    const scripting = {
        executeScript: async (injection, cb)=>{
            const targetTabId = injection.target?.tabId ?? tabId;
            const win = targetTabId !== null ? host.getTabWindow?.(targetTabId) : null;
            if (win && targetTabId !== null && !win.chrome) {
                installChromeApi(win, {
                    extId,
                    tabId: targetTabId,
                    isBackground: false,
                    registry,
                    host,
                    senderUrl: host.getTab(targetTabId)?.url,
                    senderFrameId: 0,
                    senderDocumentId: generateDocumentId()
                });
            }
            let results = [];
            if (win && injection.func) {
                try {
                    results = [
                        {
                            result: injection.func(...injection.args ?? [])
                        }
                    ];
                } catch  {
                    results = [];
                }
            } else if (win && injection.files?.length) {
                for (const file of injection.files){
                    const code = await (0,_fileStore__rspack_import_2.readExtFileText)(extId, file);
                    if (code !== null) (0,_htmlInject__rspack_import_6.injectScript)(win, code);
                }
                results = injection.files.map(()=>({
                        result: undefined
                    }));
            }
            cb?.(results);
            return Promise.resolve(results);
        },
        insertCSS: (injection, cb)=>{
            const targetTabId = injection.target?.tabId ?? tabId;
            const win = targetTabId !== null ? host.getTabWindow?.(targetTabId) : null;
            if (win && injection.css) injectCss(win, injection.css);
            cb?.();
            return Promise.resolve(undefined);
        },
        removeCSS: (_injection, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        registerContentScripts: (scripts, cb)=>{
            for (const s of scripts){
                const idx = registry.contentScripts.findIndex((cs)=>cs.extId === extId && cs.id === s.id);
                const entry = {
                    extId,
                    id: s.id,
                    matches: s.matches ?? [],
                    excludeMatches: s.excludeMatches ?? [],
                    js: s.js ?? [],
                    css: s.css ?? [],
                    runAt: s.runAt ?? "document_idle",
                    allFrames: s.allFrames ?? false
                };
                if (idx === -1) registry.contentScripts.push(entry);
                else registry.contentScripts[idx] = entry;
            }
            cb?.();
            return Promise.resolve(undefined);
        },
        unregisterContentScripts: (filter, cb)=>{
            for(let i = registry.contentScripts.length - 1; i >= 0; i--){
                const cs = registry.contentScripts[i];
                if (cs.extId !== extId || cs.id === undefined) continue;
                if (filter?.ids && !filter.ids.includes(cs.id)) continue;
                registry.contentScripts.splice(i, 1);
            }
            cb?.();
            return Promise.resolve(undefined);
        },
        getRegisteredContentScripts: (filter, cb)=>{
            const result = registry.contentScripts.filter((cs)=>cs.extId === extId && cs.id !== undefined && (!filter?.ids || filter.ids.includes(cs.id))).map((cs)=>({
                    id: cs.id,
                    matches: cs.matches,
                    excludeMatches: cs.excludeMatches,
                    js: cs.js,
                    css: cs.css,
                    runAt: cs.runAt,
                    allFrames: cs.allFrames
                }));
            cb?.(result);
            return Promise.resolve(result);
        }
    };
    function makeAction(clickHub) {
        const extRef = ext;
        return {
            setIcon: (details, cb)=>{
                if (details.imageData) {
                    extRef.iconUrl = typeof details.imageData === "object" ? Object.values(details.imageData)[0] : details.imageData;
                    registry.notifyChange();
                    cb?.();
                } else if (details.path) {
                    const p = typeof details.path === "object" ? Object.values(details.path)[0] : details.path;
                    (0,_fileStore__rspack_import_2.readExtFileURL)(extRef.id, p).then((url)=>{
                        if (url) extRef.iconUrl = url;
                        registry.notifyChange();
                        cb?.();
                    });
                } else {
                    cb?.();
                }
            },
            setTitle: (details, cb)=>{
                extRef.title = details.title;
                registry.notifyChange();
                cb?.();
            },
            setBadgeText: (details, cb)=>{
                extRef.badgeText = details.text ?? "";
                registry.notifyChange();
                cb?.();
            },
            setBadgeBackgroundColor: (details, cb)=>{
                extRef.badgeColor = details.color;
                registry.notifyChange();
                cb?.();
            },
            getBadgeText: (_details, cb)=>{
                const result = extRef.badgeText;
                cb?.(result);
                return Promise.resolve(result);
            },
            enable: (_tabId, cb)=>{
                cb?.();
                return Promise.resolve(undefined);
            },
            disable: (_tabId, cb)=>{
                cb?.();
                return Promise.resolve(undefined);
            },
            onClicked: clickHub.toApi(),
            openPopup: (_options, cb)=>{
                cb?.();
                return Promise.resolve(undefined);
            },
            setPopup: (details, cb)=>{
                extRef.popupPage = details.popup;
                registry.notifyChange();
                cb?.();
            },
            getPopup: (_details, cb)=>{
                const result = extRef.popupPage ?? "";
                cb?.(result);
                return Promise.resolve(result);
            }
        };
    }
    const action = makeAction(events.actionOnClicked);
    const browserAction = makeAction(events.browserActionOnClicked);
    const pageAction = makeAction(events.actionOnClicked);
    const alarms = {
        create: (nameOrInfo, maybeInfo)=>{
            const name = typeof nameOrInfo === "string" ? nameOrInfo : "";
            const alarmInfo = typeof nameOrInfo === "string" ? maybeInfo : nameOrInfo;
            const existing = ext.alarms.get(name);
            if (existing) clearTimeout(existing.timer);
            const delayMs = alarmInfo?.when !== undefined ? Math.max(0, alarmInfo.when - Date.now()) : (alarmInfo?.delayInMinutes ?? 0) * 60000;
            const periodMs = alarmInfo?.periodInMinutes ? alarmInfo.periodInMinutes * 60000 : null;
            const scheduledTime = Date.now() + delayMs;
            const fire = ()=>registry.broadcast(extId, (e)=>e.alarmsOnAlarm, [
                    {
                        name,
                        scheduledTime,
                        periodInMinutes: alarmInfo?.periodInMinutes
                    }
                ]);
            const timer = periodMs ? setTimeout(()=>{
                fire();
                ext.alarms.set(name, {
                    name,
                    scheduledTime,
                    periodInMinutes: alarmInfo?.periodInMinutes,
                    timer: setInterval(fire, periodMs)
                });
            }, delayMs) : setTimeout(fire, delayMs);
            ext.alarms.set(name, {
                name,
                scheduledTime,
                periodInMinutes: alarmInfo?.periodInMinutes,
                timer
            });
        },
        get: (name, cb)=>{
            const alarm = ext.alarms.get(name);
            cb?.(alarm ? {
                name,
                scheduledTime: alarm.scheduledTime,
                periodInMinutes: alarm.periodInMinutes
            } : null);
        },
        getAll: (cb)=>{
            const result = [
                ...ext.alarms.values()
            ].map((a)=>({
                    name: a.name,
                    scheduledTime: a.scheduledTime,
                    periodInMinutes: a.periodInMinutes
                }));
            cb?.(result);
            return Promise.resolve(result);
        },
        clear: (name, cb)=>{
            const alarm = ext.alarms.get(name);
            if (alarm) clearTimeout(alarm.timer);
            const existed = ext.alarms.delete(name);
            cb?.(existed);
        },
        clearAll: (cb)=>{
            for (const alarm of ext.alarms.values())clearTimeout(alarm.timer);
            ext.alarms.clear();
            cb?.(true);
        },
        onAlarm: events.alarmsOnAlarm.toApi()
    };
    const permissions = {
        request: (_perms, cb)=>{
            cb?.(true);
            return Promise.resolve(true);
        },
        contains: (_perms, cb)=>{
            cb?.(true);
            return Promise.resolve(true);
        },
        getAll: (cb)=>{
            const result = {
                permissions: ext.manifest.permissions ?? [],
                origins: ext.manifest.host_permissions ?? []
            };
            cb?.(result);
            return Promise.resolve(result);
        },
        remove: (_perms, cb)=>{
            cb?.(true);
            return Promise.resolve(true);
        },
        onAdded: new _eventHub__rspack_import_5.EventHub().toApi(),
        onRemoved: new _eventHub__rspack_import_5.EventHub().toApi()
    };
    const history = {
        search: (_query, cb)=>{
            const result = [];
            cb?.(result);
            return Promise.resolve(result);
        },
        getVisits: (_details, cb)=>{
            const result = [];
            cb?.(result);
            return Promise.resolve(result);
        },
        addUrl: (_details, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        deleteUrl: (_details, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        deleteAll: (cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        onVisited: new _eventHub__rspack_import_5.EventHub().toApi(),
        onVisitRemoved: new _eventHub__rspack_import_5.EventHub().toApi()
    };
    const bookmarks = {
        get: (_idOrList, cb)=>{
            const result = [];
            cb?.(result);
            return Promise.resolve(result);
        },
        getTree: (cb)=>{
            const result = [
                {
                    id: "0",
                    title: "Bookmarks",
                    children: []
                }
            ];
            cb?.(result);
            return Promise.resolve(result);
        },
        search: (_query, cb)=>{
            const result = [];
            cb?.(result);
            return Promise.resolve(result);
        },
        create: (bookmark, cb)=>{
            const result = {
                id: "0",
                ...bookmark
            };
            cb?.(result);
            return Promise.resolve(result);
        },
        remove: (_id, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        onCreated: new _eventHub__rspack_import_5.EventHub().toApi(),
        onRemoved: new _eventHub__rspack_import_5.EventHub().toApi(),
        onChanged: new _eventHub__rspack_import_5.EventHub().toApi()
    };
    const downloads = {
        download: (options, cb)=>{
            try {
                const doc = realm.document;
                const a = doc.createElement("a");
                a.href = options.url;
                a.download = options.filename ?? "";
                doc.body.appendChild(a);
                a.click();
                a.remove();
            } catch  {}
            cb?.(1);
        },
        search: (_query, cb)=>{
            const result = [];
            cb?.(result);
            return Promise.resolve(result);
        },
        pause: (_id, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        resume: (_id, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        cancel: (_id, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        onCreated: new _eventHub__rspack_import_5.EventHub().toApi(),
        onChanged: new _eventHub__rspack_import_5.EventHub().toApi()
    };
    const identity = {
        getAuthToken: (_details, cb)=>{
            const result = undefined;
            cb?.(result);
            return Promise.resolve(result);
        },
        launchWebAuthFlow: (_details, cb)=>{
            const result = undefined;
            cb?.(result);
            return Promise.resolve(result);
        },
        getRedirectURL: (path)=>`https://sapphire.invalid/${extId}/${path ?? ""}`,
        removeCachedAuthToken: (_details, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        }
    };
    const commands = {
        getAll: (cb)=>{
            const cmds = ext.manifest.commands ?? {};
            const list = Object.entries(cmds).map(([name, cmd])=>({
                    name,
                    description: cmd.description ?? "",
                    shortcut: cmd.suggested_key?.default ?? ""
                }));
            cb?.(list);
            return Promise.resolve(list);
        },
        onCommand: events.commandsOnCommand.toApi()
    };
    const omnibox = {
        setDefaultSuggestion: (_suggestion)=>{},
        onInputStarted: new _eventHub__rspack_import_5.EventHub().toApi(),
        onInputChanged: new _eventHub__rspack_import_5.EventHub().toApi(),
        onInputEntered: new _eventHub__rspack_import_5.EventHub().toApi(),
        onInputCancelled: new _eventHub__rspack_import_5.EventHub().toApi()
    };
    const proxy = {
        settings: {
            get: (_details, cb)=>{
                const result = {
                    value: {
                        mode: "direct"
                    },
                    levelOfControl: "controlled_by_this_extension"
                };
                cb?.(result);
                return Promise.resolve(result);
            },
            set: (_details, cb)=>{
                cb?.();
                return Promise.resolve(undefined);
            },
            clear: (_details, cb)=>{
                cb?.();
                return Promise.resolve(undefined);
            }
        },
        onProxyError: new _eventHub__rspack_import_5.EventHub().toApi()
    };
    const system = {
        cpu: {
            getInfo: (cb)=>{
                const result = {
                    numOfProcessors: 4,
                    "arch-name": "x86-64",
                    modelName: "Sapphire vCPU",
                    features: []
                };
                cb?.(result);
                return Promise.resolve(result);
            }
        },
        memory: {
            getInfo: (cb)=>{
                const result = {
                    capacity: 8 * 1024 * 1024 * 1024,
                    availableCapacity: 4 * 1024 * 1024 * 1024
                };
                cb?.(result);
                return Promise.resolve(result);
            }
        },
        storage: {
            getInfo: (cb)=>{
                cb?.([]);
                return Promise.resolve([]);
            }
        },
        display: {
            getInfo: (cb)=>cb?.([
                    {
                        id: "0",
                        isPrimary: true,
                        isInternal: false,
                        isEnabled: true,
                        bounds: {
                            left: 0,
                            top: 0,
                            width: realm.screen.width,
                            height: realm.screen.height
                        }
                    }
                ])
        }
    };
    const power = {
        requestKeepAwake: (_level)=>{},
        releaseKeepAwake: ()=>{}
    };
    const management = {
        getSelf: (cb)=>{
            const result = {
                id: extId,
                name: ext.manifest.name,
                version: ext.manifest.version ?? "",
                enabled: ext.enabled,
                type: "extension"
            };
            cb?.(result);
            return Promise.resolve(result);
        },
        getAll: (cb)=>cb?.(registry.list().map((e)=>({
                    id: e.id,
                    name: e.manifest.name,
                    version: e.manifest.version ?? "",
                    enabled: e.enabled,
                    type: "extension"
                }))),
        setEnabled: (_id, _enabled, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        uninstallSelf: (_options, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        onEnabled: new _eventHub__rspack_import_5.EventHub().toApi(),
        onDisabled: new _eventHub__rspack_import_5.EventHub().toApi()
    };
    const webNavigation = {
        getFrame: (_details, cb)=>{
            const result = null;
            cb?.(result);
            return Promise.resolve(result);
        },
        getAllFrames: (_details, cb)=>{
            const result = [];
            cb?.(result);
            return Promise.resolve(result);
        },
        onBeforeNavigate: new _eventHub__rspack_import_5.EventHub().toApi(),
        onCommitted: new _eventHub__rspack_import_5.EventHub().toApi(),
        onCompleted: events.webNavigationOnCompleted.toApi(),
        onDOMContentLoaded: new _eventHub__rspack_import_5.EventHub().toApi(),
        onErrorOccurred: new _eventHub__rspack_import_5.EventHub().toApi(),
        onHistoryStateUpdated: new _eventHub__rspack_import_5.EventHub().toApi(),
        onReferenceFragmentUpdated: new _eventHub__rspack_import_5.EventHub().toApi()
    };
    const tts = {
        speak: (utterance, options, cb)=>{
            try {
                const SpeechSynthesisUtteranceCtor = realm.SpeechSynthesisUtterance;
                const u = new SpeechSynthesisUtteranceCtor(utterance);
                if (options?.lang) u.lang = options.lang;
                if (options?.rate) u.rate = options.rate;
                if (options?.pitch) u.pitch = options.pitch;
                if (options?.volume) u.volume = options.volume;
                realm.speechSynthesis.speak(u);
            } catch  {}
            cb?.();
        },
        stop: ()=>realm.speechSynthesis?.cancel(),
        isSpeaking: (cb)=>{
            const result = realm.speechSynthesis?.speaking ?? false;
            cb?.(result);
            return Promise.resolve(result);
        },
        getVoices: (cb)=>cb?.((realm.speechSynthesis?.getVoices() ?? []).map((v)=>({
                    voiceName: v.name,
                    lang: v.lang,
                    remote: false,
                    extensionId: ""
                }))),
        onEvent: new _eventHub__rspack_import_5.EventHub().toApi()
    };
    const clipboard = {
        setImageData: (_imageData, _type, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        }
    };
    const fontSettings = {
        getFont: (_details, cb)=>{
            const result = {
                fontId: "Arial",
                levelOfControl: "controllable_by_this_extension"
            };
            cb?.(result);
            return Promise.resolve(result);
        },
        setFont: (_details, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        clearFont: (_details, cb)=>{
            cb?.();
            return Promise.resolve(undefined);
        },
        getFontList: (cb)=>{
            const fonts = [
                "Arial",
                "Arial Black",
                "Comic Sans MS",
                "Courier New",
                "Georgia",
                "Impact",
                "Segoe UI",
                "Tahoma",
                "Times New Roman",
                "Trebuchet MS",
                "Verdana"
            ].map((fontId)=>({
                    fontId,
                    displayName: fontId
                }));
            cb?.(fonts);
            return Promise.resolve(fonts);
        },
        onFontChanged: new _eventHub__rspack_import_5.EventHub().toApi()
    };
    const extensionNs = {
        getURL: runtime.getURL,
        getBackgroundPage: ()=>null,
        isAllowedIncognitoAccess: (cb)=>{
            cb?.(false);
            return Promise.resolve(false);
        },
        isAllowedFileSchemeAccess: (cb)=>{
            cb?.(false);
            return Promise.resolve(false);
        },
        onMessage: runtime.onMessage,
        onMessageExternal: new _eventHub__rspack_import_5.EventHub().toApi(),
        sendMessage: runtime.sendMessage
    };
    const chromeApi = {
        runtime,
        storage,
        tabs,
        windows,
        extension: extensionNs,
        i18n,
        contextMenus,
        notifications,
        cookies,
        webRequest,
        declarativeNetRequest,
        scripting,
        action,
        browserAction,
        pageAction,
        alarms,
        permissions,
        history,
        bookmarks,
        downloads,
        identity,
        commands,
        omnibox,
        contentSettings: {},
        proxy,
        system,
        power,
        management,
        webNavigation,
        tts,
        clipboard,
        fontSettings,
        app: {
            getDetails: ()=>null,
            isInstalled: false,
            InstallState: {
                DISABLED: "disabled",
                INSTALLED: "installed",
                NOT_INSTALLED: "not_installed"
            },
            RunningState: {
                CANNOT_RUN: "cannot_run",
                READY_TO_RUN: "ready_to_run",
                RUNNING: "running"
            }
        },
        csi: ()=>({}),
        loadTimes: ()=>({})
    };
    const chromeApiWithFallback = globalThis.SAPPHIRE_TRACE ? traceCalls((0,_autoStub__rspack_import_0.withMissingMemberFallback)(chromeApi)) : (0,_autoStub__rspack_import_0.withMissingMemberFallback)(chromeApi);
    realm.chrome = chromeApiWithFallback;
    if (!realm.browser) {
        realm.browser = chromeApiWithFallback;
    }
    return events;
}


},
"./node_modules/@x8r/sapphire/src/commands.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  findMatchingCommand: () => (findMatchingCommand),
  triggerCommand: () => (triggerCommand)
});
function findMatchingCommand(registry, e) {
    for (const ext of registry.list()){
        if (!ext.enabled) continue;
        const commands = ext.manifest.commands ?? {};
        for (const [name, cmd] of Object.entries(commands)){
            const shortcut = cmd.suggested_key?.default ?? cmd.suggested_key?.windows ?? "";
            if (!shortcut) continue;
            const parts = shortcut.toLowerCase().split("+").map((s)=>s.trim());
            const needsCtrl = parts.includes("ctrl");
            const needsShift = parts.includes("shift");
            const needsAlt = parts.includes("alt");
            const key = parts.find((p)=>![
                    "ctrl",
                    "shift",
                    "alt",
                    "command"
                ].includes(p));
            if (key && e.key.toLowerCase() === key && (needsCtrl ? e.ctrlKey || e.metaKey : true) && (needsShift ? e.shiftKey : !e.shiftKey) && (needsAlt ? e.altKey : !e.altKey)) {
                return {
                    extId: ext.id,
                    name
                };
            }
        }
    }
    return null;
}
function triggerCommand(registry, extId, name) {
    registry.broadcast(extId, (e)=>e.commandsOnCommand, [
        name
    ]);
}


},
"./node_modules/@x8r/sapphire/src/contentScripts.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  injectContentScripts: () => (injectContentScripts),
  registerContentScripts: () => (registerContentScripts),
  unregisterContentScripts: () => (unregisterContentScripts)
});
/* import */ var _chromeApi__rspack_import_0 = __webpack_require__("./node_modules/@x8r/sapphire/src/chromeApi.ts");
/* import */ var _fileStore__rspack_import_1 = __webpack_require__("./node_modules/@x8r/sapphire/src/fileStore.ts");
/* import */ var _htmlInject__rspack_import_2 = __webpack_require__("./node_modules/@x8r/sapphire/src/htmlInject.ts");
/* import */ var _manifest__rspack_import_3 = __webpack_require__("./node_modules/@x8r/sapphire/src/manifest.ts");




function registerContentScripts(ext, registry) {
    const scripts = ext.manifest.content_scripts ?? [];
    for (const cs of scripts){
        registry.contentScripts.push({
            extId: ext.id,
            matches: cs.matches ?? [],
            excludeMatches: cs.exclude_matches ?? [],
            js: cs.js ?? [],
            css: cs.css ?? [],
            runAt: cs.run_at ?? "document_idle",
            allFrames: cs.all_frames ?? false
        });
    }
}
function unregisterContentScripts(extId, registry) {
    for(let i = registry.contentScripts.length - 1; i >= 0; i--){
        if (registry.contentScripts[i].extId === extId) registry.contentScripts.splice(i, 1);
    }
}
function generateDocumentId() {
    return typeof crypto?.randomUUID === "function" ? crypto.randomUUID().replace(/-/g, "") : Math.random().toString(36).slice(2).padEnd(32, "0");
}
async function injectContentScripts(win, tabId, url, isTopLevel, registry, host) {
    if (!url) return;
    const matching = registry.contentScripts.filter((cs)=>(isTopLevel || cs.allFrames) && (0,_manifest__rspack_import_3.urlMatchesPatterns)(url, cs.matches, cs.excludeMatches));
    if (!matching.length) return;
    const documentId = generateDocumentId();
    const frameId = isTopLevel ? 0 : 1;
    const installedExts = new Set();
    const ensureChromeApi = (extId)=>{
        if (installedExts.has(extId)) return;
        installedExts.add(extId);
        (0,_chromeApi__rspack_import_0.installChromeApi)(win, {
            extId,
            tabId,
            isBackground: false,
            registry,
            host,
            senderUrl: url,
            senderFrameId: frameId,
            senderDocumentId: documentId
        });
    };
    const byRunAt = {
        document_start: [],
        document_end: [],
        document_idle: []
    };
    for (const cs of matching){
        const ext = registry.get(cs.extId);
        if (!ext?.enabled) continue;
        byRunAt[cs.runAt].push(cs);
    }
    const injectGroup = async (group)=>{
        for (const cs of group){
            ensureChromeApi(cs.extId);
            for (const cssFile of cs.css){
                const css = await (0,_fileStore__rspack_import_1.readExtFileText)(cs.extId, cssFile);
                if (css) (0,_htmlInject__rspack_import_2.injectStyle)(win, css);
            }
            for (const jsFile of cs.js){
                const code = await (0,_fileStore__rspack_import_1.readExtFileText)(cs.extId, jsFile);
                if (code) (0,_htmlInject__rspack_import_2.injectScript)(win, code);
            }
        }
    };
    await injectGroup(byRunAt.document_start);
    if (byRunAt.document_end.length) {
        win.addEventListener("DOMContentLoaded", ()=>void injectGroup(byRunAt.document_end), {
            once: true
        });
    }
    if (byRunAt.document_idle.length) {
        win.addEventListener("load", ()=>void injectGroup(byRunAt.document_idle), {
            once: true
        });
    }
    const tab = host.getTab(tabId);
    for (const extId of new Set(matching.map((cs)=>cs.extId))){
        registry.broadcast(extId, (e)=>e.tabsOnUpdated, [
            tabId,
            {
                status: "complete"
            },
            tab
        ]);
    }
}


},
"./node_modules/@x8r/sapphire/src/crx.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  crxToZip: () => (crxToZip),
  generateExtensionId: () => (generateExtensionId),
  guessMime: () => (guessMime)
});
function crxToZip(buffer) {
    const view = new DataView(buffer);
    const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
    if (magic !== "Cr24") {
        return buffer;
    }
    const version = view.getUint32(4, true);
    let zipStart;
    if (version === 2) {
        const pubKeyLen = view.getUint32(8, true);
        const sigLen = view.getUint32(12, true);
        zipStart = 16 + pubKeyLen + sigLen;
    } else if (version === 3) {
        const headerSize = view.getUint32(8, true);
        zipStart = 12 + headerSize;
    } else {
        throw new Error(`unknown CRX version: ${version}`);
    }
    return buffer.slice(zipStart);
}
function generateExtensionId(seed) {
    let hash = 0;
    for(let i = 0; i < seed.length; i++){
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
    }
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let id = "";
    let n = Math.abs(hash);
    for(let i = 0; i < 32; i++){
        id += chars[n % 26];
        n = Math.floor(n / 26) + i * 7;
    }
    return id.substring(0, 32);
}
const MIME_TYPES = {
    js: "application/javascript",
    mjs: "application/javascript",
    css: "text/css",
    html: "text/html",
    htm: "text/html",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    ico: "image/x-icon",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf"
};
function guessMime(path) {
    const ext = path.split(".").pop()?.toLowerCase() ?? "";
    return MIME_TYPES[ext] ?? "application/octet-stream";
}


},
"./node_modules/@x8r/sapphire/src/db.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  EXT_FILES_STORE: () => (EXT_FILES_STORE),
  EXT_STORAGE_STORE: () => (EXT_STORAGE_STORE),
  EXT_STORE: () => (EXT_STORE),
  dbDelete: () => (dbDelete),
  dbGet: () => (dbGet),
  dbGetAll: () => (dbGetAll),
  dbGetAllKeys: () => (dbGetAllKeys),
  dbPut: () => (dbPut)
});
const DB_NAME = "sapphire_extensions";
const DB_VERSION = 1;
const EXT_STORE = "extensions";
const EXT_FILES_STORE = "extension_files";
const EXT_STORAGE_STORE = "extension_storage";
let dbPromise = null;
function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject)=>{
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = ()=>{
            const db = req.result;
            if (!db.objectStoreNames.contains(EXT_STORE)) {
                db.createObjectStore(EXT_STORE, {
                    keyPath: "id"
                });
            }
            if (!db.objectStoreNames.contains(EXT_FILES_STORE)) {
                db.createObjectStore(EXT_FILES_STORE);
            }
            if (!db.objectStoreNames.contains(EXT_STORAGE_STORE)) {
                db.createObjectStore(EXT_STORAGE_STORE);
            }
        };
        req.onsuccess = ()=>resolve(req.result);
        req.onerror = ()=>reject(req.error);
    });
    return dbPromise;
}
async function dbGet(store, key) {
    const db = await openDB();
    return new Promise((resolve, reject)=>{
        const tx = db.transaction(store, "readonly");
        const req = tx.objectStore(store).get(key);
        req.onsuccess = ()=>resolve(req.result);
        req.onerror = ()=>reject(req.error);
    });
}
async function dbPut(store, key, value) {
    const db = await openDB();
    return new Promise((resolve, reject)=>{
        const tx = db.transaction(store, "readwrite");
        const objStore = tx.objectStore(store);
        const req = key === null ? objStore.put(value) : objStore.put(value, key);
        req.onsuccess = ()=>resolve(req.result);
        req.onerror = ()=>reject(req.error);
    });
}
async function dbDelete(store, key) {
    const db = await openDB();
    return new Promise((resolve, reject)=>{
        const tx = db.transaction(store, "readwrite");
        const req = tx.objectStore(store).delete(key);
        req.onsuccess = ()=>resolve();
        req.onerror = ()=>reject(req.error);
    });
}
async function dbGetAll(store) {
    const db = await openDB();
    return new Promise((resolve, reject)=>{
        const tx = db.transaction(store, "readonly");
        const req = tx.objectStore(store).getAll();
        req.onsuccess = ()=>resolve(req.result);
        req.onerror = ()=>reject(req.error);
    });
}
async function dbGetAllKeys(store) {
    const db = await openDB();
    return new Promise((resolve, reject)=>{
        const tx = db.transaction(store, "readonly");
        const req = tx.objectStore(store).getAllKeys();
        req.onsuccess = ()=>resolve(req.result);
        req.onerror = ()=>reject(req.error);
    });
}


},
"./node_modules/@x8r/sapphire/src/dnr.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  checkDeclarativeNetRequest: () => (checkDeclarativeNetRequest),
  recomputeStaticRules: () => (recomputeStaticRules)
});
function recomputeStaticRules(ext) {
    ext.staticRules = [];
    for (const id of ext.enabledRulesetIds){
        const rules = ext.rulesetRules.get(id);
        if (rules) ext.staticRules.push(...rules);
    }
}
function ruleMatchesUrl(rule, requestUrl) {
    const cond = rule.condition;
    if (cond.urlFilter) {
        const pattern = cond.urlFilter.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\|\|/g, "(?:https?://)(?:[^/]*\\.)?").replace(/\^/g, "[/?&#]");
        try {
            if (!new RegExp(pattern, "i").test(requestUrl)) return false;
        } catch  {
            return false;
        }
    }
    if (cond.regexFilter) {
        try {
            if (!new RegExp(cond.regexFilter, "i").test(requestUrl)) return false;
        } catch  {
            return false;
        }
    }
    return true;
}
function ruleMatchesResourceType(rule, resourceType) {
    if (!rule.condition.resourceTypes?.length) return true;
    return resourceType ? rule.condition.resourceTypes.includes(resourceType) : false;
}
function ruleMatchesInitiator(rule, initiatorUrl) {
    const cond = rule.condition;
    if (!initiatorUrl) return !cond.initiatorDomains?.length;
    let initHost;
    try {
        initHost = new URL(initiatorUrl).hostname;
    } catch  {
        return !cond.initiatorDomains?.length;
    }
    if (cond.initiatorDomains?.length && !cond.initiatorDomains.some((d)=>initHost === d || initHost.endsWith(`.${d}`))) {
        return false;
    }
    if (cond.excludedInitiatorDomains?.some((d)=>initHost === d || initHost.endsWith(`.${d}`))) {
        return false;
    }
    return true;
}
function checkDeclarativeNetRequest(registry, requestUrl, initiatorUrl, resourceType) {
    for (const ext of registry.list()){
        if (!ext.enabled) continue;
        const rules = [
            ...ext.dynamicRules,
            ...ext.staticRules
        ].sort((a, b)=>(b.priority ?? 1) - (a.priority ?? 1));
        for (const rule of rules){
            if (!ruleMatchesUrl(rule, requestUrl)) continue;
            if (!ruleMatchesResourceType(rule, resourceType)) continue;
            if (!ruleMatchesInitiator(rule, initiatorUrl)) continue;
            const action = rule.action;
            if (action.type === "block") return {
                action: "block"
            };
            if (action.type === "redirect") {
                const redirectUrl = action.redirect?.url ?? action.redirect?.regexSubstitution;
                if (redirectUrl) return {
                    action: "redirect",
                    url: redirectUrl
                };
            }
            if (action.type === "upgradeScheme") {
                return {
                    action: "redirect",
                    url: requestUrl.replace(/^http:/, "https:")
                };
            }
            if (action.type === "modifyHeaders") {
                return {
                    action: "modifyHeaders",
                    headers: action.requestHeaders ?? [],
                    responseHeaders: action.responseHeaders ?? []
                };
            }
        }
    }
    return null;
}


},
"./node_modules/@x8r/sapphire/src/eventHub.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  EventHub: () => (EventHub)
});
class EventHub {
    listeners = [];
    addListener = (fn)=>{
        if (typeof fn === "function" && !this.listeners.includes(fn)) {
            this.listeners.push(fn);
        }
    };
    removeListener = (fn)=>{
        const i = this.listeners.indexOf(fn);
        if (i > -1) this.listeners.splice(i, 1);
    };
    hasListener = (fn)=>this.listeners.includes(fn);
    hasListeners = ()=>this.listeners.length > 0;
    fire(...args) {
        for (const fn of [
            ...this.listeners
        ]){
            queueMicrotask(()=>{
                try {
                    fn(...args);
                } catch (e) {
                    console.error("[sapphire] event listener threw", e);
                }
            });
        }
    }
    fireUntilHandled(...args) {
        for (const fn of [
            ...this.listeners
        ]){
            try {
                const result = fn(...args);
                if (result !== undefined) return result;
            } catch (e) {
                console.error("[sapphire] event listener threw", e);
            }
        }
        return undefined;
    }
    snapshot() {
        return [
            ...this.listeners
        ];
    }
    toApi() {
        return {
            addListener: this.addListener,
            removeListener: this.removeListener,
            hasListener: this.hasListener
        };
    }
}


},
"./node_modules/@x8r/sapphire/src/extensions.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getInstalledExtensions: () => (getInstalledExtensions),
  installExtension: () => (installExtension),
  loadExtension: () => (loadExtension),
  loadStoredExtensions: () => (loadStoredExtensions),
  setExtensionEnabled: () => (setExtensionEnabled),
  uninstallExtension: () => (uninstallExtension)
});
/* import */ var jszip__rspack_import_0 = __webpack_require__("./node_modules/jszip/dist/jszip.min.js");
/* import */ var jszip__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(jszip__rspack_import_0);
/* import */ var _crx__rspack_import_1 = __webpack_require__("./node_modules/@x8r/sapphire/src/crx.ts");
/* import */ var _db__rspack_import_2 = __webpack_require__("./node_modules/@x8r/sapphire/src/db.ts");
/* import */ var _fileStore__rspack_import_3 = __webpack_require__("./node_modules/@x8r/sapphire/src/fileStore.ts");
/* import */ var _background__rspack_import_4 = __webpack_require__("./node_modules/@x8r/sapphire/src/background.ts");
/* import */ var _contentScripts__rspack_import_5 = __webpack_require__("./node_modules/@x8r/sapphire/src/contentScripts.ts");
/* import */ var _manifest__rspack_import_6 = __webpack_require__("./node_modules/@x8r/sapphire/src/manifest.ts");
/* import */ var _dnr__rspack_import_7 = __webpack_require__("./node_modules/@x8r/sapphire/src/dnr.ts");








async function loadMessages(extId, manifest) {
    const defaultLocale = manifest.default_locale ?? "en";
    const primary = await (0,_fileStore__rspack_import_3.readExtFileText)(extId, `_locales/${defaultLocale}/messages.json`);
    if (primary) {
        try {
            return JSON.parse(primary);
        } catch  {}
    }
    if (defaultLocale !== "en") {
        const en = await (0,_fileStore__rspack_import_3.readExtFileText)(extId, "_locales/en/messages.json");
        if (en) {
            try {
                return JSON.parse(en);
            } catch  {}
        }
    }
    return {};
}
async function loadExtension(meta, registry, host, backgroundRoot) {
    const ext = registry.createExtensionState(meta.id, meta.manifest, meta.enabled !== false, meta.installedAt, meta.filename);
    ext.messages = await loadMessages(ext.id, ext.manifest);
    (0,_manifest__rspack_import_6.resolveManifestI18n)(ext.manifest, ext.messages);
    (0,_contentScripts__rspack_import_5.registerContentScripts)(ext, registry);
    const defaultIconPath = (0,_manifest__rspack_import_6.getDefaultIcon)(ext.manifest);
    if (defaultIconPath) {
        try {
            ext.iconUrl = await (0,_fileStore__rspack_import_3.readExtFileURL)(ext.id, defaultIconPath);
        } catch (e) {
            console.warn(`[sapphire] failed to resolve default icon for ${ext.manifest.name}`, e);
        }
    }
    const ruleResources = ext.manifest.declarative_net_request?.rule_resources ?? [];
    for (const ruleSet of ruleResources){
        if (!ruleSet.path || !ruleSet.id) continue;
        const rulesText = await (0,_fileStore__rspack_import_3.readExtFileText)(ext.id, ruleSet.path);
        if (!rulesText) continue;
        try {
            ext.rulesetRules.set(ruleSet.id, JSON.parse(rulesText));
            if (ruleSet.enabled !== false) ext.enabledRulesetIds.add(ruleSet.id);
        } catch (e) {
            console.warn(`[sapphire] failed to parse rule set ${ruleSet.path}`, e);
        }
    }
    (0,_dnr__rspack_import_7.recomputeStaticRules)(ext);
    if (ext.enabled) {
        try {
            await (0,_background__rspack_import_4.startBackground)(ext, registry, host, backgroundRoot);
        } catch (e) {
            console.error(`[sapphire] failed to start background for ${ext.manifest.name}`, e);
        }
    }
    registry.notifyChange();
}
async function loadStoredExtensions(registry, host, backgroundRoot) {
    const stored = await (0,_db__rspack_import_2.dbGetAll)(_db__rspack_import_2.EXT_STORE);
    for (const meta of stored){
        try {
            await loadExtension(meta, registry, host, backgroundRoot);
        } catch (e) {
            console.error(`[sapphire] failed to load stored extension ${meta.id}`, e);
        }
    }
    return stored.length;
}
async function installExtension(buffer, filename, registry, host, backgroundRoot) {
    const zipBuffer = (0,_crx__rspack_import_1.crxToZip)(buffer);
    const zip = await jszip__rspack_import_0_default().loadAsync(zipBuffer);
    const manifestFile = zip.file("manifest.json");
    if (!manifestFile) throw new Error("no manifest.json found in extension");
    const manifestText = await manifestFile.async("text");
    let manifest;
    try {
        manifest = JSON.parse(manifestText);
    } catch (e) {
        throw new Error(`invalid manifest: ${e.message}`);
    }
    const extId = (0,_crx__rspack_import_1.generateExtensionId)(manifest.name + (manifest.version ?? ""));
    const fileOps = [];
    zip.forEach((path, file)=>{
        if (file.dir) return;
        fileOps.push(file.async("arraybuffer").then((ab)=>(0,_db__rspack_import_2.dbPut)(_db__rspack_import_2.EXT_FILES_STORE, `${extId}/${path}`, ab)).then(()=>undefined).catch((e)=>{
            console.error(`[sapphire] failed to store file ${path} for ${manifest.name}`, e);
        }));
    });
    await Promise.all(fileOps);
    const meta = {
        id: extId,
        manifest,
        enabled: true,
        installedAt: Date.now(),
        filename,
        fileList: []
    };
    await (0,_db__rspack_import_2.dbPut)(_db__rspack_import_2.EXT_STORE, null, meta);
    await loadExtension(meta, registry, host, backgroundRoot);
    return extId;
}
async function uninstallExtension(extId, registry) {
    const ext = registry.get(extId);
    if (!ext) return;
    (0,_background__rspack_import_4.stopBackground)(ext);
    (0,_contentScripts__rspack_import_5.unregisterContentScripts)(extId, registry);
    registry.remove(extId);
    await (0,_db__rspack_import_2.dbDelete)(_db__rspack_import_2.EXT_STORE, extId);
    const fileKeys = await (0,_db__rspack_import_2.dbGetAllKeys)(_db__rspack_import_2.EXT_FILES_STORE);
    for (const k of fileKeys.filter((key)=>typeof key === "string" && key.startsWith(`${extId}/`))){
        await (0,_db__rspack_import_2.dbDelete)(_db__rspack_import_2.EXT_FILES_STORE, k);
    }
    const storageKeys = await (0,_db__rspack_import_2.dbGetAllKeys)(_db__rspack_import_2.EXT_STORAGE_STORE);
    for (const k of storageKeys.filter((key)=>typeof key === "string" && key.startsWith(`${extId}/`))){
        await (0,_db__rspack_import_2.dbDelete)(_db__rspack_import_2.EXT_STORAGE_STORE, k);
    }
    registry.notifyChange();
}
async function setExtensionEnabled(extId, enabled, registry, host, backgroundRoot) {
    const ext = registry.get(extId);
    if (!ext) return;
    ext.enabled = enabled;
    const stored = await (0,_db__rspack_import_2.dbGet)(_db__rspack_import_2.EXT_STORE, extId);
    if (stored) {
        stored.enabled = enabled;
        await (0,_db__rspack_import_2.dbPut)(_db__rspack_import_2.EXT_STORE, null, stored);
    }
    if (enabled) {
        await (0,_background__rspack_import_4.startBackground)(ext, registry, host, backgroundRoot);
    } else {
        (0,_background__rspack_import_4.stopBackground)(ext);
    }
    registry.notifyChange();
}
function getInstalledExtensions(registry) {
    return registry.list().map((ext)=>({
            id: ext.id,
            name: ext.manifest.name,
            version: ext.manifest.version,
            enabled: ext.enabled,
            manifest: ext.manifest,
            iconUrl: ext.iconUrl,
            title: ext.title,
            badgeText: ext.badgeText,
            badgeColor: ext.badgeColor,
            hasPopup: Boolean(ext.popupPage ?? ext.manifest.action?.default_popup ?? ext.manifest.browser_action?.default_popup ?? ext.manifest.page_action?.default_popup)
        }));
}


},
"./node_modules/@x8r/sapphire/src/fileStore.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  readExtFile: () => (readExtFile),
  readExtFileText: () => (readExtFileText),
  readExtFileURL: () => (readExtFileURL)
});
/* import */ var _db__rspack_import_0 = __webpack_require__("./node_modules/@x8r/sapphire/src/db.ts");
/* import */ var _crx__rspack_import_1 = __webpack_require__("./node_modules/@x8r/sapphire/src/crx.ts");



async function readExtFile(extId, path) {
    const key = `${extId}/${path.replace(/^\//, "")}`;
    const ab = await (0,_db__rspack_import_0.dbGet)(_db__rspack_import_0.EXT_FILES_STORE, key);
    return ab ?? null;
}
async function readExtFileText(extId, path) {
    const ab = await readExtFile(extId, path);
    if (!ab) return null;
    return new TextDecoder().decode(ab);
}
async function readExtFileURL(extId, path) {
    const ab = await readExtFile(extId, path);
    if (!ab) return null;
    const mime = (0,_crx__rspack_import_1.guessMime)(path);
    return URL.createObjectURL(new Blob([
        ab
    ], {
        type: mime
    }));
}


},
"./node_modules/@x8r/sapphire/src/htmlInject.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  bootstrapExtensionFrame: () => (bootstrapExtensionFrame),
  injectScript: () => (injectScript),
  injectScriptFromUrl: () => (injectScriptFromUrl),
  injectStyle: () => (injectStyle),
  rewriteExtHtml: () => (rewriteExtHtml),
  writeDocument: () => (writeDocument)
});
/* import */ var _urlScheme__rspack_import_0 = __webpack_require__("./node_modules/@x8r/sapphire/src/urlScheme.ts");

const RESOURCE_ATTR_RE = /(<(?:script|link|img)\b[^>]*\s(?:src|href)=["'])([^"']+)(["'][^>]*>)/gi;
async function rewriteExtHtml(extId, html, pagePath) {
    const pageDir = (0,_urlScheme__rspack_import_0.extensionPathDir)(pagePath);
    let result = html.replace(RESOURCE_ATTR_RE, (full, prefix, url, suffix)=>{
        if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|data:|blob:)/i.test(url)) return full;
        return `${prefix}${(0,_urlScheme__rspack_import_0.buildExtensionUrl)(extId, (0,_urlScheme__rspack_import_0.resolveExtensionResourcePath)(pageDir, url))}${suffix}`;
    });
    const baseTag = `<base href="${(0,_urlScheme__rspack_import_0.sapphireExtensionBase)(extId)}${pageDir ? `${pageDir}/` : ""}">`;
    if (/<head[^>]*>/i.test(result)) {
        result = result.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`);
    } else {
        result = result.replace(/<html([^>]*)>/i, `<html$1><head>${baseTag}</head>`);
    }
    return result;
}
function bootstrapExtensionFrame(frame, extId) {
    return new Promise((resolve, reject)=>{
        frame.addEventListener("load", ()=>{
            const win = frame.contentWindow;
            if (win) resolve(win);
            else reject(new Error("sapphire: bootstrap frame has no window after load"));
        }, {
            once: true
        });
        frame.src = (0,_urlScheme__rspack_import_0.sapphireBootstrapUrl)(extId);
    });
}
function writeDocument(win, html) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    setTimeout(()=>win.dispatchEvent(new Event("load")), 0);
}
function injectScript(win, code) {
    try {
        const doc = win.document;
        const script = doc.createElement("script");
        script.textContent = code;
        (doc.head || doc.documentElement).appendChild(script);
    } catch (e) {
        console.warn("[sapphire] injectScript failed", e);
    }
}
function injectScriptFromUrl(win, url, isModule) {
    return new Promise((resolve)=>{
        try {
            const doc = win.document;
            const script = doc.createElement("script");
            if (isModule) script.type = "module";
            script.src = url;
            script.addEventListener("load", ()=>resolve(), {
                once: true
            });
            script.addEventListener("error", (e)=>{
                console.warn("[sapphire] injectScriptFromUrl failed to load", url, e);
                resolve();
            }, {
                once: true
            });
            (doc.head || doc.documentElement).appendChild(script);
        } catch (e) {
            console.warn("[sapphire] injectScriptFromUrl failed", e);
            resolve();
        }
    });
}
function injectStyle(win, css) {
    try {
        const doc = win.document;
        const style = doc.createElement("style");
        style.textContent = css;
        (doc.head || doc.documentElement).appendChild(style);
    } catch (e) {
        console.warn("[sapphire] injectStyle failed", e);
    }
}


},
"./node_modules/@x8r/sapphire/src/index.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  Sapphire: () => (/* reexport safe */ _sapphire__rspack_import_0.Sapphire),
  SapphireContentScriptPlugin: () => (/* reexport safe */ _SapphirePlugin__rspack_import_1.SapphireContentScriptPlugin),
  findMatchingCommand: () => (/* reexport safe */ _commands__rspack_import_2.findMatchingCommand),
  triggerCommand: () => (/* reexport safe */ _commands__rspack_import_2.triggerCommand)
});
/* import */ var _sapphire__rspack_import_0 = __webpack_require__("./node_modules/@x8r/sapphire/src/sapphire.ts");
/* import */ var _SapphirePlugin__rspack_import_1 = __webpack_require__("./node_modules/@x8r/sapphire/src/SapphirePlugin.ts");
/* import */ var _commands__rspack_import_2 = __webpack_require__("./node_modules/@x8r/sapphire/src/commands.ts");





},
"./node_modules/@x8r/sapphire/src/manifest.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getBackgroundInfo: () => (getBackgroundInfo),
  getDefaultIcon: () => (getDefaultIcon),
  getManifestVersion: () => (getManifestVersion),
  matchPattern: () => (matchPattern),
  resolveManifestI18n: () => (resolveManifestI18n),
  urlMatchesPatterns: () => (urlMatchesPatterns)
});
function getManifestVersion(manifest) {
    return Number(manifest.manifest_version) || 2;
}
function getBackgroundInfo(manifest) {
    if (getManifestVersion(manifest) === 3) {
        const sw = manifest.background?.service_worker;
        return sw ? {
            type: "worker",
            script: sw,
            isModule: manifest.background?.type === "module"
        } : null;
    }
    if (manifest.background?.page) {
        return {
            type: "page",
            page: manifest.background.page
        };
    }
    if (manifest.background?.scripts?.length) {
        return {
            type: "scripts",
            scripts: manifest.background.scripts
        };
    }
    return null;
}
function matchPattern(pattern, url) {
    if (pattern === "<all_urls>") return true;
    if (pattern === "*://*/*") return url.startsWith("http://") || url.startsWith("https://");
    try {
        const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".");
        const schemeMatch = escaped.match(/^([^:]+):\/\//);
        if (!schemeMatch) return false;
        const re = new RegExp("^" + escaped + "$");
        return re.test(url);
    } catch  {
        return false;
    }
}
function urlMatchesPatterns(url, matches, excludeMatches = []) {
    if (excludeMatches.some((p)=>matchPattern(p, url))) return false;
    return matches.some((p)=>matchPattern(p, url));
}
function resolveManifestI18n(manifest, messages) {
    const resolve = (s)=>{
        if (!s) return s;
        const match = s.match(/^__MSG_(.+)__$/);
        if (!match) return s;
        return messages[match[1]]?.message ?? s;
    };
    manifest.name = resolve(manifest.name) ?? manifest.name;
    manifest.short_name = resolve(manifest.short_name);
    manifest.description = resolve(manifest.description);
    for (const key of [
        "action",
        "browser_action",
        "page_action"
    ]){
        const action = manifest[key];
        if (action?.default_title) action.default_title = resolve(action.default_title);
    }
    return manifest;
}
function getDefaultIcon(manifest) {
    const icons = manifest.action?.default_icon ?? manifest.browser_action?.default_icon ?? manifest.page_action?.default_icon ?? manifest.icons;
    if (!icons) return null;
    if (typeof icons === "string") return icons;
    const sizes = Object.keys(icons).map(Number).filter((n)=>!Number.isNaN(n)).sort((a, b)=>b - a);
    if (sizes.length) return icons[String(sizes[0])] ?? null;
    const firstKey = Object.keys(icons)[0];
    return firstKey ? icons[firstKey] : null;
}


},
"./node_modules/@x8r/sapphire/src/newtab.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getNewTabOverride: () => (getNewTabOverride),
  mountNewTabPage: () => (mountNewTabPage)
});
/* import */ var _pageMount__rspack_import_0 = __webpack_require__("./node_modules/@x8r/sapphire/src/pageMount.ts");

function getNewTabOverride(registry) {
    const candidates = registry.list().filter((ext)=>ext.enabled && typeof ext.manifest.chrome_url_overrides?.newtab === "string").sort((a, b)=>b.installedAt - a.installedAt);
    const winner = candidates[0];
    if (!winner) return null;
    return {
        extId: winner.id,
        page: winner.manifest.chrome_url_overrides.newtab
    };
}
async function mountNewTabPage(frame, extId, page, tabId, registry, host) {
    return (0,_pageMount__rspack_import_0.mountExtensionPage)(frame, extId, page, tabId, registry, host, false);
}


},
"./node_modules/@x8r/sapphire/src/pageMount.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  mountExtensionPage: () => (mountExtensionPage)
});
/* import */ var _chromeApi__rspack_import_0 = __webpack_require__("./node_modules/@x8r/sapphire/src/chromeApi.ts");
/* import */ var _fileStore__rspack_import_1 = __webpack_require__("./node_modules/@x8r/sapphire/src/fileStore.ts");
/* import */ var _htmlInject__rspack_import_2 = __webpack_require__("./node_modules/@x8r/sapphire/src/htmlInject.ts");
/* import */ var _urlScheme__rspack_import_3 = __webpack_require__("./node_modules/@x8r/sapphire/src/urlScheme.ts");




async function mountExtensionPage(frame, extId, pagePath, tabId, registry, host, skipTabRegistration) {
    const win = await (0,_htmlInject__rspack_import_2.bootstrapExtensionFrame)(frame, extId);
    const events = (0,_chromeApi__rspack_import_0.installChromeApi)(win, {
        extId,
        tabId,
        isBackground: false,
        registry,
        host,
        skipTabRegistration,
        senderUrl: (0,_urlScheme__rspack_import_3.chromeExtensionUrl)(extId, pagePath)
    });
    if (skipTabRegistration) {
        const ext = registry.get(extId);
        if (ext) ext.popupEvents = events;
    }
    const raw = await (0,_fileStore__rspack_import_1.readExtFileText)(extId, pagePath);
    if (raw === null) return false;
    const html = await (0,_htmlInject__rspack_import_2.rewriteExtHtml)(extId, raw, pagePath);
    (0,_htmlInject__rspack_import_2.writeDocument)(win, html);
    return true;
}


},
"./node_modules/@x8r/sapphire/src/popup.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getExtensionPopupPage: () => (getExtensionPopupPage),
  mountExtensionPopup: () => (mountExtensionPopup)
});
/* import */ var _pageMount__rspack_import_0 = __webpack_require__("./node_modules/@x8r/sapphire/src/pageMount.ts");

function resolvePopupPage(registry, extId) {
    const ext = registry.get(extId);
    if (!ext) return null;
    const manifest = ext.manifest;
    return ext.popupPage ?? manifest.action?.default_popup ?? manifest.browser_action?.default_popup ?? manifest.page_action?.default_popup ?? null;
}
function getExtensionPopupPage(registry, extId) {
    return resolvePopupPage(registry, extId);
}
async function mountExtensionPopup(frame, extId, tabId, registry, host) {
    const popupPage = resolvePopupPage(registry, extId);
    if (!popupPage) return false;
    return (0,_pageMount__rspack_import_0.mountExtensionPage)(frame, extId, popupPage, tabId, registry, host, true);
}


},
"./node_modules/@x8r/sapphire/src/registry.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  SapphireRegistry: () => (SapphireRegistry),
  createRealmEvents: () => (createRealmEvents)
});
/* import */ var _eventHub__rspack_import_0 = __webpack_require__("./node_modules/@x8r/sapphire/src/eventHub.ts");

function createRealmEvents() {
    return {
        runtimeOnMessage: new _eventHub__rspack_import_0.EventHub(),
        runtimeOnInstalled: new _eventHub__rspack_import_0.EventHub(),
        runtimeOnStartup: new _eventHub__rspack_import_0.EventHub(),
        runtimeOnConnect: new _eventHub__rspack_import_0.EventHub(),
        tabsOnCreated: new _eventHub__rspack_import_0.EventHub(),
        tabsOnUpdated: new _eventHub__rspack_import_0.EventHub(),
        tabsOnRemoved: new _eventHub__rspack_import_0.EventHub(),
        tabsOnActivated: new _eventHub__rspack_import_0.EventHub(),
        actionOnClicked: new _eventHub__rspack_import_0.EventHub(),
        browserActionOnClicked: new _eventHub__rspack_import_0.EventHub(),
        alarmsOnAlarm: new _eventHub__rspack_import_0.EventHub(),
        contextMenusOnClicked: new _eventHub__rspack_import_0.EventHub(),
        commandsOnCommand: new _eventHub__rspack_import_0.EventHub(),
        notificationsOnClicked: new _eventHub__rspack_import_0.EventHub(),
        notificationsOnClosed: new _eventHub__rspack_import_0.EventHub(),
        notificationsOnButtonClicked: new _eventHub__rspack_import_0.EventHub(),
        cookiesOnChanged: new _eventHub__rspack_import_0.EventHub(),
        webNavigationOnCompleted: new _eventHub__rspack_import_0.EventHub()
    };
}
class SapphireRegistry {
    extensions = new Map();
    contentScripts = [];
    createExtensionState(id, manifest, enabled, installedAt, filename) {
        const state = {
            id,
            manifest,
            enabled,
            installedAt,
            filename,
            messages: {},
            dynamicRules: [],
            staticRules: [],
            rulesetRules: new Map(),
            enabledRulesetIds: new Set(),
            badgeText: "",
            badgeColor: null,
            iconUrl: null,
            title: null,
            popupPage: null,
            background: null,
            contextMenuItems: [],
            alarms: new Map(),
            ports: new Map(),
            tabEvents: new Map(),
            popupEvents: null
        };
        this.extensions.set(id, state);
        return state;
    }
    get(id) {
        return this.extensions.get(id);
    }
    remove(id) {
        const ext = this.extensions.get(id);
        if (!ext) return;
        for (const alarm of ext.alarms.values())clearTimeout(alarm.timer);
        if (ext.background?.kind === "worker") ext.background.worker?.terminate();
        if (ext.background?.kind === "frame") ext.background.frame?.remove();
        this.extensions.delete(id);
    }
    list() {
        return [
            ...this.extensions.values()
        ];
    }
    changeListeners = new Set();
    onChange(cb) {
        this.changeListeners.add(cb);
        return ()=>this.changeListeners.delete(cb);
    }
    notifyChange() {
        for (const cb of this.changeListeners)cb();
    }
    broadcast(extId, pick, args) {
        const ext = this.extensions.get(extId);
        if (!ext) return;
        if (ext.background) pick(ext.background.events).fire(...args);
        for (const events of ext.tabEvents.values())pick(events).fire(...args);
    }
    broadcastTabLifecycle(pick, args) {
        for (const ext of this.extensions.values()){
            if (!ext.enabled || !ext.background) continue;
            pick(ext.background.events).fire(...args);
        }
    }
}


},
"./node_modules/@x8r/sapphire/src/sapphire.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  Sapphire: () => (Sapphire)
});
/* import */ var _chromeApi__rspack_import_0 = __webpack_require__("./node_modules/@x8r/sapphire/src/chromeApi.ts");
/* import */ var _dnr__rspack_import_1 = __webpack_require__("./node_modules/@x8r/sapphire/src/dnr.ts");
/* import */ var _extensions__rspack_import_2 = __webpack_require__("./node_modules/@x8r/sapphire/src/extensions.ts");
/* import */ var _newtab__rspack_import_3 = __webpack_require__("./node_modules/@x8r/sapphire/src/newtab.ts");
/* import */ var _popup__rspack_import_4 = __webpack_require__("./node_modules/@x8r/sapphire/src/popup.ts");
/* import */ var _registry__rspack_import_5 = __webpack_require__("./node_modules/@x8r/sapphire/src/registry.ts");






class Sapphire {
    registry = new _registry__rspack_import_5.SapphireRegistry();
    host;
    backgroundRoot;
    ready = null;
    constructor(options){
        this.host = options.host;
        this.backgroundRoot = options.backgroundRoot ?? document.body;
    }
    init() {
        if (!this.ready) {
            this.ready = (0,_extensions__rspack_import_2.loadStoredExtensions)(this.registry, this.host, this.backgroundRoot);
        }
        return this.ready;
    }
    async installExtension(buffer, filename = "extension.crx") {
        return (0,_extensions__rspack_import_2.installExtension)(buffer, filename, this.registry, this.host, this.backgroundRoot);
    }
    async uninstallExtension(extId) {
        return (0,_extensions__rspack_import_2.uninstallExtension)(extId, this.registry);
    }
    async setExtensionEnabled(extId, enabled) {
        return (0,_extensions__rspack_import_2.setExtensionEnabled)(extId, enabled, this.registry, this.host, this.backgroundRoot);
    }
    getInstalledExtensions() {
        return (0,_extensions__rspack_import_2.getInstalledExtensions)(this.registry);
    }
    getExtensionPopupPage(extId) {
        return (0,_popup__rspack_import_4.getExtensionPopupPage)(this.registry, extId);
    }
    async mountExtensionPopup(frame, extId, tabId) {
        return (0,_popup__rspack_import_4.mountExtensionPopup)(frame, extId, tabId, this.registry, this.host);
    }
    getNewTabOverride() {
        return (0,_newtab__rspack_import_3.getNewTabOverride)(this.registry);
    }
    async mountNewTabPage(frame, extId, page, tabId) {
        return (0,_newtab__rspack_import_3.mountNewTabPage)(frame, extId, page, tabId, this.registry, this.host);
    }
    checkDeclarativeNetRequest(requestUrl, initiatorUrl, resourceType) {
        return (0,_dnr__rspack_import_1.checkDeclarativeNetRequest)(this.registry, requestUrl, initiatorUrl, resourceType);
    }
    onChange(cb) {
        return this.registry.onChange(cb);
    }
    triggerActionClicked(extId, tabId) {
        const tab = (0,_chromeApi__rspack_import_0.buildTabObject)(this.host, tabId);
        this.registry.broadcast(extId, (e)=>e.actionOnClicked, [
            tab
        ]);
        this.registry.broadcast(extId, (e)=>e.browserActionOnClicked, [
            tab
        ]);
    }
    notifyTabCreated(tabId) {
        this.registry.broadcastTabLifecycle((e)=>e.tabsOnCreated, [
            (0,_chromeApi__rspack_import_0.buildTabObject)(this.host, tabId)
        ]);
    }
    notifyTabUpdated(tabId, changeInfo) {
        const tab = (0,_chromeApi__rspack_import_0.buildTabObject)(this.host, tabId);
        this.registry.broadcastTabLifecycle((e)=>e.tabsOnUpdated, [
            tabId,
            changeInfo,
            tab
        ]);
    }
    notifyTabRemoved(tabId, windowId = 1) {
        this.registry.broadcastTabLifecycle((e)=>e.tabsOnRemoved, [
            tabId,
            {
                windowId,
                isWindowClosing: false
            }
        ]);
    }
    notifyTabActivated(tabId, windowId = 1) {
        this.registry.broadcastTabLifecycle((e)=>e.tabsOnActivated, [
            {
                tabId,
                windowId
            }
        ]);
    }
}


},
"./node_modules/@x8r/sapphire/src/urlScheme.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  SAPPHIRE_PREFIX: () => (SAPPHIRE_PREFIX),
  buildExtensionUrl: () => (buildExtensionUrl),
  chromeExtensionUrl: () => (chromeExtensionUrl),
  decodeSapphirePath: () => (decodeSapphirePath),
  decodeSapphireUrl: () => (decodeSapphireUrl),
  extensionPathDir: () => (extensionPathDir),
  resolveExtensionResourcePath: () => (resolveExtensionResourcePath),
  sapphireBootstrapUrl: () => (sapphireBootstrapUrl),
  sapphireExtensionBase: () => (sapphireExtensionBase)
});
const SAPPHIRE_PREFIX = "/~/sx/";
function sapphireBootstrapUrl(extId) {
    return `${sapphireExtensionBase(extId)}__bootstrap__`;
}
function sapphireExtensionBase(extId) {
    return `${globalThis.location.origin}${SAPPHIRE_PREFIX}${extId}/`;
}
function buildExtensionUrl(extId, path) {
    return `${sapphireExtensionBase(extId)}${path.replace(/^\//, "")}`;
}
function chromeExtensionUrl(extId, path) {
    return `chrome-extension://${extId}/${path.replace(/^\//, "")}`;
}
function resolveExtensionResourcePath(pageDir, ref) {
    if (ref.startsWith("/")) return ref.replace(/^\//, "");
    const fakeBase = `sapphire://x/${pageDir ? `${pageDir}/` : ""}`;
    const resolved = new URL(ref, fakeBase);
    return decodeURIComponent(resolved.pathname.replace(/^\//, ""));
}
function extensionPathDir(path) {
    const slash = path.lastIndexOf("/");
    return slash === -1 ? "" : path.slice(0, slash);
}
function decodeSapphirePath(pathname) {
    if (!pathname.startsWith(SAPPHIRE_PREFIX)) return null;
    const rest = pathname.slice(SAPPHIRE_PREFIX.length);
    const slash = rest.indexOf("/");
    if (slash === -1) return null;
    const extId = rest.slice(0, slash);
    const path = decodeURIComponent(rest.slice(slash + 1));
    if (!extId || !path) return null;
    return {
        extId,
        path
    };
}
function decodeSapphireUrl(input) {
    try {
        const url = new URL(input, globalThis.location.href);
        if (url.protocol === "chrome-extension:") {
            const extId = url.hostname;
            const path = decodeURIComponent(url.pathname.replace(/^\//, ""));
            if (!extId || !path) return null;
            return {
                extId,
                path
            };
        }
        if (url.origin !== globalThis.location.origin) return null;
        return decodeSapphirePath(url.pathname);
    } catch  {
        return null;
    }
}


},
"./node_modules/@mercuryworkshop/scramjet-controller/dist/controller-external.mjs"(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  Controller: () => (Controller),
  Frame: () => (Frame),
  ManagedPlugin: () => (ManagedPlugin),
  VERSION: () => (VERSION),
  assertRuntimeScramjetVersion: () => (assertRuntimeScramjetVersion),
  config: () => (config)
});
// AUTO-GENERATED by ExternalStubPlugin — do not edit.
// Re-exports of globalThis.$scramjetController (set by the IIFE bundle).
const __external = /** @type {any} */ (globalThis).$scramjetController;
const {
	Controller,
	Frame,
	ManagedPlugin,
	VERSION,
	assertRuntimeScramjetVersion,
	config,
} = __external;


},

});
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
exports: {}
});
// Execute the module function
__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

// Return the exports of the module
return module.exports;

}

// webpack/runtime/compat_get_default_export
(() => {
// getDefaultExport function for compatibility with non-ESM modules
__webpack_require__.n = (module) => {
	var getter = module && module.__esModule ?
		() => (module['default']) :
		() => (module);
	__webpack_require__.d(getter, { a: getter });
	return getter;
};

})();
// webpack/runtime/define_property_getters
(() => {
__webpack_require__.d = (exports, definition) => {
	for(var key in definition) {
        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};
})();
// webpack/runtime/global
(() => {
__webpack_require__.g = (() => {
	if (typeof globalThis === 'object') return globalThis;
	try {
		return this || new Function('return this')();
	} catch (e) {
		if (typeof window === 'object') return window;
	}
})();
})();
// webpack/runtime/has_own_property
(() => {
__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
})();
// webpack/runtime/make_namespace_object
(() => {
// define __esModule on exports
__webpack_require__.r = (exports) => {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};
})();
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  JSZip: () => (/* reexport default from dynamic */ jszip__rspack_import_1_default.a),
  Sapphire: () => (/* reexport safe */ _x8r_sapphire__rspack_import_0.Sapphire),
  SapphireContentScriptPlugin: () => (/* reexport safe */ _x8r_sapphire__rspack_import_0.SapphireContentScriptPlugin),
  "default": () => (__rspack_default_export),
  findMatchingCommand: () => (/* reexport safe */ _x8r_sapphire__rspack_import_0.findMatchingCommand),
  normalizeExtensionBuffer: () => (normalizeExtensionBuffer),
  triggerCommand: () => (/* reexport safe */ _x8r_sapphire__rspack_import_0.triggerCommand)
});
/* import */ var _x8r_sapphire__rspack_import_0 = __webpack_require__("./node_modules/@x8r/sapphire/src/index.ts");
/* import */ var jszip__rspack_import_1 = __webpack_require__("./node_modules/jszip/dist/jszip.min.js");
/* import */ var jszip__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(jszip__rspack_import_1);


// Helper to normalize extension zip/crx archives (fixes subfolder nesting and crx headers)
async function normalizeExtensionBuffer(buffer, _filename = "extension.crx") {
    let rawBuf = buffer;
    const view = new DataView(rawBuf);
    if (rawBuf.byteLength >= 4) {
        const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
        if (magic === "Cr24") {
            const version = view.getUint32(4, true);
            let zipStart = 0;
            if (version === 2) {
                const pubKeyLen = view.getUint32(8, true);
                const sigLen = view.getUint32(12, true);
                zipStart = 16 + pubKeyLen + sigLen;
            } else if (version === 3) {
                const headerSize = view.getUint32(8, true);
                zipStart = 12 + headerSize;
            }
            if (zipStart > 0 && zipStart < rawBuf.byteLength) {
                rawBuf = rawBuf.slice(zipStart);
            }
        }
    }
    try {
        const zip = await jszip__rspack_import_1_default().loadAsync(rawBuf);
        // Check if manifest.json exists at root
        if (zip.file("manifest.json")) {
            return rawBuf;
        }
        // Look for manifest.json in any subfolder
        let manifestPath = "";
        zip.forEach((relPath, file)=>{
            if (!file.dir && relPath.endsWith("manifest.json") && (!manifestPath || relPath.split("/").length < manifestPath.split("/").length)) {
                manifestPath = relPath;
            }
        });
        if (manifestPath) {
            const prefix = manifestPath.substring(0, manifestPath.lastIndexOf("manifest.json"));
            const newZip = new (jszip__rspack_import_1_default())();
            const promises = [];
            zip.forEach((relPath, file)=>{
                if (file.dir) return;
                if (relPath.startsWith(prefix)) {
                    const newRelPath = relPath.substring(prefix.length);
                    if (newRelPath) {
                        promises.push(file.async("arraybuffer").then((ab)=>{
                            newZip.file(newRelPath, ab);
                        }));
                    }
                }
            });
            await Promise.all(promises);
            return await newZip.generateAsync({
                type: "arraybuffer"
            });
        }
    } catch (e) {
        console.warn("normalizeExtensionBuffer zip inspect error:", e);
    }
    return rawBuf;
}
globalThis.Sapphire = _x8r_sapphire__rspack_import_0.Sapphire;
globalThis.SapphireContentScriptPlugin = _x8r_sapphire__rspack_import_0.SapphireContentScriptPlugin;
globalThis.findMatchingCommand = _x8r_sapphire__rspack_import_0.findMatchingCommand;
globalThis.triggerCommand = _x8r_sapphire__rspack_import_0.triggerCommand;
globalThis.JSZip = (jszip__rspack_import_1_default());
globalThis.normalizeExtensionBuffer = normalizeExtensionBuffer;

/* export default */ const __rspack_default_export = (_x8r_sapphire__rspack_import_0.Sapphire);

})();

var __rspack_exports_target = self;
for(var __rspack_i in __webpack_exports__) __rspack_exports_target[__rspack_i] = __webpack_exports__[__rspack_i];
if(__webpack_exports__.__esModule) Object.defineProperty(__rspack_exports_target, '__esModule', { value: true });
})()
;
//# sourceMappingURL=scramjet.sapphire.js.map