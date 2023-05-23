// @ts-check
const fs = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;
const rimraf = require("rimraf");
const ngcPath = path.join('node_modules', '.bin', 'ngc');
const sass = require('sass');
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
    copyLintingConfig();
    copyFile('README.md', 'Copying README');
    utils.onComplete();
}

const clean = () => {
    console.log("Cleaning distribution folder");
    rimraf.sync(utils.distPath);
    utils.logSeparator();
}

const buildModules = () => {
    fs.readdirSync(modulesDirectory)
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

        compileModule(tsConfigPath);

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

const compileModule = (tsConfigPath) => {
    try {
        execSync(`${ngcPath} -p ${tsConfigPath}`)
    } catch(err) {
        throw err;
    }
}

const copySassFiles = () => {
    const sourcePath = path.join('src', '_lib', 'sass');
    const destinationPath = path.join(utils.distPath, 'sass');
    copyDir(sourcePath, destinationPath, 'Copying SASS files')
}

const compileSass = () => {
    process.stdout.write('Compiling SCSS to CSS for CDN delivery');

    const sourceFile = path.join('src', '_lib', 'sass', 'styles.scss');
    const destFile = path.join(utils.distPath, 'styles.css');

    try {
        const result = sass.compile(sourceFile, {
            style: 'compressed'
        });
        fs.writeFileSync(destFile, result.css);
        utils.onSuccess();
    } catch(err) {
        utils.onError();
        throw err;
    }
}

const copyAssets = () => {
    const sourceDir = path.join('src', 'assets');
    const destinationPath = path.join(utils.distPath, 'assets');

    copyDir(sourceDir, destinationPath, 'Copying assets (images and fonts)')
}

const copyLintingConfig = () => {
    const dirName = 'linting-config';
    const sourceDir = path.join(dirName);
    const destinationPath = path.join(utils.distPath, dirName);

    copyDir(sourceDir, destinationPath, 'Copying linting config')
}

/**
 * @param {string} sourceFile 
 * @param {string} message 
 */
const copyFile = (sourceFile, message) => {
    process.stdout.write(message);

    const destFile = path.join(utils.distPath, sourceFile);

    try {
        fs.copyFileSync(sourceFile, destFile);
        utils.onSuccess();
    } catch (err) {
        utils.onError();
        throw err;
    }
}

/**
 * @param {string} sourceDir
 * @param {string} destPath
 * @param {string} message
 */
const copyDir = (sourceDir, destPath, message) => {
    process.stdout.write(message);

    try {
        fs.copySync(sourceDir, destPath);
        utils.onSuccess();
    } catch (err) {
        utils.onError();
        throw err;
    }
}

run();
