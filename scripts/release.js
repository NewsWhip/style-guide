import { execSync } from 'child_process';
import * as utils from '../utils.js';

const run = async () => {
    await import('./build.js');

    process.stdout.write('Publishing package \n');

    try {
        /**
         * We want the child process executed here to use the parent std in and out so that we can enter
         * the one-time-password (OTP) that we should be prompted for due the 2FA applied to the package
         *
         * ref: https://nodejs.org/api/child_process.html#optionsstdio
         * ref: https://stackoverflow.com/a/31104898/1128290
         */
        execSync(`npm publish ${utils.distPath}`, {
            stdio: 'inherit'
        });
    } catch (err) {
        throw err;
    }
};

run();
