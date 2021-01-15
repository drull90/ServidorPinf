import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApuestaComponent } from './apuesta.component';

describe('ApuestaComponent', () => {
  let component: ApuestaComponent;
  let fixture: ComponentFixture<ApuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApuestaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
