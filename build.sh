#!/bin/bash
NGC="node_modules/.bin/ngc"
modules=("picker")

# Cleaning distribution folder
echo "Cleaning distribution folder"
rm -rf distribution

# Run Angular Compiler for each module
for module in "${modules[@]}"
do
    echo "Building $module module"
    $NGC -p src/_lib/modules/$module/tsconfig.build.json
done

# Copy SASS files
echo "Copying SASS files"
cp -R src/_lib/sass distribution