import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { UsersService } from '../../service/users.service';

@Component({
  selector: 'selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class SelectedBarComponent implements OnInit, OnDestroy {

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  hasSelectedUsers: boolean;
  isIndeterminate: boolean;
  selectedUsers: string[];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {UsersService} _usersService
   * @param {MatDialog} _matDialog
   */
  constructor(
      private _usersService: UsersService,
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
    this._usersService.onSelectedUsersChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedUsers => {
        this.selectedUsers = selectedUsers;
        setTimeout(() => {
          this.hasSelectedUsers = selectedUsers.length > 0;
          this.isIndeterminate = (selectedUsers.length !== this._usersService.users.length && selectedUsers.length > 0);
        }, 0);
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
   * Select all
   */
  selectAll(): void
  {
    this._usersService.selectUsers();
  }

  /**
   * Deselect all
   */
  deselectAll(): void
  {
    this._usersService.deselectUsers();
  }

  /**
   * Delete selected users
   */
  deleteSelectedUsers(): void
  {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected users?';

    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if ( result )
        {
          this._usersService.deleteSelectedUsers();
        }
        this.confirmDialogRef = null;
      });
  }
}
