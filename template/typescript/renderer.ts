import { mat4 } from "gl-matrix";
import { Mesh } from "./mesh";
import shader from "./shaders/shader.wgsl";

export class Renderer {
  canvas: HTMLCanvasElement;
  adaptater!: GPUAdapter;
  device!: GPUDevice;
  context!: GPUCanvasContext;
  format: GPUTextureFormat;

  bindGroup!: GPUBindGroup;
  uniformBuffer!: GPUBuffer;
  pipeline!: GPURenderPipeline;

  mesh!: Mesh;

  rotate: number = 0.0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("webgpu") as GPUCanvasContext;
    this.format = "rgba8unorm";
    this.rotate = 0.0;
  }

  async Initialize() {
    await this.setupDevice();
    await this.newMesh();
    await this.createPipeline();
    this.render();
  }

  async setupDevice() {
    this.adaptater = (await navigator.gpu.requestAdapter()) as GPUAdapter;
    this.device = (await this.adaptater.requestDevice()) as GPUDevice;
    this.context.configure({
      device: this.device,
      format: this.format,
    });
  }

  async newMesh() {
    this.mesh = new Mesh(this.device);
  }

  async createPipeline() {
    this.uniformBuffer = this.device.createBuffer({
      size: 64 * 3,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ],
    });

    this.bindGroup = this.device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.uniformBuffer,
          },
        },
      ],
    });

    const pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    });

    this.pipeline = this.device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: this.device.createShaderModule({
          code: shader,
        }),
        entryPoint: "vs_main",
        buffers: [this.mesh.gpuBufferLayout],
      },
      fragment: {
        module: this.device.createShaderModule({
          code: shader,
        }),
        entryPoint: "fs_main",
        targets: [
          {
            format: this.format,
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
  }

  render = () => {
    this.rotate += 0.01;
    if (this.rotate > 2.0 * Math.PI) {
      this.rotate -= 2.0 * Math.PI;
    }

    const projection = mat4.create();
    mat4.perspective(
      projection,
      Math.PI / 4,
      this.canvas.width / this.canvas.height,
      0.1,
      10
    );

    const view = mat4.create();
    mat4.lookAt(view, [-2, 0, 2], [0, 0, 0], [0, 0, 1]);

    const model = mat4.create();
    mat4.rotate(model, model, this.rotate, [0, 0, 1]);

    this.device.queue.writeBuffer(this.uniformBuffer, 0, model as ArrayBuffer);
    this.device.queue.writeBuffer(this.uniformBuffer, 64, view as ArrayBuffer);
    this.device.queue.writeBuffer(
      this.uniformBuffer,
      128,
      projection as ArrayBuffer
    );

    const commandEncoder = this.device.createCommandEncoder();
    const texture = this.context.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          loadOp: "clear",
          storeOp: "store",
          clearValue: [0.45, 0.67, 0.77, 1.0],
          view: texture,
        },
      ],
    });

    renderPass.setPipeline(this.pipeline);
    renderPass.setVertexBuffer(0, this.mesh.gpuBuffer);
    renderPass.setBindGroup(0, this.bindGroup);
    renderPass.draw(6);
    renderPass.end();

    this.device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(this.render);
  };
}
