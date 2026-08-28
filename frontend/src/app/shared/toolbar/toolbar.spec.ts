import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Toolbar } from './toolbar';

describe('Toolbar', () => {
  let component: Toolbar;
  let fixture: ComponentFixture<Toolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toolbar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Toolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
