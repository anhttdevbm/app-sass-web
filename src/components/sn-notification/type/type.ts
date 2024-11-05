export type PropsItemNotification = {
    handleClose : () => void
}

export type ItemNotification = {
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
    item : ItemNotification
}