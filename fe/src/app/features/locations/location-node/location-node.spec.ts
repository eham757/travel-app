import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationNode } from './location-node';

describe('LocationNode', () => {
  let component: LocationNode;
  let fixture: ComponentFixture<LocationNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationNode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationNode);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
