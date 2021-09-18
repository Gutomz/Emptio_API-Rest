import axios from "axios";
import { ProductNotFoundError } from "../../errors/NotFound.Error";
import { splitBase64Data } from "../../utils/string";

export default class ProductRecognizerService {
  private static mUrl: string = "http://localhost:5000"

  static async predict(base64Image: string) {
    try {
      console.log("Predict product")
      const { data, mime } = splitBase64Data(base64Image);

      const request_data = {
        image: data,
        mime,
      };

      const service_url = ProductRecognizerService.mUrl + "/predict";

      const request = await axios.post(service_url, request_data, { responseType: "json" });
      console.log(request.data);
      return request.data.prediction;
    } catch (error) {
      throw new ProductNotFoundError()
    }
  }
}