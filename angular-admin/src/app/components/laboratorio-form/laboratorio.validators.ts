import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
// Reutilizamos la regla del nucleo JS (core-js): la misma validacion en Angular y Express
import { esNombreLaboratorio } from '../../../core/validadores';

// Validador personalizado 1: el nombre se valida con la expresion regular de core-js
export function nombreLaboratorioValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = (control.value ?? '') as string;
    if (!valor) return null; // lo vacio lo controla Validators.required
    return esNombreLaboratorio(valor) ? null : { nombreInvalido: true };
  };
}

// Validador personalizado 2 (expresion regular propia): lista de equipos separada por comas.
// Valido: "PC i7, Proyector"   Invalido: "PC i7,, Proyector" o "PC i7,"
const REGEX_EQUIPOS =
  /^[\p{L}\p{N}][\p{L}\p{N}\s.+\-]*(,\s*[\p{L}\p{N}][\p{L}\p{N}\s.+\-]*)*$/u;

export function equiposValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = ((control.value ?? '') as string).trim();
    if (!valor) return null; // equipos es opcional
    return REGEX_EQUIPOS.test(valor) ? null : { equiposInvalidos: true };
  };
}
