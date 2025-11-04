export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    usrName: string;
                    usrUserName: string;
                    usrPassword: string;
                };
            };
            ivr: {
                Row: {
                    id: string;
                    ivrDateStart: string;
                    ivrDateEnd: string;
                    ivrUserId: number;
                    ivrIdentificacion: string | null;
                    ivrMenu: string | null;
                    ivrSubMenu: string | null;
                    ivrSubMenu3: string | null;
                    ivrCanal: string | null;
                    ivrInteractionId: string | null;
                };
            };
        };
    };
}

export interface IVRRecord {
    id: string;
    ivrDateStart: string;
    ivrDateEnd: string;
    ivrUserId: number;
    ivrIdentificacion: string | null;
    ivrMenu: string | null;
    ivrSubMenu: string | null;
    ivrSubMenu3: string | null;
    ivrCanal: string | null;
    ivrInteractionId: string | null;
}

export interface User {
    id: string;
    usrName: string;
    usrUserName: string;
}
