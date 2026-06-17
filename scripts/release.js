import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import * as utils from '../utils.js';

const ALLOWED_PRERELEASE_TAGS = ['alpha', 'beta', 'rc'];

const resolveDistTag = (version) => {
    const prerelease = version.split('-')[1];
    if (!prerelease) return null;

    const identifier = prerelease.split('.')[0];
    if (!ALLOWED_PRERELEASE_TAGS.includes(identifier)) {
        throw new Error(
            `Unrecognised pre-release identifier "${identifier}" in version "${version}". ` +
                `Expected one of: ${ALLOWED_PRERELEASE_TAGS.join(', ')}.`
        );
    }
    return identifier;
};

const run = async () => {
    await import('./build.js');

    const { version } = JSON.parse(
        fs.readFileSync(path.join(utils.distPath, 'package.json'), 'utf8')
    );
    const tag = resolveDistTag(version);
    const tagFlag = tag ? `--tag ${tag}` : '';

    process.stdout.write(`Publishing ${version} with dist-tag "${tag ?? 'latest'}" \n`);

    try {
        /**
         * We want the child process executed here to use the parent std in and out so that we can enter
         * the one-time-password (OTP) that we should be prompted for due the 2FA applied to the package
         *
         * ref: https://nodejs.org/api/child_process.html#optionsstdio
         * ref: https://stackoverflow.com/a/31104898/1128290
         */
        execSync(`npm publish ${utils.distPath} ${tagFlag}`, {
            stdio: 'inherit'
        });
    } catch (err) {
        throw err;
    }
};

await run();
