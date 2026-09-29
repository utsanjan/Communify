(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/effects/schematics-core/utility/change", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * An operation that does nothing.
     */
    class NoopChange {
        constructor() {
            this.description = 'No operation.';
            this.order = Infinity;
            this.path = null;
        }
        apply() {
            return Promise.resolve();
        }
    }
    exports.NoopChange = NoopChange;
    /**
     * Will add text to the source code.
     */
    class InsertChange {
        constructor(path, pos, toAdd) {
            this.path = path;
            this.pos = pos;
            this.toAdd = toAdd;
            if (pos < 0) {
                throw new Error('Negative positions are invalid');
            }
            this.description = `Inserted ${toAdd} into position ${pos} of ${path}`;
            this.order = pos;
        }
        /**
         * This method does not insert spaces if there is none in the original string.
         */
        apply(host) {
            return host.read(this.path).then(content => {
                const prefix = content.substring(0, this.pos);
                const suffix = content.substring(this.pos);
                return host.write(this.path, `${prefix}${this.toAdd}${suffix}`);
            });
        }
    }
    exports.InsertChange = InsertChange;
    /**
     * Will remove text from the source code.
     */
    class RemoveChange {
        constructor(path, pos, end) {
            this.path = path;
            this.pos = pos;
            this.end = end;
            if (pos < 0 || end < 0) {
                throw new Error('Negative positions are invalid');
            }
            this.description = `Removed text in position ${pos} to ${end} of ${path}`;
            this.order = pos;
        }
        apply(host) {
            return host.read(this.path).then(content => {
                const prefix = content.substring(0, this.pos);
                const suffix = content.substring(this.end);
                // TODO: throw error if toRemove doesn't match removed string.
                return host.write(this.path, `${prefix}${suffix}`);
            });
        }
    }
    exports.RemoveChange = RemoveChange;
    /**
     * Will replace text from the source code.
     */
    class ReplaceChange {
        constructor(path, pos, oldText, newText) {
            this.path = path;
            this.pos = pos;
            this.oldText = oldText;
            this.newText = newText;
            if (pos < 0) {
                throw new Error('Negative positions are invalid');
            }
            this.description = `Replaced ${oldText} into position ${pos} of ${path} with ${newText}`;
            this.order = pos;
        }
        apply(host) {
            return host.read(this.path).then(content => {
                const prefix = content.substring(0, this.pos);
                const suffix = content.substring(this.pos + this.oldText.length);
                const text = content.substring(this.pos, this.pos + this.oldText.length);
                if (text !== this.oldText) {
                    return Promise.reject(new Error(`Invalid replace: "${text}" != "${this.oldText}".`));
                }
                // TODO: throw error if oldText doesn't match removed string.
                return host.write(this.path, `${prefix}${this.newText}${suffix}`);
            });
        }
    }
    exports.ReplaceChange = ReplaceChange;
    function createReplaceChange(sourceFile, node, oldText, newText) {
        return new ReplaceChange(sourceFile.fileName, node.getStart(sourceFile), oldText, newText);
    }
    exports.createReplaceChange = createReplaceChange;
    function createRemoveChange(sourceFile, node, from = node.getStart(sourceFile), to = node.getEnd()) {
        return new RemoveChange(sourceFile.fileName, from, to);
    }
    exports.createRemoveChange = createRemoveChange;
    function createChangeRecorder(tree, path, changes) {
        const recorder = tree.beginUpdate(path);
        for (const change of changes) {
            if (change instanceof InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
            else if (change instanceof RemoveChange) {
                recorder.remove(change.pos, change.end - change.pos);
            }
            else if (change instanceof ReplaceChange) {
                recorder.remove(change.pos, change.oldText.length);
                recorder.insertLeft(change.pos, change.newText);
            }
        }
        return recorder;
    }
    exports.createChangeRecorder = createChangeRecorder;
    function commitChanges(tree, path, changes) {
        if (changes.length === 0) {
            return false;
        }
        const recorder = createChangeRecorder(tree, path, changes);
        tree.commitUpdate(recorder);
        return true;
    }
    exports.commitChanges = commitChanges;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9lZmZlY3RzL3NjaGVtYXRpY3MtY29yZS91dGlsaXR5L2NoYW5nZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQWdDQTs7T0FFRztJQUNILE1BQWEsVUFBVTtRQUF2QjtZQUNFLGdCQUFXLEdBQUcsZUFBZSxDQUFDO1lBQzlCLFVBQUssR0FBRyxRQUFRLENBQUM7WUFDakIsU0FBSSxHQUFHLElBQUksQ0FBQztRQUlkLENBQUM7UUFIQyxLQUFLO1lBQ0gsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDM0IsQ0FBQztLQUNGO0lBUEQsZ0NBT0M7SUFFRDs7T0FFRztJQUNILE1BQWEsWUFBWTtRQUl2QixZQUFtQixJQUFZLEVBQVMsR0FBVyxFQUFTLEtBQWE7WUFBdEQsU0FBSSxHQUFKLElBQUksQ0FBUTtZQUFTLFFBQUcsR0FBSCxHQUFHLENBQVE7WUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFRO1lBQ3ZFLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtnQkFDWCxNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7YUFDbkQ7WUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLFlBQVksS0FBSyxrQkFBa0IsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ25CLENBQUM7UUFFRDs7V0FFRztRQUNILEtBQUssQ0FBQyxJQUFVO1lBQ2QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3pDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxNQUFNLEdB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QUFJLE1BQU0sWUFBWSxZQUFZLEVBQUU7Z0JBQ3pDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN0RDtpQkFBTSxJQUFJLE1BQU0sWUFBWSxhQUFhLEVBQUU7Z0JBQzFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuRCxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2pEO1NBQ0Y7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBakJELG9EQWlCQztJQUVELFNBQWdCLGFBQWEsQ0FBQyxJQUFVLEVBQUUsSUFBWSxFQUFFLE9BQWlCO1FBQ3ZFLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDeEIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELE1BQU0sUUFBUSxHQUFHLG9CQUFvQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFSRCxzQ0FRQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHsgVHJlZSwgVXBkYXRlUmVjb3JkZXIgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgeyBQYXRoIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIb3N0IHtcbiAgd3JpdGUocGF0aDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xuICByZWFkKHBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2Uge1xuICBhcHBseShob3N0OiBIb3N0KTogUHJvbWlzZTx2b2lkPjtcblxuICAvLyBUaGUgZmlsZSB0aGlzIGNoYW5nZSBzaG91bGQgYmUgYXBwbGllZCB0by4gU29tZSBjaGFuZ2VzIG1pZ2h0IG5vdCBhcHBseSB0b1xuICAvLyBhIGZpbGUgKG1heWJlIHRoZSBjb25maWcpLlxuICByZWFkb25seSBwYXRoOiBzdHJpbmcgfCBudWxsO1xuXG4gIC8vIFRoZSBvcmRlciB0aGlzIGNoYW5nZSBzaG91bGQgYmUgYXBwbGllZC4gTm9ybWFsbHkgdGhlIHBvc2l0aW9uIGluc2lkZSB0aGUgZmlsZS5cbiAgLy8gQ2hhbmdlcyBhcmUgYXBwbGllZCBmcm9tIHRoZSBib3R0b20gb2YgYSBmaWxlIHRvIHRoZSB0b3AuXG4gIHJlYWRvbmx5IG9yZGVyOiBudW1iZXI7XG5cbiAgLy8gVGhlIGRlc2NyaXB0aW9uIG9mIHRoaXMgY2hhbmdlLiBUaGlzIHdpbGwgYmUgb3V0cHV0dGVkIGluIGEgZHJ5IG9yIHZlcmJvc2UgcnVuLlxuICByZWFkb25seSBkZXNjcmlwdGlvbjogc3RyaW5nO1xufVxuXG4vKipcbiAqIEFuIG9wZXJhdGlvbiB0aGF0IGRvZXMgbm90aGluZy5cbiAqL1xuZXhwb3J0IGNsYXNzIE5vb3BDaGFuZ2UgaW1wbGVtZW50cyBDaGFuZ2Uge1xuICBkZXNjcmlwdGlvbiA9ICdObyBvcGVyYXRpb24uJztcbiAgb3JkZXIgPSBJbmZpbml0eTtcbiAgcGF0aCA9IG51bGw7XG4gIGFwcGx5KCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxufVxuXG4vKipcbiAqIFdpbGwgYWRkIHRleHQgdG8gdGhlIHNvdXJjZSBjb2RlLlxuICovXG5leHBvcnQgY2xhc3MgSW5zZXJ0Q2hhbmdlIGltcGxlbWVudHMgQ2hhbmdlIHtcbiAgb3JkZXI6IG51bWJlcjtcbiAgZGVzY3JpcHRpb246IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF0aDogc3RyaW5nLCBwdWJsaWMgcG9zOiBudW1iZXIsIHB1YmxpYyB0b0FkZDogc3RyaW5nKSB7XG4gICAgaWYgKHBvcyA8IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTmVnYXRpdmUgcG9zaXRpb25zIGFyZSBpbnZhbGlkJyk7XG4gICAgfVxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBgSW5zZXJ0ZWQgJHt0b0FkZH0gaW50byBwb3NpdGlvbiAke3Bvc30gb2YgJHtwYXRofWA7XG4gICAgdGhpcy5vcmRlciA9IHBvcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBkb2VzIG5vdCBpbnNlcnQgc3BhY2VzIGlmIHRoZXJlIGlzIG5vbmUgaW4gdGhlIG9yaWdpbmFsIHN0cmluZy5cbiAgICovXG4gIGFwcGx5KGhvc3Q6IEhvc3QpIHtcbiAgICByZXR1cm4gaG9zdC5yZWFkKHRoaXMucGF0aCkudGhlbihjb250ZW50ID0+IHtcbiAgICAgIGNvbnN0IHByZWZpeCA9IGNvbnRlbnQuc3Vic3RyaW5nKDAsIHRoaXMucG9zKTtcbiAgICAgIGNvbnN0IHN1ZmZpeCA9IGNvbnRlbnQuc3Vic3RyaW5nKHRoaXMucG9zKTtcblxuICAgICAgcmV0dXJuIGhvc3Qud3JpdGUodGhpcy5wYXRoLCBgJHtwcmVmaXh9JHt0aGlzLnRvQWRkfSR7c3VmZml4fWApO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogV2lsbCByZW1vdmUgdGV4dCBmcm9tIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlbW92ZUNoYW5nZSBpbXBsZW1lbnRzIENoYW5nZSB7XG4gIG9yZGVyOiBudW1iZXI7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBhdGg6IHN0cmluZywgcHVibGljIHBvczogbnVtYmVyLCBwdWJsaWMgZW5kOiBudW1iZXIpIHtcbiAgICBpZiAocG9zIDwgMCB8fCBlbmQgPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05lZ2F0aXZlIHBvc2l0aW9ucyBhcmUgaW52YWxpZCcpO1xuICAgIH1cbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gYFJlbW92ZWQgdGV4dCBpbiBwb3NpdGlvbiAke3Bvc30gdG8gJHtlbmR9IG9mICR7cGF0aH1gO1xuICAgIHRoaXMub3JkZXIgPSBwb3M7XG4gIH1cblxuICBhcHBseShob3N0OiBIb3N0KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIGhvc3QucmVhZCh0aGlzLnBhdGgpLnRoZW4oY29udGVudCA9PiB7XG4gICAgICBjb25zdCBwcmVmaXggPSBjb250ZW50LnN1YnN0cmluZygwLCB0aGlzLnBvcyk7XG4gICAgICBjb25zdCBzdWZmaXggPSBjb250ZW50LnN1YnN0cmluZyh0aGlzLmVuZCk7XG5cbiAgICAgIC8vIFRPRE86IHRocm93IGVycm9yIGlmIHRvUmVtb3ZlIGRvZXNuJ3QgbWF0Y2ggcmVtb3ZlZCBzdHJpbmcuXG4gICAgICByZXR1cm4gaG9zdC53cml0ZSh0aGlzLnBhdGgsIGAke3ByZWZpeH0ke3N1ZmZpeH1gKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFdpbGwgcmVwbGFjZSB0ZXh0IGZyb20gdGhlIHNvdXJjZSBjb2RlLlxuICovXG5leHBvcnQgY2xhc3MgUmVwbGFjZUNoYW5nZSBpbXBsZW1lbnRzIENoYW5nZSB7XG4gIG9yZGVyOiBudW1iZXI7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHBhdGg6IHN0cmluZyxcbiAgICBwdWJsaWMgcG9zOiBudW1iZXIsXG4gICAgcHVibGljIG9sZFRleHQ6IHN0cmluZyxcbiAgICBwdWJsaWMgbmV3VGV4dDogc3RyaW5nXG4gICkge1xuICAgIGlmIChwb3MgPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05lZ2F0aXZlIHBvc2l0aW9ucyBhcmUgaW52YWxpZCcpO1xuICAgIH1cbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gYFJlcGxhY2VkICR7b2xkVGV4dH0gaW50byBwb3NpdGlvbiAke3Bvc30gb2YgJHtwYXRofSB3aXRoICR7bmV3VGV4dH1gO1xuICAgIHRoaXMub3JkZXIgPSBwb3M7XG4gIH1cblxuICBhcHBseShob3N0OiBIb3N0KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIGhvc3QucmVhZCh0aGlzLnBhdGgpLnRoZW4oY29udGVudCA9PiB7XG4gICAgICBjb25zdCBwcmVmaXggPSBjb250ZW50LnN1YnN0cmluZygwLCB0aGlzLnBvcyk7XG4gICAgICBjb25zdCBzdWZmaXggPSBjb250ZW50LnN1YnN0cmluZyh0aGlzLnBvcyArIHRoaXMub2xkVGV4dC5sZW5ndGgpO1xuICAgICAgY29uc3QgdGV4dCA9IGNvbnRlbnQuc3Vic3RyaW5nKHRoaXMucG9zLCB0aGlzLnBvcyArIHRoaXMub2xkVGV4dC5sZW5ndGgpO1xuXG4gICAgICBpZiAodGV4dCAhPT0gdGhpcy5vbGRUZXh0KSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcbiAgICAgICAgICBuZXcgRXJyb3IoYEludmFsaWQgcmVwbGFjZTogXCIke3RleHR9XCIgIT0gXCIke3RoaXMub2xkVGV4dH1cIi5gKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPOiB0aHJvdyBlcnJvciBpZiBvbGRUZXh0IGRvZXNuJ3QgbWF0Y2ggcmVtb3ZlZCBzdHJpbmcuXG4gICAgICByZXR1cm4gaG9zdC53cml0ZSh0aGlzLnBhdGgsIGAke3ByZWZpeH0ke3RoaXMubmV3VGV4dH0ke3N1ZmZpeH1gKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVwbGFjZUNoYW5nZShcbiAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSxcbiAgbm9kZTogdHMuTm9kZSxcbiAgb2xkVGV4dDogc3RyaW5nLFxuICBuZXdUZXh0OiBzdHJpbmdcbik6IFJlcGxhY2VDaGFuZ2Uge1xuICByZXR1cm4gbmV3IFJlcGxhY2VDaGFuZ2UoXG4gICAgc291cmNlRmlsZS5maWxlTmFtZSxcbiAgICBub2RlLmdldFN0YXJ0KHNvdXJjZUZpbGUpLFxuICAgIG9sZFRleHQsXG4gICAgbmV3VGV4dFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVtb3ZlQ2hhbmdlKFxuICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICBub2RlOiB0cy5Ob2RlLFxuICBmcm9tID0gbm9kZS5nZXRTdGFydChzb3VyY2VGaWxlKSxcbiAgdG8gPSBub2RlLmdldEVuZCgpXG4pOiBSZW1vdmVDaGFuZ2Uge1xuICByZXR1cm4gbmV3IFJlbW92ZUNoYW5nZShzb3VyY2VGaWxlLmZpbGVOYW1lLCBmcm9tLCB0byk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDaGFuZ2VSZWNvcmRlcihcbiAgdHJlZTogVHJlZSxcbiAgcGF0aDogc3RyaW5nLFxuICBjaGFuZ2VzOiBDaGFuZ2VbXVxuKTogVXBkYXRlUmVjb3JkZXIge1xuICBjb25zdCByZWNvcmRlciA9IHRyZWUuYmVnaW5VcGRhdGUocGF0aCk7XG4gIGZvciAoY29uc3QgY2hhbmdlIG9mIGNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlIGluc3RhbmNlb2YgSW5zZXJ0Q2hhbmdlKSB7XG4gICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgfSBlbHNlIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBSZW1vdmVDaGFuZ2UpIHtcbiAgICAgIHJlY29yZGVyLnJlbW92ZShjaGFuZ2UucG9zLCBjaGFuZ2UuZW5kIC0gY2hhbmdlLnBvcyk7XG4gICAgfSBlbHNlIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBSZXBsYWNlQ2hhbmdlKSB7XG4gICAgICByZWNvcmRlci5yZW1vdmUoY2hhbmdlLnBvcywgY2hhbmdlLm9sZFRleHQubGVuZ3RoKTtcbiAgICAgIHJlY29yZGVyLmluc2VydExlZnQoY2hhbmdlLnBvcywgY2hhbmdlLm5ld1RleHQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVjb3JkZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21taXRDaGFuZ2VzKHRyZWU6IFRyZWUsIHBhdGg6IHN0cmluZywgY2hhbmdlczogQ2hhbmdlW10pIHtcbiAgaWYgKGNoYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcmVjb3JkZXIgPSBjcmVhdGVDaGFuZ2VSZWNvcmRlcih0cmVlLCBwYXRoLCBjaGFuZ2VzKTtcbiAgdHJlZS5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICByZXR1cm4gdHJ1ZTtcbn1cbiJdfQ==