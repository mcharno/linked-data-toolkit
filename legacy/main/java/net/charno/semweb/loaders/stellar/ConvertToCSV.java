package net.charno.semweb.loaders.stellar;

import au.com.bytecode.opencsv.CSVWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import net.charno.gml.Attributes;
import net.charno.gml.GML;
import net.charno.utils.GMLUtils;
import net.charno.utils.StreamGobbler;

/**
 *
 * @author mdc502
 */
public class ConvertToCSV {

    private static String filePath;
    private static String contextHeader;
    private static List<String> attributeList = new LinkedList<String>();
    private GML gml;

    public static void main(String[] args) {
        if ((args.length == 0) || (args.length == 1)) {
            System.out.println("ERROR: You must put at least two arguments to run this script! ");
            return;
        }
        if (args.length > 3) {
            System.out.println("ERROR: Too many arguments!");
            return;
        }
        if (args.length == 3) {
            String[] _atts = args[2].split("\\|");
            attributeList.addAll(Arrays.asList(_atts));
        }

        ConvertToCSV converter = new ConvertToCSV();
        filePath = args[0];
        contextHeader = args[1];

        if (filePath.toLowerCase().endsWith(".gml")) {
            converter.parseGML();
        } else if (filePath.toLowerCase().endsWith(".shp")) {
//            converter.convertSHP();
            throw new UnsupportedOperationException("Shapefile support not yet implemented");
        }

        converter.write();
    }

    private void convertSHP() {
        // check os
        //prepare appropriate command
        String cmd = "linux/bin/ogr2ogr -f \"GML\" output.gml " + filePath;
        // send command to runTask
        runOGR2OGRTask(cmd);
        // objectify created file and point at gml variable
    }

    private void parseGML() {
        this.gml = GMLUtils.objectifyGML(filePath, contextHeader, attributeList);
    }

    private void write() {
        try {
            CSVWriter writer = new CSVWriter(new FileWriter("gml_output.csv"));

            List _headers = new ArrayList();
            _headers.add("FID");
            _headers.add("CONTEXT_ID");
            _headers.addAll(attributeList);
            _headers.add("GEOMETRY");
            writer.writeNext((String[]) _headers.toArray(new String[0]));

            for (Attributes gmlAttributes : this.gml.getGmlAttributes()) {
                List _arrayList = new ArrayList();
                _arrayList.add(gmlAttributes.getFid());
                _arrayList.add(gmlAttributes.getContextID());
                _arrayList.addAll(gmlAttributes.getAttributeList().values());
                _arrayList.add(gmlAttributes.getGeometry().getWktPoints().toString());
                writer.writeNext((String[]) _arrayList.toArray(new String[0]));
            }

            writer.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    private static int runOGR2OGRTask(String command) {
        int exitVal = 0;
        StreamGobbler errorGobbler;
        StreamGobbler outputGobbler;

        try {
            Runtime rt = Runtime.getRuntime();
            Process proc = rt.exec(command);

            errorGobbler = new StreamGobbler(proc.getErrorStream(), "ERR");
            outputGobbler = new StreamGobbler(proc.getInputStream(), "OUT");

            errorGobbler.start();
            outputGobbler.start();

            exitVal = proc.waitFor();

        } catch (Throwable t) {
            t.printStackTrace();
        }
        return exitVal;
    }
}
