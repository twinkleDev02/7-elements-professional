import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

/** Set by the parent to drive the form's feedback state. */
export type NewsletterStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Newsletter blocks commonly appear twice on one page — in the footer and in a
 * section — so element ids have to be unique per instance or the labels and
 * `aria-describedby` references cross-wire.
 */
let instanceCount = 0;

/**
 * Email capture block.
 *
 * Owns the form and its validation, but not the submission: it emits the email
 * and the parent feature decides where it goes. `status` comes back in as an
 * input, which keeps this component free of any service dependency.
 */
@Component({
  selector: 'app-newsletter',
  imports: [ReactiveFormsModule],
  templateUrl: './newsletter.html',
  styleUrl: './newsletter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Newsletter {
  readonly heading = input('Join the ritual');
  readonly description = input<string>();
  readonly ctaLabel = input('Subscribe');
  readonly placeholder = input('Email address');

  /** Consent copy shown beneath the field. */
  readonly consentText = input<string>();

  readonly status = input<NewsletterStatus>('idle');
  readonly errorMessage = input('We could not sign you up. Please try again.');
  readonly successMessage = input('Thank you — please check your inbox to confirm.');

  readonly subscribed = output<string>();

  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    // Spam trap. A real visitor never sees this field, so anything that fills
    // it in is a bot. Kept in the DOM — bots skip fields that are not rendered.
    company: new FormControl('', { nonNullable: true }),
  });

  /** Prefix for every id in the template. */
  protected readonly uid = `newsletter-${++instanceCount}`;

  protected readonly isSubmitting = computed(() => this.status() === 'submitting');
  protected readonly isSuccess = computed(() => this.status() === 'success');

  protected onSubmit(): void {
    if (this.isSubmitting()) {
      return;
    }

    const { email, company } = this.form.getRawValue();

    // Report success to the bot without ever emitting, so it gets no signal
    // that it was caught.
    if (company.trim()) {
      this.form.reset();
      return;
    }

    if (this.form.controls.email.invalid) {
      this.form.controls.email.markAsTouched();
      return;
    }

    this.subscribed.emit(email.trim());
  }
}
