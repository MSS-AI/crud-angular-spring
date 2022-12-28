import { inject, TestBed } from '@angular/core/testing';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

import { FormUtilsService } from './form-utils.service';

describe('Service: FormUtils', () => {
  let formControl: UntypedFormControl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormUtilsService]
    });
  });

  it('should create an instance', inject(
    [FormUtilsService],
    (formUtils: FormUtilsService) => {
      expect(formUtils).toBeTruthy();
    }
  ));

  it('should validate all form fields', inject(
    [FormUtilsService],
    (formUtils: FormUtilsService) => {
      const fb = new UntypedFormBuilder();
      const formArray = fb.array([fb.group({ name: new UntypedFormControl('') })]);
      const formControl = fb.group({ desc: new UntypedFormControl(''), list: formArray });

      formUtils.validateAllFormFields(formControl);

      expect(formControl.get('desc')?.touched).toBeTruthy();

      const fa = formControl.get('list') as UntypedFormArray;
      expect(fa.touched).toBeTruthy();
      expect(fa.controls[0].get('name')?.touched).toBeTruthy();
    }
  ));

  it('should validate getErrorMessageFromField with custom error message', inject(
    [FormUtilsService],
    (formUtils: FormUtilsService) => {
      formControl = new UntypedFormControl('');

      formControl.setErrors({ required: true });
      expect(formUtils.getErrorMessageFromField(formControl)).toBe('Mandatory Field.');

      formControl.setErrors({ maxlength: { requiredLength: 10 } });
      expect(formUtils.getErrorMessageFromField(formControl)).toBe(
        'Length exceeded of maximum 10 characters.'
      );

      formControl.setErrors({ minlength: { requiredLength: 10 } });
      expect(formUtils.getErrorMessageFromField(formControl)).toBe(
        'Minimum length must be of 10 characters.'
      );

      formControl.setErrors({ email: true });
      expect(formUtils.getErrorMessageFromField(formControl)).toBe('Error');
    }
  ));

  it('should validate getFieldErrorMessage with custom error message', inject(
    [FormUtilsService],
    (formUtils: FormUtilsService) => {
      const fb = new UntypedFormBuilder();
      const formGroup = fb.group({ name: new UntypedFormControl('') });
      const fieldName = 'name';
      const formControl = formGroup.get(fieldName);

      formControl?.setErrors({ required: true });
      expect(formUtils.getFieldErrorMessage(formGroup, fieldName)).toBe(
        'Mandatory Field.'
      );

      formControl?.setErrors({ maxlength: { requiredLength: 10 } });
      expect(formUtils.getFieldErrorMessage(formGroup, fieldName)).toBe(
        'Length exceeded of maximum 10 characters.'
      );

      formControl?.setErrors({ minlength: { requiredLength: 10 } });
      expect(formUtils.getFieldErrorMessage(formGroup, fieldName)).toBe(
        'Minimum length must be of 10 characters.'
      );

      formControl?.setErrors({ email: true });
      expect(formUtils.getFieldErrorMessage(formGroup, fieldName)).toBe('Error');
    }
  ));

  it('should validate getFieldFormArrayErrorMessage with custom error message', inject(
    [FormUtilsService],
    (formUtils: FormUtilsService) => {
      const fb = new UntypedFormBuilder();
      const formGroup = fb.group({ name: new UntypedFormControl('') });
      const formArray = fb.array([formGroup]);
      const form = fb.group({ list: formArray });
      const fieldName = 'name';
      const arrayName = 'list';
      const formControl = formArray.controls[0].get(fieldName);

      formControl?.setErrors({ required: true });
      expect(formUtils.getFieldFormArrayErrorMessage(form, arrayName, fieldName, 0)).toBe(
        'Mandatory Field.'
      );

      formControl?.setErrors({ maxlength: { requiredLength: 10 } });
      expect(formUtils.getFieldFormArrayErrorMessage(form, arrayName, fieldName, 0)).toBe(
        'Length exceeded of maximum 10 characters.'
      );

      formControl?.setErrors({ minlength: { requiredLength: 10 } });
      expect(formUtils.getFieldFormArrayErrorMessage(form, arrayName, fieldName, 0)).toBe(
        'Minimum length must be of 10 characters.'
      );

      formControl?.setErrors({ email: true });
      expect(formUtils.getFieldFormArrayErrorMessage(form, arrayName, fieldName, 0)).toBe(
        'Error'
      );
    }
  ));

  it('should validate if formArray is required', inject(
    [FormUtilsService],
    (formUtils: FormUtilsService) => {
      const fb = new UntypedFormBuilder();
      const formGroup = fb.group({ name: new UntypedFormControl('') });
      const formArray = fb.array([formGroup]);
      const form = fb.group({ list: formArray });
      const arrayName = 'list';

      expect(formUtils.isFormArrayRequired(form, arrayName)).toBe(false);

      formArray.setErrors({ required: true });
      expect(formUtils.isFormArrayRequired(form, arrayName)).toBe(false);

      formArray.markAsTouched();
      expect(formUtils.isFormArrayRequired(form, arrayName)).toBe(true);
    }
  ));
});