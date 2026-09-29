import { Tree } from '@angular-devkit/schematics';
interface NgAddOptions {
    firebaseProject: string;
    project?: string;
}
interface DeployOptions {
    project: string;
}
export declare const setupNgDeploy: ({ project }: DeployOptions) => (host: import("@angular-devkit/schematics/src/tree/interface").Tree) => import("rxjs").Observable<import("@angular-devkit/schematics/src/tree/interface").Tree>;
export declare const ngAdd: (options: DeployOptions) => (host: import("@angular-devkit/schematics/src/tree/interface").Tree, context: import("@angular-devkit/schematics").TypedSchematicContext<{}, {}>) => void;
export declare function setupFirebaseProject(tree: Tree, options: NgAddOptions): import("@angular-devkit/schematics/src/tree/interface").Tree;
export {};
