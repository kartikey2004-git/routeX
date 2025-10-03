export interface UserProps {
  id: string;
  name: string;
  image: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}
