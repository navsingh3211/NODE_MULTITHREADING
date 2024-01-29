import express from 'express';
import {Worker} from 'worker_threads';


const app = express();
const port = 3000;

app.get("/non-blocking",async(req,res)=>{
  res.status(200).send("This page is non-blocking.");
})

/* with worker thread */
app.get("/blocking",async(req,res)=>{
  const worker = new Worker("./worker.js");

  worker.on("message",(data)=>{
    res.status(200).send(`result is ${data}`);
  });

  worker.on("error",(error)=>{
    res.status(404).send(`An error occured ${error}`);
  });
});


//previous
/*
app.get("/blocking",async(req,res)=>{
  let counter = 0;
  for(let i = 0;i< 20_000_000_000;i++){
    counter++;
  }

  res.status(200).send(`result is ${counter}`);
});
*/

app.listen(port,()=>{
  console.log(`app is listening on port ${port}`);
})