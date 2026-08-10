/** Reason a visitor is getting in touch; drives routing on the backend. */
export type ContactTopic = 'general' | 'salon-partnership' | 'wholesale' | 'press' | 'support';

/** Payload posted by the contact feature. */
export interface ContactRequest {
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly topic: ContactTopic;
  readonly message: string;
  readonly consentToMarketing: boolean;
}

export interface ContactResponse {
  readonly reference: string;
  readonly receivedAt: string;
}
