import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '../../core/services/articles.service';
import { Article } from '../../core/types/article';
import { ConfirmDeleteArticle } from '../../shared/dialogs/confirm-delete-article/confirm-delete-article';
import { MarkdownEditor } from '../../shared/markdown-editor/markdown-editor';
import { MarkdownPipe } from '../../shared/pipes/markdown.pipe';

@Component({
  imports: [
    ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    MarkdownEditor, MarkdownPipe,
  ],
  selector: 'app-article-detail',
  styleUrl: './article-detail.scss',
  templateUrl: './article-detail.html',
})
export class ArticleDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly articlesService = inject(ArticlesService);
  private readonly dialog = inject(MatDialog);

  readonly articleId = signal('');
  readonly isNew = computed(() => this.articleId() === 'new');

  readonly article = signal<Article | null>(null);
  readonly editing = signal(false);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');

  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    excerpt: new FormControl('', { nonNullable: true }),
    body: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? 'new';
      this.articleId.set(id);
      this.errorMessage.set('');

      if (id === 'new') {
        this.article.set(null);
        this.form.reset({ title: '', category: '', excerpt: '', body: '' });
        this.editing.set(true);
        this.loading.set(false);
        return;
      }

      this.editing.set(false);
      this.loading.set(true);
      this.articlesService.findOne(id).subscribe({
        next: (article) => {
          this.article.set(article);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('Artigo não encontrado.');
        },
      });
    });
  }

  startEditing() {
    const article = this.article();
    this.form.setValue({
      title: article?.title ?? '',
      category: article?.category ?? '',
      excerpt: article?.excerpt ?? '',
      body: article?.body ?? '',
    });
    this.editing.set(true);
  }

  cancelEditing() {
    if (this.isNew()) {
      this.router.navigate(['/articles']);
      return;
    }
    this.editing.set(false);
    this.errorMessage.set('');
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    const value = this.form.getRawValue();
    const payload = {
      title: value.title,
      category: value.category,
      excerpt: value.excerpt || undefined,
      body: value.body,
    };

    const request$ = this.isNew()
      ? this.articlesService.createArticle(payload)
      : this.articlesService.updateArticle(this.articleId(), payload);

    request$.subscribe({
      next: (article) => {
        this.saving.set(false);
        if (this.isNew()) {
          this.router.navigate(['/articles', article.id]);
          return;
        }
        this.article.set(article);
        this.editing.set(false);
      },
      error: (e) => {
        this.saving.set(false);
        this.errorMessage.set(e?.error?.message ?? 'Não foi possível salvar o artigo.');
      },
    });
  }

  deleteArticle() {
    const article = this.article();
    if (!article) {
      return;
    }
    this.dialog
      .open(ConfirmDeleteArticle, { data: { article } })
      .afterClosed()
      .subscribe((deleted?: boolean) => {
        if (deleted) {
          this.router.navigate(['/articles']);
        }
      });
  }

  goBack() {
    this.router.navigate(['/articles']);
  }
}
