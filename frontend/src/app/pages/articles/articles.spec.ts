import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Articles } from './articles';

describe('Articles', () => {
  let component: Articles;
  let fixture: ComponentFixture<Articles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Articles],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: { getAccessToken: () => 'test-token' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Articles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
