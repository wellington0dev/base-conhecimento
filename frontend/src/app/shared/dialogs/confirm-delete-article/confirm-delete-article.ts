import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ArticlesService } from '../../../core/services/articles.service';
import { Article } from '../../../core/types/article';

export interface ConfirmDeleteArticleData {
  article: Article;
}

@Component({
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions],
  selector: 'app-confirm-delete-article',
  styleUrl: './confirm-delete-article.scss',
  templateUrl: './confirm-delete-article.html',
})
export class ConfirmDeleteArticle {
  private readonly data = inject<ConfirmDeleteArticleData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDeleteArticle, boolean>);
  private readonly articlesService = inject(ArticlesService);

  readonly article = this.data.article;
  readonly errorMessage = signal('');
  readonly deleting = signal(false);

  confirm() {
    this.deleting.set(true);
    this.errorMessage.set('');
    this.articlesService.deleteArticle(this.article.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.dialogRef.close(true);
      },
      error: (e) => {
        this.deleting.set(false);
        this.errorMessage.set(e?.error?.message ?? 'Não foi possível excluir o artigo.');
      },
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
