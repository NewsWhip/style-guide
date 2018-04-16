#!/bin/bash
. build.sh

JSON="node_modules/.bin/json"

# Copy package.json file
echo -ne "Copying package.json file"
cp package.json distribution
on_complete

# Update private field to false
echo "Updating private field"
$JSON -I -f distribution/package.json -e "this.private=false"

# Publish the distribution folder to npm
echo "Publishing package"
npm publish distribution/

rc=$?;
if [[ $rc != 0 ]]; then
    echo -ne '\n'
    exit $rc;
fi

if [[ $rc == 0 ]]; then
    echo ""
    echo "=========================="
    echo -ne " ${GREEN}Package successfully published${NC}\n"
    echo "=========================="
    echo ""
fi
