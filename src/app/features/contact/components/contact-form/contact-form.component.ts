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

  protected readonly isSubmitting = computed(() => this.status() === 'submitting');
  protected readonly isSuccess = computed(() => this.status() === 'success');

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { nonNullable: true }),
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
  }

  /**
   * True while the visitor has typed something they have not sent. Read by the
   * page to answer the unsaved-changes guard — a sent form is not "unsaved".
   */
  hasUnsavedInput(): boolean {
    return this.form.dirty && !this.isSuccess();
  }

  protected controlInvalid(name: 'name' | 'email' | 'message'): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
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
          this.status.set('error');
        },
      });
  }
}
