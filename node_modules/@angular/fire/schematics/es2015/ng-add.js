import { SchematicsException } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { JsonParseMode, parseJson } from '@angular-devkit/core';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { listProjects, projectPrompt } from './utils';
import { dependencies as requiredDependencyVersions, devDependencies as requiredDevDependencyVersions } from './versions';
const stringifyFormatted = (obj) => JSON.stringify(obj, null, 2);
const ɵ0 = stringifyFormatted;
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
        throw new SchematicsException(`Error when parsing ${path}: ${e.message}`);
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
        throw new SchematicsException(`Target ${project} already exists in firebase.json`);
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
        throw new SchematicsException(`Firebase project ${firebaseProject} already defined in .firebaserc`);
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
function getWorkspace(host) {
    const possibleFiles = ['/angular.json', '/.angular.json'];
    const path = possibleFiles.filter(path => host.exists(path))[0];
    const configBuffer = host.read(path);
    if (configBuffer === null) {
        throw new SchematicsException(`Could not find angular.json`);
    }
    const content = configBuffer.toString();
    let workspace;
    try {
        workspace = parseJson(content, JsonParseMode.Loose);
    }
    catch (e) {
        throw new SchematicsException(`Could not parse angular.json: ` + e.message);
    }
    return {
        path,
        workspace
    };
}
export const setupNgDeploy = ({ project }) => (host) => from(listProjects()).pipe(switchMap((projects) => projectPrompt(projects)), map(({ firebaseProject }) => setupFirebaseProject(host, { firebaseProject, project })));
export const ngAdd = (options) => (host, context) => {
    const packageJson = host.exists('package.json') && safeReadJSON('package.json', host);
    if (packageJson === undefined) {
        throw new SchematicsException('Could not locate package.json');
    }
    Object.keys(requiredDependencyVersions).forEach(name => {
        packageJson.dependencies[name] = packageJson.dependencies[name] || requiredDependencyVersions[name];
    });
    Object.keys(requiredDevDependencyVersions).forEach(name => {
        packageJson.devDependencies[name] = packageJson.devDependencies[name] || requiredDevDependencyVersions[name];
    });
    overwriteIfExists(host, 'package.json', stringifyFormatted(packageJson));
    const installTaskId = context.addTask(new NodePackageInstallTask());
    context.addTask(new RunSchematicTask('ng-add-setup-firebase-deploy', options), [installTaskId]);
};
export function setupFirebaseProject(tree, options) {
    const { path: workspacePath, workspace } = getWorkspace(tree);
    if (!options.project) {
        if (workspace.defaultProject) {
            options.project = workspace.defaultProject;
        }
        else {
            throw new SchematicsException('No Angular project selected and no default project in the workspace');
        }
    }
    const project = workspace.projects[options.project];
    if (!project) {
        throw new SchematicsException('The specified Angular project is not defined in this workspace');
    }
    if (project.projectType !== 'application') {
        throw new SchematicsException(`Deploy requires an Angular project type of "application" in angular.json`);
    }
    if (!project.architect ||
        !project.architect.build ||
        !project.architect.build.options ||
        !project.architect.build.options.outputPath) {
        throw new SchematicsException(`Cannot read the output path (architect.build.options.outputPath) of the Angular project "${options.project}" in angular.json`);
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
export { ɵ0, ɵ1 };
//# sourceMappingURL=ng-add.js.map