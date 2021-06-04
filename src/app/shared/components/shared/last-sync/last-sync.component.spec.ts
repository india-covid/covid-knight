/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LastSyncComponent } from './last-sync.component';

describe('LastSyncComponent', () => {
  let component: LastSyncComponent;
  let fixture: ComponentFixture<LastSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
