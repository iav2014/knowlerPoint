/**
 * gestureControl.js
 *
 * this code use hand classifier to detect right and left movement
 * to govern power point server presentation.
 * using webcam device
 * (c) Nacho Ariza Nov 2018
 * MIT License
 */

const cv = require('opencv4nodejs');

const camera = new cv.VideoCapture(0); // or
const minDetectionsHand = 20;
const minDetectionsFist = 15;
const classifiers = {
	palm: './classifiers/palm.xml', // detect human face classifier
	fist: './classifiers/fist.xml' // detect human face classifier
};
const threshold = 8;
// cv.CascadeClassifier(0); // 0 to read from webcam device (macosx)
const classifier = new cv.CascadeClassifier(classifiers.fist);
const classifier2 = new cv.CascadeClassifier(classifiers.palm);
// BLUE/GREEN/RED
const green = new cv.Vec(0, 255, 0);
const red = new cv.Vec(0, 0, 255);
const yellow = new cv.Vec(0, 255, 255);
const blue = new cv.Vec(255, 0, 0);
const white = new cv.Vec(255, 255, 255);
let face_region_color = blue;
let text_color = green;
let counter = 0;
let xx = 640;
let swipe_right = 0;
let swipe_left = 0;
let ft = true;

let request = require('request');

let next = () => {
	try {
		request.get('http://localhost:3010/next', function (err, response, body) {
			if (err) {
				console.log(err)
			}
		})
	} catch (err) {
		console.error(err);
	}
};
let prev = () => {
	try {
		request.get('http://localhost:3010/prev', function (err, response, body) {
			if (err) {
				console.log(err)
			}
		})
	} catch (err) {
		console.error(err);
	}
};

const detect = (frame) => {
	const result = classifier.detectMultiScale(frame);//detectMultiScale(frame);
	const result2 = classifier2.detectMultiScale(frame);//detectMultiScale(frame);
	//console.log(result);
	
	result.objects.forEach((handRect, i) => {
		if (result.numDetections[i] < minDetectionsHand) {
			//console.log('=>',result.numDetections[i], minDetections, counter);
			//console.log('NONE');
			return frame;
		} else {
			if (ft) {
				xx = handRect.x;
				ft = false;
			}
			console.log('FIST', handRect.x, xx, swipe_right, swipe_left);
			if (handRect.x < xx) {
				swipe_right++;
			} else {
				swipe_left++;
			}
			
			if (swipe_right > threshold) {
				console.log('----> RIGHT');
				next();
				swipe_right = swipe_left = 0;
				ft = true;
			} else if (swipe_left > threshold) {
				console.log('LEFT <----');
				swipe_left = swipe_right = 0;
				prev();
				ft = true;
			} else {
				xx = handRect.x;
			}
			const rect = cv.drawDetection(
				frame,
				handRect,
				{color: yellow, segmentFraction: 1}
			);
		}
		
	});
	result2.objects.forEach((fistRect, i) => {
		if (result2.numDetections[i] < minDetectionsFist) {
			//console.log('=>',result.numDetections[i], minDetections, counter);
			return frame;
		} else {
			console.log('PALM', fistRect);
			const rect = cv.drawDetection(
				frame,
				fistRect,
				{color: green, segmentFraction: 1}
			);
		}
		
	});
	return frame;
};

const delay = 1;
let recursive = (value) => {
	let frame = camera.read();
	// loop back to start on end of stream reached
	if (frame.empty) {
		camera.reset();
		frame = camera.read();
		console.log('empty');
	} else {
		cv.imshow('knowlerPoint', detect(frame.resize(480 / 2, 640 / 2)));
		const key = cv.waitKey(delay);
	}
	
	setTimeout(recursive, 1);
};
recursive(1);