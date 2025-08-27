const green = '\033[0;92m';
const red = '\033[0;91m';
const noColor = '\033[0m';

exports.distPath = 'dist/nw-style-guide/';
exports.green = green;
exports.red = red;
exports.noColor = noColor;

exports.onSuccess = () => {
    process.stdout.write(`${green} ✔ ${noColor}`);
    process.stdout.write('\n');
};

exports.onError = () => {
    process.stdout.write(`${red} ✘ ${noColor}`);
    process.stdout.write('\n');
};

exports.logSeparator = () => {
    console.log("============================");
};
