const alphaVantage = require("./services/alphaVantage");
const brain = require("brain.js")
require('dotenv').config();


(async () => {
   try {
      const brainJsArray = [];

      var toPredict = [];

      //get data  
      const { data } = await alphaVantage.api.get(`query?function=FX_INTRADAY&adjusted=true&from_symbol=${process.env.FROM_SYMBOL}&to_symbol=${process.env.TO_SYMBOL}&interval=${process.env.INTERVAL}&outputsize=full&apikey=${process.env.API_KEY}`)
      const alphaVantageRes = Object.values(Object.values(data)[1]);


      for (let i = 0; i < alphaVantageRes.length; i++) {
         if (i === 0) continue

         const item = Object.values(alphaVantageRes[i]);

         const open = parseFloat(item[Object.keys(item)[0]])
         const high = parseFloat(item[Object.keys(item)[1]])
         const low = parseFloat(item[Object.keys(item)[2]])
         const close = parseFloat(item[Object.keys(item)[3]])

         //CREATING OBJECT TO TRAIN
         brainJsArray.push({
            input: [open, high, low],
            output: open > close ? [1] : [0]
         })


         if (i === alphaVantageRes.length - 1) {
            toPredict = [open, high, low]
            console.log('Proxima previsão:', toPredict)
         }
      }

      const net = new brain.NeuralNetwork({
         binaryThresh: 0.5, // ¯\_(ツ)_/¯
         hiddenLayers: [6],
         activation: 'sigmoid'
      });

      console.log('Treinando rede....')
      net.train(brainJsArray)

      const output = net.run(toPredict);

      const percent = (output[0] * 100).toFixed(2);

      console.log(percent > 50 ? 'Vai subir' : 'Vai descer')

      console.log('Taixa de acerto: ' + percent + '%' )
   
   } catch (error) {
      console.log('ERROR: ', error)

   }
})();

