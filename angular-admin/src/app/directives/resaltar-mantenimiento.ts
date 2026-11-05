import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[resaltarMantenimiento]',
  standalone: true
})
export class ResaltarMantenimientoDirective implements OnInit {
  private el = inject(ElementRef);
  
  @Input() resaltarMantenimiento: string = '';

  ngOnInit(): void {
    if (this.resaltarMantenimiento?.toLowerCase() === 'mantenimiento') {
      this.el.nativeElement.style.backgroundColor = '#fff3cd'; // Amarillo suave de alerta
      this.el.nativeElement.style.color = '#856404';
      this.el.nativeElement.style.fontWeight = 'bold';
    }
  }
}