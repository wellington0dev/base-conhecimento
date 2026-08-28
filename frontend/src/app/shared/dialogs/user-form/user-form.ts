import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UsersService } from '../../../core/services/users.service';
import { User } from '../../../core/types/auth';
import { UserRole } from '../../../core/types/user';

export type UserFormDialogData =
  | { mode: 'create' }
  | { mode: 'edit'; user: User };

@Component({
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  selector: 'app-user-form',
  styleUrl: './user-form.scss',
  templateUrl: './user-form.html',
})
export class UserFormDialog {
  private readonly data = inject<UserFormDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialog, User | undefined>);
  private readonly usersService = inject(UsersService);

  private readonly editingUser = this.data.mode === 'edit' ? this.data.user : undefined;

  readonly isEdit = !!this.editingUser;
  readonly errorMessage = signal('');
  readonly saving = signal(false);

  readonly form = new FormGroup({
    name: new FormControl(this.editingUser?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    username: new FormControl(
      { value: this.editingUser?.username ?? '', disabled: this.isEdit },
      {
        nonNullable: true,
        validators: this.isEdit ? [] : [Validators.required, Validators.minLength(3)],
      },
    ),
    password: new FormControl('', {
      nonNullable: true,
      validators: this.isEdit
        ? [Validators.minLength(6)]
        : [Validators.required, Validators.minLength(6)],
    }),
    role: new FormControl<UserRole>((this.editingUser?.role as UserRole) ?? 'intern', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    active: new FormControl(this.editingUser?.active ?? true, {
      nonNullable: true,
    }),
  });

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    const value = this.form.getRawValue();

    const request$ = this.editingUser
      ? this.usersService.updateUser(this.editingUser.id, {
          name: value.name,
          password: value.password || undefined,
          role: value.role,
          active: value.active,
        })
      : this.usersService.createUser({
          name: value.name,
          username: value.username,
          password: value.password,
          role: value.role,
        });

    request$.subscribe({
      next: (user) => {
        this.saving.set(false);
        this.dialogRef.close(user);
      },
      error: (e) => {
        this.saving.set(false);
        this.errorMessage.set(e?.error?.message ?? 'Não foi possível salvar o usuário.');
      },
    });
  }

  close() {
    this.dialogRef.close(undefined);
  }
}
