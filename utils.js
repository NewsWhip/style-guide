const green = '\x1b[0;92m';
const red = '\x1b[0;91m';
const noColor = '\x1b[0m';

export const distPath = 'lib-dist/nw-style-guide/';
export { green, red, noColor };

export const onSuccess = () => {
    process.stdout.write(`${green} ✔ ${noColor}`);
    process.stdout.write('\n');
};

export const onError = () => {
    process.stdout.write(`${red} ✘ ${noColor}`);
    process.stdout.write('\n');
};

export const logSeparator = () => {
    console.log('============================');
};
