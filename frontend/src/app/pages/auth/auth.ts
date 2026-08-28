import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule, MatSuffix } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoginResponse } from '../../core/types/auth';

@Component({
  imports: [
    FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    FormsModule, ReactiveFormsModule, MatIcon, MatIconButton, MatSuffix,
  ],
  selector: 'app-auth',
  styleUrl: './auth.scss',
  templateUrl: './auth.html',
})
export class Auth {
  readonly username = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  });

  readonly password = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  });

  hide = signal(true);
  errorMessage = signal('');

  constructor(
    private auth: AuthService
  ) {
    merge(this.username.statusChanges,
      this.username.valueChanges,
      this.password.valueChanges,
      this.password.statusChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  toggleHidePassword(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
    console.log(this.hide());
  }

  updateErrorMessage() {
    if (this.username.hasError('required') || this.password.hasError('required')) {
      this.errorMessage.set('Preencha todos os campos');
    } else {
      this.errorMessage.set('');
    }
  }

  login() {
    if (!this.username.value || !this.password.value) {
      this.updateErrorMessage();
      return
    }
    const user = {
      username: this.username.value,
      password: this.password.value
    }
    this.auth.login(user).subscribe({
      next: (res: LoginResponse) => {
        this.auth.setLoginData(res);
        window.location.reload();
      },
      error: (e: any) => {
        this.errorMessage.set(e.error.message);
      }
    })
  }
}
