/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.charno.semweb.lookups;

import net.charno.semweb.bindings.GeonamesBinding;
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
public class GeonamesClient extends SparqlClient{
    
    private static String URL_PRECISE = "http://api.geonames.org/search?name_equals=";
    private static String URL_FUZZY = "http://api.geonames.org/search?name=";
    private static String VAR_ROWS = "&maxRows=";
    private static String VAR_COUNTRY = "&country=";
    private static String VAR_FAVOR_UK = "&countryBias=GB";
    private static String VAR_CONTINENT = "&continentCode=";
    private static String VAR_SUFFIX = "&featureClass=A&featureClass=P&style=SHORT&type=json&username=";
    private static String URI = "http://sws.geonames.org/";
    
    private static Map<String,GeonamesBinding> parseJSON(String json) {
        Map<String,GeonamesBinding> results = new HashMap<String, GeonamesBinding>();
        JSONParser parser = new JSONParser();
        // process json results
        try {
            JSONObject jsonObject = (JSONObject) parser.parse(json);
            JSONArray jsonGeonames = (JSONArray) jsonObject.get("geonames");
            for (Object binding : jsonGeonames) {
                JSONObject jsonBinding = (JSONObject) binding;
                Long geonameId = (Long) jsonBinding.get("geonameId");
                String toponymName = (String) jsonBinding.get("toponymName");
                String countryCode = (String) jsonBinding.get("countryCode");
                String fcl = (String) jsonBinding.get("fcl");
                String fcode = (String) jsonBinding.get("fcode");
                
                GeonamesBinding geonamesBinding = new GeonamesBinding();
                geonamesBinding.setToponymName(toponymName);
                geonamesBinding.setCountryCode(countryCode);
                geonamesBinding.setFunctionClass(fcl);
                geonamesBinding.setFunctionCode(fcode);
                String uri = URI + geonameId;
                results.put(uri, geonamesBinding);
            }
        } catch (ParseException pe) {
            System.out.println("position: " + pe.getPosition());
            System.out.println(pe);
        }
        
        return results;
    }
    
    public static Map<String,GeonamesBinding> lookupPreciseLocationInCountry(String location, String country, int results, String username) {
        // parameter check
        if (results < 0 || results > 100) {
            results = 10;
        }
        // build SPARQL query
        String url = URL_PRECISE + StringUtils.makeURLSafe(location) + VAR_COUNTRY + country + VAR_ROWS + results + VAR_SUFFIX + username;
        // send query
        String json = getResultsFromEndpoint(url);
        
        return parseJSON(json);
    }
    
    public static Map<String,GeonamesBinding> lookupPreciseLocationInContinent(String location, String continent, int results, String username) {
        // parameter check
        if (results < 0 || results > 100) {
            results = 10;
        }
        // build SPARQL query
        String url = URL_PRECISE + StringUtils.makeURLSafe(location) + VAR_CONTINENT + continent + VAR_ROWS + results + VAR_SUFFIX + username;
        // send query
        String json = getResultsFromEndpoint(url);
        
        return parseJSON(json);
    }
    
    public static Map<String,GeonamesBinding> lookupPreciseLocationInWorld(String location, int results, String username) {
        // parameter check
        if (results < 0 || results > 100) {
            results = 10;
        }
        // build SPARQL query
        String url = URL_PRECISE + StringUtils.makeURLSafe(location) + VAR_ROWS + results + VAR_SUFFIX + username;
        // send query
        String json = getResultsFromEndpoint(url);
        
        return parseJSON(json);
    }
    
    public static Map<String,GeonamesBinding> lookupLocationFavorUK(String location, int results, String username) {
        // parameter check
        if (results < 0 || results > 100) {
            results = 10;
        }
        // build SPARQL query
        String url = URL_PRECISE + StringUtils.makeURLSafe(location) + VAR_FAVOR_UK + VAR_ROWS + results + VAR_SUFFIX + username;
        // send query
        String json = getResultsFromEndpoint(url);
        
        return parseJSON(json);
    }
    
    public static Map<String,GeonamesBinding> lookupFuzzyLocationInCountry(String location, String country, int results, String username) {
        // parameter check
        if (results < 0 || results > 100) {
            results = 10;
        }
        // build SPARQL query
        String url = URL_FUZZY + StringUtils.makeURLSafe(location) + VAR_COUNTRY + country + VAR_ROWS + results + VAR_SUFFIX + username;
        // send query
        String json = getResultsFromEndpoint(url);
        
        return parseJSON(json);
    }
    
    public static Map<String,GeonamesBinding> lookupFuzzyLocationInContinent(String location, String continent, int results, String username) {
        // parameter check
        if (results < 0 || results > 100) {
            results = 10;
        }
        // build SPARQL query
        String url = URL_FUZZY + StringUtils.makeURLSafe(location) + VAR_CONTINENT + continent + VAR_ROWS + results + VAR_SUFFIX + username;
        // send query
        String json = getResultsFromEndpoint(url);
        
        return parseJSON(json);
    }
}
