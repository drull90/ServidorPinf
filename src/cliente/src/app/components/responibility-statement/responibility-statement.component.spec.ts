import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponibilityStatementComponent } from './responibility-statement.component';

describe('ResponibilityStatementComponent', () => {
  let component: ResponibilityStatementComponent;
  let fixture: ComponentFixture<ResponibilityStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponibilityStatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponibilityStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
