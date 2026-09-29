(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/effects/schematics-core/utility/visit-utils", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    function visitTSSourceFiles(tree, visitor) {
        let result = undefined;
        for (const sourceFile of visit(tree.root)) {
            result = visitor(sourceFile, tree, result);
        }
        return result;
    }
    exports.visitTSSourceFiles = visitTSSourceFiles;
    function* visit(directory) {
        for (const path of directory.subfiles) {
            if (path.endsWith('.ts') && !path.endsWith('.d.ts')) {
                const entry = directory.file(path);
                if (entry) {
                    const content = entry.content;
                    const source = ts.createSourceFile(entry.path, content.toString().replace(/^\uFEFF/, ''), ts.ScriptTarget.Latest, true);
                    yield source;
                }
            }
        }
        for (const path of directory.subdirs) {
            if (path === 'node_modules') {
                continue;
            }
            yield* visit(directory.dir(path));
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlzaXQtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2VmZmVjdHMvc2NoZW1hdGljcy1jb3JlL3V0aWxpdHkvdmlzaXQtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSxpQ0FBaUM7SUFHakMsU0FBZ0Isa0JBQWtCLENBQ2hDLElBQVUsRUFDVixPQUl1QjtRQUV2QixJQUFJLE1BQU0sR0FBdUIsU0FBUyxDQUFDO1FBQzNDLEtBQUssTUFBTSxVQUFVLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6QyxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDNUM7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBZEQsZ0RBY0M7SUFFRCxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBbUI7UUFDakMsS0FBSyxNQUFNLElBQUksSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFO1lBQ3JDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ25ELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25DLElBQUksS0FBSyxFQUFFO29CQUNULE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7b0JBQzlCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDaEMsS0FBSyxDQUFDLElBQUksRUFDVixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFDekMsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQ3RCLElBQUksQ0FDTCxDQUFDO29CQUNGLE1BQU0sTUFBTSxDQUFDO2lCQUNkO2FBQ0Y7U0FDRjtRQUVELEtBQUssTUFBTSxJQUFJLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUNwQyxJQUFJLElBQUksS0FBSyxjQUFjLEVBQUU7Z0JBQzNCLFNBQVM7YUFDVjtZQUVELEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDbkM7SUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgeyBUcmVlLCBEaXJFbnRyeSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHZpc2l0VFNTb3VyY2VGaWxlczxSZXN1bHQgPSB2b2lkPihcbiAgdHJlZTogVHJlZSxcbiAgdmlzaXRvcjogKFxuICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsXG4gICAgdHJlZTogVHJlZSxcbiAgICByZXN1bHQ/OiBSZXN1bHRcbiAgKSA9PiBSZXN1bHQgfCB1bmRlZmluZWRcbik6IFJlc3VsdCB8IHVuZGVmaW5lZCB7XG4gIGxldCByZXN1bHQ6IFJlc3VsdCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgZm9yIChjb25zdCBzb3VyY2VGaWxlIG9mIHZpc2l0KHRyZWUucm9vdCkpIHtcbiAgICByZXN1bHQgPSB2aXNpdG9yKHNvdXJjZUZpbGUsIHRyZWUsIHJlc3VsdCk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiogdmlzaXQoZGlyZWN0b3J5OiBEaXJFbnRyeSk6IEl0ZXJhYmxlSXRlcmF0b3I8dHMuU291cmNlRmlsZT4ge1xuICBmb3IgKGNvbnN0IHBhdGggb2YgZGlyZWN0b3J5LnN1YmZpbGVzKSB7XG4gICAgaWYgKHBhdGguZW5kc1dpdGgoJy50cycpICYmICFwYXRoLmVuZHNXaXRoKCcuZC50cycpKSB7XG4gICAgICBjb25zdCBlbnRyeSA9IGRpcmVjdG9yeS5maWxlKHBhdGgpO1xuICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBlbnRyeS5jb250ZW50O1xuICAgICAgICBjb25zdCBzb3VyY2UgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgICAgIGVudHJ5LnBhdGgsXG4gICAgICAgICAgY29udGVudC50b1N0cmluZygpLnJlcGxhY2UoL15cXHVGRUZGLywgJycpLFxuICAgICAgICAgIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsXG4gICAgICAgICAgdHJ1ZVxuICAgICAgICApO1xuICAgICAgICB5aWVsZCBzb3VyY2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yIChjb25zdCBwYXRoIG9mIGRpcmVjdG9yeS5zdWJkaXJzKSB7XG4gICAgaWYgKHBhdGggPT09ICdub2RlX21vZHVsZXMnKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB5aWVsZCogdmlzaXQoZGlyZWN0b3J5LmRpcihwYXRoKSk7XG4gIH1cbn1cbiJdfQ==