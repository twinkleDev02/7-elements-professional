import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import {
  BUSINESS_TYPE_OPTIONS,
  CITY_OPTIONS,
  GENDER_OPTIONS,
  STATE_OPTIONS,
  YEARS_IN_BUSINESS_OPTIONS,
} from '../../distributors.data';
import { DistributorApplication } from '../../distributors.model';

/** Indian mobile numbers: ten digits starting 6–9, spaces tolerated. */
const MOBILE_PATTERN = /^[6-9]\d{9}$/;
const PINCODE_PATTERN = /^\d{6}$/;
/** 15 characters: 2 state digits, 10-char PAN, entity digit, 'Z', checksum. */
const GST_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/i;

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

@Component({
  selector: 'app-distributor-form',
  imports: [ReactiveFormsModule],
  templateUrl: './distributor-form.component.html',
  styleUrl: './distributor-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributorFormComponent {
  readonly submitted = output<DistributorApplication>();
  /** Emits the step the visitor is on, so the progress indicator can follow. */
  readonly stepChange = output<number>();

  protected readonly states = STATE_OPTIONS;
  protected readonly genders = GENDER_OPTIONS;
  protected readonly businessTypes = BUSINESS_TYPE_OPTIONS;
  protected readonly yearsOptions = YEARS_IN_BUSINESS_OPTIONS;

  protected readonly files = signal<readonly File[]>([]);
  protected readonly fileError = signal('');
  protected readonly isDragging = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly isSuccess = signal(false);

  protected readonly form = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    businessName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    mobile: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(MOBILE_PATTERN)],
    }),
    alternateNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(MOBILE_PATTERN)],
    }),
    state: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    pincode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(PINCODE_PATTERN)],
    }),
    dateOfBirth: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    gender: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    businessType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    address: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    gstNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(GST_PATTERN)],
    }),
    yearsInBusiness: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    reason: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)],
    }),
    acceptedTerms: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

  /** City list narrows to the chosen state. */
  protected readonly cities = computed(() => CITY_OPTIONS[this.stateValue()] ?? []);
  private readonly stateValue = signal('');

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.distributor-form__fieldset'), { y: 26, stagger: 0.1, duration: 0.8 });
    });
  }

  /** True while the visitor has typed something they have not submitted. */
  hasUnsavedInput(): boolean {
    return (this.form.dirty || this.files().length > 0) && !this.isSuccess();
  }

  /**
   * Reports which step the visitor has reached, so the progress indicator
   * follows without duplicating the form's rules. Emits only on change, since
   * it is called on every keystroke.
   */
  protected syncStep(): void {
    const step = this.deriveStep();

    if (step !== this.lastStep) {
      this.lastStep = step;
      this.stepChange.emit(step);
    }
  }

  private lastStep = -1;

  private deriveStep(): number {
    const controls = this.form.controls;

    const personalDone = (
      ['fullName', 'email', 'mobile', 'dateOfBirth', 'gender', 'state', 'city', 'pincode'] as const
    ).every((key) => controls[key].valid);

    if (!personalDone) {
      return 0;
    }

    const businessDone = (
      ['businessName', 'businessType', 'address', 'yearsInBusiness', 'reason'] as const
    ).every((key) => controls[key].valid);

    if (!businessDone) {
      return 1;
    }

    return this.files().length ? 3 : 2;
  }

  protected onStateChange(value: string): void {
    this.stateValue.set(value);
    // The previous city almost certainly does not belong to the new state.
    this.form.controls.city.setValue('');
  }

  protected invalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  // ---------------------------------------------------------------------------
  // Documents
  // ---------------------------------------------------------------------------

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  protected onDragLeave(): void {
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    this.addFiles(event.dataTransfer?.files ?? null);
  }

  protected onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addFiles(input.files);
    // Clearing lets the same file be re-picked after being removed.
    input.value = '';
  }

  protected removeFile(name: string): void {
    this.files.update((current) => current.filter((file) => file.name !== name));
  }

  /**
   * Validates type, size and count before accepting. Client-side checks are a
   * courtesy, not a control — the server must repeat all three.
   */
  private addFiles(list: FileList | null): void {
    if (!list?.length) {
      return;
    }

    const incoming = Array.from(list);
    const rejected: string[] = [];

    const accepted = incoming.filter((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        rejected.push(`${file.name} (unsupported format)`);
        return false;
      }

      if (file.size > MAX_FILE_BYTES) {
        rejected.push(`${file.name} (over 5 MB)`);
        return false;
      }

      return true;
    });

    this.files.update((current) => {
      const merged = [...current];

      for (const file of accepted) {
        if (merged.length >= MAX_FILES) {
          rejected.push(`${file.name} (limit ${MAX_FILES} files)`);
          break;
        }

        if (!merged.some((existing) => existing.name === file.name)) {
          merged.push(file);
        }
      }

      return merged;
    });

    this.fileError.set(rejected.length ? `Not added: ${rejected.join(', ')}` : '');
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  protected onSubmit(): void {
    if (this.isSubmitting()) {
      return;
    }

    if (this.form.invalid) {
      // Surfaces every outstanding error at once rather than one per blur.
      this.form.markAllAsTouched();
      this.focusFirstError();
      return;
    }

    const values = this.form.getRawValue();

    const application: DistributorApplication = {
      fullName: values.fullName.trim(),
      businessName: values.businessName.trim(),
      email: values.email.trim(),
      mobile: values.mobile.trim(),
      alternateNumber: values.alternateNumber.trim() || undefined,
      state: values.state,
      city: values.city,
      pincode: values.pincode.trim(),
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      businessType: values.businessType,
      address: values.address.trim(),
      gstNumber: values.gstNumber.trim() || undefined,
      yearsInBusiness: values.yearsInBusiness,
      reason: values.reason.trim(),
      documents: this.files().map((file) => file.name),
      acceptedTerms: values.acceptedTerms,
    };

    this.isSubmitting.set(true);
    this.stepChange.emit(3);
    this.submitted.emit(application);

    // TODO: replace with the real submission call. Until a backend exists the
    // form reports success locally rather than pretending to post anywhere.
    this.isSubmitting.set(false);
    this.isSuccess.set(true);
    this.form.reset();
    this.files.set([]);
  }

  /** Moves focus to the first failing control, so the error is discoverable. */
  private focusFirstError(): void {
    const firstInvalid = document.querySelector<HTMLElement>(
      '.distributor-form .ng-invalid[formControlName]',
    );

    firstInvalid?.focus();
  }
}
