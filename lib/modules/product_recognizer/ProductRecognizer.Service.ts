import axios from "axios";
import { ProductNotFoundError } from "../../errors/NotFound.Error";
import { splitBase64Data } from "../../utils/string";

export default class ProductRecognizerService {
  private static mUrl: string = "http://localhost:5000"

  static async predict(base64Image: string) {
    try {
      const { data, mime } = splitBase64Data(base64Image);

      const request_data = {
        image: data,
        mime,
      };

      const service_url = ProductRecognizerService.mUrl + "/predict";

      const request = await axios.post(service_url, request_data, { responseType: "json" });
      console.log("Predicted: " + request.data.prediction);
      return request.data.prediction;
    } catch (error) {
      throw new ProductNotFoundError()
    }
  }

  static parseClass(recognizedClass: string) {
    const parts = recognizedClass.split("_-_");

    console.log(parts);

    return {
      name: parts[0],
      brand: parts[1],
      variation: parts[2],
    };
  }
}