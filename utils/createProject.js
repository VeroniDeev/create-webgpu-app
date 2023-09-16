// const { askWebGPU, bundler, help, language, version } = require("./askProject");
const fs = require("fs");
const path = require("path");

const pathProject = {
  webpackTypescript: {
    filename: "webpack.common.js",
    path: path.resolve(__dirname, "../template/webpack.common.ts"),
  },
  webpackJavascript: {
    filename: "webpack.common.js",
    path: path.resolve(__dirname, "../template/webpack.common.js"),
  },
  viteJavascript: {
    filename: "vite.config.js",
    path: path.resolve(__dirname, "../template/vite.config.js"),
  },
  viteTypescript: {
    filename: "vite.config.js",
    path: path.resolve(__dirname, "../template/vite.config.ts"),
  },

  typescript: {
    parentDir: "src",
    path: path.resolve(__dirname, "../template/typescript"),
  },
  javascript: {
    parentDir: "src",
    path: path.resolve(__dirname, "../template/javascript"),
  },
  html: {
    filename: "index.html",
    path: path.resolve(__dirname, "../template/index.html"),
  },
  wgsl: {
    filename: "shader.wgsl",
    path: path.resolve(__dirname, "../template/shader.wgsl"),
  },
  package: {
    filename: "package.json",
    path: path.resolve(__dirname, "../template/package.json"),
  },
};

const runCommand = {
  webpack: {
    dev: "webpack serve --mode development --config ./webpack.common.js",
    build: "webpack --mode production --config ./webpack.common.js",
  },
  vite: {
    dev: "vite",
    build: "",
    preview: "vite preview",
  },
};

const packageDependence = {
  webpackTypescript: {
    "@types/gl-matrix": "^3.2.0",
    "@webgpu/types": "^0.1.34",
    "ts-loader": "^9.4.4",
    "ts-shader-loader": "^2.0.2",
    typescript: "^5.2.2",
    "html-webpack-plugin": "^5.5.3",
    webpack: "^5.88.2",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1",
  },
  webpackJavascript: {
    "babel-loader": "^8.0.0",
    "@babel/core": "^7.0.0",
    "@babel/preset-env": "^7.0.0",
    "raw-loader": "^4.0.2",
    "html-webpack-plugin": "^5.5.3",
    webpack: "^5.88.2",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1",
  },
  viteJavascript: {
    vite: "^4.4.9",
  },
  viteTypescript: {
    vite: "^4.4.9",
    typescript: "^5.2.2",
  },
};

const copyFile = (path, filename) => {
  fs.copyFile(path, filename, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
};

const readAndWrite = (linkedPath, data) => {
  fs.readdir(data.path, (val, files) => {
    for (let file of files) {
      const filepath = data.path + "/" + file;
      if (file == "tsconfig.json") {
        copyFile(filepath, `${linkedPath}/${file}`);
        continue;
      } else if (file == "shader.d.ts") {
        fs.mkdirSync(`${linkedPath}/${data.parentDir}/types`, (err) => {
          if (err) {
            console.error(err);
            process.exit(1);
          }
        });
        copyFile(filepath, `${linkedPath}/${data.parentDir}/types/${file}`);
      }
      copyFile(filepath, `${linkedPath}/${data.parentDir}/${file}`);
    }
  });
};

const configuePackageAndBundler = (linkedPath, data, option) => {
  const package = require(`${data.package.path}`);
  package.name = option.name;

  if (option.bundler == "webpack") {
    package.scripts = { ...runCommand.webpack };
  } else if (option.bundler == "vite") {
    runCommand.vite.build =
      option.language == "typescript" ? "tsc && vite build" : "vite build";
    package.scripts = { ...runCommand.vite };
  }

  if (option.language == "javascript") {
    package.main = "./src/index.js";
    if (option.bundler == "webpack") {
      package.devDependencies = {
        ...package.devDependencies,
        ...packageDependence.webpackJavascript,
      };
      copyFile(
        data.webpackJavascript.path,
        `${linkedPath}/${data.webpackJavascript.filename}`
      );
    } else if (option.bundler == "vite") {
      package.devDependencies = {
        ...package.devDependencies,
        ...packageDependence.viteJavascript,
      };
      copyFile(
        data.viteJavascript.path,
        `${linkedPath}/${data.viteJavascript.filename}`
      );
    }
  } else if (option.language == "typescript") {
    package.main = "./src/index.ts";
    if (option.bundler == "webpack") {
      package.devDependencies = {
        ...package.devDependencies,
        ...packageDependence.webpackTypescript,
      };
      copyFile(
        data.webpackTypescript.path,
        `${linkedPath}/${data.webpackTypescript.filename}`
      );
    } else if (option.bundler == "vite") {
      package.devDependencies = {
        ...package.devDependencies,
        ...packageDependence.viteTypescript,
      };

      copyFile(
        data.viteTypescript.path,
        `${linkedPath}/${data.viteTypescript.filename}`
      );
    }
  }

  fs.writeFile(
    `${linkedPath}/${data.package.filename}`,
    JSON.stringify(package, null, 2),
    (err) => {
      if (err) console.log(err);
    }
  );
};

const copyShader = (linkedPath, data) => {
  const path = `${linkedPath}/src/shaders`;
  fs.mkdirSync(path, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
  copyFile(data.path, `${path}/${data.filename}`);
};

module.exports.createWebGPU = async (data) => {
  let linkedPath = `${process.cwd()}/${data.name}`;
  fs.mkdirSync(data.name, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });

  fs.mkdirSync(`${linkedPath}/src`, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });

  if (data.language == "typescript") {
    readAndWrite(linkedPath, pathProject.typescript);
  } else if (data.language == "javascript") {
    readAndWrite(linkedPath, pathProject.javascript);
  }

  copyFile(pathProject.html.path, `${linkedPath}/${pathProject.html.filename}`);

  configuePackageAndBundler(linkedPath, pathProject, data);

  copyShader(linkedPath, pathProject.wgsl);
};
