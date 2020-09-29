# Charts module

There are some differences in tsconfig.build.json compared to other modules. `ChartsModule` utilizes another Style Guide module, `ResizeObserverModule`. This is imported in `charts.module.ts`. If we try to import this module with the default `rootDir` of `'.'` we'll get an error complaining that we're importing something from outsdie the root directory. Because of this we've updated the `rootDir` to `'../'` and consequently the `baseUrl` to `'../'` to prevent creating a directory structure like:

charts<br>
--> charts<br>
--> resize-observer<br>
