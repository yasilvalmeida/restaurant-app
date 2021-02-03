import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ConfirmationComponent implements OnInit {

  title: string;
  firstParagraph: string;
  secondParagraph: string;
  /**
  * Constructor
  *
  * @param {FuseConfigService} _fuseConfigService
  */
  constructor(
      private _fuseConfigService: FuseConfigService
  )
  {
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar   : {
          hidden: true
        },
        toolbar  : {
          hidden: true
        },
        footer   : {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
  }

  ngOnInit(): void {
    if (document.referrer.includes("register")) {
      this.title = "Confirm your email address!";
      this.firstParagraph = "A confirmation e-mail has been sent to your inbox.";
      this.secondParagraph = "Check your inbox and click on the link to confirm your email address.";
    }
    else if (document.referrer.includes("verify-email")) {
      this.title = "Email verification!";
      this.firstParagraph = "Your email address has been verified.";
    }
    else if (document.referrer.includes("forgot-password")) {
      this.title = "Forgot password!";
      this.firstParagraph = "A reset password token has been sent to your inbox.";
      this.secondParagraph = "Check your inbox and click on the link to reset your password.";
    }
    else if (document.referrer.includes("reset-password")) {
      this.title = "Reset password!";
      this.firstParagraph = "Your password has been reset.";
    }
  }

}
 