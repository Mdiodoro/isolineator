const AWS = require('aws-sdk');
const Stream = require('stream');

//load aws creds
AWS.config.loadFromPath('../APIs/isolineatorCreds.json');

//get polly object
var polly = new AWS.Polly();

exports.createSpeechFileFromChunks = (chunk, fileName, callBack) => {
  var params = {
    OutputFormat: 'mp3',               // You can also specify pcm or ogg_vorbis formats.
    Text: ''+chunk,     // This is where you'll specify whatever text you want to render.
    VoiceId: 'Miguel'                   // Specify the voice ID / name from the previous step.
  };
  // console.log('chunk : ', chunk);
  // console.log('chunk type : ', typeof chunk);
  var synthCallback = function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
    fs.writeFile(fileName + '.mp3', data.AudioStream, function (err) {
      if (err) { 
        console.log('An error occurred while writing the file.');
        console.log(err);
      }
      console.log('Finished writing the file to the filesystem')
    });
  };

// Call the synthesizeSpeech() API, and write the result to a file
polly.synthesizeSpeech(params, synthCallback);
}

exports.getSpeechStreamFromChunks = (chunk, callBack) => {
	var params = {
    OutputFormat: 'mp3',               
    Text: ''+chunk,     
    VoiceId: 'Miguel'                   
  };
  var synthCallback = callBack;
  polly.synthesizeSpeech(params, synthCallback);
}