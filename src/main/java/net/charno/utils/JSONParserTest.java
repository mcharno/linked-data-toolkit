
package net.charno.utils;

import java.util.HashMap;
import java.util.Map;
import net.charno.semweb.bindings.OSBinding;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 *
 * @author mcharno <michael@charno.net>
 */
public class JSONParserTest {
    public static void main(String[] args) {
        String json = "{\"head\": {\"vars\": [ \"prefLabel\" , \"id\" ]} ,\"results\": {\"bindings\": [ {\"prefLabel\": { \"type\": \"literal\" , \"value\": \"London\" } ,\"id\": { \"type\": \"uri\" , \"value\": \"http://data.ordnancesurvey.co.uk/id/7000000000041428\" } } ] } }";
        Map<String,OSBinding> results = new HashMap<String, OSBinding>();
        JSONParser parser = new JSONParser();
        // process json results
        try {
            JSONObject jsonObject = (JSONObject) parser.parse(json);
//            System.out.println(jsonObject.toString());
            JSONObject jsonResults = (JSONObject) jsonObject.get("results");
//            System.out.println(jsonResults.toString());
            JSONArray jsonBindings = (JSONArray) jsonResults.get("bindings");
//            System.out.println(jsonBindings.toString());
            JSONObject jsonBinding0 = (JSONObject) jsonBindings.get(0);
//            System.out.println(jsonBinding0.toString());
            JSONObject jsonId = (JSONObject) jsonBinding0.get("id");
            JSONObject jsonPrefLabel = (JSONObject) jsonBinding0.get("prefLabel");
            JSONObject jsonType = (JSONObject) jsonBinding0.get("type");
            if (jsonType == null) {
                System.out.println("null");
            } else {
                System.out.println(jsonType.toString());
            }
            String id = (String) jsonId.get("value");
//            System.out.println(id);
            String prefLabel = (String) jsonPrefLabel.get("value");
//            System.out.println(prefLabel);
            
            OSBinding osBinding = new OSBinding();
        } catch (ParseException pe) {
            System.out.println("position: " + pe.getPosition());
            System.out.println(pe);
        }
    }
}
