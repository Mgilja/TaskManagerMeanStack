import { TestBed } from '@angular/core/testing';

import { WebRequestInerceptorService } from './web-request-inerceptor.service';

describe('WebRequestInerceptorService', () => {
  let service: WebRequestInerceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebRequestInerceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
