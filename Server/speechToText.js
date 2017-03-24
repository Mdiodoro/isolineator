const fs = require('fs');


const Speech = require('@google-cloud/speech')({
  projectId: 'Isolineator',
  keyFilename: '../APIs/isolineator-a25b826f81b6.json'
});

const options = {
  encoding: 'LINEAR16',
  sampleRate: 44100
};

const request = {
  config: {
    encoding: 'LINEAR16',
    sampleRate: 16000
  },
  singleUtterance: false,
  interimResults: true, // maybe to false
  verbose: true
};
//##############to create a file first then transcribe##########
exports.createAndStream = (file, callback) => {
  return fs.createWriteStream(file)
    .on('finish', () => {
      console.log("Recording Finished. Now Transcribing")
      exports.streamFile(file, callback);
    })
};


//################for streaming audio from a file already created###################
exports.streamFile = (file, callback) => {
  fs.createReadStream(file)
  .on('error', console.error)
  .pipe(Speech.createRecognizeStream(request))
  .on('error', console.error)
  .on('data', function(data) {
    console.log(data);
    callback(data)
  })
};
///////////for direct mic to api//////////////////
  
exports.liveStreamAudio = (callback) => {
  return Speech.createRecognizeStream(request)
    .on('error', console.error)
    .on('data', (data) => {
      // process.stdout.write(data)
      callback(data);
    });
}

//################normal synchronus####################
exports.syncAudio = (file, callback) => {
  Speech.recognize(file, options)
  .then((results) => {
    const transcription = results[0];
    console.log(`Transcription: ${transcription}`);
    return transcription;
  })
  .then((data) => {
    callback(data);
  })
  .catch((err) => {
    console.log(err);
  });
}