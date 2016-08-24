
package net.charno.semweb.lookups;

import net.charno.semweb.bindings.OSBinding;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import net.charno.utils.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 *
 * @author mdc502
 */
public class OSClient {
    private static String URL = "http://api.talis.com/stores/ordnance-survey/services/sparql?query=";
    private static String SPARQL_PREFIX_PRECISE = "PREFIX+admingeo%3A+%3Chttp%3A%2F%2Fdata.ordnancesurvey.co.uk%2Fontology%2Fadmingeo%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0ASELECT+%3FprefLabel+%3Fid%0D%0AWHERE+%7B%0D%0A++%3Fid+%3FaltLabel+%22";
    private static String SPARQL_SUFFIX_PRECISE = "%22+.%0D%0A++%3Fid+skos%3AprefLabel+%3FprefLabel+.%0D%0A++%3Fid+admingeo%3AgssCode+%3FgssCode+.%0D%0A%7D%0D%0ALIMIT+";
    private static String SPARQL_PREFIX_FUZZY = "PREFIX+admingeo%3A+<http%3A%2F%2Fdata.ordnancesurvey.co.uk%2Fontology%2Fadmingeo%2F>%0D%0APREFIX+skos%3A+<http%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23>%0D%0ASELECT+%3FprefLabel+%3Ftype+%3Fid%0D%0AWHERE+{%0D%0A++%3Fid+skos%3AprefLabel+%3FprefLabel+%3B%0D%0A++++++a+%3Ftype+%3B%0D%0A++++++admingeo%3AgssCode+%3FgssCode+.%0D%0A++FILTER+regex(%3FprefLabel%2C+%22";
    private static String SPARQL_SUFFIX_FUZZY = "%22)%0D%0A}%0D%0ALIMIT+";
    private static String SPARQL_OUTPUT = "&output=json";
    
    private static String getResultsFromOS(String url) {
        String osResults = null;
        // make SPARQL query
        DefaultHttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(url);
        try {
            HttpResponse httpResponse = httpClient.execute(httpGet);
            osResults = EntityUtils.toString(httpResponse.getEntity());
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        
        return osResults;
    }
    
    private static Map<String,OSBinding> parseJSON(String json) {
        Map<String,OSBinding> results = new HashMap<String, OSBinding>();
        JSONParser parser = new JSONParser();
        // process json results
        try {
            JSONObject jsonObject = (JSONObject) parser.parse(json);
            JSONObject jsonResults = (JSONObject) jsonObject.get("results");
            JSONArray jsonBindings = (JSONArray) jsonResults.get("bindings");
            for (Object binding : jsonBindings) {
                JSONObject jsonBinding = (JSONObject) binding;
                JSONObject jsonId = (JSONObject) jsonBinding.get("id");
                JSONObject jsonPrefLabel = (JSONObject) jsonBinding.get("prefLabel");
                JSONObject jsonType = (JSONObject) jsonBinding.get("type");
                
                String id = (String) jsonId.get("value");
                OSBinding osBinding = new OSBinding();
                osBinding.setPrefLabel((String) jsonPrefLabel.get("value"));
                if (jsonType != null) {
                    osBinding.setType((String) jsonType.get("value"));
                }
                results.put(id, osBinding);
            }
        } catch (ParseException pe) {
            System.out.println("position: " + pe.getPosition());
            System.out.println(pe);
        }
        
        return results;
    }
    
    public static Map<String,OSBinding> lookupPreciseLocation(String location, int results) {
        // parameter check
        if (results < 0 || results > 100) {
            results = 10;
        }
        // build SPARQL query
        String url = URL + SPARQL_PREFIX_PRECISE + StringUtils.makeURLSafe(location) + SPARQL_SUFFIX_PRECISE + results + SPARQL_OUTPUT;
        // send query
        String json = getResultsFromOS(url);
        
        return parseJSON(json);
    }
    
    public static Map<String,OSBinding> lookupFuzzyLocation(String location, int results) {
        // parameter check
        if (results < 0 || results > 100) {
            results = 10;
        }
        // build SPARQL query
        String url = URL + SPARQL_PREFIX_FUZZY + StringUtils.makeURLSafe(location) + SPARQL_SUFFIX_FUZZY + results + SPARQL_OUTPUT;
        // send query
        String json = getResultsFromOS(url);
        
        return parseJSON(json);
    }
}
