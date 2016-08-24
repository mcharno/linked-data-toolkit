
package net.charno.semweb.harvesters;

import au.com.bytecode.opencsv.CSVReader;
import au.com.bytecode.opencsv.CSVWriter;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import net.charno.semweb.lookups.DBPediaClient;
import net.charno.semweb.bindings.GeonamesBinding;
import net.charno.semweb.lookups.GeonamesClient;
import net.charno.semweb.lookups.SeneschalClient;

/**
 *
 * @author mcharno <michael@charno.net>
 */
public class CRMObjectsHarvester {
    /**
     * The filename of the csv file we want to parse.
     */
    private static String FILE_NAME;
    /**
     * The new filename of the "enhanced" data.
     */
    private static String NEW_FILE_NAME;
    /**
     * The geonames username, which should be acquired by signing up for their
     * API at http://www.geonames.org/login.
     */
    private static String GEONAMES_USER;
    /**
     * An optional command line parameter which is the geonames country name 
     * (ie GB) to help focus geonames lookups.
     */
    private static String USER_COUNTRY;
    /**
     * An object to hold the headers from the csv file for safe keeping.
     */
    private List<String> headers = new ArrayList<String>();
    private static int ARRAY_LENGTH;
    // flags for later logic
    private static boolean OBJECT_TYPE = false;
    private static boolean FIND_PLACE = false;
    private static boolean COUNTRY = false;
    private static boolean PRODUCTION_PERIOD = false;
    private static boolean PRODUCTION_MATERIAL = false;
    // all of the column locations needed for later
    private static int OBJECT_ID_LOC, OBJECT_TYPE_LOC, FIND_PLACE_LOC, COUNTRY_LOC, PRODUCTION_PERIOD_LOC, PRODUCTION_MATERIAL_LOC;
    private static int OBJECT_TYPE_URI, FIND_PLACE_URI, PRODUCTION_PERIOD_URI, PRODUCTION_MATERIAL_URI;
    
