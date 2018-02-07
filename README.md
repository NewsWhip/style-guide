# NewsWhip Style Guide

A library of components based on Bootstrap Sass 3.x

## Install

`npm i --save nw-style-guide`

## Usage

In your SASS file:

```

// Import your own app variables
@import './variables.scss';

// Import the NewsWhip style guide
@import "node_modules/nw-style-guide/src/_lib/sass/styles.scss";

```

This functions as a drop-in replacement for the styles of Bootstrap SASS 3.x.

NOTE: the import above will also include fontawesome

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

### Overrides

- `bootstrap/button-groups`
- `bootstrap/forms`
- `bootstrap/modals`

### Drop-in replacements

- `bootstrap/buttons`
- `bootstrap/close`
- `bootstrap/dropdowns`
- `bootstrap/labels`
- `bootstrap/list-group`
- `bootstrap/navs`
- `bootstrap/scaffolding`


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.