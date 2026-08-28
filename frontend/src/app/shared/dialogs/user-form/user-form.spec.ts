import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserFormDialog } from './user-form';

describe('UserFormDialog', () => {
  let component: UserFormDialog;
  let fixture: ComponentFixture<UserFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormDialog],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
