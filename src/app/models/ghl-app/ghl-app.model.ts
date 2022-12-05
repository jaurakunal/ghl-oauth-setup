export interface GhlAppModel {
  id: string;
  name: string;
  createdAt: string;
  companyName: string;
  description: string;
  tagline: string;
  website: string;
  clientKeys: Array<ClientKeys>;
  allowedScopes: Array<string>;
  redirectUris: Array<string>;
  webhookUrl: string;
}

interface ClientKeys {
  id: string;
  name: string;
  createdAt: string;
}
