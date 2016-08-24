package net.charno.gml;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author mcharno <michael@charno.net>
 */
public class Attributes extends FeatureMember {
    
    /**
     * The Context ID of the Object
     */
    private String contextID;
    /**
     * A Map containing attribute key value pairs
     */
    private Map<String, String> attributeMap = new HashMap();

    /**
     *  A lazy method to print the values held by this object
     */
    public void PrintValues() {
        System.out.println("FID: " + getFid());
        System.out.println("ContextID: " + getContextID());
        for (Map.Entry attribute : getAttributeList().entrySet()) {
            System.out.println(attribute.getKey() + ": " + attribute.getValue());
        }
        System.out.println("GeometryType: " + getGeometry().getGeometryType().name());
        for (GeometryPoints point : getGeometry().getGeometryPoints()) {
            System.out.println("\t" + point.getX() + ", " + point.getY());
        }
    }

    public String getContextID() {
        return this.contextID;
    }

    public void setContextID(String contextID) {
        this.contextID = contextID;
    }

    public Map<String, String> getAttributeList() {
        return this.attributeMap;
    }

    public void setAttributeList(Map<String, String> attributeList) {
        this.attributeMap = attributeList;
    }
}
