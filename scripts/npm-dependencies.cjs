const fs = require('fs');

const meta = {
    repository: process.env.GITHUB_REPOSITORY || null,
    branch: process.env.GITHUB_REF_NAME || null,
    commit: process.env.GITHUB_SHA || null,
    actor: process.env.GITHUB_ACTOR || null,
    message: process.env.COMMIT_MESSAGE || 'Manual workflow dispatch',
};

if (!fs.existsSync('package.json') || !fs.existsSync('package-lock.json')) {
    console.log(JSON.stringify({
        ...meta,
        ecosystem: 'npm',
        dependencies: []
    }));

    process.exit();
}

const packageJson = JSON.parse(fs.readFileSync('package.json'));
const packageLock = JSON.parse(fs.readFileSync('package-lock.json'));

const directDependencies = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {})
};

const dependencies = Object.keys(directDependencies)
    .map(name => {
        const packageInfo = packageLock.packages?.[`node_modules/${name}`];

        if (!packageInfo) {
            return null;
        }

        return {
            name,
            version: packageInfo.version,
            source_reference: null
        };
    })
    .filter(Boolean);

console.log(JSON.stringify({
    ...meta,
    ecosystem: 'npm',
    dependencies
}));
