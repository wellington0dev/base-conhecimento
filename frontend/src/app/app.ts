import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Toolbar } from './shared/toolbar/toolbar';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, Toolbar,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');

  path: string = '';

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.path = event.url;
      }
    });
  }
}
