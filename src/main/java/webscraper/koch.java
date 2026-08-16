import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonElement;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class GraphQLGsonParse {
  public static void main(String[] args) throws Exception {
// inspector, "Network" / "Headers"
    String url = "https://api.superkoch.com.br/storefront/graphql";
// inspector, "Network" / "Payload"

    String jsonBody = """
    {
      "operationName":"MostFrequentSearchTermsMobileQuery",
      "variables":{"storeId":"1415"},
      "extensions":{"clientLibrary":{"name":"@apollo/client","version":"4.2.3"}},
      "query":"query MostFrequentSearchTermsMobileQuery($storeId: ID!) { publicViewer(storeId: $storeId) { id frequentSearchTerms(limit: 10, storeId: $storeId) { id term __typename } banners(storeId: $storeId, type: SEARCH) { id link title mediaType linkTarget isSponsored mediaTypeMobile mediaMobile { id url name thumborized __typename } media { id url name thumborized __typename } __typename } __typename } }"
    }
    """;

    HttpClient client = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(url))
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        // If DevTools showed cookies/auth headers for this request, copy them here too.
        // .header("Authorization", "Bearer ...")
        // .header("Cookie", "...")
        .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
        .build();

    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    if (response.statusCode() != 200) {
      throw new RuntimeException("HTTP " + response.statusCode() + ": " + response.body());
    }

///////////////
// parse result
    JsonObject root = JsonParser.parseString(response.body()).getAsJsonObject();
    JsonObject viewer = root.getAsJsonObject("data").getAsJsonObject("publicViewer");

    // frequentSearchTerms[].term
    JsonArray terms = viewer.getAsJsonArray("frequentSearchTerms");
    System.out.println("Top terms:");
    for (JsonElement t : terms) {
      JsonObject termObj = t.getAsJsonObject();
      System.out.println("- " + termObj.get("term").getAsString());
    }

    // banners[].title, banners[].mediaMobile.url, banners[].media.url
    JsonArray banners = viewer.getAsJsonArray("banners");
    System.out.println("\nBanners:");
    for (JsonElement b : banners) {
      JsonObject bo = b.getAsJsonObject();
      String title = bo.has("title") && !bo.get("title").isJsonNull() ? bo.get("title").getAsString() : null;

      String mobileUrl = null;
      if (bo.has("mediaMobile") && bo.get("mediaMobile").isJsonObject()) {
        JsonObject mm = bo.getAsJsonObject("mediaMobile");
        if (mm.has("url") && !mm.get("url").isJsonNull()) mobileUrl = mm.get("url").getAsString();
      }

      String desktopUrl = null;
      if (bo.has("media") && bo.get("media").isJsonObject()) {
        JsonObject m = bo.getAsJsonObject("media");
        if (m.has("url") && !m.get("url").isJsonNull()) desktopUrl = m.get("url").getAsString();
      }

      System.out.println("- " + title);
      System.out.println("  mobileUrl=" + mobileUrl);
      System.out.println("  desktopUrl=" + desktopUrl);
    }
  }
}
