import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccineFaqComponent } from './vaccine-faq.component';

describe('VaccineFaqComponent', () => {
  let component: VaccineFaqComponent;
  let fixture: ComponentFixture<VaccineFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaccineFaqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccineFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
