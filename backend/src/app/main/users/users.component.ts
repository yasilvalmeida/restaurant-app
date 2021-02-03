import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { UsersService } from '../service/users.service';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class UsersComponent implements OnInit, OnDestroy {

  dialogRef: any;
    hasSelectedUsers: boolean;
    searchInput: FormControl;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {UsersService} _usersService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _usersService: UsersService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog
    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');

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
      this._usersService.onSelectedUsersChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(selectedUsers => {
          this.hasSelectedUsers = selectedUsers.length > 0;
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
     * New user
     */
    newUser(): void
    {
        this.dialogRef = this._matDialog.open(UserFormComponent, {
            panelClass: 'user-form-dialog',
            data      : {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if ( !response )
                {
                    return;
                }

                this._usersService.insertUser(response.getRawValue());
            });
    }

    // Search Input on change
    searchInputOnChange(searchText: string) {
      this._usersService.searchText = searchText;
      this._usersService.filteredBySearchText();
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
      this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}

