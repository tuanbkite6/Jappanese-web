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
import { ClassAnalysisComponent } from './routes/Class/class/class-analysis/class-analysis.component';
import { MemberManagementComponent } from './routes/Class/class/member-management/member-management.component';
import { ClassResultComponent } from './routes/Class/class/class-result/class-result.component';
import { TestComponent } from './routes/Test/test/test.component';
import { TestDashboardComponent } from './routes/Test/test/test-dashboard/test-dashboard.component';
import { TestResultComponent } from './routes/Test/test/test-result/test-result.component';
import { ClassDashboardComponent } from './routes/Class/class-management/class-dashboard/class-dashboard.component';
import { EditCourseComponent } from './routes/main-screen/edit-course/edit-course.component';
import { CourseDashboardReviewComponent } from './routes/learn/course-dashboard-review/course-dashboard-review.component';
import { SearchPageComponent } from './routes/main-screen/search-page/search-page.component';
import { ClassSearchComponent } from './routes/main-screen/search-page/class-search/class-search.component';
import { CourseSearchComponent } from './routes/main-screen/search-page/course-search/course-search.component';
import { UserSearchComponent } from './routes/main-screen/search-page/user-search/user-search.component';
import { AllSearchComponent } from './routes/main-screen/search-page/all-search/all-search.component';
import { ClassCourseLearnComponent } from './routes/Class/class-course-learn/class-course-learn.component';
import { ReviewClassComponent } from './routes/Class/class/review-class/review-class.component';
import { SpeakerGameComponent } from './routes/learn/speaker-game/speaker-game.component';
// import { ClassComponent } from './routes/class/class.component';
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'home',
    component: MainScreenComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent,canActivate:[AuthGuard]},
      { path: 'my-wordbooks', component: MyWordbooksComponent,canActivate:[AuthGuard] },
      { path: 'analysis', component: AnalysisComponent,canActivate:[AuthGuard] },
      { path: 'community', component: CommunityComponent,canActivate:[AuthGuard] },
      { path: 'created-wordbooks', component: CreatedWorkbookComponent ,canActivate:[AuthGuard]},
      { path: 'personal-information', component: PersonalInformationComponent,canActivate:[AuthGuard] },
      { path: 'info-detail', component: InforDetailComponent,canActivate:[AuthGuard] },
      { path: 'infor-course', component: InforCourseComponent,canActivate:[AuthGuard] },
      {
        path: 'class',
        component : ClassComponent,
        children: [
          { path: 'class-analysis', component: ClassAnalysisComponent ,canActivate:[AuthGuard]},
          {path:'class-results', component: ClassResultComponent,canActivate:[AuthGuard]},
          {path:'class-member-manager', component: MemberManagementComponent,canActivate:[AuthGuard]},
        ],
        canActivate: [AuthGuard]

      },
      {path:'class-course', component: ClassCourseLearnComponent,canActivate:[AuthGuard]},
      {
        path: 'search',
        component : SearchPageComponent,
        children: [
          {path: 'class',component:ClassSearchComponent,canActivate:[AuthGuard]},
          {path: 'review-class',component: ReviewClassComponent,canActivate:[AuthGuard]},
          {path:'course',component:CourseSearchComponent,canActivate:[AuthGuard]},
          {path:'user',component:UserSearchComponent,canActivate:[AuthGuard]},
          {path: 'all-search', component:AllSearchComponent,canActivate:[AuthGuard]}
        ]
      },
      {
        path: 'class-dashboard',
        component : ClassDashboardComponent,canActivate:[AuthGuard]
      },
      {
        path: 'learn',
        component: LearnComponent,
        children: [
          { path: 'word-list', component: WordListComponent,canActivate:[AuthGuard] },
          { path: 'word-detail', component: WordDetailComponent,canActivate:[AuthGuard] },
          {path:'matching-game',component: MatchingGameComponent,canActivate:[AuthGuard]},
          {path:"guess-game",component: GuessGameComponent,canActivate:[AuthGuard]},
          {path:"quiz-game",component: QuizGameComponent,canActivate:[AuthGuard]},
          {path:"speaker-game",component: SpeakerGameComponent,canActivate:[AuthGuard]},
          {path:"course",component: CourseDashboardComponent,canActivate:[AuthGuard]},
          {path:"course-review",component: CourseDashboardReviewComponent,canActivate:[AuthGuard]},
          {path:"edit-course",component: EditCourseComponent,canActivate:[AuthGuard]},
        ],
        canActivate: [AuthGuard]
      },{
        path: 'test',
        component : TestComponent,
        children: [
          {path: 'test-dashboard',component:TestDashboardComponent,canActivate:[AuthGuard]},
          {path:'test-result',component:TestResultComponent,canActivate:[AuthGuard]}
        ]
      }
    ],
    canActivate: [AuthGuard]

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
    path :'firstlogin/goal-survey',
    component : SurveyFormComponent,
  }
  ,
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
      {path: 'admin-user',component: AdminUserComponent,canActivate: [AuthGuard]
    },
      {path : 'admin-post',component: AdminPostComponent,canActivate: [AuthGuard]},
      {path: 'admin-course', component: AdminCourseComponent,canActivate: [AuthGuard]},
      {path:'admin-word',component: AdminWordComponent,canActivate: [AuthGuard]}
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
