(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/effects/schematics/ng-add/index", ["require", "exports", "@angular-devkit/schematics", "@ngrx/effects/schematics-core", "typescript", "@angular-devkit/schematics/tasks"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular-devkit/schematics");
    const schematics_core_1 = require("@ngrx/effects/schematics-core");
    const ts = require("typescript");
    const tasks_1 = require("@angular-devkit/schematics/tasks");
    function addImportToNgModule(options) {
        return (host) => {
            const modulePath = options.module;
            if (!modulePath) {
                return host;
            }
            if (!host.exists(modulePath)) {
                throw new Error(`Specified module path ${modulePath} does not exist`);
            }
            const text = host.read(modulePath);
            if (text === null) {
                throw new schematics_1.SchematicsException(`File ${modulePath} does not exist.`);
            }
            const sourceText = text.toString('utf-8');
            const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
            const effectsName = `${schematics_core_1.stringUtils.classify(`${options.name}Effects`)}`;
            const effectsModuleImport = schematics_core_1.insertImport(source, modulePath, 'EffectsModule', '@ngrx/effects');
            const effectsPath = `/${options.path}/` +
                (options.flat ? '' : schematics_core_1.stringUtils.dasherize(options.name) + '/') +
                (options.group ? 'effects/' : '') +
                schematics_core_1.stringUtils.dasherize(options.name) +
                '.effects';
            const relativePath = schematics_core_1.buildRelativePath(modulePath, effectsPath);
            const effectsImport = schematics_core_1.insertImport(source, modulePath, effectsName, relativePath);
            const effectsSetup = options.minimal ? `[]` : `[${effectsName}]`;
            const [effectsNgModuleImport] = schematics_core_1.addImportToModule(source, modulePath, `EffectsModule.forRoot(${effectsSetup})`, relativePath);
            let changes = [effectsModuleImport, effectsNgModuleImport];
            if (!options.minimal) {
                changes = changes.concat([effectsImport]);
            }
            const recorder = host.beginUpdate(modulePath);
            for (const change of changes) {
                if (change instanceof schematics_core_1.InsertChange) {
                    recorder.insertLeft(change.pos, change.toAdd);
                }
            }
            host.commitUpdate(recorder);
            return host;
        };
    }
    function addNgRxEffectsToPackageJson() {
        return (host, context) => {
            schematics_core_1.addPackageToPackageJson(host, 'dependencies', '@ngrx/effects', schematics_core_1.platformVersion);
            context.addTask(new tasks_1.NodePackageInstallTask());
            return host;
        };
    }
    function default_1(options) {
        return (host, context) => {
            options.path = schematics_core_1.getProjectPath(host, options);
            if (options.module) {
                options.module = schematics_core_1.findModuleFromOptions(host, options);
            }
            const parsedPath = schematics_core_1.parseName(options.path, options.name || '');
            options.name = parsedPath.name;
            options.path = parsedPath.path;
            const templateSource = schematics_1.apply(schematics_1.url('./files'), [
                options.spec
                    ? schematics_1.noop()
                    : schematics_1.filter(path => !path.endsWith('.spec.ts.template')),
                options.minimal ? schematics_1.filter(_ => false) : schematics_1.noop(),
                schematics_1.applyTemplates(Object.assign({}, schematics_core_1.stringUtils, { 'if-flat': (s) => schematics_core_1.stringUtils.group(options.flat ? '' : s, options.group ? 'effects' : '') }, options)),
                schematics_1.move(parsedPath.path),
            ]);
            return schematics_1.chain([
                schematics_1.branchAndMerge(schematics_1.chain([addImportToNgModule(options), schematics_1.mergeWith(templateSource)])),
                options && options.skipPackageJson
                    ? schematics_1.noop()
                    : addNgRxEffectsToPackageJson(),
            ])(host, context);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2VmZmVjdHMvc2NoZW1hdGljcy9uZy1hZGQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSwyREFjb0M7SUFDcEMsbUVBV3VDO0lBQ3ZDLGlDQUFpQztJQUVqQyw0REFBMEU7SUFFMUUsU0FBUyxtQkFBbUIsQ0FBQyxPQUFzQjtRQUNqRCxPQUFPLENBQUMsSUFBVSxFQUFFLEVBQUU7WUFDcEIsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUVsQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNmLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsVUFBVSxpQkFBaUIsQ0FBQyxDQUFDO2FBQ3ZFO1lBRUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNuQyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ2pCLE1BQU0sSUFBSSxnQ0FBbUIsQ0FBQyxRQUFRLFVBQVUsa0JBQWtCLENBQUMsQ0FBQzthQUNyRTtZQUNELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFMUMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUNoQyxVQUFVLEVBQ1YsVUFBVSxFQUNWLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUN0QixJQUFJLENBQ0wsQ0FBQztZQUVGLE1BQU0sV0FBVyxHQUFHLEdBQUcsNkJBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDO1lBRXhFLE1BQU0sbUJBQW1CLEdBQUcsOEJB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bWF0aWNzRXhjZXB0aW9uLFxuICBUcmVlLFxuICBhcHBseSxcbiAgYXBwbHlUZW1wbGF0ZXMsXG4gIGJyYW5jaEFuZE1lcmdlLFxuICBjaGFpbixcbiAgZmlsdGVyLFxuICBtZXJnZVdpdGgsXG4gIG1vdmUsXG4gIG5vb3AsXG4gIHVybCxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgSW5zZXJ0Q2hhbmdlLFxuICBhZGRJbXBvcnRUb01vZHVsZSxcbiAgYnVpbGRSZWxhdGl2ZVBhdGgsXG4gIGZpbmRNb2R1bGVGcm9tT3B0aW9ucyxcbiAgZ2V0UHJvamVjdFBhdGgsXG4gIGluc2VydEltcG9ydCxcbiAgcGFyc2VOYW1lLFxuICBzdHJpbmdVdGlscyxcbiAgYWRkUGFja2FnZVRvUGFja2FnZUpzb24sXG4gIHBsYXRmb3JtVmVyc2lvbixcbn0gZnJvbSAnQG5ncngvZWZmZWN0cy9zY2hlbWF0aWNzLWNvcmUnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgeyBTY2hlbWEgYXMgRWZmZWN0T3B0aW9ucyB9IGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCB7IE5vZGVQYWNrYWdlSW5zdGFsbFRhc2sgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcy90YXNrcyc7XG5cbmZ1bmN0aW9uIGFkZEltcG9ydFRvTmdNb2R1bGUob3B0aW9uczogRWZmZWN0T3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCBtb2R1bGVQYXRoID0gb3B0aW9ucy5tb2R1bGU7XG5cbiAgICBpZiAoIW1vZHVsZVBhdGgpIHtcbiAgICAgIHJldHVybiBob3N0O1xuICAgIH1cblxuICAgIGlmICghaG9zdC5leGlzdHMobW9kdWxlUGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU3BlY2lmaWVkIG1vZHVsZSBwYXRoICR7bW9kdWxlUGF0aH0gZG9lcyBub3QgZXhpc3RgKTtcbiAgICB9XG5cbiAgICBjb25zdCB0ZXh0ID0gaG9zdC5yZWFkKG1vZHVsZVBhdGgpO1xuICAgIGlmICh0ZXh0ID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgRmlsZSAke21vZHVsZVBhdGh9IGRvZXMgbm90IGV4aXN0LmApO1xuICAgIH1cbiAgICBjb25zdCBzb3VyY2VUZXh0ID0gdGV4dC50b1N0cmluZygndXRmLTgnKTtcblxuICAgIGNvbnN0IHNvdXJjZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXG4gICAgICBtb2R1bGVQYXRoLFxuICAgICAgc291cmNlVGV4dCxcbiAgICAgIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsXG4gICAgICB0cnVlXG4gICAgKTtcblxuICAgIGNvbnN0IGVmZmVjdHNOYW1lID0gYCR7c3RyaW5nVXRpbHMuY2xhc3NpZnkoYCR7b3B0aW9ucy5uYW1lfUVmZmVjdHNgKX1gO1xuXG4gICAgY29uc3QgZWZmZWN0c01vZHVsZUltcG9ydCA9IGluc2VydEltcG9ydChcbiAgICAgIHNvdXJjZSxcbiAgICAgIG1vZHVsZVBhdGgsXG4gICAgICAnRWZmZWN0c01vZHVsZScsXG4gICAgICAnQG5ncngvZWZmZWN0cydcbiAgICApO1xuXG4gICAgY29uc3QgZWZmZWN0c1BhdGggPVxuICAgICAgYC8ke29wdGlvbnMucGF0aH0vYCArXG4gICAgICAob3B0aW9ucy5mbGF0ID8gJycgOiBzdHJpbmdVdGlscy5kYXNoZXJpemUob3B0aW9ucy5uYW1lKSArICcvJykgK1xuICAgICAgKG9wdGlvbnMuZ3JvdXAgPyAnZWZmZWN0cy8nIDogJycpICtcbiAgICAgIHN0cmluZ1V0aWxzLmRhc2hlcml6ZShvcHRpb25zLm5hbWUpICtcbiAgICAgICcuZWZmZWN0cyc7XG4gICAgY29uc3QgcmVsYXRpdmVQYXRoID0gYnVpbGRSZWxhdGl2ZVBhdGgobW9kdWxlUGF0aCwgZWZmZWN0c1BhdGgpO1xuICAgIGNvbnN0IGVmZmVjdHNJbXBvcnQgPSBpbnNlcnRJbXBvcnQoXG4gICAgICBzb3VyY2UsXG4gICAgICBtb2R1bGVQYXRoLFxuICAgICAgZWZmZWN0c05hbWUsXG4gICAgICByZWxhdGl2ZVBhdGhcbiAgICApO1xuXG4gICAgY29uc3QgZWZmZWN0c1NldHVwID0gb3B0aW9ucy5taW5pbWFsID8gYFtdYCA6IGBbJHtlZmZlY3RzTmFtZX1dYDtcbiAgICBjb25zdCBbZWZmZWN0c05nTW9kdWxlSW1wb3J0XSA9IGFkZEltcG9ydFRvTW9kdWxlKFxuICAgICAgc291cmNlLFxuICAgICAgbW9kdWxlUGF0aCxcbiAgICAgIGBFZmZlY3RzTW9kdWxlLmZvclJvb3QoJHtlZmZlY3RzU2V0dXB9KWAsXG4gICAgICByZWxhdGl2ZVBhdGhcbiAgICApO1xuXG4gICAgbGV0IGNoYW5nZXMgPSBbZWZmZWN0c01vZHVsZUltcG9ydCwgZWZmZWN0c05nTW9kdWxlSW1wb3J0XTtcblxuICAgIGlmICghb3B0aW9ucy5taW5pbWFsKSB7XG4gICAgICBjaGFuZ2VzID0gY2hhbmdlcy5jb25jYXQoW2VmZmVjdHNJbXBvcnRdKTtcbiAgICB9XG5cbiAgICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUobW9kdWxlUGF0aCk7XG4gICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgY2hhbmdlcykge1xuICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICB9XG4gICAgfVxuICAgIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5mdW5jdGlvbiBhZGROZ1J4RWZmZWN0c1RvUGFja2FnZUpzb24oKSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uKFxuICAgICAgaG9zdCxcbiAgICAgICdkZXBlbmRlbmNpZXMnLFxuICAgICAgJ0BuZ3J4L2VmZmVjdHMnLFxuICAgICAgcGxhdGZvcm1WZXJzaW9uXG4gICAgKTtcbiAgICBjb250ZXh0LmFkZFRhc2sobmV3IE5vZGVQYWNrYWdlSW5zdGFsbFRhc2soKSk7XG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wdGlvbnM6IEVmZmVjdE9wdGlvbnMpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgb3B0aW9ucy5wYXRoID0gZ2V0UHJvamVjdFBhdGgoaG9zdCwgb3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucy5tb2R1bGUpIHtcbiAgICAgIG9wdGlvbnMubW9kdWxlID0gZmluZE1vZHVsZUZyb21PcHRpb25zKGhvc3QsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcnNlZFBhdGggPSBwYXJzZU5hbWUob3B0aW9ucy5wYXRoLCBvcHRpb25zLm5hbWUgfHwgJycpO1xuICAgIG9wdGlvbnMubmFtZSA9IHBhcnNlZFBhdGgubmFtZTtcbiAgICBvcHRpb25zLnBhdGggPSBwYXJzZWRQYXRoLnBhdGg7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZVNvdXJjZSA9IGFwcGx5KHVybCgnLi9maWxlcycpLCBbXG4gICAgICBvcHRpb25zLnNwZWNcbiAgICAgICAgPyBub29wKClcbiAgICAgICAgOiBmaWx0ZXIocGF0aCA9PiAhcGF0aC5lbmRzV2l0aCgnLnNwZWMudHMudGVtcGxhdGUnKSksXG4gICAgICBvcHRpb25zLm1pbmltYWwgPyBmaWx0ZXIoXyA9PiBmYWxzZSkgOiBub29wKCksXG4gICAgICBhcHBseVRlbXBsYXRlcyh7XG4gICAgICAgIC4uLnN0cmluZ1V0aWxzLFxuICAgICAgICAnaWYtZmxhdCc6IChzOiBzdHJpbmcpID0+XG4gICAgICAgICAgc3RyaW5nVXRpbHMuZ3JvdXAoXG4gICAgICAgICAgICBvcHRpb25zLmZsYXQgPyAnJyA6IHMsXG4gICAgICAgICAgICBvcHRpb25zLmdyb3VwID8gJ2VmZmVjdHMnIDogJydcbiAgICAgICAgICApLFxuICAgICAgICAuLi4ob3B0aW9ucyBhcyBvYmplY3QpLFxuICAgICAgfSBhcyBhbnkpLFxuICAgICAgbW92ZShwYXJzZWRQYXRoLnBhdGgpLFxuICAgIF0pO1xuXG4gICAgcmV0dXJuIGNoYWluKFtcbiAgICAgIGJyYW5jaEFuZE1lcmdlKFxuICAgICAgICBjaGFpbihbYWRkSW1wb3J0VG9OZ01vZHVsZShvcHRpb25zKSwgbWVyZ2VXaXRoKHRlbXBsYXRlU291cmNlKV0pXG4gICAgICApLFxuICAgICAgb3B0aW9ucyAmJiBvcHRpb25zLnNraXBQYWNrYWdlSnNvblxuICAgICAgICA/IG5vb3AoKVxuICAgICAgICA6IGFkZE5nUnhFZmZlY3RzVG9QYWNrYWdlSnNvbigpLFxuICAgIF0pKGhvc3QsIGNvbnRleHQpO1xuICB9O1xufVxuIl19