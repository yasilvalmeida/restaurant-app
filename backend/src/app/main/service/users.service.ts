import {Injectable} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { FuseUtils } from '@fuse/utils';

import { environment } from 'environments/environment';

import { User } from '../users/user.model';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

@Injectable({
    providedIn: "root",
})
export class UsersService {
    _apiURL = environment.apiURL;
    _errorMessage: string = "";
    onUsersChanged: BehaviorSubject<any>;
    onSelectedUsersChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;

    users: User[];
    user: any;
    selectedUsers: string[] = [];

    searchText: string;
    filterBy: string = "root";

    pageIndex: number = 0;
    pageSize: number = 10;
    _fileToUpload: any = null;
    /*
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _fuseProgressBarService: FuseProgressBarService
    ) {
        // Set the defaults
        this.onUsersChanged = new BehaviorSubject([]);
        this.onSelectedUsersChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
    }
    // Handle errors
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            this._errorMessage = error.error.message;
            //console.error(errorMessage);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.log("Error handler in user.service", error);
            if (error.status == 401) {
                // Not authorized
                console.log("401 in errors");
                console.log(localStorage);
                /* localStorage.removeItem('token');
        localStorage.removeItem('fullname');
        localStorage.removeItem('email');
        localStorage.removeItem('avatar');
        localStorage.removeItem('role');
        window.location.href = "/dashboard"; */
            }

            if (error.error.message != undefined) {
                this._errorMessage = error.error.message;
            } else if (
                error.error.error.details != undefined &&
                error.error.error.details.length > 0
            )
                this._errorMessage = error.error.error.details[0].message;
        }
        console.log(error);
        // Return an observable with a user-facing error message.
        return throwError(this._errorMessage);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get users
     *
     * @returns {Promise<any>}
     */
    getUsers(): Promise<any> {
        // Show the progress bar 
        this._fuseProgressBarService.show();
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(
                    `${this._apiURL}/users/${this.filterBy}/${this.pageIndex}/${this.pageSize}`
                )
                .subscribe((response: any) => {
                    // Hide the progress bar
                    this._fuseProgressBarService.hide();
                    this.users = response.users;

                    if (this.searchText && this.searchText !== "") {
                        this.users = FuseUtils.filterArrayByString(
                            this.users,
                            this.searchText
                        );
                    }

                    this.users = this.users.map((user) => {
                        return new User(user);
                    });
                    //console.log(this.users)
                    /*
                     */
                    this.onUsersChanged.next(this.users);
                    resolve(this.users);
                }, reject);
        });
    }
    // Filtered by search text
    filteredBySearchText() {
        console.log(this.searchText);
        if (this.searchText && this.searchText !== "") {
            this.users = FuseUtils.filterArrayByString(
                this.users,
                this.searchText
            );
            console.log(this.users);
            this.onUsersChanged.next(this.users);
        }
    }

    /**
     * Get user by Id
     *
     * @returns {Promise<any>}
     */
    getUserById(id): Promise<any> {
        console.log("Get user by id");
        // Show the progress bar
        this._fuseProgressBarService.show();
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`${this._apiURL}/users/${id}`)
                .subscribe((response: any) => {
                    // Hide the progress bar
                    this._fuseProgressBarService.hide();
                    console.log(response);
                    this.user = response;
                    this.onUserDataChanged.next(this.user);
                    resolve(this.user);
                }, reject);
        });
    }

    /**
     * Toggle selected user by id
     *
     * @param id
     */
    toggleSelectedUser(id): void {
        // First, check if we already have that user as selected...
        if (this.selectedUsers.length > 0) {
            const index = this.selectedUsers.indexOf(id);

            if (index !== -1) {
                this.selectedUsers.splice(index, 1);

                // Trigger the next event
                this.onSelectedUsersChanged.next(this.selectedUsers);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedUsers.push(id);

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedUsers.length > 0) {
            this.deselectUsers();
        } else {
            this.selectUsers();
        }
    }

    /**
     * Select users
     *
     * @param filterParameter
     * @param filterValue
     */
    selectUsers(filterParameter?, filterValue?): void {
        this.selectedUsers = [];

        // If there is no filter, select all users
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedUsers = [];
            this.users.map((user) => {
                this.selectedUsers.push(user._id);
            });
        }

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    }

    /**
     * Insert user
     *
     * @param user
     * @returns {Promise<any>}
     */
    insertUser(user): Promise<any> {
        // Show the progress bar
        this._fuseProgressBarService.show();
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(`${this._apiURL}/users/`, user)
                .subscribe((response) => {
                    // Hide the progress bar
                    this._fuseProgressBarService.hide();
                    const result: any = response;
                    if (result.ok) {
                        this.getUsers();
                        resolve(response);
                    }
                });
        });
    }

    /**
     * Update user
     *
     * @param user
     * @returns {Promise<any>}
     */
    updateUser(user): Promise<any> {
        const formData: FormData = new FormData();
        formData.append("file", this._fileToUpload, this._fileToUpload.name);
        formData.append("fullname", user.fullname);
        formData.append("email", user.email);
        formData.append("password", user.password);
        formData.append("role", user.role);
        formData.append("acceptTerms", user.acceptTerms);
        formData.append("isActive", user.isActive);
        formData.append("isVerified", user.isVerified);
        //console.log(formData);
        // Show the progress bar
        this._fuseProgressBarService.show();
        return new Promise((resolve, reject) => {
            this._httpClient
                .put(`${this._apiURL}/users/${user._id}`, formData)
                .subscribe((response) => {
                    // Hide the progress bar
                    this._fuseProgressBarService.hide();
                    console.log(response);
                    const result: any = response;
                    if (result.ok) {
                        this.getUsers();
                        resolve(response);
                    }
                });
        });
    }

    /**
     * Deselect users
     */
    deselectUsers(): void {
        this.selectedUsers = [];

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    }

    /**
     * Delete user
     *
     * @param user
     * @returns {Promise<any>}
     */
    deleteUser(user): Promise<any> {
        // Show the progress bar
        this._fuseProgressBarService.show();
        return new Promise((resolve, reject) => {
            this._httpClient
                .delete(`${this._apiURL}/users/${user._id}`)
                .subscribe((response) => {
                    // Hide the progress bar
                    this._fuseProgressBarService.hide();
                    console.log(response);
                    const result: any = response;
                    if (result.ok) {
                        this.getUsers();
                        resolve(response);
                    }
                });
        });
    }

    /**
     * Verify user
     *
     * @param user
     * @returns {Promise<any>}
     */
    verifyUser(user): Promise<any> {
        // Show the progress bar
        this._fuseProgressBarService.show();
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(`${this._apiURL}/users/verify`, { email: user.email })
                .subscribe((response) => {
                    // Hide the progress bar
                    this._fuseProgressBarService.hide();
                    console.log(response);
                    const result: any = response;
                    if (result.ok) {
                        //this.getUsers();
                        resolve(response);
                    }
                });
        });
    }

    /**
     * Reset Password user
     *
     * @param user
     * @returns {Promise<any>}
     */
    resetPassword(user): Promise<any> {
        // Show the progress bar
        this._fuseProgressBarService.show();
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(`${this._apiURL}/users/forgot-password`, {
                    email: user.email,
                })
                .subscribe((response) => {
                    // Hide the progress bar
                    this._fuseProgressBarService.hide();
                    console.log(response);
                    const result: any = response;
                    if (result.ok) {
                        //this.getUsers();
                        resolve(response);
                    }
                });
        });
    }

    /**
     * Delete selected users
     */
    deleteSelectedUsers(): void {
        for (const userId of this.selectedUsers) {
            const user = this.users.find((_user) => {
                return _user._id === userId;
            });
            this.deleteUser(user);
        }
        this.onUsersChanged.next(this.users);
        this.deselectUsers();
    }
}