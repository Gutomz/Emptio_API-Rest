import axios from 'axios';
import * as moment from 'moment';
import { Place } from '@googlemaps/google-maps-services-js';
import { Document, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { IMarket } from './Market.Model';
import MarketSchema from './Market.Schema';
import MapsService from '../maps/Maps.Service';
import { formatDate } from '../../utils/date';
import { InvalidFieldError } from '../../errors/Field.Error';
import { getMarketLogo } from '../../utils/market_logo';
import UploadService from '../upload/Upload.Service';

class MarketService {

  public async exist(query: FilterQuery<IMarket>): Promise<Boolean> {
    return !!(await MarketSchema.findOne(query));
  }

  private parsePlaceDataToMarket(place: Place): IMarket {
    return {
      place_id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      location: place.geometry.location,
      phone: place.formatted_phone_number,
      website: place.website,
      openingHours: place.opening_hours.weekday_text,
    };
  }

  public async create(market: IMarket): Promise<Document<IMarket>> {
    market.createdAt = market.updatedAt = formatDate(moment()); 
    return MarketSchema.create(market);
  }

  public async updateById(_id: string, data: UpdateQuery<IMarket>, options: QueryOptions): Promise<Document<IMarket>> {
    const _data = {
      ...data,
      updatedAt: formatDate(moment()),
    };

    return MarketSchema.findByIdAndUpdate(_id, _data, options);
  }

  public async getByGoogleId(place_id: string): Promise<Document<IMarket>> {
    const _market = await MarketSchema.findOne({ place_id });

    if (_market) {
      const lastUpdate: moment.Moment = moment(_market.get("updatedAt"));
      const now: moment.Moment = moment();

      if (now.diff(lastUpdate, 'hours') < 24) {
        return _market;
      }
    }

    let place: Place;
    try {
      place = await MapsService.getPlace(place_id);
    } catch (error) {
      throw new InvalidFieldError('place_id');
    }

    const parsedPlace: IMarket = this.parsePlaceDataToMarket(place);

    if (parsedPlace.website) {
      const image = await getMarketLogo(parsedPlace.website);

      if(image) {
        const { link } = await UploadService.uploadMarketImage(image);
        parsedPlace.image = link;
      }
    }

    if (!_market) {
      return this.create(parsedPlace);
    }

    return this.updateById(_market.id, parsedPlace, { new: true });
  }
}

export default new MarketService();
