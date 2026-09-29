(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/effects/schematics-core", ["require", "exports", "@ngrx/effects/schematics-core/utility/strings", "@ngrx/effects/schematics-core/utility/ast-utils", "@ngrx/effects/schematics-core/utility/change", "@ngrx/effects/schematics-core/utility/config", "@ngrx/effects/schematics-core/utility/find-module", "@ngrx/effects/schematics-core/utility/ngrx-utils", "@ngrx/effects/schematics-core/utility/project", "@ngrx/effects/schematics-core/utility/update", "@ngrx/effects/schematics-core/utility/parse-name", "@ngrx/effects/schematics-core/utility/package", "@ngrx/effects/schematics-core/utility/libs-version", "@ngrx/effects/schematics-core/utility/visit-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const strings_1 = require("@ngrx/effects/schematics-core/utility/strings");
    var ast_utils_1 = require("@ngrx/effects/schematics-core/utility/ast-utils");
    exports.findNodes = ast_utils_1.findNodes;
    exports.getSourceNodes = ast_utils_1.getSourceNodes;
    exports.getDecoratorMetadata = ast_utils_1.getDecoratorMetadata;
    exports.getContentOfKeyLiteral = ast_utils_1.getContentOfKeyLiteral;
    exports.insertAfterLastOccurrence = ast_utils_1.insertAfterLastOccurrence;
    exports.insertImport = ast_utils_1.insertImport;
    exports.addBootstrapToModule = ast_utils_1.addBootstrapToModule;
    exports.addDeclarationToModule = ast_utils_1.addDeclarationToModule;
    exports.addExportToModule = ast_utils_1.addExportToModule;
    exports.addImportToModule = ast_utils_1.addImportToModule;
    exports.addProviderToModule = ast_utils_1.addProviderToModule;
    exports.replaceImport = ast_utils_1.replaceImport;
    var change_1 = require("@ngrx/effects/schematics-core/utility/change");
    exports.NoopChange = change_1.NoopChange;
    exports.InsertChange = change_1.InsertChange;
    exports.RemoveChange = change_1.RemoveChange;
    exports.ReplaceChange = change_1.ReplaceChange;
    exports.createReplaceChange = change_1.createReplaceChange;
    exports.createChangeRecorder = change_1.createChangeRecorder;
    exports.commitChanges = change_1.commitChanges;
    var config_1 = require("@ngrx/effects/schematics-core/utility/config");
    exports.getWorkspace = config_1.getWorkspace;
    exports.getWorkspacePath = config_1.getWorkspacePath;
    var find_module_1 = require("@ngrx/effects/schematics-core/utility/find-module");
    exports.findModule = find_module_1.findModule;
    exports.findModuleFromOptions = find_module_1.findModuleFromOptions;
    exports.buildRelativePath = find_module_1.buildRelativePath;
    var ngrx_utils_1 = require("@ngrx/effects/schematics-core/utility/ngrx-utils");
    exports.addReducerToState = ngrx_utils_1.addReducerToState;
    exports.addReducerToStateInterface = ngrx_utils_1.addReducerToStateInterface;
    exports.addReducerImportToNgModule = ngrx_utils_1.addReducerImportToNgModule;
    exports.addReducerToActionReducerMap = ngrx_utils_1.addReducerToActionReducerMap;
    exports.omit = ngrx_utils_1.omit;
    var project_1 = require("@ngrx/effects/schematics-core/utility/project");
    exports.getProjectPath = project_1.getProjectPath;
    exports.getProject = project_1.getProject;
    exports.isLib = project_1.isLib;
    exports.stringUtils = {
        dasherize: strings_1.dasherize,
        decamelize: strings_1.decamelize,
        camelize: strings_1.camelize,
        classify: strings_1.classify,
        underscore: strings_1.underscore,
        group: strings_1.group,
        capitalize: strings_1.capitalize,
        featurePath: strings_1.featurePath,
        pluralize: strings_1.pluralize,
    };
    var update_1 = require("@ngrx/effects/schematics-core/utility/update");
    exports.updatePackage = update_1.updatePackage;
    var parse_name_1 = require("@ngrx/effects/schematics-core/utility/parse-name");
    exports.parseName = parse_name_1.parseName;
    var package_1 = require("@ngrx/effects/schematics-core/utility/package");
    exports.addPackageToPackageJson = package_1.addPackageToPackageJson;
    var libs_version_1 = require("@ngrx/effects/schematics-core/utility/libs-version");
    exports.platformVersion = libs_version_1.platformVersion;
    var visit_utils_1 = require("@ngrx/effects/schematics-core/utility/visit-utils");
    exports.visitTSSourceFiles = visit_utils_1.visitTSSourceFiles;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2VmZmVjdHMvc2NoZW1hdGljcy1jb3JlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsMkVBVTJCO0lBRTNCLDZFQWE2QjtJQVozQixnQ0FBQSxTQUFTLENBQUE7SUFDVCxxQ0FBQSxjQUFjLENBQUE7SUFDZCwyQ0FBQSxvQkFBb0IsQ0FBQTtJQUNwQiw2Q0FBQSxzQkFBc0IsQ0FBQTtJQUN0QixnREFBQSx5QkFBeUIsQ0FBQTtJQUN6QixtQ0FBQSxZQUFZLENBQUE7SUFDWiwyQ0FBQSxvQkFBb0IsQ0FBQTtJQUNwQiw2Q0FBQSxzQkFBc0IsQ0FBQTtJQUN0Qix3Q0FBQSxpQkFBaUIsQ0FBQTtJQUNqQix3Q0FBQSxpQkFBaUIsQ0FBQTtJQUNqQiwwQ0FBQSxtQkFBbUIsQ0FBQTtJQUNuQixvQ0FBQSxhQUFhLENBQUE7SUFHZix1RUFVMEI7SUFQeEIsOEJBQUEsVUFBVSxDQUFBO0lBQ1YsZ0NBQUEsWUFBWSxDQUFBO0lBQ1osZ0NBQUEsWUFBWSxDQUFBO0lBQ1osaUNBQUEsYUFBYSxDQUFBO0lBQ2IsdUNBQUEsbUJBQW1CLENBQUE7SUFDbkIsd0NBQUEsb0JBQW9CLENBQUE7SUFDcEIsaUNBQUEsYUFBYSxDQUFBO0lBR2YsdUVBQTZFO0lBQXpELGdDQUFBLFlBQVksQ0FBQTtJQUFFLG9DQUFBLGdCQUFnQixDQUFBO0lBRWxELGlGQUsrQjtJQUo3QixtQ0FBQSxVQUFVLENBQUE7SUFDViw4Q0FBQSxxQkFBcUIsQ0FBQTtJQUNyQiwwQ0FBQSxpQkFBaUIsQ0FBQTtJQUluQiwrRUFNOEI7SUFMNUIseUNBQUEsaUJBQWlCLENBQUE7SUFDakIsa0RBQUEsMEJBQTBCLENBQUE7SUFDMUIsa0RBQUEsMEJBQTBCLENBQUE7SUFDMUIsb0RBQUEsNEJBQTRCLENBQUE7SUFDNUIsNEJBQUEsSUFBSSxDQUFBO0lBR04seUVBQXNFO0lBQTdELG1DQUFBLGNBQWMsQ0FBQTtJQUFFLCtCQUFBLFVBQVUsQ0FBQTtJQUFFLDBCQUFBLEtBQUssQ0FBQTtJQUU3QixRQUFBLFdBQVcsR0FBRztRQUN6QixTQUFTLEVBQVQsbUJBQVM7UUFDVCxVQUFVLEVBQVYsb0JBQVU7UUFDVixRQUFRLEVBQVIsa0JBQVE7UUFDUixRQUFRLEVBQVIsa0JBQVE7UUFDUixVQUFVLEVBQVYsb0JBQVU7UUFDVixLQUFLLEVBQUwsZUFBSztRQUNMLFVBQVUsRUFBVixvQkFBVTtRQUNWLFdBQVcsRUFBWCxxQkFBVztRQUNYLFNBQVMsRUFBVCxtQkFBUztLQUNWLENBQUM7SUFFRix1RUFBaUQ7SUFBeEMsaUNBQUEsYUFBYSxDQUFBO0lBRXRCLCtFQUFpRDtJQUF4QyxpQ0FBQSxTQUFTLENBQUE7SUFFbEIseUVBQTREO0lBQW5ELDRDQUFBLHVCQUF1QixDQUFBO0lBRWhDLG1GQUF5RDtJQUFoRCx5Q0FBQSxlQUFlLENBQUE7SUFFeEIsaUZBQTJEO0lBQWxELDJDQUFBLGtCQUFrQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgZGFzaGVyaXplLFxuICBkZWNhbWVsaXplLFxuICBjYW1lbGl6ZSxcbiAgY2xhc3NpZnksXG4gIHVuZGVyc2NvcmUsXG4gIGdyb3VwLFxuICBjYXBpdGFsaXplLFxuICBmZWF0dXJlUGF0aCxcbiAgcGx1cmFsaXplLFxufSBmcm9tICcuL3V0aWxpdHkvc3RyaW5ncyc7XG5cbmV4cG9ydCB7XG4gIGZpbmROb2RlcyxcbiAgZ2V0U291cmNlTm9kZXMsXG4gIGdldERlY29yYXRvck1ldGFkYXRhLFxuICBnZXRDb250ZW50T2ZLZXlMaXRlcmFsLFxuICBpbnNlcnRBZnRlckxhc3RPY2N1cnJlbmNlLFxuICBpbnNlcnRJbXBvcnQsXG4gIGFkZEJvb3RzdHJhcFRvTW9kdWxlLFxuICBhZGREZWNsYXJhdGlvblRvTW9kdWxlLFxuICBhZGRFeHBvcnRUb01vZHVsZSxcbiAgYWRkSW1wb3J0VG9Nb2R1bGUsXG4gIGFkZFByb3ZpZGVyVG9Nb2R1bGUsXG4gIHJlcGxhY2VJbXBvcnQsXG59IGZyb20gJy4vdXRpbGl0eS9hc3QtdXRpbHMnO1xuXG5leHBvcnQge1xuICBIb3N0LFxuICBDaGFuZ2UsXG4gIE5vb3BDaGFuZ2UsXG4gIEluc2VydENoYW5nZSxcbiAgUmVtb3ZlQ2hhbmdlLFxuICBSZXBsYWNlQ2hhbmdlLFxuICBjcmVhdGVSZXBsYWNlQ2hhbmdlLFxuICBjcmVhdGVDaGFuZ2VSZWNvcmRlcixcbiAgY29tbWl0Q2hhbmdlcyxcbn0gZnJvbSAnLi91dGlsaXR5L2NoYW5nZSc7XG5cbmV4cG9ydCB7IEFwcENvbmZpZywgZ2V0V29ya3NwYWNlLCBnZXRXb3Jrc3BhY2VQYXRoIH0gZnJvbSAnLi91dGlsaXR5L2NvbmZpZyc7XG5cbmV4cG9ydCB7XG4gIGZpbmRNb2R1bGUsXG4gIGZpbmRNb2R1bGVGcm9tT3B0aW9ucyxcbiAgYnVpbGRSZWxhdGl2ZVBhdGgsXG4gIE1vZHVsZU9wdGlvbnMsXG59IGZyb20gJy4vdXRpbGl0eS9maW5kLW1vZHVsZSc7XG5cbmV4cG9ydCB7XG4gIGFkZFJlZHVjZXJUb1N0YXRlLFxuICBhZGRSZWR1Y2VyVG9TdGF0ZUludGVyZmFjZSxcbiAgYWRkUmVkdWNlckltcG9ydFRvTmdNb2R1bGUsXG4gIGFkZFJlZHVjZXJUb0FjdGlvblJlZHVjZXJNYXAsXG4gIG9taXQsXG59IGZyb20gJy4vdXRpbGl0eS9uZ3J4LXV0aWxzJztcblxuZXhwb3J0IHsgZ2V0UHJvamVjdFBhdGgsIGdldFByb2plY3QsIGlzTGliIH0gZnJvbSAnLi91dGlsaXR5L3Byb2plY3QnO1xuXG5leHBvcnQgY29uc3Qgc3RyaW5nVXRpbHMgPSB7XG4gIGRhc2hlcml6ZSxcbiAgZGVjYW1lbGl6ZSxcbiAgY2FtZWxpemUsXG4gIGNsYXNzaWZ5LFxuICB1bmRlcnNjb3JlLFxuICBncm91cCxcbiAgY2FwaXRhbGl6ZSxcbiAgZmVhdHVyZVBhdGgsXG4gIHBsdXJhbGl6ZSxcbn07XG5cbmV4cG9ydCB7IHVwZGF0ZVBhY2thZ2UgfSBmcm9tICcuL3V0aWxpdHkvdXBkYXRlJztcblxuZXhwb3J0IHsgcGFyc2VOYW1lIH0gZnJvbSAnLi91dGlsaXR5L3BhcnNlLW5hbWUnO1xuXG5leHBvcnQgeyBhZGRQYWNrYWdlVG9QYWNrYWdlSnNvbiB9IGZyb20gJy4vdXRpbGl0eS9wYWNrYWdlJztcblxuZXhwb3J0IHsgcGxhdGZvcm1WZXJzaW9uIH0gZnJvbSAnLi91dGlsaXR5L2xpYnMtdmVyc2lvbic7XG5cbmV4cG9ydCB7IHZpc2l0VFNTb3VyY2VGaWxlcyB9IGZyb20gJy4vdXRpbGl0eS92aXNpdC11dGlscyc7XG4iXX0=