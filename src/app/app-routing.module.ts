import { LearnComponent } from './routes/learn/learn.component';
import { PersonalInformationComponent } from './routes/main-screen/personal-information/personal-information.component';
import { CommunityComponent } from './routes/main-screen/community/community.component';
import { AnalysisComponent } from './routes/main-screen/analysis/analysis.component';
import { MyWordbooksComponent } from './routes/main-screen/my-wordbooks/my-wordbooks.component';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './routes/main-screen/dashboard/dashboard.component';
import { MainScreenComponent } from './routes/main-screen/main-screen.component';
import { NgModule } from '@angular/core';
import { InforCourseComponent } from './routes/main-screen/personal-information/infor-course/infor-course/infor-course.component';
import { WordListComponent } from './routes/learn/word-list/word-list.component';
import { RegisterComponent } from './routes/Authorize/register/register.component';
import { CreatedWorkbookComponent } from './routes/main-screen/created-workbook/created-workbook.component';
import { InforDetailComponent } from './routes/main-screen/personal-information/infor-detail/infor-detail/infor-detail.component';
import { WordDetailComponent } from './routes/learn/word-detail/word-detail.component';
import { LoginComponent } from './routes/Authorize/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './routes/Authorize/admin/admin.component';
import { AdminUserComponent } from './routes/Authorize/admin/admin-user/admin-user.component';
import { AdminPostComponent } from './routes/Authorize/admin/admin-post/admin-post.component';
import { AdminCourseComponent } from './routes/Authorize/admin/admin-course/admin-course.component';
import { AdminWordComponent } from './routes/Authorize/admin/admin-word/admin-word.component';
import { AdminGuard } from './guards/admin.guard';
import { FirstLoginComponent } from './routes/Dialog/first-login/first-login.component';
import { SurveyFormComponent } from './routes/Dialog/survey-form/survey-form.component';
import { CategoryComponent } from './routes/Dialog/category/category.component';
import { LevelComponent } from './routes/Dialog/level/level.component';
import { ErrorComponent } from './error/error.component';
import { InformationComponent } from './routes/Dialog/information/information.component';
import { MatchingGameComponent } from './routes/learn/matching-game/matching-game.component';
import { GuessGameComponent } from './routes/learn/guess-game/guess-game.component';
import { QuizGameComponent } from './routes/learn/quiz-game/quiz-game.component';
import { CourseDashboardComponent } from './routes/learn/course-dashboard/course-dashboard.component';
import { ClassComponent } from './routes/Class/class/class.component';
// import { ClassComponent } from './routes/class/class.component';
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'home',
    component: MainScreenComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent,canActivate:[AuthGuard]},
      { path: 'my-wordbooks', component: MyWordbooksComponent },
      { path: 'analysis', component: AnalysisComponent },
      { path: 'community', component: CommunityComponent },
      { path: 'created-wordbooks', component: CreatedWorkbookComponent },
      { path: 'personal-information', component: PersonalInformationComponent },
      { path: 'info-detail', component: InforDetailComponent },
      { path: 'infor-course', component: InforCourseComponent },
      {path: 'class', component: ClassComponent },
    ],
  },
  {
    path: 'learn',
    component: LearnComponent,
    children: [
      { path: 'word-list', component: WordListComponent },
      { path: 'word-detail', component: WordDetailComponent },
      {path:'matching-game',component: MatchingGameComponent},
      {path:"guess-game",component: GuessGameComponent},
      {path:"quiz-game",component: QuizGameComponent},
      {path:"course",component: CourseDashboardComponent}
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path : 'firstlogin',
    component: FirstLoginComponent,
  },
  {
    path :'firstlogin/level',
    component : LevelComponent,
  },
  {
    path :'firstlogin/category',
    component : CategoryComponent
    ,
  },
  {
    path :'firstlogin/info',
    component : InformationComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
    children: [{
      path: 'survey-form',component: SurveyFormComponent }],
    },   

  {
    path: 'admin',
    component: AdminComponent,
    canActivate:[AdminGuard],
    children : [
      {path: 'admin-user',component: AdminUserComponent},
      {path : 'admin-post',component: AdminPostComponent},
      {path: 'admin-course', component: AdminCourseComponent},
      {path:'admin-word',component: AdminWordComponent}
    ]
  },
  {path:'**',component:ErrorComponent},
  { 
    path: 'first-login', 
    component: FirstLoginComponent, 
  }, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
