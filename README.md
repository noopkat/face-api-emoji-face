Emoji Face Tracking Example
=========================
Using the [Microsoft Face API](https://docs.microsoft.com/en-us/azure/cognitive-services/face/)

![example gif of face tracking](https://cdn.glitch.com/e2329117-f736-4876-bffc-0363486fbcd5%2Femotion-short.gif?1508609604194)

## A couple of things to keep in mind:

This was intended as an experiment only, to test how performant a realtime face tracking app would work with the Face API on slow hotel wifi. It stood up pretty well in the end! The simplicity of this demo is nice because it works with regular HTML elements and a repeated API call.

The Face API totally has a free tier to play with. However, this demo requires the S0 paid tier of the Face API in order to support the high amount of requests per second needed. Therefore this app can cost a chunk of money if you leave this running in a tab! Please be careful if you test this out with your own API key. I can't take responsibility for your wallet 🙏🏻 

There are alternative solutions for this sort of use which work offline and run locally on your machine. Their performance and accuracy might vary, and the code needed can be a little more involved. A couple to look at:

+ [node-opencv](https://github.com/peterbraden/node-opencv)
+ [OpenFace](https://cmusatyalab.github.io/openface/)

## How to run this example

1. Clone this repo
2. With NodeJS installed, run `npm install` in the cloned directory
3. [Create a new Face API key on the S0 tier (caution: costs money)](https://docs.microsoft.com/en-us/azure/cognitive-services/face/) and paste the key into the [source code in client.js](https://github.com/noopkat/face-api-emoji-face/blob/master/public/client.js#L19)
4. Run `npm start` in your terminal and open a browser tab pointed at your localhost on port 3000.
