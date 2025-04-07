import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../Service/AuthServices/auth.service';

@Component({
  selector: 'app-paymentsuccessful',
  imports: [RouterLink],
  templateUrl: './paymentsuccessful.component.html',
  styleUrl: './paymentsuccessful.component.css'
})
export class PaymentsuccessfulComponent {

  constructor(private AuthService: AuthService) { }

}
