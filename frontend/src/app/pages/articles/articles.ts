import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { ArticlesService } from '../../core/services/articles.service';
import { Article } from '../../core/types/article';

@Component({
  imports: [
    MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle,
    MatButton, MatToolbar, MatIconButton
  ],
  selector: 'app-articles',
  styleUrl: './articles.scss',
  templateUrl: './articles.html',
})
export class Articles implements OnInit {

  private readonly articlesService = inject(ArticlesService);
  private readonly router = inject(Router);

  readonly articles = signal<Article[]>([]);
  readonly searchTerm = signal('');

  readonly filteredArticles = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.articles();
    }
    return this.articles().filter(
      (article) =>
        article.title.toLowerCase().includes(term) ||
        article.category.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.articlesService.findAll().subscribe({
      next: (articles) => this.articles.set(articles),
      error: (e) => console.log(e),
    });
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
  }

  openArticle(article: Article) {
    this.router.navigate(['/articles', article.id]);
  }

  createArticle() {
    this.router.navigate(['/articles', 'new']);
  }
}
