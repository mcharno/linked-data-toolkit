
package net.charno.semweb.lookups;

import java.util.List;
import net.charno.semweb.bindings.URILabelBinding;
import static net.charno.semweb.lookups.SparqlClient.getResultsFromEndpoint;
import net.charno.utils.StringUtils;

/**
 *
 * @author mcharno <michael@charno.net>
 */
public class SeneschalClient extends SparqlClient {
    private static final String SPARQL_URL = "http://heritagedata.org/live/sparql?query=";
    private static final String SPARQL_EH_PERIOD_1 = "PREFIX%20skos%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%20SELECT%20%3Furi%20WHERE%20%7B%20%3Furi%20skos%3AinScheme%20%3Chttp%3A%2F%2Fpurl.org%2Fheritagedata%2Fschemes%2Feh_period%3E%20%3B%20skos%3AprefLabel%20%22";
    private static final String SPARQL_EH_PERIOD_2 = "%22%40en%20.%20%7D%20LIMIT%20";
    private static final String SPARQL_MDA_OBJ_1 = "PREFIX%20skos%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%20SELECT%20%3Furi%20WHERE%20%7B%20%3Furi%20skos%3AinScheme%20%3Chttp%3A%2F%2Fpurl.org%2Fheritagedata%2Fschemes%2Fmda_obj%3E%20%3B%20skos%3AprefLabel%20%3Flabel%20.%20FILTER%20regex(%3Flabel%2C%20%22%5E";
    private static final String SPARQL_MDA_OBJ_2 = "%22%2C%20%22i%22%20)%7D%20LIMIT%20";
    private static final String SPARQL_OUTPUT = "&output=json";
    
    private static final String REST_URL = "http://www.heritagedata.org/live/services/";
    private static final String REST_MATCH = "getConceptLabelMatch?schemeURI=";
    private static final String REST_EXISTS = "getConceptExists?schemeURI=";
    private static final String REST_ATTRS_CONTAINS = "&contains=";
    private static final String REST_ATTRS_LABEL = "&label=";
    private static final String REST_PERIOD_ENG_URL = "http://purl.org/heritagedata/schemes/eh_period";
    private static final String REST_PERIOD_WAL_URL = "http://purl.org/heritagedata/schemes/11";
    private static final String REST_MONUMENT_ENG_URL = "http://purl.org/heritagedata/schemes/eh_tmt2";
    private static final String REST_MONUMENT_SCO_URL = "http://purl.org/heritagedata/schemes/1";
    private static final String REST_MONUMENT_WAL_URL = "http://purl.org/heritagedata/schemes/10";
    private static final String REST_OBJECTS_ENG_URL = "http://purl.org/heritagedata/schemes/mda_obj";
    private static final String REST_OBJECTS_SCO_URL = "http://purl.org/heritagedata/schemes/2";
    private static final String REST_EVENT_ENG_URL = "http://purl.org/heritagedata/schemes/agl_et";
    private static final String REST_MARITIME_CRAFT_ENG_URL = "http://purl.org/heritagedata/schemes/eh_tmc";
    private static final String REST_MARITIME_CRAFT_SCO_URL = "http://purl.org/heritagedata/schemes/3";
    private static final String REST_BUILDING_MATERIALS_ENG_URL = "http://purl.org/heritagedata/schemes/eh_tbm";
    private static final String REST_EVIDENCE_ENG_URL = "http://purl.org/heritagedata/schemes/eh_evd";
    private static final String REST_COMPONENTS_ENG_URL = "http://purl.org/heritagedata/schemes/eh_com";
    private static final String REST_ARCHAEOLOGICAL_SCIENCES_ENG_URL = "http://purl.org/heritagedata/schemes/560";
    
    public static List<URILabelBinding> lookupEHPeriods(String period) {
        String url = REST_URL + REST_MATCH + REST_PERIOD_ENG_URL + REST_ATTRS_CONTAINS + StringUtils.makeURLSafe(period);
        return lookup(url);
    }
    
    public static List<URILabelBinding> lookupRCAHMWPeriods(String period) {
        String url = REST_URL + REST_MATCH + REST_PERIOD_WAL_URL + REST_ATTRS_CONTAINS + StringUtils.makeURLSafe(period);
        return lookup(url);
    }
    
    public static boolean engMonumentExists(String monument) {
        String url = REST_URL + REST_EXISTS + REST_MONUMENT_ENG_URL + REST_ATTRS_LABEL + StringUtils.makeURLSafe(monument);
        return exists(url);
    }
    
    public static List<URILabelBinding> lookupEHMonuments(String monument) {
        String url = REST_URL + REST_MATCH + REST_MONUMENT_ENG_URL + REST_ATTRS_CONTAINS + StringUtils.makeURLSafe(monument);
        return lookup(url);
    }
    
    public static List<URILabelBinding> lookupRCAHMSMonuments(String monument) {
        String url = REST_URL + REST_MATCH + REST_MONUMENT_SCO_URL + REST_ATTRS_CONTAINS + StringUtils.makeURLSafe(monument);
        return lookup(url);
    }
    
