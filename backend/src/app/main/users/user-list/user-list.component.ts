import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { UsersService } from '../../service/users.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations,
})
export class UserListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    users: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'avatar', 'fullname', 'email', 'role', 'isActive', 'buttons'];
    selectedUsers: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    length = 1;
    pageSize = 10;
    pageSizeOptions: number[] = [5, 10, 25, 100];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {UsersService} _usersService
     * @param {MatDialog} _matDialog
     */
    constructor(
        public _usersService: UsersService,
        public _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this._usersService);
        //this.length = this._usersService.users.length;

        this._usersService.onUsersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(users => {
                this.users = users;

                this.checkboxes = {};
                users.map(user => {
                    this.checkboxes[user.id] = false;
                });
            });

        this._usersService.onSelectedUsersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedUsers => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedUsers.includes(id);
                }
                this.selectedUsers = selectedUsers;
            });

        this._usersService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit user
     *
     * @param user
     */
    editUser(user): void
    {
        this.dialogRef = this._matDialog.open(UserFormComponent, {
            panelClass: 'user-form-dialog',
            data      : {
                user: user,
                action : 'edit',
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                //const updloadedFile: 
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':

                        this._usersService.updateUser(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteUser(user);

                        break;
                }
            });
    }

    /**
     * Delete User
     */
    deleteUser(user): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._usersService.deleteUser(user);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * Reset Password for a user
     */
    resetPassword(user): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to reset password?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._usersService.resetPassword(user);
            }
            this.confirmDialogRef = null;
        });
    }

    /**
     * Verify a user
     */
    verifyUser(user): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to verify?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._usersService.verifyUser(user);
            }
            this.confirmDialogRef = null;
        });
    }

    /**
     * On selected change
     *
     * @param userId
     */
    onSelectedChange(userId): void
    {
        this._usersService.toggleSelectedUser(userId);
    }

    /**
     * On paginator change
     */
    onPaginatorChange(e): void
    {
        this._usersService.pageIndex = e.pageIndex;
        this._usersService.pageSize = e.pageSize;
        this._usersService.getUsers();
    }

    
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {UsersService} _usersService
     */
    constructor(
        private _usersService: UsersService,
    )
    {
        super();
        this._usersService.getUsers();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._usersService.onUsersChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
