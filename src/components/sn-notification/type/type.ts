export type PropsItemNotification = {
    handleClose : () => void
    activeTag : number
}

export type ItemNotificationType = {
    athor: string;            
    avatar: string;            
    createdAt: string;         
    link: string;      
    message: string;   
    title: string;    
    readSatus : boolean;
    updatedAt: string;       
    userId: string;   
    _id: string; 
}

export type PropsDetaiList = {
    handleClose : () => void
    item : ItemNotificationType
}