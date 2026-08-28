import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { loggedGuard } from './core/guards/logged-guard';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { Users } from './pages/users/users';
import { Articles } from './pages/articles/articles';
import { ArticleDetail } from './pages/article-detail/article-detail';

export const routes: Routes = [
    {
        path:"auth",
        component:Auth,
        canActivate:[authGuard]
    },
    {
        path:"users",
        component:Users,
        canActivate:[loggedGuard, roleGuard('admin')]
    },
    {
        path:"articles",
        component:Articles,
        canActivate:[loggedGuard]
    },
    {
        path:"articles/:id",
        component:ArticleDetail,
        canActivate:[loggedGuard]
    },
    {
        path:"**",
        redirectTo:"auth",
        pathMatch:"full"
    }
];
