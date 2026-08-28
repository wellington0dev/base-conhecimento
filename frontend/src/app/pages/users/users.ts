import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbar } from '@angular/material/toolbar';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/types/auth';
import { ConfirmDeactivateUser } from '../../shared/dialogs/confirm-deactivate-user/confirm-deactivate-user';
import { UserFormDialog } from '../../shared/dialogs/user-form/user-form';

@Component({
  imports: [
    MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardActions,
    MatButton, MatIconButton, MatToolbar,
  ],
  selector: 'app-users',
  styleUrl: './users.scss',
  templateUrl: './users.html',
})
export class Users implements OnInit {

  private readonly usersService = inject(UsersService);
  private readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  private readonly currentUserId = this.getCurrentUserId();

  readonly users = signal<User[]>([]);
  readonly searchTerm = signal('');

  readonly filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.users();
    }
    return this.users().filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.load();
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
  }

  openCreateDialog() {
    this.dialog
      .open(UserFormDialog, { data: { mode: 'create' } })
      .afterClosed()
      .subscribe((user?: User) => {
        if (user) {
          this.users.update((users) => [user, ...users]);
        }
      });
  }

  openEditDialog(user: User) {
    this.dialog
      .open(UserFormDialog, { data: { mode: 'edit', user } })
      .afterClosed()
      .subscribe((updated?: User) => {
        if (updated) {
          this.users.update((users) => users.map((u) => (u.id === updated.id ? updated : u)));
        }
      });
  }

  openDeactivateDialog(user: User) {
    if (this.isSelf(user)) {
      return;
    }
    this.dialog
      .open(ConfirmDeactivateUser, { data: { user } })
      .afterClosed()
      .subscribe((updated?: User) => {
        if (updated) {
          this.users.update((users) => users.map((u) => (u.id === updated.id ? updated : u)));
        }
      });
  }

  isSelf(user: User): boolean {
    return user.id === this.currentUserId;
  }

  private load() {
    this.usersService.findAll().subscribe({
      next: (users) => this.users.set(users),
      error: (e) => console.log(e),
    });
  }

  private getCurrentUserId(): string | null {
    try {
      return this.auth.getUserData().id;
    } catch {
      return null;
    }
  }
}
