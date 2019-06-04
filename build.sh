#!/bin/bash
NGC="node_modules/.bin/ngc"

# node-sass is a dependency of angular-cli and is installed when
# npm install is run in the root of the style guide project
NODE_SASS="node_modules/.bin/node-sass"
SCSS_INPUT_FILE="src/_lib/sass/styles.scss"
CSS_OUTPUT_DIRECTORY="distribution/"

cd "src/_lib/modules"
modules=( $(find . -maxdepth 1 -type d -printf '%P\n') )

cd "../../.."

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

on_success() {
    echo -ne " ${GREEN}✔${NC}"
    echo -ne '\n'
}
on_complete() {
    rc=$?;
    if [[ $rc != 0 ]]; then
        echo -ne '\n'
        exit $rc;
    fi

    if [[ $rc == 0 ]]; then
        on_success;
    fi
}

# Cleaning distribution folder
echo -ne "Cleaning distribution folder"
rm -rf distribution
on_complete

# Run Angular Compiler for each module
for module in "${modules[@]}"
do
    TSCONFIG_PATH="src/_lib/modules/$module/tsconfig.build.json"

    # First check that the tsconfig.build.json exists
    # =============================================================== #
    # If not we make the assumption that this is not an Angular module
    # and we simply copy the directory to the distribution folder
    if [ -e $TSCONFIG_PATH ]
    then
        echo -ne "Building $module module"
        $NGC -p src/_lib/modules/$module/tsconfig.build.json
        on_complete
    else
        echo -ne "$module directory does not contain a tsconfig.build.json file...copying folder to distribution"
        mkdir -p distribution/$module
        cp -R src/_lib/modules/$module/. distribution/$module/
        on_complete
    fi
done

# Copy SASS files
echo -ne "Copying SASS files"
cp -R src/_lib/sass distribution
on_complete

# Compiling SCSS to CSS for CDN delivery
echo -ne "Compiling SCSS to CSS for CDN delivery"
$NODE_SASS $SCSS_INPUT_FILE --o $CSS_OUTPUT_DIRECTORY --output-style compressed --quiet
on_complete

# Copy Assets (images and fonts)
echo -ne "Copying assets (images and fonts)"
cp -R src/assets distribution
on_complete

# Copy readme
echo -ne "Copying README"
cp README.md distribution
on_complete

echo ""
echo "=========================="
echo -ne "${GREEN}Library built successfully${NC}\n"
echo "=========================="
echo ""
