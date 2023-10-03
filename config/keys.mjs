import prodConfig from './prod.mjs';
import devConfig from './dev.mjs';

let config;

if (process.env.NODE_ENV === 'production') {
    config = prodConfig;
} else {
    config = devConfig;
}

export default config;
