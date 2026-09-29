(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/effects/schematics-core/utility/ngrx-utils", ["require", "exports", "typescript", "@ngrx/effects/schematics-core/utility/strings", "@ngrx/effects/schematics-core/utility/change", "@angular-devkit/schematics", "@angular-devkit/core", "@ngrx/effects/schematics-core/utility/find-module", "@ngrx/effects/schematics-core/utility/ast-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    const stringUtils = require("@ngrx/effects/schematics-core/utility/strings");
    const change_1 = require("@ngrx/effects/schematics-core/utility/change");
    const schematics_1 = require("@angular-devkit/schematics");
    const core_1 = require("@angular-devkit/core");
    const find_module_1 = require("@ngrx/effects/schematics-core/utility/find-module");
    const ast_utils_1 = require("@ngrx/effects/schematics-core/utility/ast-utils");
    function addReducerToState(options) {
        return (host) => {
            if (!options.reducers) {
                return host;
            }
            const reducersPath = core_1.normalize(`/${options.path}/${options.reducers}`);
            if (!host.exists(reducersPath)) {
                throw new Error(`Specified reducers path ${reducersPath} does not exist`);
            }
            const text = host.read(reducersPath);
            if (text === null) {
                throw new schematics_1.SchematicsException(`File ${reducersPath} does not exist.`);
            }
            const sourceText = text.toString('utf-8');
            const source = ts.createSourceFile(reducersPath, sourceText, ts.ScriptTarget.Latest, true);
            const reducerPath = `/${options.path}/` +
                (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
                (options.group ? 'reducers/' : '') +
                stringUtils.dasherize(options.name) +
                '.reducer';
            const relativePath = find_module_1.buildRelativePath(reducersPath, reducerPath);
            const reducerImport = ast_utils_1.insertImport(source, reducersPath, `* as from${stringUtils.classify(options.name)}`, relativePath, true);
            const stateInterfaceInsert = addReducerToStateInterface(source, reducersPath, options);
            const reducerMapInsert = addReducerToActionReducerMap(source, reducersPath, options);
            const changes = [reducerImport, stateInterfaceInsert, reducerMapInsert];
            const recorder = host.beginUpdate(reducersPath);
            for (const change of changes) {
                if (change instanceof change_1.InsertChange) {
                    recorder.insertLeft(change.pos, change.toAdd);
                }
            }
            host.commitUpdate(recorder);
            return host;
        };
    }
    exports.addReducerToState = addReducerToState;
    /**
     * Insert the reducer into the first defined top level interface
     */
    function addReducerToStateInterface(source, reducersPath, options) {
        const stateInterface = source.statements.find(stm => stm.kind === ts.SyntaxKind.InterfaceDeclaration);
        let node = stateInterface;
        if (!node) {
            return new change_1.NoopChange();
        }
        const state = options.plural
            ? stringUtils.pluralize(options.name)
            : stringUtils.camelize(options.name);
        const keyInsert = `[from${stringUtils.classify(options.name)}.${stringUtils.camelize(state)}FeatureKey]: from${stringUtils.classify(options.name)}.State;`;
        const expr = node;
        let position;
        let toInsert;
        if (expr.members.length === 0) {
            position = expr.getEnd() - 1;
            toInsert = `  ${keyInsert}\n`;
        }
        else {
            node = expr.members[expr.members.length - 1];
            position = node.getEnd() + 1;
            // Get the indentation of the last element, if any.
            const text = node.getFullText(source);
            const matches = text.match(/^\r?\n+(\s*)/);
            if (matches.length > 0) {
                toInsert = `${matches[1]}${keyInsert}\n`;
            }
            else {
                toInsert = `\n${keyInsert}`;
            }
        }
        return new change_1.InsertChange(reducersPath, position, toInsert);
    }
    exports.addReducerToStateInterface = addReducerToStateInterface;
    /**
     * Insert the reducer into the ActionReducerMap
     */
    function addReducerToActionReducerMap(source, reducersPath, options) {
        let initializer;
        const actionReducerMap = source.statements
            .filter(stm => stm.kind === ts.SyntaxKind.VariableStatement)
            .filter((stm) => !!stm.declarationList)
            .map((stm) => {
            const { declarations, } = stm.declarationList;
            const variable = declarations.find((decl) => decl.kind === ts.SyntaxKind.VariableDeclaration);
            const type = variable ? variable.type : {};
            return { initializer: variable.initializer, type };
        })
            .filter(initWithType => initWithType.type !== undefined)
            .find(({ type }) => type.typeName.text === 'ActionReducerMap');
        if (!actionReducerMap || !actionReducerMap.initializer) {
            return new change_1.NoopChange();
        }
        let node = actionReducerMap.initializer;
        const state = options.plural
            ? stringUtils.pluralize(options.name)
            : stringUtils.camelize(options.name);
        const keyInsert = `[from${stringUtils.classify(options.name)}.${stringUtils.camelize(state)}FeatureKey]: from${stringUtils.classify(options.name)}.reducer,`;
        const expr = node;
        let position;
        let toInsert;
        if (expr.properties.length === 0) {
            position = expr.getEnd() - 1;
            toInsert = `  ${keyInsert}\n`;
        }
        else {
            node = expr.properties[expr.properties.length - 1];
            position = node.getEnd() + 1;
            // Get the indentation of the last element, if any.
            const text = node.getFullText(source);
            const matches = text.match(/^\r?\n+(\s*)/);
            if (matches.length > 0) {
                toInsert = `\n${matches[1]}${keyInsert}`;
            }
            else {
                toInsert = `\n${keyInsert}`;
            }
        }
        return new change_1.InsertChange(reducersPath, position, toInsert);
    }
    exports.addReducerToActionReducerMap = addReducerToActionReducerMap;
    /**
     * Add reducer feature to NgModule
     */
    function addReducerImportToNgModule(options) {
        return (host) => {
            if (!options.module) {
                return host;
            }
            const modulePath = options.module;
            if (!host.exists(options.module)) {
                throw new Error(`Specified module path ${modulePath} does not exist`);
            }
            const text = host.read(modulePath);
            if (text === null) {
                throw new schematics_1.SchematicsException(`File ${modulePath} does not exist.`);
            }
            const sourceText = text.toString('utf-8');
            const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
            const commonImports = [
                ast_utils_1.insertImport(source, modulePath, 'StoreModule', '@ngrx/store'),
            ];
            const reducerPath = `/${options.path}/` +
                (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
                (options.group ? 'reducers/' : '') +
                stringUtils.dasherize(options.name) +
                '.reducer';
            const relativePath = find_module_1.buildRelativePath(modulePath, reducerPath);
            const reducerImport = ast_utils_1.insertImport(source, modulePath, `* as from${stringUtils.classify(options.name)}`, relativePath, true);
            const state = options.plural
                ? stringUtils.pluralize(options.name)
                : stringUtils.camelize(options.name);
            const [storeNgModuleImport] = ast_utils_1.addImportToModule(source, modulePath, `StoreModule.forFeature(from${stringUtils.classify(options.name)}.${state}FeatureKey, from${stringUtils.classify(options.name)}.reducer)`, relativePath);
            const changes = [...commonImports, reducerImport, storeNgModuleImport];
            const recorder = host.beginUpdate(modulePath);
            for (const change of changes) {
                if (change instanceof change_1.InsertChange) {
                    recorder.insertLeft(change.pos, change.toAdd);
                }
            }
            host.commitUpdate(recorder);
            return host;
        };
    }
    exports.addReducerImportToNgModule = addReducerImportToNgModule;
    function omit(object, keyToRemove) {
        return Object.keys(object)
            .filter(key => key !== keyToRemove)
            .reduce((result, key) => Object.assign(result, { [key]: object[key] }), {});
    }
    exports.omit = omit;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdyeC11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZWZmZWN0cy9zY2hlbWF0aWNzLWNvcmUvdXRpbGl0eS9uZ3J4LXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsaUNBQWlDO0lBQ2pDLDZFQUF5QztJQUN6Qyx5RUFBNEQ7SUFDNUQsMkRBQTZFO0lBQzdFLCtDQUFpRDtJQUNqRCxtRkFBa0Q7SUFDbEQsK0VBQThEO0lBRTlELFNBQWdCLGlCQUFpQixDQUFDLE9BQVk7UUFDNUMsT0FBTyxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUNyQixPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsTUFBTSxZQUFZLEdBQUcsZ0JBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFFdkUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLFlBQVksaUJBQWlCLENBQUMsQ0FBQzthQUMzRTtZQUVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckMsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO2dCQUNqQixNQUFNLElBQUksZ0NBQW1CLENBQUMsUUFBUSxZQUFZLGtCQUFrQixDQUFDLENBQUM7YUFDdkU7WUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTFDLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDaEMsWUFBWSxFQUNaLFVBQVUsRUFDVixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFDdEIsSUFBSSxDQUNMLENBQUM7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QzthQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssV0FBVyxDQUFDO2FBQ2xDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFQRCxvQkFPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0ICogYXMgc3RyaW5nVXRpbHMgZnJvbSAnLi9zdHJpbmdzJztcbmltcG9ydCB7IEluc2VydENoYW5nZSwgQ2hhbmdlLCBOb29wQ2hhbmdlIH0gZnJvbSAnLi9jaGFuZ2UnO1xuaW1wb3J0IHsgVHJlZSwgU2NoZW1hdGljc0V4Y2VwdGlvbiwgUnVsZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7IG5vcm1hbGl6ZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IGJ1aWxkUmVsYXRpdmVQYXRoIH0gZnJvbSAnLi9maW5kLW1vZHVsZSc7XG5pbXBvcnQgeyBhZGRJbXBvcnRUb01vZHVsZSwgaW5zZXJ0SW1wb3J0IH0gZnJvbSAnLi9hc3QtdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkUmVkdWNlclRvU3RhdGUob3B0aW9uczogYW55KTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGlmICghb3B0aW9ucy5yZWR1Y2Vycykge1xuICAgICAgcmV0dXJuIGhvc3Q7XG4gICAgfVxuXG4gICAgY29uc3QgcmVkdWNlcnNQYXRoID0gbm9ybWFsaXplKGAvJHtvcHRpb25zLnBhdGh9LyR7b3B0aW9ucy5yZWR1Y2Vyc31gKTtcblxuICAgIGlmICghaG9zdC5leGlzdHMocmVkdWNlcnNQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTcGVjaWZpZWQgcmVkdWNlcnMgcGF0aCAke3JlZHVjZXJzUGF0aH0gZG9lcyBub3QgZXhpc3RgKTtcbiAgICB9XG5cbiAgICBjb25zdCB0ZXh0ID0gaG9zdC5yZWFkKHJlZHVjZXJzUGF0aCk7XG4gICAgaWYgKHRleHQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBGaWxlICR7cmVkdWNlcnNQYXRofSBkb2VzIG5vdCBleGlzdC5gKTtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VUZXh0ID0gdGV4dC50b1N0cmluZygndXRmLTgnKTtcblxuICAgIGNvbnN0IHNvdXJjZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXG4gICAgICByZWR1Y2Vyc1BhdGgsXG4gICAgICBzb3VyY2VUZXh0LFxuICAgICAgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCxcbiAgICAgIHRydWVcbiAgICApO1xuXG4gICAgY29uc3QgcmVkdWNlclBhdGggPVxuICAgICAgYC8ke29wdGlvbnMucGF0aH0vYCArXG4gICAgICAob3B0aW9ucy5mbGF0ID8gJycgOiBzdHJpbmdVdGlscy5kYXNoZXJpemUob3B0aW9ucy5uYW1lKSArICcvJykgK1xuICAgICAgKG9wdGlvbnMuZ3JvdXAgPyAncmVkdWNlcnMvJyA6ICcnKSArXG4gICAgICBzdHJpbmdVdGlscy5kYXNoZXJpemUob3B0aW9ucy5uYW1lKSArXG4gICAgICAnLnJlZHVjZXInO1xuXG4gICAgY29uc3QgcmVsYXRpdmVQYXRoID0gYnVpbGRSZWxhdGl2ZVBhdGgocmVkdWNlcnNQYXRoLCByZWR1Y2VyUGF0aCk7XG4gICAgY29uc3QgcmVkdWNlckltcG9ydCA9IGluc2VydEltcG9ydChcbiAgICAgIHNvdXJjZSxcbiAgICAgIHJlZHVjZXJzUGF0aCxcbiAgICAgIGAqIGFzIGZyb20ke3N0cmluZ1V0aWxzLmNsYXNzaWZ5KG9wdGlvbnMubmFtZSl9YCxcbiAgICAgIHJlbGF0aXZlUGF0aCxcbiAgICAgIHRydWVcbiAgICApO1xuXG4gICAgY29uc3Qgc3RhdGVJbnRlcmZhY2VJbnNlcnQgPSBhZGRSZWR1Y2VyVG9TdGF0ZUludGVyZmFjZShcbiAgICAgIHNvdXJjZSxcbiAgICAgIHJlZHVjZXJzUGF0aCxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIGNvbnN0IHJlZHVjZXJNYXBJbnNlcnQgPSBhZGRSZWR1Y2VyVG9BY3Rpb25SZWR1Y2VyTWFwKFxuICAgICAgc291cmNlLFxuICAgICAgcmVkdWNlcnNQYXRoLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG5cbiAgICBjb25zdCBjaGFuZ2VzID0gW3JlZHVjZXJJbXBvcnQsIHN0YXRlSW50ZXJmYWNlSW5zZXJ0LCByZWR1Y2VyTWFwSW5zZXJ0XTtcbiAgICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUocmVkdWNlcnNQYXRoKTtcbiAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBjaGFuZ2VzKSB7XG4gICAgICBpZiAoY2hhbmdlIGluc3RhbmNlb2YgSW5zZXJ0Q2hhbmdlKSB7XG4gICAgICAgIHJlY29yZGVyLmluc2VydExlZnQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuXG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG5cbi8qKlxuICogSW5zZXJ0IHRoZSByZWR1Y2VyIGludG8gdGhlIGZpcnN0IGRlZmluZWQgdG9wIGxldmVsIGludGVyZmFjZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkUmVkdWNlclRvU3RhdGVJbnRlcmZhY2UoXG4gIHNvdXJjZTogdHMuU291cmNlRmlsZSxcbiAgcmVkdWNlcnNQYXRoOiBzdHJpbmcsXG4gIG9wdGlvbnM6IHsgbmFtZTogc3RyaW5nOyBwbHVyYWw6IGJvb2xlYW4gfVxuKTogQ2hhbmdlIHtcbiAgY29uc3Qgc3RhdGVJbnRlcmZhY2UgPSBzb3VyY2Uuc3RhdGVtZW50cy5maW5kKFxuICAgIHN0bSA9PiBzdG0ua2luZCA9PT0gdHMuU3ludGF4S2luZC5JbnRlcmZhY2VEZWNsYXJhdGlvblxuICApO1xuICBsZXQgbm9kZSA9IHN0YXRlSW50ZXJmYWNlIGFzIHRzLlN0YXRlbWVudDtcblxuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm4gbmV3IE5vb3BDaGFuZ2UoKTtcbiAgfVxuXG4gIGNvbnN0IHN0YXRlID0gb3B0aW9ucy5wbHVyYWxcbiAgICA/IHN0cmluZ1V0aWxzLnBsdXJhbGl6ZShvcHRpb25zLm5hbWUpXG4gICAgOiBzdHJpbmdVdGlscy5jYW1lbGl6ZShvcHRpb25zLm5hbWUpO1xuXG4gIGNvbnN0IGtleUluc2VydCA9IGBbZnJvbSR7c3RyaW5nVXRpbHMuY2xhc3NpZnkoXG4gICAgb3B0aW9ucy5uYW1lXG4gICl9LiR7c3RyaW5nVXRpbHMuY2FtZWxpemUoc3RhdGUpfUZlYXR1cmVLZXldOiBmcm9tJHtzdHJpbmdVdGlscy5jbGFzc2lmeShcbiAgICBvcHRpb25zLm5hbWVcbiAgKX0uU3RhdGU7YDtcbiAgY29uc3QgZXhwciA9IG5vZGUgYXMgYW55O1xuICBsZXQgcG9zaXRpb247XG4gIGxldCB0b0luc2VydDtcblxuICBpZiAoZXhwci5tZW1iZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIHBvc2l0aW9uID0gZXhwci5nZXRFbmQoKSAtIDE7XG4gICAgdG9JbnNlcnQgPSBgICAke2tleUluc2VydH1cXG5gO1xuICB9IGVsc2Uge1xuICAgIG5vZGUgPSBleHByLm1lbWJlcnNbZXhwci5tZW1iZXJzLmxlbmd0aCAtIDFdO1xuICAgIHBvc2l0aW9uID0gbm9kZS5nZXRFbmQoKSArIDE7XG4gICAgLy8gR2V0IHRoZSBpbmRlbnRhdGlvbiBvZiB0aGUgbGFzdCBlbGVtZW50LCBpZiBhbnkuXG4gICAgY29uc3QgdGV4dCA9IG5vZGUuZ2V0RnVsbFRleHQoc291cmNlKTtcbiAgICBjb25zdCBtYXRjaGVzID0gdGV4dC5tYXRjaCgvXlxccj9cXG4rKFxccyopLyk7XG5cbiAgICBpZiAobWF0Y2hlcyEubGVuZ3RoID4gMCkge1xuICAgICAgdG9JbnNlcnQgPSBgJHttYXRjaGVzIVsxXX0ke2tleUluc2VydH1cXG5gO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b0luc2VydCA9IGBcXG4ke2tleUluc2VydH1gO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgSW5zZXJ0Q2hhbmdlKHJlZHVjZXJzUGF0aCwgcG9zaXRpb24sIHRvSW5zZXJ0KTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgdGhlIHJlZHVjZXIgaW50byB0aGUgQWN0aW9uUmVkdWNlck1hcFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkUmVkdWNlclRvQWN0aW9uUmVkdWNlck1hcChcbiAgc291cmNlOiB0cy5Tb3VyY2VGaWxlLFxuICByZWR1Y2Vyc1BhdGg6IHN0cmluZyxcbiAgb3B0aW9uczogeyBuYW1lOiBzdHJpbmc7IHBsdXJhbDogYm9vbGVhbiB9XG4pOiBDaGFuZ2Uge1xuICBsZXQgaW5pdGlhbGl6ZXI6IGFueTtcbiAgY29uc3QgYWN0aW9uUmVkdWNlck1hcDogYW55ID0gc291cmNlLnN0YXRlbWVudHNcbiAgICAuZmlsdGVyKHN0bSA9PiBzdG0ua2luZCA9PT0gdHMuU3ludGF4S2luZC5WYXJpYWJsZVN0YXRlbWVudClcbiAgICAuZmlsdGVyKChzdG06IGFueSkgPT4gISFzdG0uZGVjbGFyYXRpb25MaXN0KVxuICAgIC5tYXAoKHN0bTogYW55KSA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGRlY2xhcmF0aW9ucyxcbiAgICAgIH06IHtcbiAgICAgICAgZGVjbGFyYXRpb25zOiB0cy5TeW50YXhLaW5kLlZhcmlhYmxlRGVjbGFyYXRpb25MaXN0W107XG4gICAgICB9ID0gc3RtLmRlY2xhcmF0aW9uTGlzdDtcbiAgICAgIGNvbnN0IHZhcmlhYmxlOiBhbnkgPSBkZWNsYXJhdGlvbnMuZmluZChcbiAgICAgICAgKGRlY2w6IGFueSkgPT4gZGVjbC5raW5kID09PSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlRGVjbGFyYXRpb25cbiAgICAgICk7XG4gICAgICBjb25zdCB0eXBlID0gdmFyaWFibGUgPyB2YXJpYWJsZS50eXBlIDoge307XG5cbiAgICAgIHJldHVybiB7IGluaXRpYWxpemVyOiB2YXJpYWJsZS5pbml0aWFsaXplciwgdHlwZSB9O1xuICAgIH0pXG4gICAgLmZpbHRlcihpbml0V2l0aFR5cGUgPT4gaW5pdFdpdGhUeXBlLnR5cGUgIT09IHVuZGVmaW5lZClcbiAgICAuZmluZCgoeyB0eXBlIH0pID0+IHR5cGUudHlwZU5hbWUudGV4dCA9PT0gJ0FjdGlvblJlZHVjZXJNYXAnKTtcblxuICBpZiAoIWFjdGlvblJlZHVjZXJNYXAgfHwgIWFjdGlvblJlZHVjZXJNYXAuaW5pdGlhbGl6ZXIpIHtcbiAgICByZXR1cm4gbmV3IE5vb3BDaGFuZ2UoKTtcbiAgfVxuXG4gIGxldCBub2RlID0gYWN0aW9uUmVkdWNlck1hcC5pbml0aWFsaXplcjtcblxuICBjb25zdCBzdGF0ZSA9IG9wdGlvbnMucGx1cmFsXG4gICAgPyBzdHJpbmdVdGlscy5wbHVyYWxpemUob3B0aW9ucy5uYW1lKVxuICAgIDogc3RyaW5nVXRpbHMuY2FtZWxpemUob3B0aW9ucy5uYW1lKTtcblxuICBjb25zdCBrZXlJbnNlcnQgPSBgW2Zyb20ke3N0cmluZ1V0aWxzLmNsYXNzaWZ5KFxuICAgIG9wdGlvbnMubmFtZVxuICApfS4ke3N0cmluZ1V0aWxzLmNhbWVsaXplKHN0YXRlKX1GZWF0dXJlS2V5XTogZnJvbSR7c3RyaW5nVXRpbHMuY2xhc3NpZnkoXG4gICAgb3B0aW9ucy5uYW1lXG4gICl9LnJlZHVjZXIsYDtcbiAgY29uc3QgZXhwciA9IG5vZGUgYXMgYW55O1xuICBsZXQgcG9zaXRpb247XG4gIGxldCB0b0luc2VydDtcblxuICBpZiAoZXhwci5wcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHBvc2l0aW9uID0gZXhwci5nZXRFbmQoKSAtIDE7XG4gICAgdG9JbnNlcnQgPSBgICAke2tleUluc2VydH1cXG5gO1xuICB9IGVsc2Uge1xuICAgIG5vZGUgPSBleHByLnByb3BlcnRpZXNbZXhwci5wcm9wZXJ0aWVzLmxlbmd0aCAtIDFdO1xuICAgIHBvc2l0aW9uID0gbm9kZS5nZXRFbmQoKSArIDE7XG4gICAgLy8gR2V0IHRoZSBpbmRlbnRhdGlvbiBvZiB0aGUgbGFzdCBlbGVtZW50LCBpZiBhbnkuXG4gICAgY29uc3QgdGV4dCA9IG5vZGUuZ2V0RnVsbFRleHQoc291cmNlKTtcbiAgICBjb25zdCBtYXRjaGVzID0gdGV4dC5tYXRjaCgvXlxccj9cXG4rKFxccyopLyk7XG5cbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0b0luc2VydCA9IGBcXG4ke21hdGNoZXMhWzFdfSR7a2V5SW5zZXJ0fWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRvSW5zZXJ0ID0gYFxcbiR7a2V5SW5zZXJ0fWA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBJbnNlcnRDaGFuZ2UocmVkdWNlcnNQYXRoLCBwb3NpdGlvbiwgdG9JbnNlcnQpO1xufVxuXG4vKipcbiAqIEFkZCByZWR1Y2VyIGZlYXR1cmUgdG8gTmdNb2R1bGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFJlZHVjZXJJbXBvcnRUb05nTW9kdWxlKG9wdGlvbnM6IGFueSk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBpZiAoIW9wdGlvbnMubW9kdWxlKSB7XG4gICAgICByZXR1cm4gaG9zdDtcbiAgICB9XG5cbiAgICBjb25zdCBtb2R1bGVQYXRoID0gb3B0aW9ucy5tb2R1bGU7XG4gICAgaWYgKCFob3N0LmV4aXN0cyhvcHRpb25zLm1vZHVsZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU3BlY2lmaWVkIG1vZHVsZSBwYXRoICR7bW9kdWxlUGF0aH0gZG9lcyBub3QgZXhpc3RgKTtcbiAgICB9XG5cbiAgICBjb25zdCB0ZXh0ID0gaG9zdC5yZWFkKG1vZHVsZVBhdGgpO1xuICAgIGlmICh0ZXh0ID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgRmlsZSAke21vZHVsZVBhdGh9IGRvZXMgbm90IGV4aXN0LmApO1xuICAgIH1cbiAgICBjb25zdCBzb3VyY2VUZXh0ID0gdGV4dC50b1N0cmluZygndXRmLTgnKTtcblxuICAgIGNvbnN0IHNvdXJjZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXG4gICAgICBtb2R1bGVQYXRoLFxuICAgICAgc291cmNlVGV4dCxcbiAgICAgIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsXG4gICAgICB0cnVlXG4gICAgKTtcblxuICAgIGNvbnN0IGNvbW1vbkltcG9ydHMgPSBbXG4gICAgICBpbnNlcnRJbXBvcnQoc291cmNlLCBtb2R1bGVQYXRoLCAnU3RvcmVNb2R1bGUnLCAnQG5ncngvc3RvcmUnKSxcbiAgICBdO1xuXG4gICAgY29uc3QgcmVkdWNlclBhdGggPVxuICAgICAgYC8ke29wdGlvbnMucGF0aH0vYCArXG4gICAgICAob3B0aW9ucy5mbGF0ID8gJycgOiBzdHJpbmdVdGlscy5kYXNoZXJpemUob3B0aW9ucy5uYW1lKSArICcvJykgK1xuICAgICAgKG9wdGlvbnMuZ3JvdXAgPyAncmVkdWNlcnMvJyA6ICcnKSArXG4gICAgICBzdHJpbmdVdGlscy5kYXNoZXJpemUob3B0aW9ucy5uYW1lKSArXG4gICAgICAnLnJlZHVjZXInO1xuICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IGJ1aWxkUmVsYXRpdmVQYXRoKG1vZHVsZVBhdGgsIHJlZHVjZXJQYXRoKTtcbiAgICBjb25zdCByZWR1Y2VySW1wb3J0ID0gaW5zZXJ0SW1wb3J0KFxuICAgICAgc291cmNlLFxuICAgICAgbW9kdWxlUGF0aCxcbiAgICAgIGAqIGFzIGZyb20ke3N0cmluZ1V0aWxzLmNsYXNzaWZ5KG9wdGlvbnMubmFtZSl9YCxcbiAgICAgIHJlbGF0aXZlUGF0aCxcbiAgICAgIHRydWVcbiAgICApO1xuICAgIGNvbnN0IHN0YXRlID0gb3B0aW9ucy5wbHVyYWxcbiAgICAgID8gc3RyaW5nVXRpbHMucGx1cmFsaXplKG9wdGlvbnMubmFtZSlcbiAgICAgIDogc3RyaW5nVXRpbHMuY2FtZWxpemUob3B0aW9ucy5uYW1lKTtcbiAgICBjb25zdCBbc3RvcmVOZ01vZHVsZUltcG9ydF0gPSBhZGRJbXBvcnRUb01vZHVsZShcbiAgICAgIHNvdXJjZSxcbiAgICAgIG1vZHVsZVBhdGgsXG4gICAgICBgU3RvcmVNb2R1bGUuZm9yRmVhdHVyZShmcm9tJHtzdHJpbmdVdGlscy5jbGFzc2lmeShcbiAgICAgICAgb3B0aW9ucy5uYW1lXG4gICAgICApfS4ke3N0YXRlfUZlYXR1cmVLZXksIGZyb20ke3N0cmluZ1V0aWxzLmNsYXNzaWZ5KFxuICAgICAgICBvcHRpb25zLm5hbWVcbiAgICAgICl9LnJlZHVjZXIpYCxcbiAgICAgIHJlbGF0aXZlUGF0aFxuICAgICk7XG4gICAgY29uc3QgY2hhbmdlcyA9IFsuLi5jb21tb25JbXBvcnRzLCByZWR1Y2VySW1wb3J0LCBzdG9yZU5nTW9kdWxlSW1wb3J0XTtcbiAgICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUobW9kdWxlUGF0aCk7XG4gICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgY2hhbmdlcykge1xuICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICB9XG4gICAgfVxuICAgIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb21pdDxUIGV4dGVuZHMgeyBba2V5OiBzdHJpbmddOiBhbnkgfT4oXG4gIG9iamVjdDogVCxcbiAga2V5VG9SZW1vdmU6IGtleW9mIFRcbik6IFBhcnRpYWw8VD4ge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KVxuICAgIC5maWx0ZXIoa2V5ID0+IGtleSAhPT0ga2V5VG9SZW1vdmUpXG4gICAgLnJlZHVjZSgocmVzdWx0LCBrZXkpID0+IE9iamVjdC5hc3NpZ24ocmVzdWx0LCB7IFtrZXldOiBvYmplY3Rba2V5XSB9KSwge30pO1xufVxuIl19