import { TestBed } from '@angular/core/testing';

import { HttpRequestMessageService } from './http-request-message.service';

describe('HttpErrorsService', () => {
  let service: HttpRequestMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpRequestMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
