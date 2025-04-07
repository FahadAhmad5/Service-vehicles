import { Routes } from '@angular/router';
import { SiteComponent } from './layout/site/site.component';
import { AuthguardGuard } from './Service/AuthServices/authguard.guard';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ForgetComponent } from './pages/Authentication/ForgetPassword/forget/forget.component';
import { SignupComponent } from './pages/Authentication/signup/signup.component';
import { SigninComponent } from './pages/Authentication/signin/signin.component';
import { AddserviceComponent } from './admin/addservice/addservice.component';
import { CompanyregisterComponent } from './admin/companyregister/companyregister.component';
import { CategoryComponent } from './admin/category/category.component';
import { ProfileSettingComponent } from './admin/profile-setting/profile-setting.component';
import { LandingpageComponent } from './pages/User/landingpage/landingpage.component';
import { AppComponent } from './layout/app/app.component';
import { AuthComponent } from './layout/auth/auth.component';
import { CompanydetailComponent } from './pages/User/companydetail/companydetail.component';
import { BookingScheduleComponent } from './pages/User/booking-schedule/booking-schedule.component';
import { ScheduleComponent } from './admin/schedule/schedule.component';
import { AboutComponent } from './pages/User/about/about.component';
import { CompaniesComponent } from './pages/User/companies/companies.component';
import { ContactUsComponent } from './pages/User/contact-us/contact-us.component';
import { PaymentsuccessfulComponent } from './pages/User/paymentsuccessful/paymentsuccessful.component';

export const routes: Routes = [

        {
                path: '',
                component: AuthComponent,
                children: [
                        { path: '', redirectTo: 'login', pathMatch: 'full' },
                        { path: 'login', component: SigninComponent },
                        { path: 'register', component: SignupComponent },
                        { path: 'forgetpassword', component: ForgetComponent }
                ]
        },

        {
                path: '',
                component: SiteComponent,
                // canActivate: [AuthguardGuard],
                // data: { role: 'manager' },
                children: [
                        { path: 'home', component: LandingpageComponent },
                        { path: 'companyDetails/:id', component: CompanydetailComponent },
                        { path: 'booking-schedule/:id', component: BookingScheduleComponent },
                        { path: 'about-us', component: AboutComponent },
                        { path: 'all-companies', component: CompaniesComponent },
                        { path: 'contact-us', component: ContactUsComponent },
                        { path: 'payment-success', component: PaymentsuccessfulComponent },  
                ]
        },


        {
                path: '',
                component: AppComponent,
                canActivate: [AuthguardGuard],
                data: { role: 'admin' },
                children: [
                        { path: 'dashboard', component: DashboardComponent },
                        { path: 'add-service', component: AddserviceComponent },
                        { path: 'add-company', component: CompanyregisterComponent },
                        { path: 'add-category', component: CategoryComponent },
                        { path: 'profile', component: ProfileSettingComponent },
                        { path: 'schedule', component: ScheduleComponent },
                ],
        },

        {
                path: '**',
                redirectTo: '',
        },

];

