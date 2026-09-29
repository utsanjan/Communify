(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/effects/schematics-core/utility/ast-utils", ["require", "exports", "typescript", "@ngrx/effects/schematics-core/utility/change"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* istanbul ignore file */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    const ts = require("typescript");
    const change_1 = require("@ngrx/effects/schematics-core/utility/change");
    /**
     * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
     * @param node
     * @param kind
     * @param max The maximum number of items to return.
     * @return all nodes of kind, or [] if none is found
     */
    function findNodes(node, kind, max = Infinity) {
        if (!node || max == 0) {
            return [];
        }
        const arr = [];
        if (node.kind === kind) {
            arr.push(node);
            max--;
        }
        if (max > 0) {
            for (const child of node.getChildren()) {
                findNodes(child, kind, max).forEach(node => {
                    if (max > 0) {
                        arr.push(node);
                    }
                    max--;
                });
                if (max <= 0) {
                    break;
                }
            }
        }
        return arr;
    }
    exports.findNodes = findNodes;
    /**
     * Get all the nodes from a source.
     * @param sourceFile The source file object.
     * @returns {Observable<ts.Node>} An observable of all the nodes in the source.
     */
    function getSourceNodes(sourceFile) {
        const nodes = [sourceFile];
        const result = [];
        while (nodes.length > 0) {
            const node = nodes.shift();
            if (node) {
                result.push(node);
                if (node.getChildCount(sourceFile) >= 0) {
                    nodes.unshift(...node.getChildren());
                }
            }
        }
        return result;
    }
    exports.getSourceNodes = getSourceNodes;
    /**
     * Helper for sorting nodes.
     * @return function to sort nodes in increasing order of position in sourceFile
     */
    function nodesByPosition(first, second) {
        return first.pos - second.pos;
    }
    /**
     * Insert `toInsert` after the last occurence of `ts.SyntaxKind[nodes[i].kind]`
     * or after the last of occurence of `syntaxKind` if the last occurence is a sub child
     * of ts.SyntaxKind[nodes[i].kind] and save the changes in file.
     *
     * @param nodes insert after the last occurence of nodes
     * @param toInsert string to insert
     * @param file file to insert changes into
     * @param fallbackPos position to insert if toInsert happens to be the first occurence
     * @param syntaxKind the ts.SyntaxKind of the subchildren to insert after
     * @return Change instance
     * @throw Error if toInsert is first occurence but fall back is not set
     */
    function insertAfterLastOccurrence(nodes, toInsert, file, fallbackPos, syntaxKind) {
        let lastItem = nodes.sort(nodesByPosition).pop();
        if (!lastItem) {
            throw new Error();
        }
        if (syntaxKind) {
            lastItem = findNodes(lastItem, syntaxKind)
                .sort(nodesByPosition)
                .pop();
        }
        if (!lastItem && fallbackPos == undefined) {
            throw new Error(`tried to insert ${toInsert} as first occurence with no fallback position`);
        }
        const lastItemPosition = lastItem ? lastItem.end : fallbackPos;
        return new change_1.InsertChange(file, lastItemPosition, toInsert);
    }
    exports.insertAfterLastOccurrence = insertAfterLastOccurrence;
    function getContentOfKeyLiteral(_source, node) {
        if (node.kind == ts.SyntaxKind.Identifier) {
            return node.text;
        }
        else if (node.kind == ts.SyntaxKind.StringLiteral) {
            return node.text;
        }
        else {
            return null;
        }
    }
    exports.getContentOfKeyLiteral = getContentOfKeyLiteral;
    function _angularImportsFromNode(node, _sourceFile) {
        const ms = node.moduleSpecifier;
        let modulePath;
        switch (ms.kind) {
            case ts.SyntaxKind.StringLiteral:
                modulePath = ms.text;
                break;
            default:
                return {};
        }
        if (!modulePath.startsWith('@angular/')) {
            return {};
        }
        if (node.importClause) {
            if (node.importClause.name) {
                // This is of the form `import Name from 'path'`. Ignore.
                return {};
            }
            else if (node.importClause.namedBindings) {
                const nb = node.importClause.namedBindings;
                if (nb.kind == ts.SyntaxKind.NamespaceImport) {
                    // This is of the form `import * as name from 'path'`. Return `name.`.
                    return {
                        [nb.name.text + '.']: modulePath,
                    };
                }
                else {
                    // This is of the form `import {a,b,c} from 'path'`
                    const namedImports = nb;
                    return namedImports.elements
                        .map((is) => is.propertyName ? is.propertyName.text : is.name.text)
                        .reduce((acc, curr) => {
                        acc[curr] = modulePath;
                        return acc;
                    }, {});
                }
            }
            return {};
        }
        else {
            // This is of the form `import 'path';`. Nothing to do.
            return {};
        }
    }
    function getDecoratorMetadata(source, identifier, module) {
        const angularImports = findNodes(source, ts.SyntaxKind.ImportDeclaration)
            .map(node => _angularImportsFromNode(node, source))
            .reduce((acc, current) => {
            for (const key of Object.keys(current)) {
                acc[key] = current[key];
            }
            return acc;
        }, {});
        return getSourceNodes(source)
            .filter(node => {
            return (node.kind == ts.SyntaxKind.Decorator &&
                node.expression.kind == ts.SyntaxKind.CallExpression);
        })
            .map(node => node.expression)
            .filter(expr => {
            if (expr.expression.kind == ts.SyntaxKind.Identifier) {
                const id = expr.expression;
                return (id.getFullText(source) == identifier &&
                    angularImports[id.getFullText(source)] === module);
            }
            else if (expr.expression.kind == ts.SyntaxKind.PropertyAccessExpression) {
                // This covers foo.NgModule when importing * as foo.
                const paExpr = expr.expression;
                // If the left expression is not an identifier, just give up at that point.
                if (paExpr.expression.kind !== ts.SyntaxKind.Identifier) {
                    return false;
                }
                const id = paExpr.name.text;
                const moduleId = paExpr.expression.getText(source);
                return id === identifier && angularImports[moduleId + '.'] === module;
            }
            return false;
        })
            .filter(expr => expr.arguments[0] &&
            expr.arguments[0].kind == ts.SyntaxKind.ObjectLiteralExpression)
            .map(expr => expr.arguments[0]);
    }
    exports.getDecoratorMetadata = getDecoratorMetadata;
    function _addSymbolToNgModuleMetadata(source, ngModulePath, metadataField, symbolName, importPath) {
        const nodes = getDecoratorMetadata(source, 'NgModule', '@angular/core');
        let node = nodes[0]; // tslint:disable-line:no-any
        // Find the decorator declaration.
        if (!node) {
            return [];
        }
        // Get all the children property assignment of object literals.
        const matchingProperties = node.properties
            .filter(prop => prop.kind == ts.SyntaxKind.PropertyAssignment)
            // Filter out every fields that's not "metadataField". Also handles string literals
            // (but not expressions).
            .filter((prop) => {
            const name = prop.name;
            switch (name.kind) {
                case ts.SyntaxKind.Identifier:
                    return name.getText(source) == metadataField;
                case ts.SyntaxKind.StringLiteral:
                    return name.text == metadataField;
            }
            return false;
        });
        // Get the last node of the array literal.
        if (!matchingProperties) {
            return [];
        }
        if (matchingProperties.length == 0) {
            // We haven't found the field in the metadata declaration. Insert a new field.
            const expr = node;
            let position;
            let toInsert;
            if (expr.properties.length == 0) {
                position = expr.getEnd() - 1;
                toInsert = `  ${metadataField}: [${symbolName}]\n`;
            }
            else {
                node = expr.properties[expr.properties.length - 1];
                position = node.getEnd();
                // Get the indentation of the last element, if any.
                const text = node.getFullText(source);
                const matches = text.match(/^\r?\n\s*/);
                if (matches.length > 0) {
                    toInsert = `,${matches[0]}${metadataField}: [${symbolName}]`;
                }
                else {
                    toInsert = `, ${metadataField}: [${symbolName}]`;
                }
            }
            const newMetadataProperty = new change_1.InsertChange(ngModulePath, position, toInsert);
            const newMetadataImport = insertImport(source, ngModulePath, symbolName.replace(/\..*$/, ''), importPath);
            return [newMetadataProperty, newMetadataImport];
        }
        const assignment = matchingProperties[0];
        // If it's not an array, nothing we can do really.
        if (assignment.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
            return [];
        }
        const arrLiteral = assignment.initializer;
        if (arrLiteral.elements.length == 0) {
            // Forward the property.
            node = arrLiteral;
        }
        else {
            node = arrLiteral.elements;
        }
        if (!node) {
            console.log('No app module found. Please add your new class to your component.');
            return [];
        }
        if (Array.isArray(node)) {
            const nodeArray = node;
            const symbolsArray = nodeArray.map(node => node.getText());
            if (symbolsArray.includes(symbolName)) {
                return [];
            }
            node = node[node.length - 1];
            const effectsModule = nodeArray.find(node => (node.getText().includes('EffectsModule.forRoot') &&
                symbolName.includes('EffectsModule.forRoot')) ||
                (node.getText().includes('EffectsModule.forFeature') &&
                    symbolName.includes('EffectsModule.forFeature')));
            if (effectsModule && symbolName.includes('EffectsModule')) {
                const effectsArgs = effectsModule.arguments.shift();
                if (effectsArgs &&
                    effectsArgs.kind === ts.SyntaxKind.ArrayLiteralExpression) {
                    const effectsElements = effectsArgs
                        .elements;
                    const [, effectsSymbol] = symbolName.match(/\[(.*)\]/);
                    let epos;
                    if (effectsElements.length === 0) {
                        epos = effectsArgs.getStart() + 1;
                        return [new change_1.InsertChange(ngModulePath, epos, effectsSymbol)];
                    }
                    else {
                        const lastEffect = effectsElements[effectsElements.length - 1];
                        epos = lastEffect.getEnd();
                        // Get the indentation of the last element, if any.
                        const text = lastEffect.getFullText(source);
                        let effectInsert;
                        if (text.match('^\r?\r?\n')) {
                            effectInsert = `,${text.match(/^\r?\n\s+/)[0]}${effectsSymbol}`;
                        }
                        else {
                            effectInsert = `, ${effectsSymbol}`;
                        }
                        return [new change_1.InsertChange(ngModulePath, epos, effectInsert)];
                    }
                }
                else {
                    return [];
                }
            }
        }
        let toInsert;
        let position = node.getEnd();
        if (node.kind == ts.SyntaxKind.ObjectLiteralExpression) {
            // We haven't found the field in the metadata declaration. Insert a new
            // field.
            const expr = node;
            if (expr.properties.length == 0) {
                position = expr.getEnd() - 1;
                toInsert = `  ${metadataField}: [${symbolName}]\n`;
            }
            else {
                node = expr.properties[expr.properties.length - 1];
                position = node.getEnd();
                // Get the indentation of the last element, if any.
                const text = node.getFullText(source);
                if (text.match('^\r?\r?\n')) {
                    toInsert = `,${text.match(/^\r?\n\s+/)[0]}${metadataField}: [${symbolName}]`;
                }
                else {
                    toInsert = `, ${metadataField}: [${symbolName}]`;
                }
            }
        }
        else if (node.kind == ts.SyntaxKind.ArrayLiteralExpression) {
            // We found the field but it's empty. Insert it just before the `]`.
            position--;
            toInsert = `${symbolName}`;
        }
        else {
            // Get the indentation of the last element, if any.
            const text = node.getFullText(source);
            if (text.match(/^\r?\n/)) {
                toInsert = `,${text.match(/^\r?\n(\r?)\s+/)[0]}${symbolName}`;
            }
            else {
                toInsert = `, ${symbolName}`;
            }
        }
        const insert = new change_1.InsertChange(ngModulePath, position, toInsert);
        const importInsert = insertImport(source, ngModulePath, symbolName.replace(/\..*$/, ''), importPath);
        return [insert, importInsert];
    }
    /**
     * Custom function to insert a declaration (component, pipe, directive)
     * into NgModule declarations. It also imports the component.
     */
    function addDeclarationToModule(source, modulePath, classifiedName, importPath) {
        return _addSymbolToNgModuleMetadata(source, modulePath, 'declarations', classifiedName, importPath);
    }
    exports.addDeclarationToModule = addDeclarationToModule;
    /**
     * Custom function to insert a declaration (component, pipe, directive)
     * into NgModule declarations. It also imports the component.
     */
    function addImportToModule(source, modulePath, classifiedName, importPath) {
        return _addSymbolToNgModuleMetadata(source, modulePath, 'imports', classifiedName, importPath);
    }
    exports.addImportToModule = addImportToModule;
    /**
     * Custom function to insert a provider into NgModule. It also imports it.
     */
    function addProviderToModule(source, modulePath, classifiedName, importPath) {
        return _addSymbolToNgModuleMetadata(source, modulePath, 'providers', classifiedName, importPath);
    }
    exports.addProviderToModule = addProviderToModule;
    /**
     * Custom function to insert an export into NgModule. It also imports it.
     */
    function addExportToModule(source, modulePath, classifiedName, importPath) {
        return _addSymbolToNgModuleMetadata(source, modulePath, 'exports', classifiedName, importPath);
    }
    exports.addExportToModule = addExportToModule;
    /**
     * Custom function to insert an export into NgModule. It also imports it.
     */
    function addBootstrapToModule(source, modulePath, classifiedName, importPath) {
        return _addSymbolToNgModuleMetadata(source, modulePath, 'bootstrap', classifiedName, importPath);
    }
    exports.addBootstrapToModule = addBootstrapToModule;
    /**
     * Add Import `import { symbolName } from fileName` if the import doesn't exit
     * already. Assumes fileToEdit can be resolved and accessed.
     * @param fileToEdit (file we want to add import to)
     * @param symbolName (item to import)
     * @param fileName (path to the file)
     * @param isDefault (if true, import follows style for importing default exports)
     * @return Change
     */
    function insertImport(source, fileToEdit, symbolName, fileName, isDefault = false) {
        const rootNode = source;
        const allImports = findNodes(rootNode, ts.SyntaxKind.ImportDeclaration);
        // get nodes that map to import statements from the file fileName
        const relevantImports = allImports.filter(node => {
            // StringLiteral of the ImportDeclaration is the import file (fileName in this case).
            const importFiles = node
                .getChildren()
                .filter(child => child.kind === ts.SyntaxKind.StringLiteral)
                .map(n => n.text);
            return importFiles.filter(file => file === fileName).length === 1;
        });
        if (relevantImports.length > 0) {
            let importsAsterisk = false;
            // imports from import file
            const imports = [];
            relevantImports.forEach(n => {
                Array.prototype.push.apply(imports, findNodes(n, ts.SyntaxKind.Identifier));
                if (findNodes(n, ts.SyntaxKind.AsteriskToken).length > 0) {
                    importsAsterisk = true;
                }
            });
            // if imports * from fileName, don't add symbolName
            if (importsAsterisk) {
                return new change_1.NoopChange();
            }
            const importTextNodes = imports.filter(n => n.text === symbolName);
            // insert import if it's not there
            if (importTextNodes.length === 0) {
                const fallbackPos = findNodes(relevantImports[0], ts.SyntaxKind.CloseBraceToken)[0].getStart() ||
                    findNodes(relevantImports[0], ts.SyntaxKind.FromKeyword)[0].getStart();
                return insertAfterLastOccurrence(imports, `, ${symbolName}`, fileToEdit, fallbackPos);
            }
            return new change_1.NoopChange();
        }
        // no such import declaration exists
        const useStrict = findNodes(rootNode, ts.SyntaxKind.StringLiteral).filter(n => n.getText() === 'use strict');
        let fallbackPos = 0;
        if (useStrict.length > 0) {
            fallbackPos = useStrict[0].end;
        }
        const open = isDefault ? '' : '{ ';
        const close = isDefault ? '' : ' }';
        // if there are no imports or 'use strict' statement, insert import at beginning of file
        const insertAtBeginning = allImports.length === 0 && useStrict.length === 0;
        const separator = insertAtBeginning ? '' : ';\n';
        const toInsert = `${separator}import ${open}${symbolName}${close}` +
            ` from '${fileName}'${insertAtBeginning ? ';\n' : ''}`;
        return insertAfterLastOccurrence(allImports, toInsert, fileToEdit, fallbackPos, ts.SyntaxKind.StringLiteral);
    }
    exports.insertImport = insertImport;
    function replaceImport(sourceFile, path, importFrom, importAsIs, importToBe) {
        const imports = sourceFile.statements
            .filter(ts.isImportDeclaration)
            .filter(({ moduleSpecifier }) => moduleSpecifier.getText(sourceFile) === `'${importFrom}'` ||
            moduleSpecifier.getText(sourceFile) === `"${importFrom}"`);
        if (imports.length === 0) {
            return [];
        }
        const importText = (specifier) => {
            if (specifier.name.text) {
                return specifier.name.text;
            }
            // if import is renamed
            if (specifier.propertyName && specifier.propertyName.text) {
                return specifier.propertyName.text;
            }
            return '';
        };
        const changes = imports.map(p => {
            const importSpecifiers = p.importClause.namedBindings
                .elements;
            const isAlreadyImported = importSpecifiers
                .map(importText)
                .includes(importToBe);
            const importChanges = importSpecifiers.map((specifier, index) => {
                const text = importText(specifier);
                // import is not the one we're looking for, can be skipped
                if (text !== importAsIs) {
                    return undefined;
                }
                // identifier has not been imported, simply replace the old text with the new text
                if (!isAlreadyImported) {
                    return change_1.createReplaceChange(sourceFile, specifier, importAsIs, importToBe);
                }
                const nextIdentifier = importSpecifiers[index + 1];
                // identifer is not the last, also clean up the comma
                if (nextIdentifier) {
                    return change_1.createRemoveChange(sourceFile, specifier, specifier.getStart(sourceFile), nextIdentifier.getStart(sourceFile));
                }
                // there are no imports following, just remove it
                return change_1.createRemoveChange(sourceFile, specifier, specifier.getStart(sourceFile), specifier.getEnd());
            });
            return importChanges.filter(Boolean);
        });
        return changes.reduce((imports, curr) => imports.concat(curr), []);
    }
    exports.replaceImport = replaceImport;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LXV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9lZmZlY3RzL3NjaGVtYXRpY3MtY29yZS91dGlsaXR5L2FzdC11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLDBCQUEwQjtJQUMxQjs7Ozs7O09BTUc7SUFDSCxpQ0FBaUM7SUFDakMseUVBUWtCO0lBR2xCOzs7Ozs7T0FNRztJQUNILFNBQWdCLFNBQVMsQ0FDdkIsSUFBYSxFQUNiLElBQW1CLEVBQ25CLEdBQUcsR0FBRyxRQUFRO1FBRWQsSUFBSSxDQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQ3JCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFFRCxNQUFNLEdBQUcsR0FBYyxFQUFFLENBQUM7UUFDMUIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtZQUN0QixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2YsR0FBRyxFQUFFLENBQUM7U0FDUDtRQUNELElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtZQUNYLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO2dCQUN0QyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3pDLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTt3QkFDWCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNoQjtvQkFDRCxHQUFHLEVBQUUsQ0FBQztnQkFDUixDQUFDLENBQUMsQ0FBQztnQkFFSCxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7b0JBQ1osTUFBTTtpQkFDUDthQUNGO1NBQ0Y7UUFFRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUE5QkQsOEJBOEJDO0lBRUQ7Ozs7T0FJ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QUFFLENBQ25CLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQXFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFsRkQsc0NBa0ZDIiwic291cmNlc0NvbnRlbnQiOlsiLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlLFxuICBJbnNlcnRDaGFuZ2UsXG4gIE5vb3BDaGFuZ2UsXG4gIGNyZWF0ZVJlcGxhY2VDaGFuZ2UsXG4gIFJlcGxhY2VDaGFuZ2UsXG4gIFJlbW92ZUNoYW5nZSxcbiAgY3JlYXRlUmVtb3ZlQ2hhbmdlLFxufSBmcm9tICcuL2NoYW5nZSc7XG5pbXBvcnQgeyBQYXRoIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuXG4vKipcbiAqIEZpbmQgYWxsIG5vZGVzIGZyb20gdGhlIEFTVCBpbiB0aGUgc3VidHJlZSBvZiBub2RlIG9mIFN5bnRheEtpbmQga2luZC5cbiAqIEBwYXJhbSBub2RlXG4gKiBAcGFyYW0ga2luZFxuICogQHBhcmFtIG1heCBUaGUgbWF4aW11bSBudW1iZXIgb2YgaXRlbXMgdG8gcmV0dXJuLlxuICogQHJldHVybiBhbGwgbm9kZXMgb2Yga2luZCwgb3IgW10gaWYgbm9uZSBpcyBmb3VuZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZE5vZGVzKFxuICBub2RlOiB0cy5Ob2RlLFxuICBraW5kOiB0cy5TeW50YXhLaW5kLFxuICBtYXggPSBJbmZpbml0eVxuKTogdHMuTm9kZVtdIHtcbiAgaWYgKCFub2RlIHx8IG1heCA9PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgYXJyOiB0cy5Ob2RlW10gPSBbXTtcbiAgaWYgKG5vZGUua2luZCA9PT0ga2luZCkge1xuICAgIGFyci5wdXNoKG5vZGUpO1xuICAgIG1heC0tO1xuICB9XG4gIGlmIChtYXggPiAwKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlLmdldENoaWxkcmVuKCkpIHtcbiAgICAgIGZpbmROb2RlcyhjaGlsZCwga2luZCwgbWF4KS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICBpZiAobWF4ID4gMCkge1xuICAgICAgICAgIGFyci5wdXNoKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIG1heC0tO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChtYXggPD0gMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXJyO1xufVxuXG4vKipcbiAqIEdldCBhbGwgdGhlIG5vZGVzIGZyb20gYSBzb3VyY2UuXG4gKiBAcGFyYW0gc291cmNlRmlsZSBUaGUgc291cmNlIGZpbGUgb2JqZWN0LlxuICogQHJldHVybnMge09ic2VydmFibGU8dHMuTm9kZT59IEFuIG9ic2VydmFibGUgb2YgYWxsIHRoZSBub2RlcyBpbiB0aGUgc291cmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U291cmNlTm9kZXMoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IHRzLk5vZGVbXSB7XG4gIGNvbnN0IG5vZGVzOiB0cy5Ob2RlW10gPSBbc291cmNlRmlsZV07XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlIChub2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3Qgbm9kZSA9IG5vZGVzLnNoaWZ0KCk7XG5cbiAgICBpZiAobm9kZSkge1xuICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XG4gICAgICBpZiAobm9kZS5nZXRDaGlsZENvdW50KHNvdXJjZUZpbGUpID49IDApIHtcbiAgICAgICAgbm9kZXMudW5zaGlmdCguLi5ub2RlLmdldENoaWxkcmVuKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogSGVscGVyIGZvciBzb3J0aW5nIG5vZGVzLlxuICogQHJldHVybiBmdW5jdGlvbiB0byBzb3J0IG5vZGVzIGluIGluY3JlYXNpbmcgb3JkZXIgb2YgcG9zaXRpb24gaW4gc291cmNlRmlsZVxuICovXG5mdW5jdGlvbiBub2Rlc0J5UG9zaXRpb24oZmlyc3Q6IHRzLk5vZGUsIHNlY29uZDogdHMuTm9kZSk6IG51bWJlciB7XG4gIHJldHVybiBmaXJzdC5wb3MgLSBzZWNvbmQucG9zO1xufVxuXG4vKipcbiAqIEluc2VydCBgdG9JbnNlcnRgIGFmdGVyIHRoZSBsYXN0IG9jY3VyZW5jZSBvZiBgdHMuU3ludGF4S2luZFtub2Rlc1tpXS5raW5kXWBcbiAqIG9yIGFmdGVyIHRoZSBsYXN0IG9mIG9jY3VyZW5jZSBvZiBgc3ludGF4S2luZGAgaWYgdGhlIGxhc3Qgb2NjdXJlbmNlIGlzIGEgc3ViIGNoaWxkXG4gKiBvZiB0cy5TeW50YXhLaW5kW25vZGVzW2ldLmtpbmRdIGFuZCBzYXZlIHRoZSBjaGFuZ2VzIGluIGZpbGUuXG4gKlxuICogQHBhcmFtIG5vZGVzIGluc2VydCBhZnRlciB0aGUgbGFzdCBvY2N1cmVuY2Ugb2Ygbm9kZXNcbiAqIEBwYXJhbSB0b0luc2VydCBzdHJpbmcgdG8gaW5zZXJ0XG4gKiBAcGFyYW0gZmlsZSBmaWxlIHRvIGluc2VydCBjaGFuZ2VzIGludG9cbiAqIEBwYXJhbSBmYWxsYmFja1BvcyBwb3NpdGlvbiB0byBpbnNlcnQgaWYgdG9JbnNlcnQgaGFwcGVucyB0byBiZSB0aGUgZmlyc3Qgb2NjdXJlbmNlXG4gKiBAcGFyYW0gc3ludGF4S2luZCB0aGUgdHMuU3ludGF4S2luZCBvZiB0aGUgc3ViY2hpbGRyZW4gdG8gaW5zZXJ0IGFmdGVyXG4gKiBAcmV0dXJuIENoYW5nZSBpbnN0YW5jZVxuICogQHRocm93IEVycm9yIGlmIHRvSW5zZXJ0IGlzIGZpcnN0IG9jY3VyZW5jZSBidXQgZmFsbCBiYWNrIGlzIG5vdCBzZXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydEFmdGVyTGFzdE9jY3VycmVuY2UoXG4gIG5vZGVzOiB0cy5Ob2RlW10sXG4gIHRvSW5zZXJ0OiBzdHJpbmcsXG4gIGZpbGU6IHN0cmluZyxcbiAgZmFsbGJhY2tQb3M6IG51bWJlcixcbiAgc3ludGF4S2luZD86IHRzLlN5bnRheEtpbmRcbik6IENoYW5nZSB7XG4gIGxldCBsYXN0SXRlbSA9IG5vZGVzLnNvcnQobm9kZXNCeVBvc2l0aW9uKS5wb3AoKTtcbiAgaWYgKCFsYXN0SXRlbSkge1xuICAgIHRocm93IG5ldyBFcnJvcigpO1xuICB9XG4gIGlmIChzeW50YXhLaW5kKSB7XG4gICAgbGFzdEl0ZW0gPSBmaW5kTm9kZXMobGFzdEl0ZW0sIHN5bnRheEtpbmQpXG4gICAgICAuc29ydChub2Rlc0J5UG9zaXRpb24pXG4gICAgICAucG9wKCk7XG4gIH1cbiAgaWYgKCFsYXN0SXRlbSAmJiBmYWxsYmFja1BvcyA9PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgdHJpZWQgdG8gaW5zZXJ0ICR7dG9JbnNlcnR9IGFzIGZpcnN0IG9jY3VyZW5jZSB3aXRoIG5vIGZhbGxiYWNrIHBvc2l0aW9uYFxuICAgICk7XG4gIH1cbiAgY29uc3QgbGFzdEl0ZW1Qb3NpdGlvbjogbnVtYmVyID0gbGFzdEl0ZW0gPyBsYXN0SXRlbS5lbmQgOiBmYWxsYmFja1BvcztcblxuICByZXR1cm4gbmV3IEluc2VydENoYW5nZShmaWxlLCBsYXN0SXRlbVBvc2l0aW9uLCB0b0luc2VydCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250ZW50T2ZLZXlMaXRlcmFsKFxuICBfc291cmNlOiB0cy5Tb3VyY2VGaWxlLFxuICBub2RlOiB0cy5Ob2RlXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKG5vZGUua2luZCA9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICByZXR1cm4gKG5vZGUgYXMgdHMuSWRlbnRpZmllcikudGV4dDtcbiAgfSBlbHNlIGlmIChub2RlLmtpbmQgPT0gdHMuU3ludGF4S2luZC5TdHJpbmdMaXRlcmFsKSB7XG4gICAgcmV0dXJuIChub2RlIGFzIHRzLlN0cmluZ0xpdGVyYWwpLnRleHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2FuZ3VsYXJJbXBvcnRzRnJvbU5vZGUoXG4gIG5vZGU6IHRzLkltcG9ydERlY2xhcmF0aW9uLFxuICBfc291cmNlRmlsZTogdHMuU291cmNlRmlsZVxuKTogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICBjb25zdCBtcyA9IG5vZGUubW9kdWxlU3BlY2lmaWVyO1xuICBsZXQgbW9kdWxlUGF0aDogc3RyaW5nO1xuICBzd2l0Y2ggKG1zLmtpbmQpIHtcbiAgICBjYXNlIHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbDpcbiAgICAgIG1vZHVsZVBhdGggPSAobXMgYXMgdHMuU3RyaW5nTGl0ZXJhbCkudGV4dDtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4ge307XG4gIH1cblxuICBpZiAoIW1vZHVsZVBhdGguc3RhcnRzV2l0aCgnQGFuZ3VsYXIvJykpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBpZiAobm9kZS5pbXBvcnRDbGF1c2UpIHtcbiAgICBpZiAobm9kZS5pbXBvcnRDbGF1c2UubmFtZSkge1xuICAgICAgLy8gVGhpcyBpcyBvZiB0aGUgZm9ybSBgaW1wb3J0IE5hbWUgZnJvbSAncGF0aCdgLiBJZ25vcmUuXG4gICAgICByZXR1cm4ge307XG4gICAgfSBlbHNlIGlmIChub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XG4gICAgICBjb25zdCBuYiA9IG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3M7XG4gICAgICBpZiAobmIua2luZCA9PSB0cy5TeW50YXhLaW5kLk5hbWVzcGFjZUltcG9ydCkge1xuICAgICAgICAvLyBUaGlzIGlzIG9mIHRoZSBmb3JtIGBpbXBvcnQgKiBhcyBuYW1lIGZyb20gJ3BhdGgnYC4gUmV0dXJuIGBuYW1lLmAuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgWyhuYiBhcyB0cy5OYW1lc3BhY2VJbXBvcnQpLm5hbWUudGV4dCArICcuJ106IG1vZHVsZVBhdGgsXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIGlzIG9mIHRoZSBmb3JtIGBpbXBvcnQge2EsYixjfSBmcm9tICdwYXRoJ2BcbiAgICAgICAgY29uc3QgbmFtZWRJbXBvcnRzID0gbmIgYXMgdHMuTmFtZWRJbXBvcnRzO1xuXG4gICAgICAgIHJldHVybiBuYW1lZEltcG9ydHMuZWxlbWVudHNcbiAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgKGlzOiB0cy5JbXBvcnRTcGVjaWZpZXIpID0+XG4gICAgICAgICAgICAgIGlzLnByb3BlcnR5TmFtZSA/IGlzLnByb3BlcnR5TmFtZS50ZXh0IDogaXMubmFtZS50ZXh0XG4gICAgICAgICAgKVxuICAgICAgICAgIC5yZWR1Y2UoKGFjYzogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0sIGN1cnI6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgYWNjW2N1cnJdID0gbW9kdWxlUGF0aDtcblxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LCB7fSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHt9O1xuICB9IGVsc2Uge1xuICAgIC8vIFRoaXMgaXMgb2YgdGhlIGZvcm0gYGltcG9ydCAncGF0aCc7YC4gTm90aGluZyB0byBkby5cbiAgICByZXR1cm4ge307XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlY29yYXRvck1ldGFkYXRhKFxuICBzb3VyY2U6IHRzLlNvdXJjZUZpbGUsXG4gIGlkZW50aWZpZXI6IHN0cmluZyxcbiAgbW9kdWxlOiBzdHJpbmdcbik6IHRzLk5vZGVbXSB7XG4gIGNvbnN0IGFuZ3VsYXJJbXBvcnRzOiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfSA9IGZpbmROb2RlcyhcbiAgICBzb3VyY2UsXG4gICAgdHMuU3ludGF4S2luZC5JbXBvcnREZWNsYXJhdGlvblxuICApXG4gICAgLm1hcChub2RlID0+IF9hbmd1bGFySW1wb3J0c0Zyb21Ob2RlKG5vZGUgYXMgdHMuSW1wb3J0RGVjbGFyYXRpb24sIHNvdXJjZSkpXG4gICAgLnJlZHVjZShcbiAgICAgIChcbiAgICAgICAgYWNjOiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfSxcbiAgICAgICAgY3VycmVudDogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH1cbiAgICAgICkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhjdXJyZW50KSkge1xuICAgICAgICAgIGFjY1trZXldID0gY3VycmVudFtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sXG4gICAgICB7fVxuICAgICk7XG5cbiAgcmV0dXJuIGdldFNvdXJjZU5vZGVzKHNvdXJjZSlcbiAgICAuZmlsdGVyKG5vZGUgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgbm9kZS5raW5kID09IHRzLlN5bnRheEtpbmQuRGVjb3JhdG9yICYmXG4gICAgICAgIChub2RlIGFzIHRzLkRlY29yYXRvcikuZXhwcmVzc2lvbi5raW5kID09IHRzLlN5bnRheEtpbmQuQ2FsbEV4cHJlc3Npb25cbiAgICAgICk7XG4gICAgfSlcbiAgICAubWFwKG5vZGUgPT4gKG5vZGUgYXMgdHMuRGVjb3JhdG9yKS5leHByZXNzaW9uIGFzIHRzLkNhbGxFeHByZXNzaW9uKVxuICAgIC5maWx0ZXIoZXhwciA9PiB7XG4gICAgICBpZiAoZXhwci5leHByZXNzaW9uLmtpbmQgPT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSB7XG4gICAgICAgIGNvbnN0IGlkID0gZXhwci5leHByZXNzaW9uIGFzIHRzLklkZW50aWZpZXI7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBpZC5nZXRGdWxsVGV4dChzb3VyY2UpID09IGlkZW50aWZpZXIgJiZcbiAgICAgICAgICBhbmd1bGFySW1wb3J0c1tpZC5nZXRGdWxsVGV4dChzb3VyY2UpXSA9PT0gbW9kdWxlXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBleHByLmV4cHJlc3Npb24ua2luZCA9PSB0cy5TeW50YXhLaW5kLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvblxuICAgICAgKSB7XG4gICAgICAgIC8vIFRoaXMgY292ZXJzIGZvby5OZ01vZHVsZSB3aGVuIGltcG9ydGluZyAqIGFzIGZvby5cbiAgICAgICAgY29uc3QgcGFFeHByID0gZXhwci5leHByZXNzaW9uIGFzIHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbjtcbiAgICAgICAgLy8gSWYgdGhlIGxlZnQgZXhwcmVzc2lvbiBpcyBub3QgYW4gaWRlbnRpZmllciwganVzdCBnaXZlIHVwIGF0IHRoYXQgcG9pbnQuXG4gICAgICAgIGlmIChwYUV4cHIuZXhwcmVzc2lvbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpZCA9IHBhRXhwci5uYW1lLnRleHQ7XG4gICAgICAgIGNvbnN0IG1vZHVsZUlkID0gKHBhRXhwci5leHByZXNzaW9uIGFzIHRzLklkZW50aWZpZXIpLmdldFRleHQoc291cmNlKTtcblxuICAgICAgICByZXR1cm4gaWQgPT09IGlkZW50aWZpZXIgJiYgYW5ndWxhckltcG9ydHNbbW9kdWxlSWQgKyAnLiddID09PSBtb2R1bGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KVxuICAgIC5maWx0ZXIoXG4gICAgICBleHByID0+XG4gICAgICAgIGV4cHIuYXJndW1lbnRzWzBdICYmXG4gICAgICAgIGV4cHIuYXJndW1lbnRzWzBdLmtpbmQgPT0gdHMuU3ludGF4S2luZC5PYmplY3RMaXRlcmFsRXhwcmVzc2lvblxuICAgIClcbiAgICAubWFwKGV4cHIgPT4gZXhwci5hcmd1bWVudHNbMF0gYXMgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pO1xufVxuXG5mdW5jdGlvbiBfYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhKFxuICBzb3VyY2U6IHRzLlNvdXJjZUZpbGUsXG4gIG5nTW9kdWxlUGF0aDogc3RyaW5nLFxuICBtZXRhZGF0YUZpZWxkOiBzdHJpbmcsXG4gIHN5bWJvbE5hbWU6IHN0cmluZyxcbiAgaW1wb3J0UGF0aDogc3RyaW5nXG4pOiBDaGFuZ2VbXSB7XG4gIGNvbnN0IG5vZGVzID0gZ2V0RGVjb3JhdG9yTWV0YWRhdGEoc291cmNlLCAnTmdNb2R1bGUnLCAnQGFuZ3VsYXIvY29yZScpO1xuICBsZXQgbm9kZTogYW55ID0gbm9kZXNbMF07IC8vIHRzbGludDpkaXNhYmxlLWxpbmU6bm8tYW55XG5cbiAgLy8gRmluZCB0aGUgZGVjb3JhdG9yIGRlY2xhcmF0aW9uLlxuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvLyBHZXQgYWxsIHRoZSBjaGlsZHJlbiBwcm9wZXJ0eSBhc3NpZ25tZW50IG9mIG9iamVjdCBsaXRlcmFscy5cbiAgY29uc3QgbWF0Y2hpbmdQcm9wZXJ0aWVzOiB0cy5PYmplY3RMaXRlcmFsRWxlbWVudFtdID0gKG5vZGUgYXMgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pLnByb3BlcnRpZXNcbiAgICAuZmlsdGVyKHByb3AgPT4gcHJvcC5raW5kID09IHRzLlN5bnRheEtpbmQuUHJvcGVydHlBc3NpZ25tZW50KVxuICAgIC8vIEZpbHRlciBvdXQgZXZlcnkgZmllbGRzIHRoYXQncyBub3QgXCJtZXRhZGF0YUZpZWxkXCIuIEFsc28gaGFuZGxlcyBzdHJpbmcgbGl0ZXJhbHNcbiAgICAvLyAoYnV0IG5vdCBleHByZXNzaW9ucykuXG4gICAgLmZpbHRlcigocHJvcDogYW55KSA9PiB7XG4gICAgICBjb25zdCBuYW1lID0gcHJvcC5uYW1lO1xuICAgICAgc3dpdGNoIChuYW1lLmtpbmQpIHtcbiAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXI6XG4gICAgICAgICAgcmV0dXJuIChuYW1lIGFzIHRzLklkZW50aWZpZXIpLmdldFRleHQoc291cmNlKSA9PSBtZXRhZGF0YUZpZWxkO1xuICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbDpcbiAgICAgICAgICByZXR1cm4gKG5hbWUgYXMgdHMuU3RyaW5nTGl0ZXJhbCkudGV4dCA9PSBtZXRhZGF0YUZpZWxkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgLy8gR2V0IHRoZSBsYXN0IG5vZGUgb2YgdGhlIGFycmF5IGxpdGVyYWwuXG4gIGlmICghbWF0Y2hpbmdQcm9wZXJ0aWVzKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmIChtYXRjaGluZ1Byb3BlcnRpZXMubGVuZ3RoID09IDApIHtcbiAgICAvLyBXZSBoYXZlbid0IGZvdW5kIHRoZSBmaWVsZCBpbiB0aGUgbWV0YWRhdGEgZGVjbGFyYXRpb24uIEluc2VydCBhIG5ldyBmaWVsZC5cbiAgICBjb25zdCBleHByID0gbm9kZSBhcyB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbjtcbiAgICBsZXQgcG9zaXRpb246IG51bWJlcjtcbiAgICBsZXQgdG9JbnNlcnQ6IHN0cmluZztcbiAgICBpZiAoZXhwci5wcm9wZXJ0aWVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICBwb3NpdGlvbiA9IGV4cHIuZ2V0RW5kKCkgLSAxO1xuICAgICAgdG9JbnNlcnQgPSBgICAke21ldGFkYXRhRmllbGR9OiBbJHtzeW1ib2xOYW1lfV1cXG5gO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gZXhwci5wcm9wZXJ0aWVzW2V4cHIucHJvcGVydGllcy5sZW5ndGggLSAxXTtcbiAgICAgIHBvc2l0aW9uID0gbm9kZS5nZXRFbmQoKTtcbiAgICAgIC8vIEdldCB0aGUgaW5kZW50YXRpb24gb2YgdGhlIGxhc3QgZWxlbWVudCwgaWYgYW55LlxuICAgICAgY29uc3QgdGV4dCA9IG5vZGUuZ2V0RnVsbFRleHQoc291cmNlKTtcbiAgICAgIGNvbnN0IG1hdGNoZXMgPSB0ZXh0Lm1hdGNoKC9eXFxyP1xcblxccyovKTtcbiAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdG9JbnNlcnQgPSBgLCR7bWF0Y2hlc1swXX0ke21ldGFkYXRhRmllbGR9OiBbJHtzeW1ib2xOYW1lfV1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9JbnNlcnQgPSBgLCAke21ldGFkYXRhRmllbGR9OiBbJHtzeW1ib2xOYW1lfV1gO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBuZXdNZXRhZGF0YVByb3BlcnR5ID0gbmV3IEluc2VydENoYW5nZShcbiAgICAgIG5nTW9kdWxlUGF0aCxcbiAgICAgIHBvc2l0aW9uLFxuICAgICAgdG9JbnNlcnRcbiAgICApO1xuICAgIGNvbnN0IG5ld01ldGFkYXRhSW1wb3J0ID0gaW5zZXJ0SW1wb3J0KFxuICAgICAgc291cmNlLFxuICAgICAgbmdNb2R1bGVQYXRoLFxuICAgICAgc3ltYm9sTmFtZS5yZXBsYWNlKC9cXC4uKiQvLCAnJyksXG4gICAgICBpbXBvcnRQYXRoXG4gICAgKTtcblxuICAgIHJldHVybiBbbmV3TWV0YWRhdGFQcm9wZXJ0eSwgbmV3TWV0YWRhdGFJbXBvcnRdO1xuICB9XG5cbiAgY29uc3QgYXNzaWdubWVudCA9IG1hdGNoaW5nUHJvcGVydGllc1swXSBhcyB0cy5Qcm9wZXJ0eUFzc2lnbm1lbnQ7XG5cbiAgLy8gSWYgaXQncyBub3QgYW4gYXJyYXksIG5vdGhpbmcgd2UgY2FuIGRvIHJlYWxseS5cbiAgaWYgKGFzc2lnbm1lbnQuaW5pdGlhbGl6ZXIua2luZCAhPT0gdHMuU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgYXJyTGl0ZXJhbCA9IGFzc2lnbm1lbnQuaW5pdGlhbGl6ZXIgYXMgdHMuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbjtcbiAgaWYgKGFyckxpdGVyYWwuZWxlbWVudHMubGVuZ3RoID09IDApIHtcbiAgICAvLyBGb3J3YXJkIHRoZSBwcm9wZXJ0eS5cbiAgICBub2RlID0gYXJyTGl0ZXJhbDtcbiAgfSBlbHNlIHtcbiAgICBub2RlID0gYXJyTGl0ZXJhbC5lbGVtZW50cztcbiAgfVxuXG4gIGlmICghbm9kZSkge1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgJ05vIGFwcCBtb2R1bGUgZm91bmQuIFBsZWFzZSBhZGQgeW91ciBuZXcgY2xhc3MgdG8geW91ciBjb21wb25lbnQuJ1xuICAgICk7XG5cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgIGNvbnN0IG5vZGVBcnJheSA9IChub2RlIGFzIHt9KSBhcyBBcnJheTx0cy5Ob2RlPjtcbiAgICBjb25zdCBzeW1ib2xzQXJyYXkgPSBub2RlQXJyYXkubWFwKG5vZGUgPT4gbm9kZS5nZXRUZXh0KCkpO1xuICAgIGlmIChzeW1ib2xzQXJyYXkuaW5jbHVkZXMoc3ltYm9sTmFtZSkpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBub2RlID0gbm9kZVtub2RlLmxlbmd0aCAtIDFdO1xuXG4gICAgY29uc3QgZWZmZWN0c01vZHVsZSA9IG5vZGVBcnJheS5maW5kKFxuICAgICAgbm9kZSA9PlxuICAgICAgICAobm9kZS5nZXRUZXh0KCkuaW5jbHVkZXMoJ0VmZmVjdHNNb2R1bGUuZm9yUm9vdCcpICYmXG4gICAgICAgICAgc3ltYm9sTmFtZS5pbmNsdWRlcygnRWZmZWN0c01vZHVsZS5mb3JSb290JykpIHx8XG4gICAgICAgIChub2RlLmdldFRleHQoKS5pbmNsdWRlcygnRWZmZWN0c01vZHVsZS5mb3JGZWF0dXJlJykgJiZcbiAgICAgICAgICBzeW1ib2xOYW1lLmluY2x1ZGVzKCdFZmZlY3RzTW9kdWxlLmZvckZlYXR1cmUnKSlcbiAgICApO1xuXG4gICAgaWYgKGVmZmVjdHNNb2R1bGUgJiYgc3ltYm9sTmFtZS5pbmNsdWRlcygnRWZmZWN0c01vZHVsZScpKSB7XG4gICAgICBjb25zdCBlZmZlY3RzQXJncyA9IChlZmZlY3RzTW9kdWxlIGFzIGFueSkuYXJndW1lbnRzLnNoaWZ0KCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgZWZmZWN0c0FyZ3MgJiZcbiAgICAgICAgZWZmZWN0c0FyZ3Mua2luZCA9PT0gdHMuU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgZWZmZWN0c0VsZW1lbnRzID0gKGVmZmVjdHNBcmdzIGFzIHRzLkFycmF5TGl0ZXJhbEV4cHJlc3Npb24pXG4gICAgICAgICAgLmVsZW1lbnRzO1xuICAgICAgICBjb25zdCBbLCBlZmZlY3RzU3ltYm9sXSA9ICg8YW55PnN5bWJvbE5hbWUpLm1hdGNoKC9cXFsoLiopXFxdLyk7XG5cbiAgICAgICAgbGV0IGVwb3M7XG4gICAgICAgIGlmIChlZmZlY3RzRWxlbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgZXBvcyA9IGVmZmVjdHNBcmdzLmdldFN0YXJ0KCkgKyAxO1xuICAgICAgICAgIHJldHVybiBbbmV3IEluc2VydENoYW5nZShuZ01vZHVsZVBhdGgsIGVwb3MsIGVmZmVjdHNTeW1ib2wpXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBsYXN0RWZmZWN0ID0gZWZmZWN0c0VsZW1lbnRzW1xuICAgICAgICAgICAgZWZmZWN0c0VsZW1lbnRzLmxlbmd0aCAtIDFcbiAgICAgICAgICBdIGFzIHRzLkV4cHJlc3Npb247XG4gICAgICAgICAgZXBvcyA9IGxhc3RFZmZlY3QuZ2V0RW5kKCk7XG4gICAgICAgICAgLy8gR2V0IHRoZSBpbmRlbnRhdGlvbiBvZiB0aGUgbGFzdCBlbGVtZW50LCBpZiBhbnkuXG4gICAgICAgICAgY29uc3QgdGV4dDogYW55ID0gbGFzdEVmZmVjdC5nZXRGdWxsVGV4dChzb3VyY2UpO1xuXG4gICAgICAgICAgbGV0IGVmZmVjdEluc2VydDogc3RyaW5nO1xuICAgICAgICAgIGlmICh0ZXh0Lm1hdGNoKCdeXFxyP1xccj9cXG4nKSkge1xuICAgICAgICAgICAgZWZmZWN0SW5zZXJ0ID0gYCwke3RleHQubWF0Y2goL15cXHI/XFxuXFxzKy8pWzBdfSR7ZWZmZWN0c1N5bWJvbH1gO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlZmZlY3RJbnNlcnQgPSBgLCAke2VmZmVjdHNTeW1ib2x9YDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gW25ldyBJbnNlcnRDaGFuZ2UobmdNb2R1bGVQYXRoLCBlcG9zLCBlZmZlY3RJbnNlcnQpXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxldCB0b0luc2VydDogc3RyaW5nO1xuICBsZXQgcG9zaXRpb24gPSBub2RlLmdldEVuZCgpO1xuICBpZiAobm9kZS5raW5kID09IHRzLlN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pIHtcbiAgICAvLyBXZSBoYXZlbid0IGZvdW5kIHRoZSBmaWVsZCBpbiB0aGUgbWV0YWRhdGEgZGVjbGFyYXRpb24uIEluc2VydCBhIG5ld1xuICAgIC8vIGZpZWxkLlxuICAgIGNvbnN0IGV4cHIgPSBub2RlIGFzIHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uO1xuICAgIGlmIChleHByLnByb3BlcnRpZXMubGVuZ3RoID09IDApIHtcbiAgICAgIHBvc2l0aW9uID0gZXhwci5nZXRFbmQoKSAtIDE7XG4gICAgICB0b0luc2VydCA9IGAgICR7bWV0YWRhdGFGaWVsZH06IFske3N5bWJvbE5hbWV9XVxcbmA7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUgPSBleHByLnByb3BlcnRpZXNbZXhwci5wcm9wZXJ0aWVzLmxlbmd0aCAtIDFdO1xuICAgICAgcG9zaXRpb24gPSBub2RlLmdldEVuZCgpO1xuICAgICAgLy8gR2V0IHRoZSBpbmRlbnRhdGlvbiBvZiB0aGUgbGFzdCBlbGVtZW50LCBpZiBhbnkuXG4gICAgICBjb25zdCB0ZXh0ID0gbm9kZS5nZXRGdWxsVGV4dChzb3VyY2UpO1xuICAgICAgaWYgKHRleHQubWF0Y2goJ15cXHI/XFxyP1xcbicpKSB7XG4gICAgICAgIHRvSW5zZXJ0ID0gYCwke1xuICAgICAgICAgIHRleHQubWF0Y2goL15cXHI/XFxuXFxzKy8pWzBdXG4gICAgICAgIH0ke21ldGFkYXRhRmllbGR9OiBbJHtzeW1ib2xOYW1lfV1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9JbnNlcnQgPSBgLCAke21ldGFkYXRhRmllbGR9OiBbJHtzeW1ib2xOYW1lfV1gO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChub2RlLmtpbmQgPT0gdHMuU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uKSB7XG4gICAgLy8gV2UgZm91bmQgdGhlIGZpZWxkIGJ1dCBpdCdzIGVtcHR5LiBJbnNlcnQgaXQganVzdCBiZWZvcmUgdGhlIGBdYC5cbiAgICBwb3NpdGlvbi0tO1xuICAgIHRvSW5zZXJ0ID0gYCR7c3ltYm9sTmFtZX1gO1xuICB9IGVsc2Uge1xuICAgIC8vIEdldCB0aGUgaW5kZW50YXRpb24gb2YgdGhlIGxhc3QgZWxlbWVudCwgaWYgYW55LlxuICAgIGNvbnN0IHRleHQgPSBub2RlLmdldEZ1bGxUZXh0KHNvdXJjZSk7XG4gICAgaWYgKHRleHQubWF0Y2goL15cXHI/XFxuLykpIHtcbiAgICAgIHRvSW5zZXJ0ID0gYCwke3RleHQubWF0Y2goL15cXHI/XFxuKFxccj8pXFxzKy8pWzBdfSR7c3ltYm9sTmFtZX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b0luc2VydCA9IGAsICR7c3ltYm9sTmFtZX1gO1xuICAgIH1cbiAgfVxuICBjb25zdCBpbnNlcnQgPSBuZXcgSW5zZXJ0Q2hhbmdlKG5nTW9kdWxlUGF0aCwgcG9zaXRpb24sIHRvSW5zZXJ0KTtcbiAgY29uc3QgaW1wb3J0SW5zZXJ0OiBDaGFuZ2UgPSBpbnNlcnRJbXBvcnQoXG4gICAgc291cmNlLFxuICAgIG5nTW9kdWxlUGF0aCxcbiAgICBzeW1ib2xOYW1lLnJlcGxhY2UoL1xcLi4qJC8sICcnKSxcbiAgICBpbXBvcnRQYXRoXG4gICk7XG5cbiAgcmV0dXJuIFtpbnNlcnQsIGltcG9ydEluc2VydF07XG59XG5cbi8qKlxuICogQ3VzdG9tIGZ1bmN0aW9uIHRvIGluc2VydCBhIGRlY2xhcmF0aW9uIChjb21wb25lbnQsIHBpcGUsIGRpcmVjdGl2ZSlcbiAqIGludG8gTmdNb2R1bGUgZGVjbGFyYXRpb25zLiBJdCBhbHNvIGltcG9ydHMgdGhlIGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZERlY2xhcmF0aW9uVG9Nb2R1bGUoXG4gIHNvdXJjZTogdHMuU291cmNlRmlsZSxcbiAgbW9kdWxlUGF0aDogc3RyaW5nLFxuICBjbGFzc2lmaWVkTmFtZTogc3RyaW5nLFxuICBpbXBvcnRQYXRoOiBzdHJpbmdcbik6IENoYW5nZVtdIHtcbiAgcmV0dXJuIF9hZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEoXG4gICAgc291cmNlLFxuICAgIG1vZHVsZVBhdGgsXG4gICAgJ2RlY2xhcmF0aW9ucycsXG4gICAgY2xhc3NpZmllZE5hbWUsXG4gICAgaW1wb3J0UGF0aFxuICApO1xufVxuXG4vKipcbiAqIEN1c3RvbSBmdW5jdGlvbiB0byBpbnNlcnQgYSBkZWNsYXJhdGlvbiAoY29tcG9uZW50LCBwaXBlLCBkaXJlY3RpdmUpXG4gKiBpbnRvIE5nTW9kdWxlIGRlY2xhcmF0aW9ucy4gSXQgYWxzbyBpbXBvcnRzIHRoZSBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRJbXBvcnRUb01vZHVsZShcbiAgc291cmNlOiB0cy5Tb3VyY2VGaWxlLFxuICBtb2R1bGVQYXRoOiBzdHJpbmcsXG4gIGNsYXNzaWZpZWROYW1lOiBzdHJpbmcsXG4gIGltcG9ydFBhdGg6IHN0cmluZ1xuKTogQ2hhbmdlW10ge1xuICByZXR1cm4gX2FkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YShcbiAgICBzb3VyY2UsXG4gICAgbW9kdWxlUGF0aCxcbiAgICAnaW1wb3J0cycsXG4gICAgY2xhc3NpZmllZE5hbWUsXG4gICAgaW1wb3J0UGF0aFxuICApO1xufVxuXG4vKipcbiAqIEN1c3RvbSBmdW5jdGlvbiB0byBpbnNlcnQgYSBwcm92aWRlciBpbnRvIE5nTW9kdWxlLiBJdCBhbHNvIGltcG9ydHMgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRQcm92aWRlclRvTW9kdWxlKFxuICBzb3VyY2U6IHRzLlNvdXJjZUZpbGUsXG4gIG1vZHVsZVBhdGg6IHN0cmluZyxcbiAgY2xhc3NpZmllZE5hbWU6IHN0cmluZyxcbiAgaW1wb3J0UGF0aDogc3RyaW5nXG4pOiBDaGFuZ2VbXSB7XG4gIHJldHVybiBfYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhKFxuICAgIHNvdXJjZSxcbiAgICBtb2R1bGVQYXRoLFxuICAgICdwcm92aWRlcnMnLFxuICAgIGNsYXNzaWZpZWROYW1lLFxuICAgIGltcG9ydFBhdGhcbiAgKTtcbn1cblxuLyoqXG4gKiBDdXN0b20gZnVuY3Rpb24gdG8gaW5zZXJ0IGFuIGV4cG9ydCBpbnRvIE5nTW9kdWxlLiBJdCBhbHNvIGltcG9ydHMgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRFeHBvcnRUb01vZHVsZShcbiAgc291cmNlOiB0cy5Tb3VyY2VGaWxlLFxuICBtb2R1bGVQYXRoOiBzdHJpbmcsXG4gIGNsYXNzaWZpZWROYW1lOiBzdHJpbmcsXG4gIGltcG9ydFBhdGg6IHN0cmluZ1xuKTogQ2hhbmdlW10ge1xuICByZXR1cm4gX2FkZFN5bWJvbFRvTmdNb2R1bGVNZXRhZGF0YShcbiAgICBzb3VyY2UsXG4gICAgbW9kdWxlUGF0aCxcbiAgICAnZXhwb3J0cycsXG4gICAgY2xhc3NpZmllZE5hbWUsXG4gICAgaW1wb3J0UGF0aFxuICApO1xufVxuXG4vKipcbiAqIEN1c3RvbSBmdW5jdGlvbiB0byBpbnNlcnQgYW4gZXhwb3J0IGludG8gTmdNb2R1bGUuIEl0IGFsc28gaW1wb3J0cyBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEJvb3RzdHJhcFRvTW9kdWxlKFxuICBzb3VyY2U6IHRzLlNvdXJjZUZpbGUsXG4gIG1vZHVsZVBhdGg6IHN0cmluZyxcbiAgY2xhc3NpZmllZE5hbWU6IHN0cmluZyxcbiAgaW1wb3J0UGF0aDogc3RyaW5nXG4pOiBDaGFuZ2VbXSB7XG4gIHJldHVybiBfYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhKFxuICAgIHNvdXJjZSxcbiAgICBtb2R1bGVQYXRoLFxuICAgICdib290c3RyYXAnLFxuICAgIGNsYXNzaWZpZWROYW1lLFxuICAgIGltcG9ydFBhdGhcbiAgKTtcbn1cblxuLyoqXG4gKiBBZGQgSW1wb3J0IGBpbXBvcnQgeyBzeW1ib2xOYW1lIH0gZnJvbSBmaWxlTmFtZWAgaWYgdGhlIGltcG9ydCBkb2Vzbid0IGV4aXRcbiAqIGFscmVhZHkuIEFzc3VtZXMgZmlsZVRvRWRpdCBjYW4gYmUgcmVzb2x2ZWQgYW5kIGFjY2Vzc2VkLlxuICogQHBhcmFtIGZpbGVUb0VkaXQgKGZpbGUgd2Ugd2FudCB0byBhZGQgaW1wb3J0IHRvKVxuICogQHBhcmFtIHN5bWJvbE5hbWUgKGl0ZW0gdG8gaW1wb3J0KVxuICogQHBhcmFtIGZpbGVOYW1lIChwYXRoIHRvIHRoZSBmaWxlKVxuICogQHBhcmFtIGlzRGVmYXVsdCAoaWYgdHJ1ZSwgaW1wb3J0IGZvbGxvd3Mgc3R5bGUgZm9yIGltcG9ydGluZyBkZWZhdWx0IGV4cG9ydHMpXG4gKiBAcmV0dXJuIENoYW5nZVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRJbXBvcnQoXG4gIHNvdXJjZTogdHMuU291cmNlRmlsZSxcbiAgZmlsZVRvRWRpdDogc3RyaW5nLFxuICBzeW1ib2xOYW1lOiBzdHJpbmcsXG4gIGZpbGVOYW1lOiBzdHJpbmcsXG4gIGlzRGVmYXVsdCA9IGZhbHNlXG4pOiBDaGFuZ2Uge1xuICBjb25zdCByb290Tm9kZSA9IHNvdXJjZTtcbiAgY29uc3QgYWxsSW1wb3J0cyA9IGZpbmROb2Rlcyhyb290Tm9kZSwgdHMuU3ludGF4S2luZC5JbXBvcnREZWNsYXJhdGlvbik7XG5cbiAgLy8gZ2V0IG5vZGVzIHRoYXQgbWFwIHRvIGltcG9ydCBzdGF0ZW1lbnRzIGZyb20gdGhlIGZpbGUgZmlsZU5hbWVcbiAgY29uc3QgcmVsZXZhbnRJbXBvcnRzID0gYWxsSW1wb3J0cy5maWx0ZXIobm9kZSA9PiB7XG4gICAgLy8gU3RyaW5nTGl0ZXJhbCBvZiB0aGUgSW1wb3J0RGVjbGFyYXRpb24gaXMgdGhlIGltcG9ydCBmaWxlIChmaWxlTmFtZSBpbiB0aGlzIGNhc2UpLlxuICAgIGNvbnN0IGltcG9ydEZpbGVzID0gbm9kZVxuICAgICAgLmdldENoaWxkcmVuKClcbiAgICAgIC5maWx0ZXIoY2hpbGQgPT4gY2hpbGQua2luZCA9PT0gdHMuU3ludGF4S2luZC5TdHJpbmdMaXRlcmFsKVxuICAgICAgLm1hcChuID0+IChuIGFzIHRzLlN0cmluZ0xpdGVyYWwpLnRleHQpO1xuXG4gICAgcmV0dXJuIGltcG9ydEZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUgPT09IGZpbGVOYW1lKS5sZW5ndGggPT09IDE7XG4gIH0pO1xuXG4gIGlmIChyZWxldmFudEltcG9ydHMubGVuZ3RoID4gMCkge1xuICAgIGxldCBpbXBvcnRzQXN0ZXJpc2sgPSBmYWxzZTtcbiAgICAvLyBpbXBvcnRzIGZyb20gaW1wb3J0IGZpbGVcbiAgICBjb25zdCBpbXBvcnRzOiB0cy5Ob2RlW10gPSBbXTtcbiAgICByZWxldmFudEltcG9ydHMuZm9yRWFjaChuID0+IHtcbiAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KFxuICAgICAgICBpbXBvcnRzLFxuICAgICAgICBmaW5kTm9kZXMobiwgdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKVxuICAgICAgKTtcbiAgICAgIGlmIChmaW5kTm9kZXMobiwgdHMuU3ludGF4S2luZC5Bc3Rlcmlza1Rva2VuKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGltcG9ydHNBc3RlcmlzayA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBpZiBpbXBvcnRzICogZnJvbSBmaWxlTmFtZSwgZG9uJ3QgYWRkIHN5bWJvbE5hbWVcbiAgICBpZiAoaW1wb3J0c0FzdGVyaXNrKSB7XG4gICAgICByZXR1cm4gbmV3IE5vb3BDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbXBvcnRUZXh0Tm9kZXMgPSBpbXBvcnRzLmZpbHRlcihcbiAgICAgIG4gPT4gKG4gYXMgdHMuSWRlbnRpZmllcikudGV4dCA9PT0gc3ltYm9sTmFtZVxuICAgICk7XG5cbiAgICAvLyBpbnNlcnQgaW1wb3J0IGlmIGl0J3Mgbm90IHRoZXJlXG4gICAgaWYgKGltcG9ydFRleHROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGZhbGxiYWNrUG9zID1cbiAgICAgICAgZmluZE5vZGVzKFxuICAgICAgICAgIHJlbGV2YW50SW1wb3J0c1swXSxcbiAgICAgICAgICB0cy5TeW50YXhLaW5kLkNsb3NlQnJhY2VUb2tlblxuICAgICAgICApWzBdLmdldFN0YXJ0KCkgfHxcbiAgICAgICAgZmluZE5vZGVzKHJlbGV2YW50SW1wb3J0c1swXSwgdHMuU3ludGF4S2luZC5Gcm9tS2V5d29yZClbMF0uZ2V0U3RhcnQoKTtcblxuICAgICAgcmV0dXJuIGluc2VydEFmdGVyTGFzdE9jY3VycmVuY2UoXG4gICAgICAgIGltcG9ydHMsXG4gICAgICAgIGAsICR7c3ltYm9sTmFtZX1gLFxuICAgICAgICBmaWxlVG9FZGl0LFxuICAgICAgICBmYWxsYmFja1Bvc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IE5vb3BDaGFuZ2UoKTtcbiAgfVxuXG4gIC8vIG5vIHN1Y2ggaW1wb3J0IGRlY2xhcmF0aW9uIGV4aXN0c1xuICBjb25zdCB1c2VTdHJpY3QgPSBmaW5kTm9kZXMocm9vdE5vZGUsIHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbCkuZmlsdGVyKFxuICAgIG4gPT4gbi5nZXRUZXh0KCkgPT09ICd1c2Ugc3RyaWN0J1xuICApO1xuICBsZXQgZmFsbGJhY2tQb3MgPSAwO1xuICBpZiAodXNlU3RyaWN0Lmxlbmd0aCA+IDApIHtcbiAgICBmYWxsYmFja1BvcyA9IHVzZVN0cmljdFswXS5lbmQ7XG4gIH1cbiAgY29uc3Qgb3BlbiA9IGlzRGVmYXVsdCA/ICcnIDogJ3sgJztcbiAgY29uc3QgY2xvc2UgPSBpc0RlZmF1bHQgPyAnJyA6ICcgfSc7XG4gIC8vIGlmIHRoZXJlIGFyZSBubyBpbXBvcnRzIG9yICd1c2Ugc3RyaWN0JyBzdGF0ZW1lbnQsIGluc2VydCBpbXBvcnQgYXQgYmVnaW5uaW5nIG9mIGZpbGVcbiAgY29uc3QgaW5zZXJ0QXRCZWdpbm5pbmcgPSBhbGxJbXBvcnRzLmxlbmd0aCA9PT0gMCAmJiB1c2VTdHJpY3QubGVuZ3RoID09PSAwO1xuICBjb25zdCBzZXBhcmF0b3IgPSBpbnNlcnRBdEJlZ2lubmluZyA/ICcnIDogJztcXG4nO1xuICBjb25zdCB0b0luc2VydCA9XG4gICAgYCR7c2VwYXJhdG9yfWltcG9ydCAke29wZW59JHtzeW1ib2xOYW1lfSR7Y2xvc2V9YCArXG4gICAgYCBmcm9tICcke2ZpbGVOYW1lfScke2luc2VydEF0QmVnaW5uaW5nID8gJztcXG4nIDogJyd9YDtcblxuICByZXR1cm4gaW5zZXJ0QWZ0ZXJMYXN0T2NjdXJyZW5jZShcbiAgICBhbGxJbXBvcnRzLFxuICAgIHRvSW5zZXJ0LFxuICAgIGZpbGVUb0VkaXQsXG4gICAgZmFsbGJhY2tQb3MsXG4gICAgdHMuU3ludGF4S2luZC5TdHJpbmdMaXRlcmFsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlSW1wb3J0KFxuICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICBwYXRoOiBQYXRoLFxuICBpbXBvcnRGcm9tOiBzdHJpbmcsXG4gIGltcG9ydEFzSXM6IHN0cmluZyxcbiAgaW1wb3J0VG9CZTogc3RyaW5nXG4pOiAoUmVwbGFjZUNoYW5nZSB8IFJlbW92ZUNoYW5nZSlbXSB7XG4gIGNvbnN0IGltcG9ydHMgPSBzb3VyY2VGaWxlLnN0YXRlbWVudHNcbiAgICAuZmlsdGVyKHRzLmlzSW1wb3J0RGVjbGFyYXRpb24pXG4gICAgLmZpbHRlcihcbiAgICAgICh7IG1vZHVsZVNwZWNpZmllciB9KSA9PlxuICAgICAgICBtb2R1bGVTcGVjaWZpZXIuZ2V0VGV4dChzb3VyY2VGaWxlKSA9PT0gYCcke2ltcG9ydEZyb219J2AgfHxcbiAgICAgICAgbW9kdWxlU3BlY2lmaWVyLmdldFRleHQoc291cmNlRmlsZSkgPT09IGBcIiR7aW1wb3J0RnJvbX1cImBcbiAgICApO1xuXG4gIGlmIChpbXBvcnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IGltcG9ydFRleHQgPSAoc3BlY2lmaWVyOiB0cy5JbXBvcnRTcGVjaWZpZXIpID0+IHtcbiAgICBpZiAoc3BlY2lmaWVyLm5hbWUudGV4dCkge1xuICAgICAgcmV0dXJuIHNwZWNpZmllci5uYW1lLnRleHQ7XG4gICAgfVxuXG4gICAgLy8gaWYgaW1wb3J0IGlzIHJlbmFtZWRcbiAgICBpZiAoc3BlY2lmaWVyLnByb3BlcnR5TmFtZSAmJiBzcGVjaWZpZXIucHJvcGVydHlOYW1lLnRleHQpIHtcbiAgICAgIHJldHVybiBzcGVjaWZpZXIucHJvcGVydHlOYW1lLnRleHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9O1xuXG4gIGNvbnN0IGNoYW5nZXMgPSBpbXBvcnRzLm1hcChwID0+IHtcbiAgICBjb25zdCBpbXBvcnRTcGVjaWZpZXJzID0gKHAuaW1wb3J0Q2xhdXNlIS5uYW1lZEJpbmRpbmdzISBhcyB0cy5OYW1lZEltcG9ydHMpXG4gICAgICAuZWxlbWVudHM7XG5cbiAgICBjb25zdCBpc0FscmVhZHlJbXBvcnRlZCA9IGltcG9ydFNwZWNpZmllcnNcbiAgICAgIC5tYXAoaW1wb3J0VGV4dClcbiAgICAgIC5pbmNsdWRlcyhpbXBvcnRUb0JlKTtcblxuICAgIGNvbnN0IGltcG9ydENoYW5nZXMgPSBpbXBvcnRTcGVjaWZpZXJzLm1hcCgoc3BlY2lmaWVyLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9IGltcG9ydFRleHQoc3BlY2lmaWVyKTtcblxuICAgICAgLy8gaW1wb3J0IGlzIG5vdCB0aGUgb25lIHdlJ3JlIGxvb2tpbmcgZm9yLCBjYW4gYmUgc2tpcHBlZFxuICAgICAgaWYgKHRleHQgIT09IGltcG9ydEFzSXMpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgLy8gaWRlbnRpZmllciBoYXMgbm90IGJlZW4gaW1wb3J0ZWQsIHNpbXBseSByZXBsYWNlIHRoZSBvbGQgdGV4dCB3aXRoIHRoZSBuZXcgdGV4dFxuICAgICAgaWYgKCFpc0FscmVhZHlJbXBvcnRlZCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlUmVwbGFjZUNoYW5nZShcbiAgICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAgIHNwZWNpZmllciEsXG4gICAgICAgICAgaW1wb3J0QXNJcyxcbiAgICAgICAgICBpbXBvcnRUb0JlXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5leHRJZGVudGlmaWVyID0gaW1wb3J0U3BlY2lmaWVyc1tpbmRleCArIDFdO1xuICAgICAgLy8gaWRlbnRpZmVyIGlzIG5vdCB0aGUgbGFzdCwgYWxzbyBjbGVhbiB1cCB0aGUgY29tbWFcbiAgICAgIGlmIChuZXh0SWRlbnRpZmllcikge1xuICAgICAgICByZXR1cm4gY3JlYXRlUmVtb3ZlQ2hhbmdlKFxuICAgICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgICAgc3BlY2lmaWVyLFxuICAgICAgICAgIHNwZWNpZmllci5nZXRTdGFydChzb3VyY2VGaWxlKSxcbiAgICAgICAgICBuZXh0SWRlbnRpZmllci5nZXRTdGFydChzb3VyY2VGaWxlKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyB0aGVyZSBhcmUgbm8gaW1wb3J0cyBmb2xsb3dpbmcsIGp1c3QgcmVtb3ZlIGl0XG4gICAgICByZXR1cm4gY3JlYXRlUmVtb3ZlQ2hhbmdlKFxuICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICBzcGVjaWZpZXIsXG4gICAgICAgIHNwZWNpZmllci5nZXRTdGFydChzb3VyY2VGaWxlKSxcbiAgICAgICAgc3BlY2lmaWVyLmdldEVuZCgpXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGltcG9ydENoYW5nZXMuZmlsdGVyKEJvb2xlYW4pIGFzIChSZXBsYWNlQ2hhbmdlIHwgUmVtb3ZlQ2hhbmdlKVtdO1xuICB9KTtcblxuICByZXR1cm4gY2hhbmdlcy5yZWR1Y2UoKGltcG9ydHMsIGN1cnIpID0+IGltcG9ydHMuY29uY2F0KGN1cnIpLCBbXSk7XG59XG4iXX0=