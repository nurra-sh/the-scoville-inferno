import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'app-order-success-page',
  imports: [RouterLink, ButtonModule],
  templateUrl: './order-success-page.html',
  styleUrl: './order-success-page.scss',
})
export class OrderSuccessPage {
  
}
