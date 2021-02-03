import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'menus',
        title    : 'Menus',
        translate: 'NAV.MENUS',
        type     : 'group',
        children : [
            {
                id       : 'dashboard',
                title    : 'Dashboard',
                translate: 'NAV.DASHBOARD.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard',
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            },
            {
                id       : 'users',
                title    : 'Users',
                translate: 'NAV.USER.TITLE',
                type     : 'item',
                icon     : 'person',
                url      : '/users',
            },
            {
                id       : 'chat',
                title    : 'Chat',
                translate: 'NAV.CHAT.TITLE',
                type     : 'item',
                icon     : 'chat',
                url      : '/chat',
            },
            {
                id       : 'settings',
                title    : 'Settings',
                translate: 'NAV.SETTINGS.TITLE',
                type     : 'item',
                icon     : 'settings',
                url      : '/settings',
            }
        ]
    }
];
