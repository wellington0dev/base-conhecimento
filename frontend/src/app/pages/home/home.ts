import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Toolbar } from '../../shared/toolbar/toolbar';

@Component({
  imports: [
    MatButton, Toolbar
  ],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
