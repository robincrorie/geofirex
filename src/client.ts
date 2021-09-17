import { FirebaseSDK } from './interfaces';

import { GeoFireQuery } from './query';
import { encode, distance, bearing } from './util';

import * as fb from 'firebase/compat/app';

export interface FirePoint {
  geopoint: fb.default.firestore.GeoPoint,
  geohash: string
}

export class GeoFireClient {
  constructor(public app: FirebaseSDK) {}
  /**
   * Creates reference to a Firestore collection that can be used to make geoqueries
   * @param  {firestore.CollectionReference | firestore.Query | string} ref path to collection
   * @returns {GeoFireQuery}
   */
  query<T>(ref): GeoFireQuery<T> {
    return new GeoFireQuery(this.app, ref);
  }

  /**
   * Creates an object with a geohash. Save it to a field in Firestore to make geoqueries. 
   * @param  {number} latitude
   * @param  {number} longitude
   * @returns FirePoint
   */
  point(latitude: number, longitude: number): FirePoint {
    return {
      geopoint: new fb.default.firestore.GeoPoint(latitude, longitude),
      geohash: encode(latitude, longitude, 9)
    }
  }
  /**
   * Haversine distance between points
   * @param  {FirePoint} from
   * @param  {FirePoint} to
   * @returns number
   */
  distance(from: FirePoint, to: FirePoint): number {
      return distance(
        [from.geopoint.latitude, from.geopoint.longitude],
        [to.geopoint.latitude, to.geopoint.longitude]
      )
    }

  /**
   * Haversine bearing between points
   * @param  {FirePoint} from
   * @param  {FirePoint} to
   * @returns number
   */
  bearing(from: FirePoint, to: FirePoint): number {
      return bearing(
        [from.geopoint.latitude, from.geopoint.longitude],
        [to.geopoint.latitude, to.geopoint.longitude]
      )
    }
  }
/**
 * Initialize the library by passing it your Firebase app
 * @param  {firestore.FirebaseApp} app
 * @returns GeoFireClient
 */
export function init(app: FirebaseSDK): GeoFireClient {
  return new GeoFireClient(app);
}
