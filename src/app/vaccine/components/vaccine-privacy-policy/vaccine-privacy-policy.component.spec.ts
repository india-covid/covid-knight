import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinePrivacyPolicyComponent } from './vaccine-privacy-policy.component';

describe('VaccinePrivacyPolicyComponent', () => {
  let component: VaccinePrivacyPolicyComponent;
  let fixture: ComponentFixture<VaccinePrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaccinePrivacyPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccinePrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
