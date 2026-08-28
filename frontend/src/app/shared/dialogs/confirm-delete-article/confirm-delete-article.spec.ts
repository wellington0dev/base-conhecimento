import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDeleteArticle } from './confirm-delete-article';

describe('ConfirmDeleteArticle', () => {
  let component: ConfirmDeleteArticle;
  let fixture: ComponentFixture<ConfirmDeleteArticle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteArticle],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            article: {
              id: '1',
              title: 'Artigo',
              category: 'rede',
              excerpt: '',
              body: 'corpo',
              author: {
                id: '1',
                username: 'user',
                name: 'User',
                role: 'intern',
                active: true,
                createdAt: '',
                updatedAt: '',
              },
              lastEditor: {
                id: '1',
                username: 'user',
                name: 'User',
                role: 'intern',
                active: true,
                createdAt: '',
                updatedAt: '',
              },
              createdAt: '',
              updatedAt: '',
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteArticle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
