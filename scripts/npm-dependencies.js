const fs = require('fs');

if (!fs.existsSync('package.json') || !fs.existsSync('package-lock.json')) {
    console.log(JSON.stringify({
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
    ecosystem: 'npm',
    dependencies
}));