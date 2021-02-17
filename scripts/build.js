const fs = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;
const rimraf = require("rimraf");
const ngcPath = path.join('node_modules', '.bin', 'ngc');
const nodeSassPath = path.join('node_modules', '.bin', 'node-sass');
const modulesDirectory = path.join('src', '_lib', 'modules');
const utils = require('../utils');

const isDirectory = source => fs.lstatSync(source).isDirectory();

const run = () => {
    console.log("\n");
    // Remove the distribution folder
    clean();
    // Create the distribution folder
    fs.mkdirSync(utils.distPath);
    // For each module, try to compile the Angular module
    buildModules();
    utils.logSeparator();
    copySassFiles();
    compileSass();
    copyAssets();
    copyReadme();
    utils.onComplete();
}

const clean = () => {
    console.log("Cleaning distribution folder");
    rimraf.sync(utils.distPath);
    utils.logSeparator();
}

const buildModules = () => {
    const directories  = fs.readdirSync(modulesDirectory)
        .map(name => path.join(modulesDirectory, name))
        .filter(item => isDirectory(item))
        .forEach(directory => buildModule(directory))
}

const buildModule = (directoryPath) => {
    const dirName = path.basename(directoryPath);
    const outputPath = utils.distPath + dirName;
    const tsConfigPath = path.join(directoryPath, 'tsconfig.build.json');

    /**
     * First check that the tsconfig.build.json exists
     * ===============================================================
     * If not we make the assumption that this is not an Angular module
     * and we simply copy the directory to the distribution folder
     */
    if (fs.existsSync(tsConfigPath)) {
        process.stdout.write(`Building ${dirName} module`);

        compileModule(tsConfigPath, outputPath);

        utils.onSuccess();
    }
    else {
        console.warn(`${directoryPath} directory does not contain a tsconfig.build.json file...copying folder to ${utils.distPath}`);

        fs.mkdirSync(outputPath);

        try {
            fs.copySync(directoryPath, outputPath);
        } catch (err) {
            throw err;
        }
    }
}

const compileModule = (tsConfigPath, outputPath) => {
    try {
        execSync(`${ngcPath} -p ${tsConfigPath}`)
    } catch(err) {
        throw err;
    }
}

const copySassFiles = () => {
    process.stdout.write('Copying SASS files');

    const sourcePath = path.join('src', '_lib', 'sass');
    const destinationPath = path.join(utils.distPath, 'sass');

    fs.mkdirSync(destinationPath);

    try {
        fs.copySync(sourcePath, destinationPath);
        utils.onSuccess();
    } catch (err) {
        utils.onError();
        throw err;
    }
}

const compileSass = () => {
    process.stdout.write('Compiling SCSS to CSS for CDN delivery');

    const sourceFile = path.join('src', '_lib', 'sass', 'styles.scss');
    const args = [
        `--o ${utils.distPath}`,
        `--output-style compressed`,
        `--quiet`
    ];

    try {
        execSync(`${nodeSassPath} ${sourceFile} ${args.join(' ')}`)
        utils.onSuccess();
    } catch(err) {
        utils.onError();
        throw err;
    }
}

const copyAssets = () => {
    process.stdout.write('Copying assets (images and fonts)');

    const sourceDir = path.join('src', 'assets');
    const destinationPath = path.join(utils.distPath, 'assets');

    try {
        fs.copySync(sourceDir, destinationPath);
        utils.onSuccess();
    } catch (err) {
        utils.onError();
        throw err;
    }
}

const copyReadme = () => {
    process.stdout.write('Copying README');

    const sourceFile = 'README.md';
    const destFile = path.join(utils.distPath, sourceFile);

    try {
        fs.copyFileSync(sourceFile, destFile);
        utils.onSuccess();
    } catch (err) {
        utils.onError();
        throw err;
    }
}

run();
