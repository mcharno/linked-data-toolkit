
package net.charno.semweb.lookups;

import java.util.List;
import net.charno.semweb.bindings.URILabelBinding;
import net.charno.utils.StringUtils;

/**
 *
 * @author mdc502
 */
public class DBPediaClient extends SparqlClient {
    private static final String URL = "http://dbpedia.org/sparql?query=";
    private static final String SPARQL_ORG_1 = "PREFIX%20dbpedia-owl%3A%20%3Chttp%3A//dbpedia.org/ontology/%3E%20PREFIX%20dbpprop%3A%20%3Chttp%3A//dbpedia.org/property/%3E%20SELECT%20%3Flabel%20%3Furi%20WHERE%20%7B%3Furi%20rdfs%3Alabel%20%3Flabel%20;%20rdf%3Atype%20dbpedia-owl%3AOrganisation%20.%20FILTER%20(regex(%3Flabel,%20%22";
    private static final String SPARQL_ORG_2 = "%22@en)%20&&%20langMatches(%20lang(%3Flabel),%20%22en%22))%7D%20LIMIT%20";
    private static final String SPARQL_THING_1 = "PREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%20SELECT%20%3Furi%20WHERE%20%7B%20%3Furi%20rdfs%3Alabel%20%22";
    private static final String SPARQL_THING_2 = "%22%40en%20FILTER%20(%20!strstarts(str(%3Furi)%2C%20%22http%3A%2F%2Fdbpedia.org%2Fresource%2FCategory%3A%22)%20)%20%7D%20LIMIT%201";
    private static final String SPARQL_OUTPUT = "&format=json";
    
    public static List<URILabelBinding> lookupOrganization(String organization, int results) {
        // parameter check
        if (results < 0 || results > 100) {
            results = 10;
        }
        // build SPARQL query
        String url = URL + SPARQL_ORG_1 + StringUtils.makeURLSafe(organization) + SPARQL_ORG_2 + results + SPARQL_OUTPUT;
        // send query
        String json = getResultsFromEndpoint(url);
        
        return parseStandardJSON(json);
    }
    
    public static String lookupSingleThing(String material) {
        String uri = null;
        // build SPARQL query
        String url = URL + SPARQL_THING_1 + StringUtils.makeURLSafe(StringUtils.capitalise(material)) + SPARQL_THING_2 + SPARQL_OUTPUT;
        // send query
        String json = getResultsFromEndpoint(url);
        // loop through results and grab the first entry
        List<URILabelBinding> resultsList = parseStandardJSON(json);
        for (URILabelBinding result : resultsList) {
            uri = result.getUri();
            break;
        }
        
        return uri;
    }
}