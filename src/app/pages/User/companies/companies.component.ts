import { Component } from '@angular/core';
import { AuthService } from '../../../Service/AuthServices/auth.service';
import { GeneralServiceService } from '../../../Service/GeneralService/general-service.service';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-companies',
  imports: [CommonModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css',
})
export class CompaniesComponent {

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

  getImageUrl(logo: string): string {
    return `${environment.apiUrl}${logo.replace('\\', '/')}`;
  }
}