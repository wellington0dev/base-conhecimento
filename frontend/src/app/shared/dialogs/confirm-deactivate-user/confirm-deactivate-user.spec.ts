import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDeactivateUser } from './confirm-deactivate-user';

describe('ConfirmDeactivateUser', () => {
  let component: ConfirmDeactivateUser;
  let fixture: ComponentFixture<ConfirmDeactivateUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeactivateUser],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            user: {
              id: '1',
              username: 'user',
              name: 'User',
              role: 'intern',
              active: true,
              createdAt: '',
              updatedAt: '',
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDeactivateUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
