import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@core/services/api.service';
import { ContactRequest, ContactResponse } from '@shared/models/contact-request.model';

/** Data access for the contact feature. */
@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly api = inject(ApiService);

  submit(request: ContactRequest): Observable<ContactResponse> {
    return this.api.post<ContactResponse, ContactRequest>('contact', request);
  }
}
