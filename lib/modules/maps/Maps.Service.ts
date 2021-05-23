import { Client, Language, PlaceDetailsResponse } from '@googlemaps/google-maps-services-js'
import environment from '../../environment';

class MapsService {
  private client: Client = new Client();

  public async getPlace(place_id: string) {
    const response: PlaceDetailsResponse = await this.client.placeDetails({
      params: {
        place_id,
        key: environment.getGoogleApiKey(),
        language: Language.pt_BR,
        fields: ["name", "geometry", "formatted_address", "place_id", "website",
         "formatted_phone_number", "opening_hours"]
      }
    });
    
    return response.data.result;
  }
}

export default new MapsService();
