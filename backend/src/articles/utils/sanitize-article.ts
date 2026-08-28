import { sanitizeUser, SafeUser } from '../../users/utils/sanitize-user';
import { Article } from '../entities/article.entity';

export type SafeArticle = Omit<Article, 'author' | 'lastEditor'> & {
  author: SafeUser;
  lastEditor: SafeUser;
};

export function sanitizeArticle(article: Article): SafeArticle {
  return {
    ...article,
    author: sanitizeUser(article.author),
    lastEditor: sanitizeUser(article.lastEditor),
  };
}
