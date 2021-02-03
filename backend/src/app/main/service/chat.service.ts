import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

import { Contact } from '../chat/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService { 
  contacts: any[];
  chats: any[];
  user: any;
  onChatSelected: BehaviorSubject<any>;
  onContactSelected: BehaviorSubject<any>;
  onChatsUpdated: Subject<any>;
  onUserUpdated: Subject<any>;
  onLeftSidenavViewChanged: Subject<any>;
  onRightSidenavViewChanged: Subject<any>;
  _apiURL = environment.apiURL;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
      private _httpClient: HttpClient,
      private _fuseProgressBarService: FuseProgressBarService
  )
  {
      // Set the defaults
      this.onChatSelected = new BehaviorSubject(null);
      this.onContactSelected = new BehaviorSubject(null);
      this.onChatsUpdated = new Subject();
      this.onUserUpdated = new Subject();
      this.onLeftSidenavViewChanged = new Subject();
      this.onRightSidenavViewChanged = new Subject();
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
  {
      return new Promise<void>((resolve, reject) => {
          Promise.all([
              this.getReceivers(),
              /* this.getChats(), */
              this.getUser()
          ]).then(
              ([contacts/* , chats */]) => {
                  this.contacts = contacts;
                  /* this.chats = chats; */
                  resolve();
              },
              reject
          );
      });
  }

  /**
   * Get chat
   *
   * @param contactId
   * @returns {Promise<any>}
   */
  getChat(contactId): Promise<any>
  {
      return new Promise((resolve, reject) => {
          // Show the progress bar
            this._fuseProgressBarService.show();
          this._httpClient.get(`${this._apiURL}/chat/${contactId}`)
              .subscribe((response: any) => {
                this._fuseProgressBarService.hide();
                  //console.log(response);
                  const dialogs = response.dialogs;

                  const chatContact = this.contacts.find((contact) => {
                      return contact._id === contactId;
                  });
                  //console.log("Selected contact", chatContact)

                const chatData = {
                    dialogs: dialogs,
                    contact: chatContact
                };

                  this.onChatSelected.next({...chatData});

              }, reject);

      });

  }


  /**
   * Select contact
   *
   * @param contact
   */
  selectContact(contact): void
  {
      this.onContactSelected.next(contact);
  }

  /**
   * Set user status
   *
   * @param status
   */
  setUserStatus(status): void
  {
      this.user.status = status;
  }

  /**
   * Update user data
   *
   * @param userData
   */
  updateUserData(userData): void
  {
      console.log("Update user date", userData)
      /* this._httpClient.post('api/chat-user/' + this.user.id, userData)
          .subscribe((response: any) => {
                  this.user = userData;
              }
          ); */
  }

  /**
   * Update the chat dialog
   *
   * @param chatId
   * @param dialogs
   * @returns {Promise<any>}
   */
  updateDialog(contactId, dialogs): Promise<any>
  {
      return new Promise((resolve, reject) => {

          /* const newData = {
              id    : chatId,
              dialog: dialog
          }; */

          this._httpClient.post(`${this._apiURL}/chat/${contactId}`, dialogs)
              .subscribe(updatedChat => {
                  resolve(updatedChat);
              }, reject);
      });
  }

  /**
   * Get receivers
   *
   * @returns {Promise<any>}
   */
  getReceivers(): Promise<any>
  {
      return new Promise((resolve, reject) => {
          this._httpClient.get(`${this._apiURL}/chat/receiver`)
              .subscribe((response: any) => {
                  let contacts = response.contacts;
                  var users: any[] = new Array(contacts.length);
                  contacts.map((contact, i) => {
                      users[i] = new Contact(contact);
                  });
                  resolve(users);
              }, reject);
      });
  }

  /**
   * Get chats
   *
   * @returns {Promise<any>}
   */
  /* getChats(): Promise<any>
  {
      return new Promise((resolve, reject) => {
          this._httpClient.get(`${this._apiURL}/chat`)
              .subscribe((response: any) => {
                  resolve(response);
              }, reject);
      });
  } */

  /**
   * Get user
   *
   * @returns {Promise<any>}
   */
  getUser(): void//Promise<any>
  {
      let _id = localStorage.getItem("_id"),
        fullname = localStorage.getItem("fullname"),
        email = localStorage.getItem("email"),
        role = localStorage.getItem("role"),
        avatar = 'data:image/png;base64,' + localStorage.getItem("avatar"),
        status = 'online',
        chatList = [];
      this.user = {
          _id, 
          fullname,
          email,
          role,
          avatar,
          status,
          chatList
      };
  }
}
