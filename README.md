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

### Prerequisites

- If you don't have one, you'll need to [create an npm account](https://www.npmjs.com/signup)
- You'll need to  [login](https://docs.npmjs.com/creating-a-new-npm-user-account#testing-your-new-account-with-npm-login) on a local command line
- Request to be added as a maintainer to the nw-style-guide [npm package](https://www.npmjs.com/package/nw-style-guide)
- [Enable 2FA](https://docs.npmjs.com/configuring-two-factor-authentication) on your npm account
- Add Font Awesome registry and authentication token to your global .npmrc file which is generated after logging in to npm 
```
    @fortawesome:registry=https://npm.fontawesome.com/
    /npm.fontawesome.com/:_authToken=xxxxxxxxxxxxxxxxxxxxxxx // replace with Fontawesome Pro authToken
    //registry.npmjs.org/:_authToken=xxxxxxxxxxxxxxxxxxxxxxx // replace with your authToken from npm
```
### Features and fixes

1. Create a new feature branch off master
1. Implement feature / fix in feature branch
1. Create pull request
1. Update the package version with the command `npm version {{version_type}}`. The version bump is automatically committed. See [here](https://docs.npmjs.com/cli/v6/commands/npm-version#synopsis) for further information on the `npm version` command
1. Push changes
1. PR is approved
1. Merge pull request to master
1. After merging to master, the docs will be deployed to Github pages, a new release will be created (if the version in package.json has changed), and a new version will be published to npm

### Manually publishing the package to npm
If there is an issue with Github Actions and we need to manually publish the package, we can do so with the `npm run package:release` script

> :bulb: At the end of the `package:release` script you will be prompted for a one-time-password (OTP). You should get this OTP from whatever authenticator app you're using

### Development

We use several npm scripts to generate modules, components and directives. The following is an example of creating a tabs module, component, and directive.

`> npm run g:module tabs`

`> npm run g:component tabs`

`> npm run g:directive tabs`
 
This is now what our `src` directory looks like

![src directory](https://i.imgur.com/BjSjf41.png)

### Further info on package release / publication

This final step in the release process above is
> Publish the new package version to npm

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

> :warning: Publication will fail if the version in `package.json` has not been updated

### Github pages

We use Github pages to continuously deploy the application. This deployment is handled automatically with the [build-and-deploy-docs](./.github/workflows/build-and-deploy-docs.yml) Github workflow. Whenever the master branch is updated, you can expect this workflow to trigger.

### Building local versions

Sometimes we won't want to release a beta version for testing changes, namely when making extensive changes that require continuous local testing inside the product. For this purpose we can run the `make-local-tgz` script and use it as follows:  
- Make a `.tgz` package of Style Guide by running `npm run package:make-local-tgz`.
- Copy absolute path of newly built `.tgz` package from console logs.
- Paste it into the product's (e.g. Spike's) `package.json` file in place of the current `nw-style-guide` version to test your SG changes locally, without the need to publish a beta version.
