import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  selector: 'app-confirm-logout',
  styleUrl: './confirm-logout.scss',
  templateUrl: './confirm-logout.html',
})
export class ConfirmLogout {
  private readonly auth = inject(AuthService);
  private readonly dialogRef = inject(MatDialogRef<ConfirmLogout>);

  confirm() {
    this.dialogRef.close(true);
    this.auth.logout();
  }

  close() {
    this.dialogRef.close(false);
  }
}
