import { Renderer } from "./renderer";

const canvas = document.getElementById("webgpu");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const renderer = new Renderer(canvas);
renderer
  .Initialize()
  .then(() => {
    console.log("Render passed with success");
  })
  .catch((error) => {
    console.log("Error !");
    console.log("-------------------------------");
    console.log(error);
  });
