import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverworldComponent } from './overworld.component';

describe('OverworldComponent', () => {
  let component: OverworldComponent;
  let fixture: ComponentFixture<OverworldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverworldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverworldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
