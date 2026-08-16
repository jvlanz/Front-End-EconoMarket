import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonElement;

import java.net.URI;
import java.net.http.*;
import java.time.Duration;

public class FetchJSONItems {
  public static void main(String[] args) throws Exception {
// inspector, "Network" / "Headers"
    String url = "https://sense.osuper.com.br/295/1415/category/3886563";

    HttpClient client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .build();

    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(url))
        .timeout(Duration.ofSeconds(20))
        .header("Accept", "application/json")
        // Add Cookie/Authorization/etc if needed:
        // .header("Cookie", "SESSION=...; OTHER=...")
        // .header("Authorization", "Bearer ...")
        .GET()
        .build();

    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    if (response.statusCode() != 200) {
      throw new RuntimeException("HTTP " + response.statusCode() + ": " + response.body());
    }

///////////////
// parse result
    JsonObject root = JsonParser.parseString(response.body()).getAsJsonObject();
    JsonArray  items = root.getAsJsonArray("hits");

    for (JsonElement t : items) {
      JsonObject item = t.getAsJsonObject();
      JsonObject pricing = item.getAsJsonObject("pricing");
      System.out.println(item.get("id").getAsString() + " - " + item.get("name").getAsString() + " - " + pricing.get("price").getAsString());
    }

  }
}