    /**
     * The main method to parse the CSV file and perform the lookups to the 
     * appropriate authorities. This method parses a STELLAR compatible CSV
     * file, identifies the appropriate headers, and then performs lookups on 
     * the values in those fields. This method should be customised for other 
     * lookups, and can certainly be improved to be more flexible.
     * 
     */
    private void parse() {
        try {
            // prepare the CSVReader object
            CSVReader reader = new CSVReader(new FileReader(FILE_NAME));
            // create a new filename based on the old filename
            String suffix = FILE_NAME.substring(FILE_NAME.lastIndexOf("."), FILE_NAME.length());
            NEW_FILE_NAME = FILE_NAME.replace(suffix, "-enhanced" + suffix);
            // prepare the CSVWriter object
            CSVWriter writer = new CSVWriter(new FileWriter(NEW_FILE_NAME));
            String[] nextLine;
            
            int i = 0;  // a counter to set the headers aside
            
            while ((nextLine = reader.readNext()) != null) {
                if (i == 0) { // this is the first line of the CSV
                    headers = new ArrayList<String>(Arrays.asList(nextLine));
                    int loc = 0;
                    // find STELLAR headers and record location
                    for (String header : headers) {
                        if ("object_id".equals(header.toLowerCase())) {
                            OBJECT_ID_LOC = loc; // grab this just for outputs
                        } else if ("object_type_label".equals(header.toLowerCase())) {
                            OBJECT_TYPE = true;
                            OBJECT_TYPE_LOC = loc;
                        } else if ("find_place_label".equals(header.toLowerCase())) {
                            FIND_PLACE = true;
                            FIND_PLACE_LOC = loc;
                        } else if ("country".equals(header.toLowerCase())) {
                            COUNTRY = true;
                            COUNTRY_LOC = loc;
                        } else if ("production_period_label".equals(header.toLowerCase())) {
                            PRODUCTION_PERIOD = true;
                            PRODUCTION_PERIOD_LOC = loc;
                        } else if ("production_material_label".equals(header.toLowerCase())) {
                            PRODUCTION_MATERIAL = true;
                            PRODUCTION_MATERIAL_LOC = loc;
                        }
                        loc++;
                    }
                    // print out the lookupable fields and append the necessary new columns
                    System.out.println("Following headers with potential lookups found:");
                    if (OBJECT_TYPE) {
                        System.out.println("\tobject_type_label");
                        headers.add("object_type_uri");
                        OBJECT_TYPE_URI = loc++;
                    }
                    if (FIND_PLACE) {
                        System.out.println("\tfind_place_label");
                        headers.add("find_place_uri");
                        FIND_PLACE_URI = loc++;
                    }
                    if (PRODUCTION_PERIOD) {
                        System.out.println("\tproduction_period_label");
                        headers.add("production_period_uri");
                        PRODUCTION_PERIOD_URI = loc++;
                    }
                    if (PRODUCTION_MATERIAL) {
                        System.out.println("\tproduction_material_label");
                        headers.add("production_material_uri");
                        PRODUCTION_MATERIAL_URI = loc++;
                    }
                    ARRAY_LENGTH = loc;
                    // write out the new headers
                    writer.writeNext(headers.toArray(new String[0]));
                } else { // this is the data
                    System.out.println(nextLine[OBJECT_ID_LOC]);
                    // add the previous values to the new CSV
                    String[] newLine = new String[ARRAY_LENGTH];
                    for (int j=0; j<nextLine.length; j++) {
                        newLine[j] = nextLine[j];
                    }
                    // add object_type_uri if it exists
                    if (OBJECT_TYPE && !"".equals(nextLine[OBJECT_TYPE_LOC])) {
                        // do a lookup to a SENESCHAL vocabulary
                        String objectTypeUri = SeneschalClient.lookupSingleFISHObject(nextLine[OBJECT_TYPE_LOC]);
                        if (objectTypeUri != null) {
                            System.out.println("\tobject_type_uri=" + objectTypeUri);
                            newLine[OBJECT_TYPE_URI] = objectTypeUri;
                        }
                    }
                    // add find_place_uri if it exists, but first check if the data has a country to simplify the search
                    if (FIND_PLACE && !"".equals(nextLine[FIND_PLACE_LOC])) {
                        Map<String, GeonamesBinding> geonamesMap;
                        if (COUNTRY) {  // check if a command line parameter was included
                            String _country = nextLine[COUNTRY_LOC];
                            if ("england".equals(_country.toLowerCase())) {
                                _country = "GB";
                            } 
                            geonamesMap = GeonamesClient.lookupPreciseLocationInCountry(nextLine[FIND_PLACE_LOC], _country, 1, GEONAMES_USER);
                        } else if (USER_COUNTRY != null) {  // otherwise check if the CSV included a country column
                            geonamesMap = GeonamesClient.lookupPreciseLocationInCountry(nextLine[FIND_PLACE_LOC], USER_COUNTRY, 1, GEONAMES_USER);
                        } else {  // otherwise we assume we can't specify our query any further, so search the world
                            geonamesMap = GeonamesClient.lookupPreciseLocationInWorld(nextLine[FIND_PLACE_LOC], 1, GEONAMES_USER);
                        }
                        // Loop through the results, but just getting 1 at the moment
                        for (Map.Entry<String, GeonamesBinding> entry : geonamesMap.entrySet()) {
                            System.out.println("\tfind_place_uri=" + entry.getKey());
                            newLine[FIND_PLACE_URI] = entry.getKey();
                            break; // got the only one we want, so break out
                        }
                    }
                    // Add production_period_uri if one exists
                    if (PRODUCTION_PERIOD && !"".equals(nextLine[PRODUCTION_PERIOD_LOC])) {
                        // do a lookup to another SENESCHAL vocabulary
                        String periodUri = SeneschalClient.lookupSingleEHPeriod(nextLine[PRODUCTION_PERIOD_LOC]);
                        if (periodUri != null) {
                            System.out.println("\tproduction_period_uri=" + periodUri);
                            newLine[PRODUCTION_PERIOD_URI] = periodUri;
                        }
                    }
                    // Add production_material_uri if it exists
                    if (PRODUCTION_MATERIAL && !"".equals(nextLine[PRODUCTION_MATERIAL_LOC])) {
                        // do a lookup to DBPedia for a thing
                        String materialUri = DBPediaClient.lookupSingleThing(nextLine[PRODUCTION_MATERIAL_LOC]);
                        if (materialUri != null) {
                            System.out.println("\tproduction_material_uri=" + materialUri);
                            newLine[PRODUCTION_MATERIAL_URI] = materialUri;
                        }
                    }
                    // write the new line to our CSVWriter
                    writer.writeNext(newLine);
                }
                i++;
            }
            
            writer.close();
        } catch (FileNotFoundException ex) {
            System.out.println("Can't find the file " + FILE_NAME);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        
    }
    
    public static void main(String[] args) {
        switch (args.length) {
            case 3: USER_COUNTRY = args[2];
            case 2: GEONAMES_USER = args[1];
                    FILE_NAME = args[0];
                    break;
            default: System.out.println("You don't have the correct number of arguments! The CRMObjectHarvester needs at least 2 command line arguments:"
                    + "\n\n\t"
                    + "java -jar LinkedDataToolkit.jar [FILE_NAME] [GEONAMES_USER]"
                    + "\n\n"
                    + "or"
                    + "\n\n\t"
                    + "java -jar LinkedDataToolkit.jar [FILE_NAME] [GEONAMES_USER] [COUNTRY]");
                    return;
        }
        
        CRMObjectsHarvester clarosHarvester = new CRMObjectsHarvester();
        clarosHarvester.parse();
        System.out.println("--------------------------------------------");
        System.out.println("New file written to " + NEW_FILE_NAME);
    }
}
