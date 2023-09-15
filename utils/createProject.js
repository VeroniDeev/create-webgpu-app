const { askWebGPU, bundler, help, language, version } = require("./askProject");
const fs = require("fs");
const path = require("path");

const pathProject = {
  webpack: {
    filename: "webpack.common.js",
    path: path.resolve(__dirname, "../template/webpack.common.js"),
  },
};

module.exports.createWebGPU = async () => {
  const webGPUProjectData = await askWebGPU();
  fs.mkdir(webGPUProjectData.name, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
  let linkedPath = process.cwd() + "/" + webGPUProjectData.name;
  fs.copyFile(
    pathProject.webpack.path,
    linkedPath + "/" + pathProject.webpack.filename,
    (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    }
  );
};
