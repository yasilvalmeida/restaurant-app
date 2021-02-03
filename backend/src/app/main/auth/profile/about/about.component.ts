import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

import { AuthService } from 'app/main/service/auth.service';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AboutComponent implements OnInit {
  _errorMessage: string = "";
  _profileForm: FormGroup;
  _fileToUpload: any = null;
  constructor
  (
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _fuseProgressBarService: FuseProgressBarService,
  ) { }

  ngOnInit(): void {
    this._profileForm = this._formBuilder.group({
        fullname       : ['', Validators.required],
        email          : ['', [Validators.required, Validators.email]],
        password       : [
            '', [
                Validators.required, 
                Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
            ] 
        ],
        avatar        : [
            null, Validators.required
        ],
        role          : [
            '', Validators.required
        ],
        created     : [
            '', Validators.required
        ],
    });
    this.loadProfile();
    //console.log(localStorage)
  }

  // Load user information
  loadProfile(): void {
    // Show the progress bar
    this._fuseProgressBarService.show();
    this._authService.loadProfile()
    .subscribe
    (
      data => {
        // Hide the progress bar
        this._fuseProgressBarService.hide();
        //console.log(data)
        this._profileForm.setValue({
          fullname  : data.profile.fullname,
          email     : data.profile.email,
          password  : data.profile.password,
          avatar    : data.profile.avatar,
          role      : data.profile.role,
          created   : data.profile.created,
        });
      },
      error => {
        console.log(error);
        // Hide the progress bar
        this._fuseProgressBarService.hide();
      }
    );
  }

  handleFileInput(files: any) {
    this._fileToUpload = files.item(0);
    //console.log(this._fileToUpload)
  }

  updateProfile(): void {
    // Show the progress bar
    this._fuseProgressBarService.show();
    let fullname = this._profileForm.get("fullname").value,
      email = this._profileForm.get("email").value,
      password = this._profileForm.get("password").value,
      avatar = this._fileToUpload,
      role = this._profileForm.get("role").value;
    const formData: FormData = new FormData();
    if (avatar != null)
      formData.append('file', this._fileToUpload, this._fileToUpload.name);
    formData.append('fullname', fullname);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    this._authService.updateProfile(formData)
    .subscribe
    (
      data => {
        // Hide the progress bar
        this._fuseProgressBarService.hide();
        //console.log(data)
        let avatarBuf = data.profile.avatar.data;
        let TYPED_ARRAY = new Uint8Array(avatarBuf);
        /* const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY); */
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
            return data + String.fromCharCode(byte);
        }, '');
        let avatar = btoa(STRING_CHAR);
        /* console.log(avatar);
        return; */
        // Set new values to the local storage
        localStorage.setItem('fullname', data.profile.fullname);
        localStorage.setItem('avatar', avatar);
        // Reload page
        window.location.reload();
      },
      error => {
        console.log(error);
        // Hide the progress bar
        this._fuseProgressBarService.hide();
        
      }
    );
  }
  
}
