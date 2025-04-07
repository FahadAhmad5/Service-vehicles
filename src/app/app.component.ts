import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './Service/AuthServices/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'vehiclesService';
  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');

    this.authService.validateToken().then((isValid) => {
      if (!isValid) {
        console.log('Token validation failed or no token found in app.component.ts.');
      }

      else {
        console.log('Token validated successfully. Navigating by role...');
        this.authService.navigateByRole();
      }
    })
  };
}