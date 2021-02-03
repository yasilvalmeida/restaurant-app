import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from 'app/main/service/users.service';

import { User } from '../user.model';

@Component({
    selector: "user-form",
    templateUrl: "./user-form.component.html",
    styleUrls: ["./user-form.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class UserFormComponent {
    action: string;
    user: User;
    userForm: FormGroup;
    isEditForm: Boolean;
    dialogTitle: string;
    _fileToUpload: any = null;
    /**
     * Constructor
     *
     * @param {MatDialogRef<UserFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<UserFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        public _usersService: UsersService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === "edit") {
            this.dialogTitle = "Edit User";
            this.user = _data.user;
            this.isEditForm = true;
        } else {
            this.dialogTitle = "New User";
            this.user = new User({});
            this.isEditForm = false;
        }

        this.userForm = this.createUserForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create user form
     *
     * @returns {FormGroup}
     */
    createUserForm(): FormGroup {
        if (this.action == "new") {
            return this._formBuilder.group({
                fullname: [this.user.fullname],
                email: [this.user.email],
                avatar: [null],
                role: [this.user.role || ""],
                password: [this.user.password],
            });
        } else {
            return this._formBuilder.group({
                _id: [this.user._id],
                fullname: [this.user.fullname],
                email: [this.user.email],
                avatar: [null],
                role: [this.user.role],
                isActive: [this.user.isActive],
                isVerified: [this.user.isVerified],
                acceptTerms: [this.user.acceptTerms],
                googleId: [this.user.googleId],
                password: [this.user.password],
                created: [this.user.created],
                updated: [this.user.updated],
                verificationToken: [this.user.verificationToken],
                verified: [this.user.verified],
                passwordResetToken: [this.user.passwordResetToken],
                passwordResetExpires: [this.user.passwordResetExpires],
            });
        }
    }

    // Handle file input for uploads
    handleFileInput(files: any) {
        this._fileToUpload = files.item(0);
        const formData: FormData = new FormData();
        formData.append("file", this._fileToUpload, this._fileToUpload.name);
        this._usersService._fileToUpload = this._fileToUpload;
    }

    // Handle isVerified Checkbox Change
    isVerifiedOnChange(e) {
        this.user.isVerified = e.checked;
        this.userForm.setValue(this.user);
    }

    // Handle isActive Checkbox Change
    isActiveOnChange(e) {
        this.user.isActive = e.checked;
        this.userForm.setValue(this.user);
    }

    // Handle role Change
    roleOnChange(e) {
        this.user.fullname = "tes"
        this.user.role = e.value;
        this.userForm.setValue(this.user);
    }
}
