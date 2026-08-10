import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { MISSION_IMAGE, MISSION_VISION, MissionPillar } from '../../about.data';

@Component({
  selector: 'app-mission-vision',
  imports: [],
  templateUrl: './mission-vision.component.html',
  styleUrl: './mission-vision.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionVisionComponent {
  readonly pillars = input<readonly MissionPillar[]>(MISSION_VISION);

  protected readonly image = MISSION_IMAGE;

  constructor() {
    useScrollReveal(({ q, revealUp, parallax }) => {
      // Alternating slide-in: mission from the leading edge, vision from the
      // trailing one, so the pair converges on the still between them.
      revealUp(q('.mission-vision__pillar--mission'), { x: -40, y: 0, duration: 0.95 });
      revealUp(q('.mission-vision__pillar--vision'), { x: 40, y: 0, duration: 0.95 });
      revealUp(q('.mission-vision__media'), { y: 28, scale: 0.94 });

      parallax(q('.mission-vision__image'), 4);
    });
  }
}
