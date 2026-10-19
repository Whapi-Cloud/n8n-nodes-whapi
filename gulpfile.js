const path = require('path');
const { task, src, dest, parallel } = require('gulp');

function copyNodeIcons() {
    return src('nodes/**/*.{png,svg}')
        .pipe(dest(path.resolve('dist', 'nodes')));
}

function copyCredentialIcons() {
    return src('credentials/**/*.{png,svg}')
        .pipe(dest(path.resolve('dist', 'credentials')));
}

task('build:icons', parallel(copyNodeIcons, copyCredentialIcons));