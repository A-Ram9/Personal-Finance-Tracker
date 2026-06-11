
   module = {
     webpack: {
       configure: (webpackConfig) => {
         // Configure Webpack to stop panicking over strict ESM imports missing extensions
         webpackConfig.module.rules.push({
           test: /\.m?js/,
           resolve: {
             fullySpecified: false,
           },
         });
         return webpackConfig;
       },
     },
   };