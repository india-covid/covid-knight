/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VaccineSlotsComponent } from './vaccine-slots.component';

describe('VaccineSlotsComponent', () => {
  let component: VaccineSlotsComponent;
  let fixture: ComponentFixture<VaccineSlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaccineSlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccineSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
