import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

export type NewsletterBandStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface SocialLink {
  readonly id: string;
  readonly label: string;
  readonly url: string;
  readonly iconPaths: readonly string[];
}

const SOCIALS: readonly SocialLink[] = [
  {
    id: 'facebook',
    label: 'Facebook',
    url: 'https://www.facebook.com/',
    iconPaths: ['M14.5 8.5h2V5.6h-2.3c-2 0-3.2 1.3-3.2 3.3v1.7H9v2.9h2v6.9h3v-6.9h2.2l.4-2.9H14v-1.3c0-.6.2-.8.5-.8z'],
  },
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/',
    iconPaths: [
      'M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z',
      'M12 8.6a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8z',
      'M16.9 7.3h.01',
    ],
  },
  {
    id: 'youtube',
    label: 'YouTube',
    url: 'https://www.youtube.com/',
    iconPaths: [
      'M3.5 8.4a2.6 2.6 0 0 1 2.2-2.2c2-.3 4.2-.4 6.3-.4s4.3.1 6.3.4a2.6 2.6 0 0 1 2.2 2.2c.2 1.2.2 2.4.2 3.6s0 2.4-.2 3.6a2.6 2.6 0 0 1-2.2 2.2c-2 .3-4.2.4-6.3.4s-4.3-.1-6.3-.4a2.6 2.6 0 0 1-2.2-2.2A22 22 0 0 1 3.3 12c0-1.2 0-2.4.2-3.6z',
      'M10.4 9.6l4.2 2.4-4.2 2.4z',
    ],
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    url: 'https://www.pinterest.com/',
    iconPaths: [
      'M12 3.6a8.4 8.4 0 0 1 3.1 16.2',
      'M12 3.6a8.4 8.4 0 0 0-3.4 16.1',
      'M9.8 20.2c.7-1.2 1.5-4.2 1.8-5.6.2-1-.4-1.9-.4-2.9 0-1.6 1-2.7 2.2-2.7 1 0 1.6.8 1.6 1.8 0 1.1-.7 2.7-1.1 4.2-.3 1.2.6 2.2 1.8 2.2',
    ],
  },
];

/**
 * Email capture band above the footer.
 *
 * Owns the form and its validation but not the submission — it emits the
 * address and the page decides where it goes, so this stays free of any
 * service dependency and can be reused behind a different backend.
 */
@Component({
  selector: 'app-newsletter-band',
  imports: [ReactiveFormsModule],
  templateUrl: './newsletter-band.component.html',
  styleUrl: './newsletter-band.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterBandComponent {
  readonly heading = input('Stay Beautiful, Stay Updated');
  readonly description = input('Subscribe to our newsletter for latest offers and exclusive updates.');
  readonly placeholder = input('Enter your email');
  readonly ctaLabel = input('Subscribe');
  readonly followLabel = input('Follow Us');
  readonly socials = input<readonly SocialLink[]>(SOCIALS);

  readonly status = input<NewsletterBandStatus>('idle');
  readonly errorMessage = input('We could not sign you up. Please try again.');
  readonly successMessage = input('Thank you — please check your inbox to confirm.');

  readonly subscribed = output<string>();

  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    // Spam trap. Never shown to a person, so anything that fills it is a bot.
    company: new FormControl('', { nonNullable: true }),
  });

  protected readonly isSubmitting = computed(() => this.status() === 'submitting');
  protected readonly isSuccess = computed(() => this.status() === 'success');

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.newsletter-band__reveal'), { y: 24, stagger: 0.09 });
    });
  }

  protected onSubmit(): void {
    if (this.isSubmitting()) {
      return;
    }

    const { email, company } = this.form.getRawValue();

    // Give the bot a clean exit without emitting, so it learns nothing.
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
