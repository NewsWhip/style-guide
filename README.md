# NewsWhip Style Guide

A library of components based on Bootstrap Sass 3.x

## Install

`npm i --save nw-style-guide`

## Usage

In your SASS file:

```scss
// Import your own app variables
@import './variables.scss';

// Import the entire NewsWhip style guide
@import "node_modules/nw-style-guide/sass/styles.scss";
```

This functions as a drop-in replacement for the styles of Bootstrap SASS 3.x.

---

If you wish to import only specific parts of the style guide you first need to import the core library.

```scss
// Import the core (required) files
@import "node_modules/nw-style-guide/sass/src/functions/functions";
@import "node_modules/nw-style-guide/sass/src/mixins/mixins";
@import "node_modules/nw-style-guide/sass/src/variables";

// Now you include the specific section of the style guide you require
@import "node_modules/nw-style-guide/sass/src/labels";
@import "node_modules/nw-style-guide/sass/src/forms";
```

## Components

### Removed

- `bootstrap/variables`
- `bootstrap/breadcrumbs`
- `bootstrap/carousel`
- `bootstrap/glyphicons`
- `bootstrap/jumbotron`
- `bootstrap/pager`
- `bootstrap/panels`
- `bootstrap/progress-bars`
- `bootstrap/wells`

### New

- `links`
- `relative-weight`
- `shadows`
- `toasts`
- `filters`
- `picker`

### Overrides

- `bootstrap/button-groups`
- `bootstrap/modals`
- `bootstrap/tooltip`
- `bootstrap/table`
- `bootstrap/pagination`

### Drop-in replacements

- `bootstrap/buttons`
- `bootstrap/close`
- `bootstrap/dropdowns`
- `bootstrap/labels`
- `bootstrap/list-group`
- `bootstrap/navs`
- `bootstrap/scaffolding`
- `bootstrap/popovers`
- `bootstrap/forms`
- `bootstrap/type`

---

## Development and release process

1. Create a new development branch off master
2. Implement feature / fix in development branch
3. Create pull request
4. PR is approved
5. Build the Github Pages demo in the development branch
    - `npm run ghpages`
6. Merge pull request to master
7. After merging to master, create a new release branch off master
8. Update the npm package version
    - Depending on the type of release this will usually be "major", "minor" or "patch"
    - Package version is updated by running `npm version {{version_type}}`
    - e.g. `npm version patch` - this will increment the patch part of the package version
    - more info at https://docs.npmjs.com/cli/version
9. The update to `package.json` should be auto-committed
10. Push the package update to your release branch
11. Create PR
12. PR approved
13. Merge to master
14. Checkout master
15. Publish the updated package to npm repository
    - `./release.sh`

### Github pages

We use Github pages to continuously deploy the application. When Github detects a change to the `/docs` folder in master, a redeployment takes place.

We can build the `/docs` folder for Github pages by running `npm run ghpages`.

**It's important to rebuild the `/docs` folder before branches are merged to master. Otherwise new features or fixes won't be visible on our demo site on Github Pages. As part of a pull request the `/docs` folder should be rebuilt using `npm run ghpages`**

### Local server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.
