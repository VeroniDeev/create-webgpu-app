struct TransformData {
    model: mat4x4<f32>,
    view: mat4x4<f32>,
    projection: mat4x4<f32>,
};

@binding(0) @group(0) var<uniform> transformBO: TransformData;

struct Mesh{
    @builtin(position) Position: vec4<f32>,
    @location(0) Color: vec3<f32>,
}

@vertex
fn vs_main(@location(0) posi: vec3<f32>, @location(1) color: vec3<f32>) -> Mesh {
    var frag: Mesh;
    frag.Position = transformBO.projection * transformBO.view * transformBO.model * vec4<f32>(posi, 1.0);
    frag.Color = color;
    return frag;
}

@fragment
fn fs_main(@location(0) Color: vec4<f32>) -> @location(0) vec4<f32>  {
    return Color;
}