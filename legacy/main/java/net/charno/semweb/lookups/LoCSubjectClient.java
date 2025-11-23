
package net.charno.semweb.lookups;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import net.charno.semweb.bindings.URILabelBinding;
import net.charno.utils.LoCSAXHandler;
import net.charno.utils.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.xml.sax.InputSource;

/**
 *
 * @author mcharno <michael@charno.net>
 */
public class LoCSubjectClient {
    private static final String URL = "http://memp.york.ac.uk:10035/repositories/loc?query=";
    private static final String SPARQL_SUBJ_PRECISE_PREFIX = "PREFIX%20skos%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0Aselect%20%3Furi%20%3Flabel%20%7B%0A%20%20%3Furi%20skos%3AprefLabel%20%3Flabel%20.%0A%20%20%3Furi%20skos%3AprefLabel%20%22";
    private static final String SPARQL_SUBJ_PRECISE_SUFFIX = "%22%40en%0A%7D";
    private static final String SPARQL_SUBJ_STARTS_PREFIX =  "PREFIX%20skos%3A%20%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0Aselect%20%3Furi%20%3Flabel%20%7B%0A%20%20%3Furi%20skos%3AprefLabel%20%3Flabel%20.%0A%20%20FILTER%20regex(str(%3Flabel)%2C%20%27%5E";
    private static final String SPARQL_SUBJ_STARTS_SUFFIX = "%27%40en%2C%20%27i%27)%0A%7D%0ALIMIT%20300";
    private static final String SPARQL_SUBJ_FUZZY_PREFIX = "PREFIX%20skos%3A%20%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0Aselect%20%3Furi%20%3Flabel%20%7B%0A%20%20%3Furi%20skos%3AprefLabel%20%3Flabel%20.%0A%20%20FILTER%20regex(str(%3Flabel)%2C%20%27";
    private static final String SPARQL_SUBJ_FUZZY_SUFFIX = "%27%40en%2C%20%27i%27)%0A%7D%0ALIMIT%20500";
    
    private static String getResultsFromLoC(String url) {
        String locResults = null;
        
        DefaultHttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(url);
        try {
            HttpResponse httpResponse = httpClient.execute(httpGet);
            locResults = EntityUtils.toString(httpResponse.getEntity());
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        
        return locResults;
    }
    
    private static List<URILabelBinding> parseXML(String xml) {
        List<URILabelBinding> results = new ArrayList<URILabelBinding>();
        try {
            SAXParserFactory spf = SAXParserFactory.newInstance();
            SAXParser parser = spf.newSAXParser();
            LoCSAXHandler handler = new LoCSAXHandler();
            parser.parse(new InputSource(new StringReader(xml)), handler);
            List<URILabelBinding> resultList = handler.getResultList();
            for (URILabelBinding binding : resultList) {
                results.add(new URILabelBinding(binding.getUri(), binding.getLabel()));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        
        return results;
    }
    
    public static List<URILabelBinding> lookupSubjectExact(String subject) {
        String url = URL + SPARQL_SUBJ_PRECISE_PREFIX + StringUtils.makeURLSafe(subject) + SPARQL_SUBJ_PRECISE_SUFFIX;
        
        return processLookup(url);
    }
    
    public static List<URILabelBinding> lookupSubjectStartsWith(String subject) {
        String url = URL + SPARQL_SUBJ_STARTS_PREFIX + StringUtils.makeURLSafe(subject.toLowerCase()) + SPARQL_SUBJ_STARTS_SUFFIX;
        
        return processLookup(url);
    }
    
    public static List<URILabelBinding> lookupSubjectFuzzy(String subject) {
        String url = URL + SPARQL_SUBJ_FUZZY_PREFIX + StringUtils.makeURLSafe(subject.toLowerCase()) + SPARQL_SUBJ_FUZZY_SUFFIX;
        
        return processLookup(url);
    }
    
    private static List<URILabelBinding> processLookup(String url) {
        String xml = getResultsFromLoC(url);
        
        return parseXML(xml);
    }
    
    public static List<URILabelBinding> lookupSubjectCMSValues(String subject) {
//        System.out.println("\t" + subject);
        // quick fixeroo
        subject = subject.replace(" -- ", "--").replace(" --", "--").replace("-- ", "--");
        // build SPARQL query
        String url = URL + SPARQL_SUBJ_PRECISE_PREFIX + StringUtils.makeURLSafe(subject) + SPARQL_SUBJ_PRECISE_SUFFIX;
        // send query
        String xml = getResultsFromLoC(url);
//        System.out.println(xml);
        List<URILabelBinding> results = parseXML(xml);
        // try shrinking the string to see if another one exists
        if (results.isEmpty()) {
            if (subject.lastIndexOf("--") != -1) {
                subject = subject.substring(0, subject.lastIndexOf("--"));
                results = lookupSubjectCMSValues(subject);
            }
        }
        return results;
    }
    
    public static void main(String[] args) {
        List<URILabelBinding> test;
        test = lookupSubjectFuzzy("archaeology");
        for (URILabelBinding entry : test) {
            System.out.println(entry.getUri() + " - " + entry.getLabel());
        }
    }
}
