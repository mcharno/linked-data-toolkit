
package net.charno.semweb.bindings;

/**
 *
 * @author mcharno <michael@charno.net>
 */
public class URILabelBinding implements Comparable<URILabelBinding> {
    private String uri;
    private String label;

    public URILabelBinding() {
        super();
    }
    
    public URILabelBinding(String uri, String label) {
        this.uri = uri;
        this.label = label;
    }

    public int compareTo(URILabelBinding ulb) {
        return getLabel().compareTo(ulb.getLabel());
    }
    
    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}
