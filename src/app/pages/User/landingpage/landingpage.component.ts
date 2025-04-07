import { Component } from '@angular/core';
import { AuthService } from '../../../Service/AuthServices/auth.service';
import { GeneralServiceService } from '../../../Service/GeneralService/general-service.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';





@Component({
  selector: 'app-landingpage',
  imports: [CommonModule, RouterLink],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css',
  standalone: true
})
export class LandingpageComponent {
  loading = false;
  companies: any[] = [];
  errorMessage: string = '';

  constructor(private authService: AuthService, private generalService: GeneralServiceService, private router: Router) { }

  ngOnInit(): void {
    this.fetchCompanies();
  }

  fetchCompanies(): void {
    this.loading = true;
    this.authService.get('all-company').subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.status === 200 && response.data) {
          this.companies = response.data.flat();
        }
        console.log('Fetched companies: ', this.companies);
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = 'Error fetching companies';
        console.error('Error: ', error);
      },
    });
  }

  onCardClick(companyId: string): void {
    console.log('Navigating to Company ID:', companyId);
    this.router.navigate(['/companyDetails', companyId]);
  }


}
