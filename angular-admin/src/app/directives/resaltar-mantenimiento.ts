
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  inject
} from '@angular/core';

@Directive({
  selector: '[appResaltarMantenimiento]',
  standalone: true
})
export class ResaltarMantenimientoDirective implements OnChanges {

  private readonly elemento =
    inject(ElementRef<HTMLElement>);

  private readonly renderer = inject(Renderer2);

  @Input() appResaltarMantenimiento: string | null = null;

  ngOnChanges(_changes: SimpleChanges): void {

    const fila = this.elemento.nativeElement;

    if (
      this.appResaltarMantenimiento?.toLowerCase() ===
      'mantenimiento'
    ) {

      this.renderer.addClass(
        fila,
        'table-warning'
      );

      this.renderer.setAttribute(
        fila,
        'title',
        'El laboratorio asociado está en mantenimiento'
      );

    } else {

      this.renderer.removeClass(
        fila,
        'table-warning'
      );

      this.renderer.removeAttribute(
        fila,
        'title'
      );
    }
  }
}
