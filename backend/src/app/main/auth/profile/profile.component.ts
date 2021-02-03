import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { AboutComponent } from './about/about.component';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ProfileComponent implements OnInit {
  _fullname: string;
  _email: string;
  _avatar: string;
  _role: string;
  constructor() { }

  ngOnInit(): void {
    this._fullname = localStorage.getItem('fullname');
    this._email    = localStorage.getItem('email');
    let tmpAvatar  = localStorage.getItem('avatar');
    //console.log("profile ", tmpAvatar)
    
    if (tmpAvatar == null) 
      this._avatar = './assets/images/avatar.png';
    /* else if (tmpAvatar.includes('https')) 
      this._avatar = localStorage.getItem('avatar'); */
    else 
      this._avatar = 'data:image/png;base64,' + tmpAvatar;
  }

} 
