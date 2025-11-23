/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.charno.semweb.lookups;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import net.charno.semweb.bindings.URILabelBinding;
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
 * @author charno
 */
public abstract class SparqlClient {
    
    protected static String getResultsFromEndpoint(String url) {
        String results = null;
        
        DefaultHttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(url);
        try {
            HttpResponse httpResponse = httpClient.execute(httpGet);
            results = EntityUtils.toString(httpResponse.getEntity());
        } catch (IOException ex) {
            System.out.println(ex);
        }
        
        return results;
    }
    
    protected static List<URILabelBinding> parseRootArrayJSON(String json) {
        List<URILabelBinding> results = new ArrayList<URILabelBinding>();
        JSONParser parser = new JSONParser();
        
        try {
            Object jsonObject = parser.parse(json);
            JSONArray jsonArray = (JSONArray) jsonObject;
            for (int i=0; i<jsonArray.size(); i++) {
                JSONObject result = (JSONObject) jsonArray.get(i);
                String uri = (String) result.get("uri");
                String label = (String) result.get("label");
                if (uri != null && label != null) {
                    results.add(new URILabelBinding(uri, label));
                }
            }
            
        } catch (ParseException pe) {
            System.out.println("ERROR at position: " + pe.getPosition());
            System.out.println(pe);
        }
        
        return results;
    }
    
    protected static List<URILabelBinding> parseStandardJSON(String json) {
        List<URILabelBinding> results = new ArrayList<URILabelBinding>();
        JSONParser parser = new JSONParser();
        // check if the json String is null
        if (json == null) {
            System.out.println("ERROR! The interenet connection may be down, because i just got a NULL String"
                    + "for the JSON results from the endpoint...");
        }
        // process json results
        try {
            JSONObject jsonObject = (JSONObject) parser.parse(json);
            JSONObject jsonResults = (JSONObject) jsonObject.get("results");
            JSONArray jsonBindings = (JSONArray) jsonResults.get("bindings");
            for (Object binding : jsonBindings) {
                JSONObject jsonBinding = (JSONObject) binding;
                JSONObject jsonUri = (JSONObject) jsonBinding.get("uri");
                
                String uri = null;
                if (jsonUri != null) {
                    uri = (String) jsonUri.get("value");
                }
                results.add(new URILabelBinding(uri, null));
            }
            
        } catch (ParseException pe) {
            System.out.println("position: " + pe.getPosition());
            System.out.println(pe);
        } 
        
        return results;
    }
}
