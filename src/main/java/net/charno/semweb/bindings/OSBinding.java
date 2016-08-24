/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.charno.semweb.bindings;

/**
 *
 * @author mdc502
 */
public class OSBinding extends URILabelBinding {
    
    private String prefLabel;
    private String type;

    public String getPrefLabel() {
        return prefLabel;
    }

    public void setPrefLabel(String prefLabel) {
        this.prefLabel = prefLabel;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
