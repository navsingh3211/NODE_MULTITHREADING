import express from 'express';
import {Worker} from 'worker_threads';


const app = express();
const port = 3000;
const THREAD_COUNT = 4;

app.get("/non-blocking",async(req,res)=>{
  res.status(200).send("This page is non-blocking.");
});

function createWorker(){
  return new Promise((resolve,reject)=>{
    const worker = new Worker("./four-workers.js",{
      workerData:{thread_count:THREAD_COUNT}
    });

    worker.on("message",(data)=>{
      resolve(data);
    });
  
    worker.on("error",(error)=>{
      reject(error);
    });
  });
}

/* with worker thread */
app.get("/blocking",async(req,res)=>{
  const workerPromises = [];
  for(let i=0;i<THREAD_COUNT;i++){
    workerPromises.push(createWorker());
  }
  
  const thread_result = await Promise.all(workerPromises);
  const total = thread_result[0] + 
  thread_result[1] + 
  thread_result[2] + 
  thread_result[3];

  res.status(200).send(`result after multithreading with worker is ${total}`)
});

app.listen(port,()=>{
  console.log(`app is listening on port ${port}`);
})