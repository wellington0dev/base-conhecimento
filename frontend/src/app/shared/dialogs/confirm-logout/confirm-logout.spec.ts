import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmLogout } from './confirm-logout';

describe('ConfirmLogout', () => {
  let component: ConfirmLogout;
  let fixture: ComponentFixture<ConfirmLogout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmLogout],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmLogout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
