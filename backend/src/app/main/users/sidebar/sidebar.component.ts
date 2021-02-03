import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UsersService } from '../../service/users.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

    user: any;
    filterBy: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {UsersService} _usersService
     */
    constructor(
        private _usersService: UsersService
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
        this.filterBy = this._usersService.filterBy;

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
     * Change the filter
     *
     * @param filter
     */
    changeFilter(filter): void
    {
        this.filterBy = filter;
        this._usersService.filterBy = this.filterBy;
        this._usersService.getUsers();
    }

}
