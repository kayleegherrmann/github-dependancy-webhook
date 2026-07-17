const fs = require('fs');

const meta = {
    repository: process.env.GITHUB_REPOSITORY || null,
    branch: process.env.GITHUB_REF_NAME || null,
    commit: process.env.GITHUB_SHA || null,
    actor: process.env.GITHUB_ACTOR || null,
    message: process.env.COMMIT_MESSAGE || 'Manual workflow dispatch',
};

if (!fs.existsSync('composer.json') || !fs.existsSync('composer.lock')) {
    console.log(JSON.stringify({
        ...meta,
        ecosystem: 'composer',
        dependencies: []
    }));

    process.exit();
}

const composer = JSON.parse(fs.readFileSync('composer.json'));
const lock = JSON.parse(fs.readFileSync('composer.lock'));

const directDependencies = {
    ...(composer.require || {}),
    ...(composer['require-dev'] || {})
};

const packages = [
    ...(lock.packages || []),
    ...(lock['packages-dev'] || [])
];

console.log(JSON.stringify({
    ...meta,
    ecosystem: 'composer',

    dependencies: packages
        .filter(pkg => directDependencies[pkg.name])
        .map(pkg => ({
            name: pkg.name,
            version: pkg.version,
            type: pkg.type,
            source_reference: pkg.source?.reference ?? null
        }))
}));
