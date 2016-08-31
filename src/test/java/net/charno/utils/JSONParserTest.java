
package net.charno.utils;

import java.util.HashMap;
import java.util.Map;
import net.charno.semweb.bindings.OSBinding;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author mcharno <michael@charno.net>
 */
public class JSONParserTest {

    private String json;
    private Map<String,OSBinding> results;
    private JSONParser parser;
    private JSONObject jsonObject;

    @Before
    public void setup() throws Exception {
        json = "{\"head\": {\"vars\": [ \"prefLabel\" , \"id\" ]} ,\"results\": {\"bindings\": [ {\"prefLabel\": { \"type\": \"literal\" , \"value\": \"London\" } ,\"id\": { \"type\": \"uri\" , \"value\": \"http://data.ordnancesurvey.co.uk/id/7000000000041428\" } } ] } }";
        results = new HashMap<String, OSBinding>();
        parser = new JSONParser();
        jsonObject = (JSONObject) parser.parse(json);
    }

    @Test
    public void testParsingResults() throws Exception {
        JSONObject jsonResults = (JSONObject) jsonObject.get("results");
        JSONArray jsonBindings = (JSONArray) jsonResults.get("bindings");
        JSONObject jsonBinding0 = (JSONObject) jsonBindings.get(0);
        assertNotNull(jsonBinding0);

        JSONObject jsonPrefLabel = (JSONObject) jsonBinding0.get("prefLabel");
        JSONObject jsonType = (JSONObject) jsonBinding0.get("type");
        assertNull(jsonType);

        String prefLabel = (String) jsonPrefLabel.get("value");
        assertEquals("London", prefLabel);
    }
}
