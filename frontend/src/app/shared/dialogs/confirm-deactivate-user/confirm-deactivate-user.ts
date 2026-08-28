import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { UsersService } from '../../../core/services/users.service';
import { User } from '../../../core/types/auth';

export interface ConfirmDeactivateUserData {
  user: User;
}

@Component({
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions],
  selector: 'app-confirm-deactivate-user',
  styleUrl: './confirm-deactivate-user.scss',
  templateUrl: './confirm-deactivate-user.html',
})
export class ConfirmDeactivateUser {
  private readonly data = inject<ConfirmDeactivateUserData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDeactivateUser, User | undefined>);
  private readonly usersService = inject(UsersService);

  readonly user = this.data.user;
  readonly errorMessage = signal('');
  readonly saving = signal(false);

  confirm() {
    this.saving.set(true);
    this.errorMessage.set('');
    this.usersService.updateUser(this.user.id, { active: false }).subscribe({
      next: (user) => {
        this.saving.set(false);
        this.dialogRef.close(user);
      },
      error: (e) => {
        this.saving.set(false);
        this.errorMessage.set(e?.error?.message ?? 'Não foi possível desativar o usuário.');
      },
    });
  }

  close() {
    this.dialogRef.close(undefined);
  }
}
