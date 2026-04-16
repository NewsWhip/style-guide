// @ts-check
import fs from 'fs-extra';
import path from 'path';
import sass from 'sass';
import * as utils from '../utils.js';
import { execSync } from 'child_process';

const run = () => {
    execSync('ng build nw-style-guide', { stdio: 'inherit' });
    utils.logSeparator();
    compileSass();
};

const compileSass = () => {
    process.stdout.write('Compiling SCSS to CSS for CDN delivery');

    const sourceFile = path.join('projects', 'nw-style-guide', 'src', 'lib', 'sass', 'styles.scss');
    const destFile = path.join(utils.distPath, 'styles.css');

    try {
        const result = sass.compile(sourceFile, {
            style: 'compressed',
            loadPaths: ['node_modules']
        });
        fs.writeFileSync(destFile, result.css);
        utils.onSuccess();
    } catch (err) {
        utils.onError();
        throw err;
    }
};

run();
