export class Mesh {
  gpuBuffer: GPUBuffer;
  gpuBufferLayout: GPUVertexBufferLayout;

  constructor(device: GPUDevice) {
    const vertice = new Float32Array([
      -0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 0.5, -0.5, 0.0, 0.0, 1.0, 0.0, -0.5, 0.5,
      0.0, 0.0, 0.0, 1.0, -0.5, 0.5, 0.0, 0.0, 0.0, 1.0, 0.5, -0.5, 0.0, 0.0,
      1.0, 0.0, 0.5, 0.5, 0.0, 1.0, 1.0, 0.0,
    ]);

    const usage: GPUBufferUsageFlags =
      GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;

    this.gpuBuffer = device.createBuffer({
      size: vertice.byteLength,
      usage,
      mappedAtCreation: true,
    });
    new Float32Array(this.gpuBuffer.getMappedRange()).set(vertice);
    this.gpuBuffer.unmap();

    this.gpuBufferLayout = {
      arrayStride: 24,
      attributes: [
        {
          format: "float32x3",
          offset: 0,
          shaderLocation: 0,
        },
        {
          format: "float32x3",
          offset: 12,
          shaderLocation: 1,
        },
      ],
    };
  }
}
