import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { useScrollReveal } from '@shared/animations/scroll-reveal';
import { ApiError } from '@shared/models/api-response.model';
import { ContactRequest, ContactTopic } from '@shared/models/contact-request.model';

import { ContactService } from '../../contact.service';
import { CONTACT_FORM, CONTACT_TOPICS } from '../../contact.data';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

/** The controls that render an inline error under themselves. */
type ErrorField = 'name' | 'email' | 'message';

/**
 * Shown when the browser rejects a field before the request is made. The server
 * may disagree in wording for the same field, and when it does its text wins —
 * it knows the actual rule that failed.
 */
const FALLBACK_ERRORS: Readonly<Record<ErrorField, string>> = {
  name: 'Please tell us your name.',
  email: 'Please enter a valid email address.',
  message: 'Please tell us a little more — at least ten characters.',
};

/**
 * Enquiry form.
 *
 * Submits through the existing `ContactService`, and exposes
 * `hasUnsavedInput()` so the page can answer `pendingChangesGuard` — the guard
 * is already wired on this route, and without this it could never fire.
 */
@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
  private readonly contactService = inject(ContactService);
  // Captured here because `takeUntilDestroyed()` needs an injection context,
  // and `onSubmit()` runs outside one.
  private readonly destroyRef = inject(DestroyRef);

  protected readonly content = CONTACT_FORM;
  protected readonly topics = CONTACT_TOPICS;

  protected readonly status = signal<SubmitStatus>('idle');
  protected readonly errorMessage = signal('');
  protected readonly reference = signal('');

  /**
   * Per-field messages returned by a 400, keyed by control name.
   *
   * The API sends camelCase keys that match these controls exactly, so they map
   * across without translation. Held beside the form rather than pushed into
   * `setErrors()` so that a server complaint never makes the control itself
   * invalid — otherwise a field the browser considers fine could not be
   * resubmitted without being edited first.
   */
  protected readonly serverFieldErrors = signal<Readonly<Record<string, string>>>({});

  protected readonly isSubmitting = computed(() => this.status() === 'submitting');
  protected readonly isSuccess = computed(() => this.status() === 'success');

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(150)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(32)] }),
    topic: new FormControl<ContactTopic>('salon-partnership', { nonNullable: true }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    consentToMarketing: new FormControl(false, { nonNullable: true }),
    // Spam trap. Never shown to a person, so anything that fills it is a bot.
    company: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.contact-form__reveal'), { x: -32, y: 0, stagger: 0.09, duration: 0.85 });
    });

    // A server complaint describes what was sent, so the moment any of it is
    // edited the complaint is stale and should stop being shown.
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (Object.keys(this.serverFieldErrors()).length > 0) {
        this.serverFieldErrors.set({});
      }
    });
  }

  /**
   * True while the visitor has typed something they have not sent. Read by the
   * page to answer the unsaved-changes guard — a sent form is not "unsaved".
   */
  hasUnsavedInput(): boolean {
    return this.form.dirty && !this.isSuccess();
  }

  protected controlInvalid(name: ErrorField): boolean {
    const control = this.form.controls[name];
    return (control.invalid && control.touched) || name in this.serverFieldErrors();
  }

  /** The server's wording for a field when it sent one, else the local copy. */
  protected errorFor(name: ErrorField): string {
    return this.serverFieldErrors()[name] ?? FALLBACK_ERRORS[name];
  }

  protected onSubmit(): void {
    if (this.isSubmitting()) {
      return;
    }

    const { company, ...values } = this.form.getRawValue();

    // Give the bot a clean exit without sending anything, so it learns nothing.
    if (company.trim()) {
      this.form.reset();
      return;
    }

    if (this.form.invalid) {
      // Surfaces every outstanding error at once, rather than one per blur.
      this.form.markAllAsTouched();
      return;
    }

    const request: ContactRequest = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || undefined,
      topic: values.topic,
      message: values.message.trim(),
      consentToMarketing: values.consentToMarketing,
    };

    this.status.set('submitting');
    this.errorMessage.set('');
    this.serverFieldErrors.set({});

    this.contactService
      .submit(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.reference.set(response.reference);
          this.status.set('success');
          // Clears `dirty`, which also releases the unsaved-changes guard.
          this.form.reset();
        },
        error: (error: ApiError) => {
          this.errorMessage.set(error.message);
          // Only a 400 carries these; every other status leaves them empty and
          // the banner alone explains the failure.
          this.serverFieldErrors.set(error.fieldErrors ?? {});
          this.status.set('error');
        },
      });
  }
}
