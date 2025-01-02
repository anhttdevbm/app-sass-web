export interface Contact {
  _id?: string;
  id?: string;
  name?: string;
  position?: string;
  address?: string;
  phone?: string;
  email?: string;
  created_time?: string;
  avatar?: string;
  website?: string;
}

export interface IAvatar {
  object: string;
  name: string;
  link: string;
}

export interface Position {
  id: string
  name: string
}

export interface CreatedBy {
  id: string
  email: string
  roles: string[]
  company: string
  fullname: string
  position: Position
  avatar: string
}

export interface ClientCompany {
  id?: string;
  code: string;
  name: string;
  tax_code: string;
  address: string;
  phone: string;
  email: string;
  created_time: string;
  status: boolean;
  zip_code?: string;
  avatar?: string;
  website?: string;
  contact?: Contact;
  files?: File;
  created_by?: CreatedBy
}

const INITIAL_VALUES: ClientCompany = {
  code: "COM1z",
  name: "",
  tax_code: "",
  zip_code: "",
  address: "",
  phone: "",
  email: "",
  avatar: "",
  website: "",
  status: false,
  created_time: "",
  contact: {
    name: "",
    position: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    avatar: "",
  },
};
