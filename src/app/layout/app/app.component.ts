import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../component/sidebar/sidebar.component';
import { AppheaderComponent } from '../../component/appheader/appheader.component';
import { AuthService } from '../../Service/AuthServices/auth.service';

@Component({
  selector: 'app-app',
  imports: [RouterOutlet, SidebarComponent, AppheaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  isSidebarShrink = false;

  constructor(private AuthService: AuthService) { }

  ngOnInit(): void {
    this.AuthService.isShrink$.subscribe((isShrink) => {
      this.isSidebarShrink = isShrink;
    });
  }
  
  


}
