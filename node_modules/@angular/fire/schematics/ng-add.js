"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const core_1 = require("@angular-devkit/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("./utils");
const versions_1 = require("./versions");
const stringifyFormatted = (obj) => JSON.stringify(obj, null, 2);
const ɵ0 = stringifyFormatted;
exports.ɵ0 = ɵ0;
function emptyFirebaseJson() {
    return {
        hosting: []
    };
}
function emptyFirebaseRc() {
    return {
        targets: {}
    };
}
function generateHostingConfig(project, dist) {
    return {
        target: project,
        public: dist,
        ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
        rewrites: [
            {
                source: '**',
                destination: '/index.html'
            }
        ]
    };
}
function safeReadJSON(path, tree) {
    try {
        return JSON.parse(tree.read(path).toString());
    }
    catch (e) {
        throw new schematics_1.SchematicsException(`Error when parsing ${path}: ${e.message}`);
    }
}
function generateFirebaseJson(tree, path, project, dist) {
    let firebaseJson = tree.exists(path)
        ? safeReadJSON(path, tree)
        : emptyFirebaseJson();
    if (firebaseJson.hosting &&
        (Array.isArray(firebaseJson.hosting) &&
            firebaseJson.hosting.find(config => config.target === project) ||
            firebaseJson.hosting.target === project)) {
        throw new schematics_1.SchematicsException(`Target ${project} already exists in firebase.json`);
    }
    const newConfig = generateHostingConfig(project, dist);
    if (firebaseJson.hosting === undefined) {
        firebaseJson.hosting = newConfig;
    }
    else if (Array.isArray(firebaseJson.hosting)) {
        firebaseJson.hosting.push(newConfig);
    }
    else {
        firebaseJson.hosting = [firebaseJson.hosting, newConfig];
    }
    overwriteIfExists(tree, path, stringifyFormatted(firebaseJson));
}
function generateFirebaseRcTarget(firebaseProject, project) {
    return {
        hosting: {
            [project]: [
                firebaseProject
            ]
        }
    };
}
function generateFirebaseRc(tree, path, firebaseProject, project) {
    const firebaseRc = tree.exists(path)
        ? safeReadJSON(path, tree)
        : emptyFirebaseRc();
    firebaseRc.targets = firebaseRc.targets || {};
    if (firebaseProject in firebaseRc.targets) {
        throw new schematics_1.SchematicsException(`Firebase project ${firebaseProject} already defined in .firebaserc`);
    }
    firebaseRc.targets[firebaseProject] = generateFirebaseRcTarget(firebaseProject, project);
    overwriteIfExists(tree, path, stringifyFormatted(firebaseRc));
}
const overwriteIfExists = (tree, path, content) => {
    if (tree.exists(path))
        tree.overwrite(path, content);
    else
        tree.create(path, content);
};
const ɵ1 = overwriteIfExists;
exports.ɵ1 = ɵ1;
function getWorkspace(host) {
    const possibleFiles = ['/angular.json', '/.angular.json'];
    const path = possibleFiles.filter(path => host.exists(path))[0];
    const configBuffer = host.read(path);
    if (configBuffer === null) {
        throw new schematics_1.SchematicsException(`Could not find angular.json`);
    }
    const content = configBuffer.toString();
    let workspace;
    try {
        workspace = core_1.parseJson(content, core_1.JsonParseMode.Loose);
    }
    catch (e) {
        throw new schematics_1.SchematicsException(`Could not parse angular.json: ` + e.message);
    }
    return {
        path,
        workspace
    };
}
exports.setupNgDeploy = ({ project }) => (host) => rxjs_1.from(utils_1.listProjects()).pipe(operators_1.switchMap((projects) => utils_1.projectPrompt(projects)), operators_1.map(({ firebaseProject }) => setupFirebaseProject(host, { firebaseProject, project })));
exports.ngAdd = (options) => (host, context) => {
    const packageJson = host.exists('package.json') && safeReadJSON('package.json', host);
    if (packageJson === undefined) {
        throw new schematics_1.SchematicsException('Could not locate package.json');
    }
    Object.keys(versions_1.dependencies).forEach(name => {
        packageJson.dependencies[name] = packageJson.dependencies[name] || versions_1.dependencies[name];
    });
    Object.keys(versions_1.devDependencies).forEach(name => {
        packageJson.devDependencies[name] = packageJson.devDependencies[name] || versions_1.devDependencies[name];
    });
    overwriteIfExists(host, 'package.json', stringifyFormatted(packageJson));
    const installTaskId = context.addTask(new tasks_1.NodePackageInstallTask());
    context.addTask(new tasks_1.RunSchematicTask('ng-add-setup-firebase-deploy', options), [installTaskId]);
};
function setupFirebaseProject(tree, options) {
    const { path: workspacePath, workspace } = getWorkspace(tree);
    if (!options.project) {
        if (workspace.defaultProject) {
            options.project = workspace.defaultProject;
        }
        else {
            throw new schematics_1.SchematicsException('No Angular project selected and no default project in the workspace');
        }
    }
    const project = workspace.projects[options.project];
    if (!project) {
        throw new schematics_1.SchematicsException('The specified Angular project is not defined in this workspace');
    }
    if (project.projectType !== 'application') {
        throw new schematics_1.SchematicsException(`Deploy requires an Angular project type of "application" in angular.json`);
    }
    if (!project.architect ||
        !project.architect.build ||
        !project.architect.build.options ||
        !project.architect.build.options.outputPath) {
        throw new schematics_1.SchematicsException(`Cannot read the output path (architect.build.options.outputPath) of the Angular project "${options.project}" in angular.json`);
    }
    const outputPath = project.architect.build.options.outputPath;
    project.architect['deploy'] = {
        builder: '@angular/fire:deploy',
        options: {}
    };
    tree.overwrite(workspacePath, JSON.stringify(workspace, null, 2));
    generateFirebaseJson(tree, 'firebase.json', options.project, outputPath);
    generateFirebaseRc(tree, '.firebaserc', options.firebaseProject, options.project);
    return tree;
}
exports.setupFirebaseProject = setupFirebaseProject;
//# sourceMappingURL=ng-add.js.map