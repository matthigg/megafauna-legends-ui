import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverworldMapComponent } from './overworld-map.component';

describe('OverworldMapComponent', () => {
  let component: OverworldMapComponent;
  let fixture: ComponentFixture<OverworldMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverworldMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverworldMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
