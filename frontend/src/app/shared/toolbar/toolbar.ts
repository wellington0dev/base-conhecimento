import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmLogout } from '../dialogs/confirm-logout/confirm-logout';

@Component({
  imports: [
    MatToolbar, MatButton, RouterLink, RouterLinkActive
  ],
  selector: 'app-toolbar',
  styleUrl: './toolbar.scss',
  templateUrl: './toolbar.html',
})
export class Toolbar {

  private readonly dialog = inject(MatDialog);
  private readonly auth = inject(AuthService);

  readonly isAdmin = this.getIsAdmin();

  logout(){
    this.dialog.open(ConfirmLogout);
  }

  private getIsAdmin(): boolean {
    try {
      return this.auth.getUserData().role === 'admin';
    } catch {
      return false;
    }
  }
}
