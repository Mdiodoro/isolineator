var app = require('express')();
var express = require('express');
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var fs = require('fs');
const Stream = require('stream');
var record = require('node-record-lpcm16');
var request = require('request');
var multer = require('multer');
var db = require('../mongo-db/config.js');
var inputs = require('../mongo-db/inputs.js');
var Speech = require('../Server/speechToText.js');
var t2s = require('../Server/textToSpeech.js');
const {Translater} = require('./TextTranslateApi.js');


var io = require ('socket.io')(server);

io.on('connection', (socket) => {
 console.log('io connected');
});

io.on('disconnect', (socket) => {
 console.log('io is disconnected');
});


app.use(express.static(__dirname + '/../angular-client'));
app.use(express.static(__dirname + '/../node_modules'));



// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
 extended: true
}));


var storage = multer.diskStorage({
 destination: function (req, file, cb) {
   cb(null, 'uploads/');
 },
 filename: function (req, file, cb) {
   var date = new Date().toISOString();
   cb(null, file.fieldname + '-' + date + '.wav');
 }
});

var upload = multer({ storage: storage });

var port = process.env.PORT || 5000;

app.post('/log', function(req, res) {
 console.log('req.body.query', req.body.query);
 res.status(201).end();
});

app.post('/record', upload.single('recording'), function(req, res) {

  console.log('post handled: request file', req.file);

  // Speech.streamFile(`./${req.file.path}`, (data)=>{
  //   if (data.endpointerType === 'ENDPOINTER_EVENT_UNSPECIFIED') {
  //     console.log('data.results', data.results);
  //     console.log('data.results[0].transcript', data.results[0].transcript);
  //     res.status(201).send(data.results[0].transcript);
  //   }
  // });
  // // res.status(201).end();
});

app.post('/stopStream', function (req, res) {
 record.stop();
 io.on('remove', function() {
   io.disconnect();
   console.log('socket should be disconnected');
 });
 res.status(201).end();
});

// Creates a file first, THEN transcribes the audio from the file
// RETURNS the transcribed text string.
// first audio create wave file, then transcribes
app.post('/testCreate', (req, res) => {
 record.start({
   sampleRate: 44100,
   threshold: 0.5,
   verbose: true
 })
 .pipe(Speech.createAndStream('./Server/audio/test.wav', (data) => {
   if(data.endpointerType === 'ENDPOINTER_EVENT_UNSPECIFIED') {
     res.status(201).end(data.results[0].transcript);
   }
 }));
});


// Creates a direct data stream from the user's microphone into the Speech-to-text API
// RETURNS the transcribed text string when the user is done talking
app.post('/testStream', function(req, res) {

 record.start({
   sampleRate: 16000,
   threshold: 0
   // verbose: true
 })
 .pipe(Speech.liveStreamAudio((data) => {
   console.log(data);
   if(Array.isArray(data.results) && data.results[0] !== undefined) {
      Translater(data.results[0].transcript, 'es', (translate) =>{
        io.emit('transcription', data, translate);
        // console.log(data); 
      })
    }else if(typeof data.results === 'string'){
      Translater(data.results, 'es', (translate) =>{
        io.emit('transcription', data, translate);
      })
   }
   // Translator()
   // res.write(data.results);

   // let speech = data.results.length ? data.results[0].transcribe : '';
   // io.on('connection', (socket) => {
   // console.log('speech here:', speech);
   // if (data.results.length > 0) {
   // }
   // });
   if (data.endpointerType === 'ENDPOINTER_EVENT_UNSPECIFIED') {
     // console.log('transcribed data from teststream', data.results[0]);
     res.status(201).end(data.results[0].transcript);
   }
 }));
});


// Transcribes a local audio file that already exisits
// RETURN the transcribed text string when done
app.post('/testFile', function(req, res) {
  Speech.streamFile('./Server/audio/test.wav',(data)=>{
    console.log(data.results);
    if(data.endpointerType === 'ENDPOINTER_EVENT_UNSPECIFIED') {
      res.status(201).send(data.results[0].transcript);
    }
  });
});



// Mike's translation code
app.post('/txtTranslate', function(req, res) {
  console.log(Translater(req.body.textTranslate, 'es'));
})


//Apurva's text to voice
app.get('/textToSpeech', (req, res) => {
  t2s.getSpeechStreamFromChunks('Hola. Soy una persona impresionante. Mi nombre es Apurva.', (err, data) => {
    if (err) {
        console.log(err.code)
    } else if (data) {
      console.log('inside data of getSpeechStreamFromChunks');
        if (data.AudioStream instanceof Buffer) {
            // Initiate the source
            var bufferStream = new Stream.PassThrough()
            // convert AudioStream into a readable stream
            bufferStream.end(data.AudioStream)
            // Pipe into Player
            bufferStream.pipe(res)
        }
    }
  });
});




server.listen(port, function () {
 console.log('server listening to', port);
});