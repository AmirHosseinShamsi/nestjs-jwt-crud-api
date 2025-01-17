export interface UserInterface {
  id: number;
  first_name: string;
  last_name: string;
  age: string;
  address: {
    city: string;
    street: string;
    postal_code: string;
  };
}

export interface messageInterface {
  message: string;
}
