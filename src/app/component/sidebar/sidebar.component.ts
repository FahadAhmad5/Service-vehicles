import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Service/AuthServices/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {


  toggleSidebar(): void {
    this.isShrink = !this.isShrink;
    this.AuthService.toggleSidebar(); 
  }

  isShrink: boolean = false;

  constructor(private AuthService: AuthService) { }

  ngOnInit(): void {
    this.AuthService.isShrink$.subscribe((isShrink) => {
      this.isShrink = isShrink;
    });
  }


  // logout() {
  //   this.AuthService.logout()
  // }

}
