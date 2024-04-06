import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appResultStyle]'
})
export class ResultStyleDirective implements OnInit {
  @Input('appResultStyle') result: string = '';

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    // Split the result to extract the status
    const parts = this.result.split(' ');
    const status = parts[0]; // First part is the status (passed or failed)

    // Check the status and apply corresponding styles
    if (status === 'Passed') {
      this.renderer.setStyle(this.elementRef.nativeElement, 'color', 'green');
    } else if (status === 'Failed') {
      this.renderer.setStyle(this.elementRef.nativeElement, 'color', 'red');
    }
  }
}
