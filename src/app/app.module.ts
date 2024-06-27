import { NgZorroAntdModule } from './ng-zorro-antd.module';

import { LearnComponent } from './routes/learn/learn.component';
import { PersonalInformationComponent } from './routes/main-screen/personal-information/personal-information.component';
import { CommunityComponent } from './routes/main-screen/community/community.component';
import { AnalysisComponent } from './routes/main-screen/analysis/analysis.component';
import { MyWordbooksComponent } from './routes/main-screen/my-wordbooks/my-wordbooks.component';
import { DashboardComponent } from './routes/main-screen/dashboard/dashboard.component';
import { MainScreenComponent } from './routes/main-screen/main-screen.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { InforCourseComponent } from './routes/main-screen/personal-information/infor-course/infor-course/infor-course.component';
import { WordListDetailComponent } from './routes/learn/word-list/word-list-detail/word-list-detail/word-list-detail.component';
import { CreatedWorkbookComponent } from './routes/main-screen/created-workbook/created-workbook.component';
import { WordListComponent } from './routes/learn/word-list/word-list.component';
import { WordDetailComponent } from './routes/learn/word-detail/word-detail.component';
import { RegisterComponent } from './routes/Authorize/register/register.component';
import { InforDetailComponent } from './routes/main-screen/personal-information/infor-detail/infor-detail/infor-detail.component';
import { LoginComponent } from './routes/Authorize/login/login.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { NgToastModule } from 'ng-angular-popup';
import { AdminComponent } from './routes/Authorize/admin/admin.component';
import { AdminCourseComponent } from './routes/Authorize/admin/admin-course/admin-course.component';
import { AdminPostComponent } from './routes/Authorize/admin/admin-post/admin-post.component';
import { AdminUserComponent } from './routes/Authorize/admin/admin-user/admin-user.component';
import { AdminWordComponent } from './routes/Authorize/admin/admin-word/admin-word.component';
import { FirstLoginComponent } from './routes/Dialog/first-login/first-login.component';
import { SurveyFormComponent } from './routes/Dialog/survey-form/survey-form.component';
import { CategoryComponent } from './routes/Dialog/category/category.component';
import { ErrorComponent } from './error/error.component';
import { LevelComponent } from './routes/Dialog/level/level.component';
import { InformationComponent } from './routes/Dialog/information/information.component';
import { MatchingGameComponent } from './routes/learn/matching-game/matching-game.component';
import { GuessGameComponent } from './routes/learn/guess-game/guess-game.component';
import { QuizGameComponent } from './routes/learn/quiz-game/quiz-game.component';
import { CourseDashboardComponent } from './routes/learn/course-dashboard/course-dashboard.component';
import { ClassComponent } from './routes/Class/class/class.component';
import { MatchingCardComponent } from './routes/learn/matching-game/matching-card/matching-card.component';
import { ChangeBgDirective } from './change-bg.directive';
import { ClassAnalysisComponent } from './routes/Class/class/class-analysis/class-analysis.component';
import { ClassDashboardComponent } from './routes/Class/class-management/class-dashboard/class-dashboard.component';
import { ClassResultComponent } from './routes/Class/class/class-result/class-result.component';
import { TestComponent } from './routes/Test/test/test.component';
import { TestDashboardComponent } from './routes/Test/test/test-dashboard/test-dashboard.component';
import { TestResultComponent } from './routes/Test/test/test-result/test-result.component';
import { EditCourseComponent } from './routes/main-screen/edit-course/edit-course.component';
import { CourseDashboardReviewComponent } from './routes/learn/course-dashboard-review/course-dashboard-review.component';
import { SearchPageComponent } from './routes/main-screen/search-page/search-page.component';
import { ClassSearchComponent } from './routes/main-screen/search-page/class-search/class-search.component';
import { CourseSearchComponent } from './routes/main-screen/search-page/course-search/course-search.component';
import { UserSearchComponent } from './routes/main-screen/search-page/user-search/user-search.component';
import { AllSearchComponent } from './routes/main-screen/search-page/all-search/all-search.component';
import { ClassCourseLearnComponent } from './routes/Class/class-course-learn/class-course-learn.component';
import { ReviewClassComponent } from './routes/Class/class/review-class/review-class.component';
import { MemberManagementComponent } from './routes/Class/class/member-management/member-management.component';
import { SpeakerGameComponent } from './routes/learn/speaker-game/speaker-game.component';
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    MainScreenComponent,
    DashboardComponent,
    MyWordbooksComponent,
    AnalysisComponent,
    CommunityComponent,
    CreatedWorkbookComponent,
    PersonalInformationComponent,
    LearnComponent,
    WordListComponent,
    WordDetailComponent,
    FirstLoginComponent,
    SurveyFormComponent,
    InforDetailComponent,
    InforCourseComponent,
    WordListDetailComponent,
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    AdminCourseComponent,
    AdminPostComponent,
    AdminUserComponent,
    AdminWordComponent,
    LevelComponent,
    CategoryComponent,
    ErrorComponent,
    InformationComponent,
    MatchingGameComponent,
    GuessGameComponent,
    QuizGameComponent,
    CourseDashboardComponent,
    ClassComponent,
    MatchingCardComponent,
    ClassAnalysisComponent,
    ClassAnalysisComponent,
    ClassDashboardComponent,
    ClassResultComponent,
    TestComponent,
    EditCourseComponent,
    TestDashboardComponent,
    TestResultComponent,
    ChangeBgDirective,
    SearchPageComponent,
    ClassSearchComponent,
    CourseSearchComponent,
    UserSearchComponent,
    CourseDashboardReviewComponent,
    AllSearchComponent,
    ClassCourseLearnComponent,
    ReviewClassComponent,
    MemberManagementComponent,
    SpeakerGameComponent,
    SurveyFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    NgToastModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: 'SPEECH_LANG', useValue: 'ja-JA' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  constructor() {}
}
