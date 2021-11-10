# NewsWhip Style Guide

A library of components based on Bootstrap Sass 3.x

## Install

`npm i --save nw-style-guide`

Alternatively, the styles are available via cdn at

`https://cdn.jsdelivr.net/npm/nw-style-guide@{{version}}/styles.css`

or

`https://unpkg.com/nw-style-guide@{{version}}/styles.css`

## Usage

In your SASS file:

```scss
// Import your own app variables (if you have any)
@import './variables.scss';

// Import the entire NewsWhip style guide
@import "node_modules/nw-style-guide/sass/styles.scss";
```

> :warning: If you are importing the entire `styles.scss` file you do not need to import the individual functions, mixins and variables as outlined below. The `styles.scss` bundle already includes these

---

If you wish to import only specific parts of the style guide you first need to import the core library (functions, mixins and variables). The order of these imports is important

```scss
// Import the core (required) files in this order
@import "node_modules/nw-style-guide/sass/src/functions/functions";
@import "node_modules/nw-style-guide/sass/src/mixins/mixins";
@import "node_modules/nw-style-guide/sass/src/variables";
```

```scss
// Now you include the specific section of the style guide you require
@import "node_modules/nw-style-guide/sass/src/labels";
@import "node_modules/nw-style-guide/sass/src/forms";
```

In order to use the Proxima Nova font-family that comes bundled with the Style Guide, you will need to set the `$nw-font-path` variable in your own `variables.scss` file. This variable is a path that points to the fonts folder in the installed `nw-style-guide` package in your `node_modules` folder.

```scss
// your variables.scss file
$nw-font-path: '~nw-style-guide/assets/fonts';
```

---

## Development and release process

1. Create a new feature branch off master
2. Implement feature / fix in feature branch
3. Create pull request
4. PR is approved
5. Build the Github Pages demo in the feature branch
    - `npm run ghpages`
    - Make sure to `git add --all` not to end up with untracked files
    - Commit with message `build:ghpages`
    - Push changes
    - `npm version {{version_type}}` to bump the version. The bump is automatically committed.
    - Push changes
6. Merge pull request to master
7. After merging to master, checkout master
8. Publish the new package version to npm with `npm run package:release`
    - `npm run package:release` first runs the `package:build` script
    - it then publishes the built files to npm

### Development

We use several npm scripts to generate modules, components and directives. The following is an example of creating a tabs module, component, and directive.

`> npm run g:module tabs`

`> npm run g:component tabs`

`> npm run g:directive tabs`
 
This is now what our `src` directory looks like

![src directory](https://i.imgur.com/BjSjf41.png)

### Library publication

This final step in the release process above is
> Publish the updated package to the npm repository

We don't want to publish all our assets to npm, only the assets required by the consumer. In order to achieve this we run our release script which builds the required files to the `distribution` folder.

```shell
> npm run package:release
```

This script does a few things:

1. It runs the `build.js` script which does the following
   - Cleans the `distribution` folder
   - Compiles each Angular module with `ngc` using the specific `tsconfig.build.json` for that module
   - Copies the `sass` folder 
   - Copies the `README.md`
2. Copies the `package.json` file
3. Updates the copied `package.json` private property to `false`
4. Publishes the `distribution` folder to npm

_Publication will fail if the version in `package.json` has not been updated_.

### Github pages

We use Github pages to continuously deploy the application. When Github detects a change to the `/docs` folder in master, a redeployment takes place.

We can build the `/docs` folder for Github pages by running `npm run ghpages`.

**It's important to rebuild the `/docs` folder before branches are merged to master. Otherwise new features or fixes won't be visible on our demo site on Github Pages. As part of a pull request the `/docs` folder should be rebuilt using `npm run ghpages`**

### Local server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Building local versions

Sometimes we won't want to release a beta version for testing changes, namely when making extensive changes that require continuous local testing inside the product. For this purpose we can run the `make-local-tgz` script and use it as follows:  
- Make a `.tgz` package of Style Guide by running `npm run package:make-local-tgz`.
- Copy absolute path of newly built `.tgz` package from console logs.
- Paste it into the product's (e.g. Spike's) `package.json` file in place of the current `nw-style-guide` version to test your SG changes locally, without the need to publish a beta version.
