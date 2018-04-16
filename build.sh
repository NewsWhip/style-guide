#!/bin/bash
NGC="node_modules/.bin/ngc"

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
    echo -ne "Building $module module"
    $NGC -p src/_lib/modules/$module/tsconfig.build.json
    on_complete
done

# Copy SASS files
echo -ne "Copying SASS files"
cp -R src/_lib/sass distribution
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
