import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { deriveExcerpt } from './utils/derive-excerpt';
import { sanitizeArticle, SafeArticle } from './utils/sanitize-article';

export interface CreateArticleInput {
  title: string;
  category: string;
  excerpt?: string;
  body: string;
  authorId: string;
}

export interface UpdateArticleInput {
  title?: string;
  category?: string;
  excerpt?: string;
  body?: string;
  editorId: string;
}

const RELATIONS = { author: true, lastEditor: true };

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
  ) {}

  async create(input: CreateArticleInput): Promise<SafeArticle> {
    const article = this.articlesRepository.create({
      title: input.title,
      category: input.category,
      body: input.body,
      excerpt: input.excerpt?.trim() || deriveExcerpt(input.body),
      author: { id: input.authorId },
      lastEditor: { id: input.authorId },
    });

    const saved = await this.articlesRepository.save(article);
    return sanitizeArticle(await this.findEntityById(saved.id));
  }

  async findAll(): Promise<SafeArticle[]> {
    const articles = await this.articlesRepository.find({
      relations: RELATIONS,
      order: { updatedAt: 'DESC' },
    });
    return articles.map(sanitizeArticle);
  }

  async findOne(id: string): Promise<SafeArticle> {
    return sanitizeArticle(await this.findEntityById(id));
  }

  async update(id: string, changes: UpdateArticleInput): Promise<SafeArticle> {
    const article = await this.findEntityById(id);

    if (changes.title !== undefined) {
      article.title = changes.title;
    }
    if (changes.category !== undefined) {
      article.category = changes.category;
    }
    if (changes.body !== undefined) {
      article.body = changes.body;
      article.excerpt = changes.excerpt?.trim() || deriveExcerpt(changes.body);
    } else if (changes.excerpt !== undefined) {
      article.excerpt = changes.excerpt.trim() || deriveExcerpt(article.body);
    }
    article.lastEditor = { id: changes.editorId } as Article['lastEditor'];

    const saved = await this.articlesRepository.save(article);
    return sanitizeArticle(await this.findEntityById(saved.id));
  }

  async remove(id: string): Promise<void> {
    const article = await this.findEntityById(id);
    await this.articlesRepository.remove(article);
  }

  private async findEntityById(id: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: RELATIONS,
    });

    if (!article) {
      throw new NotFoundException(`Artigo com id "${id}" não encontrado.`);
    }

    return article;
  }
}
