(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/effects/schematics-core/utility/update", ["require", "exports", "@angular-devkit/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular-devkit/schematics");
    function updatePackage(name) {
        return (tree, context) => {
            const pkgPath = '/package.json';
            const buffer = tree.read(pkgPath);
            if (buffer === null) {
                throw new schematics_1.SchematicsException('Could not read package.json');
            }
            const content = buffer.toString();
            const pkg = JSON.parse(content);
            if (pkg === null || typeof pkg !== 'object' || Array.isArray(pkg)) {
                throw new schematics_1.SchematicsException('Error reading package.json');
            }
            const dependencyCategories = ['dependencies', 'devDependencies'];
            dependencyCategories.forEach(category => {
                const packageName = `@ngrx/${name}`;
                if (pkg[category] && pkg[category][packageName]) {
                    const firstChar = pkg[category][packageName][0];
                    const suffix = match(firstChar, '^') || match(firstChar, '~');
                    pkg[category][packageName] = `${suffix}6.0.0`;
                }
            });
            tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2));
            return tree;
        };
    }
    exports.updatePackage = updatePackage;
    function match(value, test) {
        return value === test ? test : '';
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9lZmZlY3RzL3NjaGVtYXRpY3MtY29yZS91dGlsaXR5L3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLDJEQUtvQztJQUVwQyxTQUFnQixhQUFhLENBQUMsSUFBWTtRQUN4QyxPQUFPLENBQUMsSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtZQUMvQyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUM7WUFDaEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNsQyxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7Z0JBQ25CLE1BQU0sSUFBSSxnQ0FBbUIsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO2FBQzlEO1lBQ0QsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFaEMsSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNqRSxNQUFNLElBQUksZ0NBQW1CLENBQUMsNEJBQTRCLENBQUMsQ0FBQzthQUM3RDtZQUVELE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUVqRSxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3RDLE1BQU0sV0FBVyxHQUFHLFNBQVMsSUFBSSxFQUFFLENBQUM7Z0JBRXBDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRTtvQkFDL0MsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBRTlELEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHLE1BQU0sT0FBTyxDQUFDO2lCQUMvQztZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdEQsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUM7SUFDSixDQUFDO0lBL0JELHNDQStCQztJQUVELFNBQVMsS0FBSyxDQUFDLEtBQWEsRUFBRSxJQUFZO1FBQ3hDLE9BQU8sS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDcEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFRyZWUsXG4gIFNjaGVtYXRpY3NFeGNlcHRpb24sXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVBhY2thZ2UobmFtZTogc3RyaW5nKTogUnVsZSB7XG4gIHJldHVybiAodHJlZTogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHBrZ1BhdGggPSAnL3BhY2thZ2UuanNvbic7XG4gICAgY29uc3QgYnVmZmVyID0gdHJlZS5yZWFkKHBrZ1BhdGgpO1xuICAgIGlmIChidWZmZXIgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKCdDb3VsZCBub3QgcmVhZCBwYWNrYWdlLmpzb24nKTtcbiAgICB9XG4gICAgY29uc3QgY29udGVudCA9IGJ1ZmZlci50b1N0cmluZygpO1xuICAgIGNvbnN0IHBrZyA9IEpTT04ucGFyc2UoY29udGVudCk7XG5cbiAgICBpZiAocGtnID09PSBudWxsIHx8IHR5cGVvZiBwa2cgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkocGtnKSkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ0Vycm9yIHJlYWRpbmcgcGFja2FnZS5qc29uJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVwZW5kZW5jeUNhdGVnb3JpZXMgPSBbJ2RlcGVuZGVuY2llcycsICdkZXZEZXBlbmRlbmNpZXMnXTtcblxuICAgIGRlcGVuZGVuY3lDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xuICAgICAgY29uc3QgcGFja2FnZU5hbWUgPSBgQG5ncngvJHtuYW1lfWA7XG5cbiAgICAgIGlmIChwa2dbY2F0ZWdvcnldICYmIHBrZ1tjYXRlZ29yeV1bcGFja2FnZU5hbWVdKSB7XG4gICAgICAgIGNvbnN0IGZpcnN0Q2hhciA9IHBrZ1tjYXRlZ29yeV1bcGFja2FnZU5hbWVdWzBdO1xuICAgICAgICBjb25zdCBzdWZmaXggPSBtYXRjaChmaXJzdENoYXIsICdeJykgfHwgbWF0Y2goZmlyc3RDaGFyLCAnficpO1xuXG4gICAgICAgIHBrZ1tjYXRlZ29yeV1bcGFja2FnZU5hbWVdID0gYCR7c3VmZml4fTYuMC4wYDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRyZWUub3ZlcndyaXRlKHBrZ1BhdGgsIEpTT04uc3RyaW5naWZ5KHBrZywgbnVsbCwgMikpO1xuXG4gICAgcmV0dXJuIHRyZWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG1hdGNoKHZhbHVlOiBzdHJpbmcsIHRlc3Q6IHN0cmluZykge1xuICByZXR1cm4gdmFsdWUgPT09IHRlc3QgPyB0ZXN0IDogJyc7XG59XG4iXX0=