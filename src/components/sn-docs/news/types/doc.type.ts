/* eslint-disable @typescript-eslint/no-explicit-any */
// interface Avatar {
//   object: string;
//   name: string;
//   link: string;
// }

interface Position {
  id: string;
  name: string;
}

interface DocMember {
  _id: string;
  user: string;
  perm: string;
  doc: string;
  created_time: string;
}

interface DocUser {
  id: string;
  avatar: string;
  company: string;
  email: string;
  fullname: string;
  position: Position;
  roles: string[];
}

export interface DocComment {
  _id: string;
  doc: string;
  content: string;
  created_time: string;
  updated_time: string;
  created_by: string;
  position: string;
}

export interface DocPositionComment {
  _id: string;
  doc: string;
  position: string;
  created_time: string;
  updated_time: string;
  comment: DocComment[];
}

export interface DocInfo {
  _id: string;
  avatar: string;
  child: any[];
  company: string;
  content: string;
  created_by: DocUser;
  created_time: string;
  description: string;
  id: string;
  is_active: boolean;
  is_public: boolean;
  member: DocMember[];
  name: string;
  owner: DocUser;
  positionComment: DocPositionComment[];
  updated_by: DocUser;
  updated_time: string;
  project_id?: string;
}
