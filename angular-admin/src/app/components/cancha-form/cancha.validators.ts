import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

import {
  esNombreCancha
} from '../../../core/validadores';

/**
 * Validador personalizado del nombre de cancha.
 */
export function nombreCanchaValidator(): ValidatorFn {

  return (
    control: AbstractControl
  ): ValidationErrors | null => {

    const valor = String(control.value ?? '');

    if (!valor.trim()) return null;

    return esNombreCancha(valor)
      ? null
      : { nombreInvalido: true };
  };
}

/**
 * Validador personalizado para implementos.
 */
const REGEX_IMPLEMENTOS =
  /^[\p{L}\p{N}][\p{L}\p{N}\s.+\-]*(,\s*[\p{L}\p{N}][\p{L}\p{N}\s.+\-]*)*$/u;

export function implementosValidator(): ValidatorFn {

  return (
    control: AbstractControl
  ): ValidationErrors | null => {

    const valor = String(control.value ?? '').trim();

    if (!valor) return null;

    return REGEX_IMPLEMENTOS.test(valor)
      ? null
      : { implementosInvalidos: true };
  };
}