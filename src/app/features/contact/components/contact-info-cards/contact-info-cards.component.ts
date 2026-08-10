import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { CONTACT_CHANNELS, ContactChannel } from '../../contact.data';

@Component({
  selector: 'app-contact-info-cards',
  imports: [],
  templateUrl: './contact-info-cards.component.html',
  styleUrl: './contact-info-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactInfoCardsComponent {
  readonly channels = input<readonly ContactChannel[]>(CONTACT_CHANNELS);

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.contact-info-cards__card'), {
        y: 28,
        scale: 0.95,
        stagger: 0.08,
        duration: 0.8,
      });

      revealUp(q('.contact-info-cards__icon'), {
        scale: 0.7,
        rotate: -12,
        y: 0,
        stagger: 0.08,
        duration: 0.7,
      });
    });
  }
}
