/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SubscribedCentersComponent } from './subscribed-centers.component';

describe('SubscribedCentersComponent', () => {
  let component: SubscribedCentersComponent;
  let fixture: ComponentFixture<SubscribedCentersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribedCentersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribedCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