    public static List<URILabelBinding> lookupRCAHMWMonuments(String monument) {
        String url = REST_URL + REST_MATCH + REST_MONUMENT_WAL_URL + REST_ATTRS_CONTAINS + StringUtils.makeURLSafe(monument);
        return lookup(url);
    }
    
    public static List<URILabelBinding> lookupEHMaritimeCraft(String craft) {
        String url = REST_URL + REST_MATCH + REST_MARITIME_CRAFT_ENG_URL + REST_ATTRS_CONTAINS + StringUtils.makeURLSafe(craft);
        return lookup(url);
    }
    
    public static List<URILabelBinding> lookupRCAHMSMaritimeCraft(String craft) {
        String url = REST_URL + REST_MATCH + REST_MARITIME_CRAFT_SCO_URL + REST_ATTRS_CONTAINS + StringUtils.makeURLSafe(craft);
        return lookup(url);
    }
    
    public static boolean engObjectExists(String obj) {
        String url = REST_URL + REST_EXISTS + REST_OBJECTS_ENG_URL + REST_ATTRS_LABEL + StringUtils.makeURLSafe(obj);
        return exists(url);
    }
    
    public static List<URILabelBinding> lookupEHObjects(String obj) {
        String url = REST_URL + REST_MATCH + REST_OBJECTS_ENG_URL + REST_ATTRS_CONTAINS + StringUtils.makeURLSafe(obj);
        return lookup(url);
    }
    
    public static List<URILabelBinding> lookupRCAHMSObjects(String obj) {
        String url = REST_URL + REST_MATCH + REST_OBJECTS_SCO_URL + REST_ATTRS_CONTAINS + StringUtils.makeURLSafe(obj);
        return lookup(url);
    }
    
    public static boolean engEventExists(String event) {
        String url = REST_URL + REST_EXISTS + REST_EVENT_ENG_URL + REST_ATTRS_LABEL + StringUtils.makeURLSafe(event);
        return exists(url);
    }
    
    public static List<URILabelBinding> lookupEHEvent(String event) {
        String url = REST_URL + REST_MATCH + REST_EVENT_ENG_URL + REST_ATTRS_CONTAINS + StringUtils.makeURLSafe(event);
        return lookup(url);
    }
    
    public static List<URILabelBinding> lookupEHBuildingMaterials(String material) {
        String url = REST_URL + REST_MATCH + REST_BUILDING_MATERIALS_ENG_URL + REST_ATTRS_CONTAINS + StringUtils.makeURLSafe(material);
        return lookup(url);
    }
    
    public static List<URILabelBinding> lookupEHEvidence(String evidence) {
        String url = REST_URL + REST_MATCH + REST_EVIDENCE_ENG_URL + REST_ATTRS_CONTAINS + StringUtils.makeURLSafe(evidence);
        return lookup(url);
    }
    
    public static List<URILabelBinding> lookupEHComponents(String components) {
        String url = REST_URL + REST_MATCH + REST_COMPONENTS_ENG_URL + REST_ATTRS_CONTAINS + StringUtils.makeURLSafe(components);
        return lookup(url);
    }
    
    public static List<URILabelBinding> lookupEHArchaeologicalSciences(String science) {
        String url = REST_URL + REST_MATCH + REST_ARCHAEOLOGICAL_SCIENCES_ENG_URL + REST_ATTRS_CONTAINS + StringUtils.makeURLSafe(science);
        return lookup(url);
    }
    
    public static String lookupSingleFISHObject(String object) {
        // build SPARQL query
        String url = SPARQL_URL + SPARQL_MDA_OBJ_1 + StringUtils.makeURLSafe(object) + SPARQL_MDA_OBJ_2 + "1" + SPARQL_OUTPUT;
        return lookupSingle(url);
    }
    
    public static String lookupSingleEHPeriod(String period) {
        // build SPARQL query
        String url = SPARQL_URL + SPARQL_EH_PERIOD_1 + StringUtils.makeURLSafe(period.toUpperCase()) + SPARQL_EH_PERIOD_2 + "1" + SPARQL_OUTPUT;
        return lookupSingle(url);
    }
    
    private static boolean exists(String url) {
        String exists = getResultsFromEndpoint(url);
        if (exists == null) {
            System.out.println("***ERROR*** NULL RETURNED FROM " + url);
        } else if ("true".equals(exists.toLowerCase())) {
            return true;
        } else if ("false".equals(exists.toLowerCase())) {
            return false;
        }
        System.out.println("***ERROR*** UNKNOWN VALUE RETURNED FROM " + url);
        return false;
    }
    
    private static List<URILabelBinding> lookup(String url) {
        String json = getResultsFromEndpoint(url);
        
        return parseRootArrayJSON(json);
    }
    
    private static String lookupSingle(String url) {
        String uri = null;
        // send query
        String json = getResultsFromEndpoint(url);
        // loop through results and grab first entry
        List<URILabelBinding> resultsList = parseStandardJSON(json);
        for (URILabelBinding entry : resultsList) {
            uri = entry.getUri();
            break;
        }
        
        return uri;
    }
    
    public static void main(String[] args) {
        List<URILabelBinding> test;
        test = lookupEHMonuments("barrow");
        for (URILabelBinding entry : test) {
            System.out.println(entry.getUri() + " - " + entry.getLabel());
        }
    }
}
