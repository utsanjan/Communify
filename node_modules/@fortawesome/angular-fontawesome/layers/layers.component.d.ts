import { ElementRef, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
/**
 * Fontawesome layers.
 */
export declare class FaLayersComponent implements OnInit, OnChanges {
    private renderer;
    private elementRef;
    size?: SizeProp;
    fixedWidth?: boolean;
    constructor(renderer: Renderer2, elementRef: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
}
