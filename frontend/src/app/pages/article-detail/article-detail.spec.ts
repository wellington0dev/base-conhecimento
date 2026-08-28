import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ArticleDetail } from './article-detail';

describe('ArticleDetail', () => {
  let component: ArticleDetail;
  let fixture: ComponentFixture<ArticleDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { getAccessToken: () => 'test-token' } },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: 'new' })) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
