import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../Service/AuthServices/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-appheader',
  imports: [RouterLink],
  templateUrl: './appheader.component.html',
  styleUrl: './appheader.component.css'
})
export class AppheaderComponent {
  @ViewChild(SidebarComponent) sidebar: SidebarComponent | undefined; 
  isSidebarShrink = false;

  constructor(private AuthService: AuthService) {}

  toggleSidebar(): void {
    this.AuthService.toggleSidebar();
  }

  logout() {
    this.AuthService.logout()
  }

}
