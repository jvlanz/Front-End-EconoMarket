import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonElement;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class FetchJSONCategorias {
  public static void main(String[] args) throws Exception {
// inspector, "Network" / "Headers"
    String url = "https://api.superkoch.com.br/storefront/graphql";

// inspector, "Network" / "Payload"
    String jsonBody = """
    {
      "operationName":"CategoryLevel1Query",
      "variables":{"storeId":"1415", "slugStructure":"acougue"},
      "extensions":{"clientLibrary":{"name":"@apollo/client","version":"4.2.3"}},
      "query":"query CategoryLevel1Query($storeId: ID!, $slugStructure: String!) { publicViewer(storeId: $storeId) { id category(storeId: $storeId, slugStructure: $slugStructure) { id name description slug metaTitle metaDescription metaKeywords noIndex canonicalOverride ogImage { id name url thumborized(width: 1200, height: 630) __typename } image { id url thumborized __typename } banners { id link linkTarget linkType title isSponsored interval mediaType media { id name url thumborized(width: 1542) __typename } mediaMobile { id name url thumborized(width: 1023) __typename } __typename } children(active: true, group: true) { id name slug image { id url thumborized(height: 35, width: 35) __typename } __typename } __typename } __typename } }"
    }
    """;
//    "query":"query MostFrequentSearchTermsMobileQuery($storeId: ID!) { publicViewer(storeId: $storeId) { id frequentSearchTerms(limit: 10, storeId: $storeId) { id term __typename } banners(storeId: $storeId, type: SEARCH) { id link title mediaType linkTarget isSponsored mediaTypeMobile mediaMobile { id url name thumborized __typename } media { id url name thumborized __typename } __typename } __typename } }"

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
    JsonArray items = root.getAsJsonObject("data").getAsJsonObject("publicViewer").getAsJsonObject("category").getAsJsonArray("children");

    for (JsonElement t : items) {
      JsonObject item = t.getAsJsonObject();
      System.out.println(item.get("id").getAsString() + " - " + item.get("name").getAsString());
    }

  }
}
