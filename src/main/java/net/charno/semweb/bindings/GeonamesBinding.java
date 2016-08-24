/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.charno.semweb.bindings;

/**
 *
 * @author mdc502
 */
public class GeonamesBinding extends URILabelBinding{
    
    private String toponymName;
    private String geonameId;
    private String countryCode;
    private String functionClass;
    private String functionCode;

    public String getToponymName() {
        return toponymName;
    }

    public void setToponymName(String toponymName) {
        this.toponymName = toponymName;
    }

    public String getGeonameId() {
        return geonameId;
    }

    public void setGeonameId(String geonameId) {
        this.geonameId = geonameId;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getFunctionClass() {
        return functionClass;
    }

    public void setFunctionClass(String functionClass) {
        this.functionClass = functionClass;
    }

    public String getFunctionCode() {
        return functionCode;
    }

    public void setFunctionCode(String functionCode) {
        this.functionCode = functionCode;
    }
}
