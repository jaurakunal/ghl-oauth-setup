export interface OauthAuthorizationModel {
  client_id: string;
  location_id: string;
  userType: string;
  response_type: string;
  redirect_url: string;
  scope: string;
  conversationProviders: string;
}
